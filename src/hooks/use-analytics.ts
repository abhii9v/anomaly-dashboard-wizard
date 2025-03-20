import { useQuery } from '@tanstack/react-query';
import {
  fetchLatestAnalytics,
  fetchAnalyticsByDateRange,
  fetchAnalyticsForPastDays,
  calculateTrend,
  type DailyAnalytics
} from '@/services/analyticsService';

// Query keys for caching and invalidation
export const analyticsKeys = {
  all: ['analytics'] as const,
  latest: () => [...analyticsKeys.all, 'latest'] as const,
  byDateRange: (startDate: string, endDate: string) => 
    [...analyticsKeys.all, 'byDateRange', startDate, endDate] as const,
  byPastDays: (days: number) => 
    [...analyticsKeys.all, 'byPastDays', days] as const,
};

/**
 * Hook to get the latest analytics data
 */
export function useLatestAnalytics() {
  return useQuery({
    queryKey: analyticsKeys.latest(),
    queryFn: () => fetchLatestAnalytics(),
  });
}

/**
 * Hook to get analytics for a specific date range
 */
export function useAnalyticsByDateRange(startDate: string, endDate: string) {
  return useQuery({
    queryKey: analyticsKeys.byDateRange(startDate, endDate),
    queryFn: () => fetchAnalyticsByDateRange(startDate, endDate),
    enabled: !!startDate && !!endDate,
  });
}

/**
 * Hook to get analytics for the past n days
 */
export function useAnalyticsForPastDays(days: number) {
  return useQuery({
    queryKey: analyticsKeys.byPastDays(days),
    queryFn: () => fetchAnalyticsForPastDays(days),
  });
}

/**
 * Utility function to calculate metric trends
 */
export function useAnalyticsTrends(current?: DailyAnalytics, previous?: DailyAnalytics) {
  if (!current || !previous) return null;

  return {
    adSpend: calculateTrend(current.total_ad_spend, previous.total_ad_spend),
    anomalies: calculateTrend(current.anomalies_detected, previous.anomalies_detected),
    fraudPrevention: calculateTrend(current.fraud_prevention_amount, previous.fraud_prevention_amount),
    forecastAccuracy: calculateTrend(current.forecast_accuracy, previous.forecast_accuracy),
  };
}