import { supabase } from '@/integrations/supabase/client';
import type { Database } from '@/integrations/supabase/types';

export type RecentAnomaly = Database['public']['Tables']['recent_anomalies']['Row'];
export type AdSpendMetrics = Database['public']['Tables']['ad_spend_metrics']['Row'];

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
 * Records a new ad spend metric
 */
export async function recordAdSpendMetric(
  metric: Omit<AdSpendMetrics, 'id' | 'created_at'>
): Promise<AdSpendMetrics> {
  const { data, error } = await supabase
    .from('ad_spend_metrics')
    .insert([metric])
    .select()
    .single();
  
  if (error) throw new Error(`Error recording ad spend metric: ${error.message}`);
  return data;
}

/**
 * Updates anomaly flag for a metric
 */
export async function updateAnomalyFlag(
  id: number, 
  isAnomaly: boolean
): Promise<void> {
  const { error } = await supabase
    .from('ad_spend_metrics')
    .update({ anomaly: isAnomaly })
    .eq('id', id);
  
  if (error) throw new Error(`Error updating anomaly flag: ${error.message}`);
}

/**
 * Record a new anomaly for dashboard display
 */
export async function recordRecentAnomaly(
  anomaly: Omit<RecentAnomaly, 'id' | 'created_at'>
): Promise<RecentAnomaly> {
  const { data, error } = await supabase
    .from('recent_anomalies')
    .insert([anomaly])
    .select()
    .single();
  
  if (error) throw new Error(`Error recording recent anomaly: ${error.message}`);
  return data;
}