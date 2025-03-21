import { supabase } from '@/integrations/supabase/client';
import { fetchPerformanceWithForecasts } from './anomalyService';

export interface DailyAnalytics {
  id: number;
  date: string;
  total_ad_spend: number;
  total_clicks: number;
  total_impressions: number;
  total_unique_users: number;
  anomalies_detected: number;
  fraud_prevention_amount: number;
  forecast_accuracy: number;
  created_at?: string;
}

export interface AnalyticsWithForecast {
  date: string;
  total_ad_spend: number;
  total_forecast_spend: number;
  difference: number;
  percentage_difference: number;
  total_clicks: number;
  total_impressions: number;
  total_unique_users: number;
  anomalies_detected: number;
}

/**
 * Fetches the latest analytics data
 */
export async function fetchLatestAnalytics(): Promise<DailyAnalytics> {
  const { data, error } = await supabase
    .from('daily_analytics')
    .select('*')
    .order('date', { ascending: false })
    .limit(1)
    .single();

  if (error) throw new Error(`Error fetching analytics: ${error.message}`);
  return data;
}

/**
 * Fetches analytics data for a specific date range
 */
export async function fetchAnalyticsByDateRange(startDate: string, endDate: string): Promise<DailyAnalytics[]> {
  const { data, error } = await supabase
    .from('daily_analytics')
    .select('*')
    .gte('date', startDate)
    .lte('date', endDate)
    .order('date', { ascending: true });

  if (error) throw new Error(`Error fetching analytics range: ${error.message}`);
  return data || [];
}

/**
 * Fetches analytics data for the past n days
 */
export async function fetchAnalyticsForPastDays(days: number): Promise<DailyAnalytics[]> {
  const date = new Date();
  date.setDate(date.getDate() - days);
  const pastDate = date.toISOString().split('T')[0]; // Format as YYYY-MM-DD
  
  const { data, error } = await supabase
    .from('daily_analytics')
    .select('*')
    .gte('date', pastDate)
    .order('date', { ascending: true });

  if (error) throw new Error(`Error fetching past ${days} days analytics: ${error.message}`);
  return data || [];
}

/**
 * Calculates trend data compared to previous period
 */
export function calculateTrend(current: number, previous: number): { value: number; isPositive: boolean } {
  if (previous === 0) return { value: 0, isPositive: false };
  
  const percentChange = ((current - previous) / previous) * 100;
  return {
    value: Math.abs(Number(percentChange.toFixed(1))),
    isPositive: percentChange > 0
  };
}

/**
 * Fetches analytics with forecasted vs actual spend data
 */
export async function fetchAnalyticsWithForecast(days: number = 7): Promise<AnalyticsWithForecast[]> {
  // Define the date range
  const endDate = new Date();
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - days);
  
  const startDateStr = startDate.toISOString();
  const endDateStr = endDate.toISOString();
  
  // Get hourly performance data with forecasts
  const performanceData = await fetchPerformanceWithForecasts(
    undefined, // campaignId
    startDateStr,
    endDateStr
  );
  
  // Group data by date for daily aggregation
  const dailyData: Record<string, AnalyticsWithForecast> = {};
  
  for (const item of performanceData) {
    const date = new Date(item.date_time).toISOString().split('T')[0]; // Get YYYY-MM-DD
    
    if (!dailyData[date]) {
      dailyData[date] = {
        date,
        total_ad_spend: 0,
        total_forecast_spend: 0,
        difference: 0,
        percentage_difference: 0,
        total_clicks: 0,
        total_impressions: 0,
        total_unique_users: 0,
        anomalies_detected: 0
      };
    }
    
    dailyData[date].total_ad_spend += item.actual_spend;
    dailyData[date].total_forecast_spend += item.forecast_spend;
    
    if (item.is_anomaly) {
      dailyData[date].anomalies_detected += 1;
    }
  }
  
  // Calculate differences and percentages
  for (const date in dailyData) {
    const item = dailyData[date];
    item.difference = item.total_ad_spend - item.total_forecast_spend;
    item.percentage_difference = item.total_forecast_spend > 0 
      ? (Math.abs(item.difference) / item.total_forecast_spend) * 100 
      : 0;
  }
  
  // Get the standard analytics data to merge in other metrics
  const analyticsData = await fetchAnalyticsForPastDays(days);
  
  // Merge in the additional metrics from daily_analytics table
  for (const analytics of analyticsData) {
    const date = analytics.date;
    
    if (dailyData[date]) {
      dailyData[date].total_clicks = analytics.total_clicks;
      dailyData[date].total_impressions = analytics.total_impressions;
      dailyData[date].total_unique_users = analytics.total_unique_users;
    }
  }
  
  // Convert to array and sort by date
  return Object.values(dailyData).sort((a, b) => 
    new Date(a.date).getTime() - new Date(b.date).getTime()
  );
}

/**
 * Calculates forecast accuracy based on predicted vs actual values
 */
export async function calculateForecastAccuracy(days: number = 30): Promise<number> {
  const analyticsWithForecast = await fetchAnalyticsWithForecast(days);
  
  // Calculate mean absolute percentage error (MAPE)
  let totalError = 0;
  let validDataPoints = 0;
  
  for (const day of analyticsWithForecast) {
    if (day.total_forecast_spend > 0) {
      // Calculate absolute percentage error for this day
      const absolutePercentageError = Math.abs(
        (day.total_ad_spend - day.total_forecast_spend) / day.total_forecast_spend
      ) * 100;
      
      totalError += absolutePercentageError;
      validDataPoints += 1;
    }
  }
  
  // If no valid data points, return 0
  if (validDataPoints === 0) return 0;
  
  // Calculate mean error
  const mape = totalError / validDataPoints;
  
  // Convert to accuracy percentage (100% - MAPE), with a floor of 0%
  const accuracy = Math.max(0, 100 - mape);
  
  return Number(accuracy.toFixed(1));
}

/**
 * Calculates total amount saved by preventing anomalous spend
 */
export async function calculatePreventedOverspend(days: number = 30): Promise<number> {
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - days);
  
  const { data, error } = await supabase
    .from('ad_spend_metrics')
    .select('forecast_spend, spend')
    .gte('timestamp', startDate.toISOString())
    .eq('anomaly', true);
  
  if (error) throw new Error(`Error calculating prevented overspend: ${error.message}`);
  
  let totalSaved = 0;
  
  if (data && data.length > 0) {
    for (const item of data) {
      if (item.forecast_spend && item.spend) {
        // If the forecast is higher than actual spend, that's money saved
        const difference = item.forecast_spend - item.spend;
        if (difference > 0) {
          totalSaved += difference;
        }
      }
    }
  }
  
  return totalSaved;
}

/**
 * Updates the forecast accuracy in the daily_analytics table
 */
export async function updateForecastAccuracy(date: string): Promise<void> {
  // Calculate accuracy for the past 30 days up to this date
  const endDate = new Date(date);
  const startDate = new Date(date);
  startDate.setDate(startDate.getDate() - 30);
  
  const startDateStr = startDate.toISOString();
  const endDateStr = endDate.toISOString();
  
  const performanceData = await fetchPerformanceWithForecasts(
    undefined,
    startDateStr,
    endDateStr
  );
  
  // Calculate accuracy
  let totalError = 0;
  let validDataPoints = 0;
  
  for (const item of performanceData) {
    if (item.forecast_spend > 0) {
      const absolutePercentageError = Math.abs(
        (item.actual_spend - item.forecast_spend) / item.forecast_spend
      ) * 100;
      
      totalError += absolutePercentageError;
      validDataPoints += 1;
    }
  }
  
  const mape = validDataPoints > 0 ? totalError / validDataPoints : 0;
  const accuracy = Math.max(0, 100 - mape);
  
  // Update the analytics table
  const { error } = await supabase
    .from('daily_analytics')
    .update({ forecast_accuracy: Number(accuracy.toFixed(1)) })
    .eq('date', date);
  
  if (error) throw new Error(`Error updating forecast accuracy: ${error.message}`);
}