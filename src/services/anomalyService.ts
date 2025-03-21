import { supabase } from '@/integrations/supabase/client';
import type { Database } from '@/integrations/supabase/types';

export type RecentAnomaly = Database['public']['Tables']['recent_anomalies']['Row'];
export type AdSpendMetrics = Database['public']['Tables']['ad_spend_metrics']['Row'];
export type AdItemPerformance = Database['public']['Tables']['ad_item_performance_hourly']['Row'];
export type AdSpendForecast = Database['public']['Tables']['ad_spend_forecasts']['Row'];

export interface CombinedPerformanceData {
  id: number;
  ad_item_id: number;
  date_time: string;
  campaign_id?: number | null;
  campaign_name?: string;
  actual_spend: number;
  forecast_spend: number;
  difference: number;
  percentage_difference: number;
  is_anomaly: boolean;
  threshold_exceeded: 'none' | 'L1' | 'L2' | 'L3';
  severity: 'low' | 'medium' | 'high';
}

// Default thresholds for anomaly detection (can be customized later)
const DEFAULT_THRESHOLDS = {
  L1: 15, // 15% difference triggers L1 alert
  L2: 30, // 30% difference triggers L2 alert
  L3: 50  // 50% difference triggers L3 alert
};

/**
 * Fetches recent anomalies for dashboard display
 */
export async function fetchRecentAnomalies(limit = 5): Promise<RecentAnomaly[]> {
  const { data, error } = await supabase
    .from('recent_anomalies')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(limit);

  if (error) throw new Error(`Error fetching recent anomalies: ${error.message}`);
  return data || [];
}

/**
 * Fetches ad spend metrics with optional filters
 */
export async function fetchAdSpendMetrics(
  campaignId?: number, 
  startDate?: string, 
  endDate?: string
): Promise<AdSpendMetrics[]> {
  let query = supabase
    .from('ad_spend_metrics')
    .select('*')
    .order('timestamp', { ascending: false });
  
  // Apply filters if provided
  if (campaignId) {
    query = query.eq('campaign_id', campaignId);
  }
  
  if (startDate) {
    query = query.gte('timestamp', startDate);
  }
  
  if (endDate) {
    query = query.lte('timestamp', endDate);
  }
  
  const { data, error } = await query;
  
  if (error) throw new Error(`Error fetching ad spend metrics: ${error.message}`);
  return data || [];
}

/**
 * Fetches only anomalous metrics
 */
export async function fetchAnomalousMetrics(limit = 20): Promise<AdSpendMetrics[]> {
  const { data, error } = await supabase
    .from('ad_spend_metrics')
    .select('*')
    .eq('anomaly', true)
    .order('timestamp', { ascending: false })
    .limit(limit);
  
  if (error) throw new Error(`Error fetching anomalous metrics: ${error.message}`);
  return data || [];
}

/**
 * Fetches ad performance data from the new hourly performance table
 */
export async function fetchAdPerformance(
  adItemId?: number,
  campaignId?: number,
  startDateTime?: string,
  endDateTime?: string,
  limit = 100
): Promise<AdItemPerformance[]> {
  let query = supabase
    .from('ad_item_performance_hourly')
    .select('*')
    .order('date_time', { ascending: false });
  
  // Apply filters if provided
  if (adItemId) {
    query = query.eq('ad_item_id', adItemId);
  }
  
  if (campaignId) {
    query = query.eq('campaign_id', campaignId);
  }
  
  if (startDateTime) {
    query = query.gte('date_time', startDateTime);
  }
  
  if (endDateTime) {
    query = query.lte('date_time', endDateTime);
  }
  
  const { data, error } = await query.limit(limit);
  
  if (error) throw new Error(`Error fetching ad performance data: ${error.message}`);
  return data || [];
}

/**
 * Fetches forecast data for specific time periods
 */
export async function fetchAdSpendForecasts(
  adItemId?: number,
  startDateTime?: string,
  endDateTime?: string,
  limit = 100
): Promise<AdSpendForecast[]> {
  let query = supabase
    .from('ad_spend_forecasts')
    .select('*')
    .order('date_time', { ascending: false });
  
  // Apply filters if provided
  if (adItemId) {
    query = query.eq('ad_item_id', adItemId);
  }
  
  if (startDateTime) {
    query = query.gte('date_time', startDateTime);
  }
  
  if (endDateTime) {
    query = query.lte('date_time', endDateTime);
  }
  
  const { data, error } = await query.limit(limit);
  
  if (error) throw new Error(`Error fetching ad spend forecasts: ${error.message}`);
  return data || [];
}

/**
 * Combines actual performance data with forecasts and detects anomalies
 */
export async function fetchPerformanceWithForecasts(
  campaignId?: number,
  startDateTime?: string,
  endDateTime?: string,
  customThresholds?: { L1: number; L2: number; L3: number },
  limit = 100
): Promise<CombinedPerformanceData[]> {
  // First, get the performance data
  const performance = await fetchAdPerformance(undefined, campaignId, startDateTime, endDateTime, limit);
  
  // Early return if no performance data
  if (performance.length === 0) {
    return [];
  }
  
  // Get unique ad_item_ids from performance data
  const adItemIds = [...new Set(performance.map(p => p.ad_item_id))];
  
  // Fetch all relevant forecasts
  let forecasts: AdSpendForecast[] = [];
  for (const adItemId of adItemIds) {
    const itemForecasts = await fetchAdSpendForecasts(adItemId, startDateTime, endDateTime);
    forecasts = [...forecasts, ...itemForecasts];
  }
  
  // Fetch campaign names if campaign IDs are available
  const campaignIds = [...new Set(performance.filter(p => p.campaign_id !== null).map(p => p.campaign_id!))];
  const campaignMap: Record<number, string> = {};
  
  if (campaignIds.length > 0) {
    const { data: campaigns } = await supabase
      .from('campaigns')
      .select('id, name')
      .in('id', campaignIds);
    
    if (campaigns) {
      campaigns.forEach(campaign => {
        campaignMap[campaign.id] = campaign.name;
      });
    }
  }
  
  // Use provided thresholds or defaults
  const thresholds = customThresholds || DEFAULT_THRESHOLDS;
  
  // Combine the data and detect anomalies
  const combinedData: CombinedPerformanceData[] = performance.map(perf => {
    // Find the matching forecast
    const forecast = forecasts.find(f => 
      f.ad_item_id === perf.ad_item_id && 
      new Date(f.date_time).getTime() === new Date(perf.date_time).getTime()
    );
    
    const actualSpend = perf.total_budget_spent;
    const forecastSpend = forecast?.forecast_value || 0;
    
    // Calculate the difference and percentage
    const difference = actualSpend - forecastSpend;
    const percentageDifference = forecastSpend > 0 
      ? Math.abs((difference / forecastSpend) * 100) 
      : 0;
    
    // Determine if it's an anomaly based on thresholds
    let thresholdExceeded: 'none' | 'L1' | 'L2' | 'L3' = 'none';
    let severity: 'low' | 'medium' | 'high' = 'low';
    
    if (percentageDifference >= thresholds.L3) {
      thresholdExceeded = 'L3';
      severity = 'high';
    } else if (percentageDifference >= thresholds.L2) {
      thresholdExceeded = 'L2';
      severity = 'medium';
    } else if (percentageDifference >= thresholds.L1) {
      thresholdExceeded = 'L1';
      severity = 'low';
    }
    
    const isAnomaly = thresholdExceeded !== 'none';
    
    return {
      id: perf.id,
      ad_item_id: perf.ad_item_id,
      date_time: perf.date_time,
      campaign_id: perf.campaign_id,
      campaign_name: perf.campaign_id ? campaignMap[perf.campaign_id] : undefined,
      actual_spend: actualSpend,
      forecast_spend: forecastSpend,
      difference,
      percentage_difference: percentageDifference,
      is_anomaly: isAnomaly,
      threshold_exceeded: thresholdExceeded,
      severity
    };
  });
  
  return combinedData;
}

/**
 * Records a new ad spend anomaly in the recent_anomalies table
 */
export async function recordRecentAnomaly(
  combinedData: CombinedPerformanceData
): Promise<RecentAnomaly> {
  const { data, error } = await supabase
    .from('recent_anomalies')
    .insert([{
      campaign: combinedData.campaign_name || `Ad Item ${combinedData.ad_item_id}`,
      time: new Date().toLocaleString(),
      value: combinedData.actual_spend,
      expected: combinedData.forecast_spend,
      severity: combinedData.severity
    }])
    .select()
    .single();
  
  if (error) throw new Error(`Error recording recent anomaly: ${error.message}`);
  return data;
}

/**
 * Finds and records all anomalies for a given time period
 * Returns the number of anomalies detected
 */
export async function detectAndRecordAnomalies(
  startDateTime: string,
  endDateTime: string,
  customThresholds?: { L1: number; L2: number; L3: number }
): Promise<number> {
  const anomalies = await fetchPerformanceWithForecasts(
    undefined,
    startDateTime,
    endDateTime,
    customThresholds
  );
  
  const detectedAnomalies = anomalies.filter(a => a.is_anomaly);
  
  // Record each anomaly
  for (const anomaly of detectedAnomalies) {
    await recordRecentAnomaly(anomaly);
  }
  
  return detectedAnomalies.length;
}

/**
 * Gets aggregated anomaly statistics for a time period
 */
export async function getAnomalyStatistics(
  startDateTime: string,
  endDateTime: string
): Promise<{
  totalAnomalies: number;
  highSeverity: number;
  mediumSeverity: number;
  lowSeverity: number;
  potentialLostRevenue: number;
}> {
  const anomalies = await fetchPerformanceWithForecasts(
    undefined,
    startDateTime,
    endDateTime
  );
  
  const detectedAnomalies = anomalies.filter(a => a.is_anomaly);
  
  return {
    totalAnomalies: detectedAnomalies.length,
    highSeverity: detectedAnomalies.filter(a => a.severity === 'high').length,
    mediumSeverity: detectedAnomalies.filter(a => a.severity === 'medium').length,
    lowSeverity: detectedAnomalies.filter(a => a.severity === 'low').length,
    potentialLostRevenue: detectedAnomalies.reduce((sum, a) => sum + Math.abs(a.difference), 0)
  };
}