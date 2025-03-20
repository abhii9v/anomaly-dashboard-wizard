import { useQuery } from '@tanstack/react-query';
import {
  fetchRecentAnomalies,
  fetchAdSpendMetrics,
  fetchAnomalousMetrics,
  type RecentAnomaly,
  type AdSpendMetrics
} from '@/services/anomalyService';

// Query keys for caching and invalidation
export const anomalyKeys = {
  all: ['anomalies'] as const,
  recent: (limit: number = 5) => [...anomalyKeys.all, 'recent', limit] as const,
  adSpendMetrics: (campaignId?: number, startDate?: string, endDate?: string) => 
    [...anomalyKeys.all, 'adSpendMetrics', campaignId, startDate, endDate] as const,
  anomalousMetrics: (limit: number = 20) => 
    [...anomalyKeys.all, 'anomalousMetrics', limit] as const,
};

/**
 * Hook to get recent anomalies for the dashboard
 */
export function useRecentAnomalies(limit = 5) {
  return useQuery<RecentAnomaly[]>({
    queryKey: anomalyKeys.recent(limit),
    queryFn: () => fetchRecentAnomalies(limit),
  });
}

/**
 * Hook to get ad spend metrics
 */
export function useAdSpendMetrics(campaignId?: number, startDate?: string, endDate?: string) {
  return useQuery<AdSpendMetrics[]>({
    queryKey: anomalyKeys.adSpendMetrics(campaignId, startDate, endDate),
    queryFn: () => fetchAdSpendMetrics(campaignId, startDate, endDate),
    enabled: startDate !== undefined || endDate !== undefined || campaignId !== undefined,
  });
}

/**
 * Hook to get only anomalous metrics
 */
export function useAnomalousMetrics(limit = 20) {
  return useQuery<AdSpendMetrics[]>({
    queryKey: anomalyKeys.anomalousMetrics(limit),
    queryFn: () => fetchAnomalousMetrics(limit),
  });
}