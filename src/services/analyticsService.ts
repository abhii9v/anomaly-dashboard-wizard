import { supabase } from '@/integrations/supabase/client';

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