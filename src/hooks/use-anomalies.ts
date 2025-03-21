import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  fetchRecentAnomalies,
  fetchAdSpendMetrics,
  fetchAnomalousMetrics,
  fetchPerformanceWithForecasts,
  fetchAdPerformance,
  fetchAdSpendForecasts,
  detectAndRecordAnomalies,
  recordRecentAnomaly,
  getAnomalyStatistics,
  type RecentAnomaly,
  type AdSpendMetrics,
  type AdItemPerformance,
  type AdSpendForecast,
  type CombinedPerformanceData
} from '@/services/anomalyService';
import { useCallback, useMemo } from 'react';

// Default thresholds for anomaly detection
export const DEFAULT_THRESHOLDS = {
  L1: 15, // 15% difference triggers L1 alert
  L2: 30, // 30% difference triggers L2 alert
  L3: 50  // 50% difference triggers L3 alert
};

// Query keys for caching and invalidation
export const anomalyKeys = {
  all: ['anomalies'] as const,
  recent: (limit: number = 5) => [...anomalyKeys.all, 'recent', limit] as const,
  adSpendMetrics: (campaignId?: number, startDate?: string, endDate?: string) => 
    [...anomalyKeys.all, 'adSpendMetrics', campaignId, startDate, endDate] as const,
  anomalousMetrics: (limit: number = 20) => 
    [...anomalyKeys.all, 'anomalousMetrics', limit] as const,
  forecastComparison: (campaignId?: number, startDate?: string, endDate?: string, thresholds?: any) =>
    [...anomalyKeys.all, 'forecastComparison', campaignId, startDate, endDate, JSON.stringify(thresholds)] as const,
  adPerformance: (adItemId?: number, campaignId?: number, startDate?: string, endDate?: string) =>
    [...anomalyKeys.all, 'adPerformance', adItemId, campaignId, startDate, endDate] as const,
  adSpendForecasts: (adItemId?: number, startDate?: string, endDate?: string) =>
    [...anomalyKeys.all, 'adSpendForecasts', adItemId, startDate, endDate] as const,
  anomalyStats: (startDate: string, endDate: string) =>
    [...anomalyKeys.all, 'stats', startDate, endDate] as const,
};

/**
 * Hook to get recent anomalies for the dashboard
 */
export function useRecentAnomalies(limit = 5) {
  // Using memoized query key to prevent unnecessary re-renders
  const queryKey = useMemo(() => anomalyKeys.recent(limit), [limit]);
  
  return useQuery<RecentAnomaly[]>({
    queryKey,
    queryFn: () => fetchRecentAnomalies(limit),
    staleTime: 60000, // Data remains fresh for 1 minute
  });
}

/**
 * Hook to get ad spend metrics
 */
export function useAdSpendMetrics(campaignId?: number, startDate?: string, endDate?: string) {
  // Memoize query keys based on the actual values of dependencies
  const queryKey = useMemo(
    () => anomalyKeys.adSpendMetrics(campaignId, startDate, endDate),
    [campaignId, startDate, endDate]
  );
  
  // Memoize the enabled condition
  const isEnabled = useMemo(
    () => startDate !== undefined || endDate !== undefined || campaignId !== undefined,
    [startDate, endDate, campaignId]
  );
  
  return useQuery<AdSpendMetrics[]>({
    queryKey,
    queryFn: () => fetchAdSpendMetrics(campaignId, startDate, endDate),
    enabled: isEnabled,
    staleTime: 60000, // Data remains fresh for 1 minute
  });
}

/**
 * Hook to get only anomalous metrics
 */
export function useAnomalousMetrics(limit = 20) {
  // Memoized query key
  const queryKey = useMemo(() => anomalyKeys.anomalousMetrics(limit), [limit]);
  
  return useQuery<AdSpendMetrics[]>({
    queryKey,
    queryFn: () => fetchAnomalousMetrics(limit),
    staleTime: 60000, // Data remains fresh for 1 minute
  });
}

/**
 * Hook to get raw ad performance data
 */
export function useAdPerformance(
  adItemId?: number,
  campaignId?: number,
  startDateTime?: string,
  endDateTime?: string,
  limit = 100
) {
  // Memoize query keys and fetch function
  const queryKey = useMemo(
    () => anomalyKeys.adPerformance(adItemId, campaignId, startDateTime, endDateTime),
    [adItemId, campaignId, startDateTime, endDateTime]
  );
  
  const isEnabled = useMemo(
    () => !!adItemId || !!campaignId || !!startDateTime || !!endDateTime,
    [adItemId, campaignId, startDateTime, endDateTime]
  );
  
  const fetchFn = useCallback(
    () => fetchAdPerformance(adItemId, campaignId, startDateTime, endDateTime, limit),
    [adItemId, campaignId, startDateTime, endDateTime, limit]
  );
  
  return useQuery<AdItemPerformance[]>({
    queryKey,
    queryFn: fetchFn,
    enabled: isEnabled,
    staleTime: 300000, // Data remains fresh for 5 minutes
  });
}

/**
 * Hook to get ad spend forecast data
 */
export function useAdSpendForecasts(
  adItemId?: number,
  startDateTime?: string,
  endDateTime?: string,
  limit = 100
) {
  // Memoize query keys and fetch function
  const queryKey = useMemo(
    () => anomalyKeys.adSpendForecasts(adItemId, startDateTime, endDateTime),
    [adItemId, startDateTime, endDateTime]
  );
  
  const isEnabled = useMemo(
    () => !!adItemId || !!startDateTime || !!endDateTime,
    [adItemId, startDateTime, endDateTime]
  );
  
  const fetchFn = useCallback(
    () => fetchAdSpendForecasts(adItemId, startDateTime, endDateTime, limit),
    [adItemId, startDateTime, endDateTime, limit]
  );
  
  return useQuery<AdSpendForecast[]>({
    queryKey,
    queryFn: fetchFn,
    enabled: isEnabled,
    staleTime: 300000, // Data remains fresh for 5 minutes
  });
}

/**
 * Hook to get performance data with forecasts and detect anomalies
 */
export function useForecastComparison(
  campaignId?: number,
  startDate?: string,
  endDate?: string,
  customThresholds = DEFAULT_THRESHOLDS,
  limit = 100
) {
  // Memoize the thresholds object to prevent it from causing re-renders
  const thresholds = useMemo(() => customThresholds, [
    customThresholds.L1,
    customThresholds.L2,
    customThresholds.L3
  ]);
  
  // Memoize query key
  const queryKey = useMemo(
    () => anomalyKeys.forecastComparison(campaignId, startDate, endDate, thresholds),
    [campaignId, startDate, endDate, thresholds]
  );
  
  // Memoize enabled condition
  const isEnabled = useMemo(
    () => !!startDate && !!endDate, // Only fetch when we have both start and end dates
    [startDate, endDate]
  );
  
  // Memoize fetch function
  const fetchFn = useCallback(
    () => fetchPerformanceWithForecasts(campaignId, startDate, endDate, thresholds, limit),
    [campaignId, startDate, endDate, thresholds, limit]
  );
  
  return useQuery<CombinedPerformanceData[]>({
    queryKey,
    queryFn: fetchFn,
    enabled: isEnabled,
    staleTime: 300000, // Keep data fresh for 5 minutes (300000 ms)
    refetchOnWindowFocus: false, // Don't refetch when window regains focus
    refetchOnMount: false, // Don't refetch when component mounts if data is still fresh
    refetchOnReconnect: false, // Don't refetch when network reconnects if data is still fresh
  });
}

/**
 * Hook to get anomaly statistics for a time period
 */
export function useAnomalyStatistics(startDate: string, endDate: string) {
  // Memoize query key and enabled condition
  const queryKey = useMemo(
    () => anomalyKeys.anomalyStats(startDate, endDate),
    [startDate, endDate]
  );
  
  const isEnabled = useMemo(
    () => !!startDate && !!endDate,
    [startDate, endDate]
  );
  
  return useQuery({
    queryKey,
    queryFn: () => getAnomalyStatistics(startDate, endDate),
    enabled: isEnabled,
    staleTime: 300000, // Data remains fresh for 5 minutes
  });
}

/**
 * Hook to detect and record anomalies for a given time period
 */
export function useDetectAnomalies() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({
      startDateTime,
      endDateTime,
      customThresholds = DEFAULT_THRESHOLDS
    }: {
      startDateTime: string;
      endDateTime: string;
      customThresholds?: { L1: number; L2: number; L3: number };
    }) => detectAndRecordAnomalies(startDateTime, endDateTime, customThresholds),
    onSuccess: () => {
      // After successfully detecting anomalies, invalidate relevant queries
      queryClient.invalidateQueries({ queryKey: anomalyKeys.recent() });
      queryClient.invalidateQueries({ queryKey: [...anomalyKeys.all, 'forecastComparison'] });
    }
  });
}

/**
 * Hook to manually record a recent anomaly
 */
export function useRecordAnomaly() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (anomalyData: CombinedPerformanceData) => recordRecentAnomaly(anomalyData),
    onSuccess: () => {
      // After recording an anomaly, invalidate the recent anomalies query
      queryClient.invalidateQueries({ queryKey: anomalyKeys.recent() });
    }
  });
}

/**
 * Utility function to format anomaly level from threshold exceeded value
 */
export function formatAnomalyLevel(thresholdExceeded: 'none' | 'L1' | 'L2' | 'L3') {
  switch (thresholdExceeded) {
    case 'L3':
      return { text: 'Critical', color: 'red' };
    case 'L2':
      return { text: 'Warning', color: 'amber' };
    case 'L1':
      return { text: 'Alert', color: 'blue' };
    default:
      return { text: 'Normal', color: 'green' };
  }
}

/**
 * Utility function to get color for anomaly severity
 */
export function getAnomalySeverityColor(severity: 'low' | 'medium' | 'high' | string) {
  switch (severity) {
    case 'high':
      return 'bg-red-100 text-red-800 hover:bg-red-200';
    case 'medium':
      return 'bg-amber-100 text-amber-800 hover:bg-amber-200';
    case 'low':
      return 'bg-blue-100 text-blue-800 hover:bg-blue-200';
    default:
      return 'bg-slate-100 text-slate-800 hover:bg-slate-200';
  }
}

/**
 * Utility function to get the appropriate description for an anomaly level
 */
export function getAnomalyDescription(level: 'none' | 'L1' | 'L2' | 'L3') {
  switch (level) {
    case 'L3':
      return 'Critical threshold exceeded. Immediate action required.';
    case 'L2':
      return 'Warning threshold exceeded. Investigate soon.';
    case 'L1':
      return 'Alert threshold exceeded. Monitor closely.';
    default:
      return 'No anomaly detected.';
  }
}

/**
 * Utility function to determine if a percentage difference is significant
 */
export function isSignificantDifference(
  percentageDifference: number,
  thresholds = DEFAULT_THRESHOLDS
) {
  if (percentageDifference >= thresholds.L3) {
    return 'L3';
  } else if (percentageDifference >= thresholds.L2) {
    return 'L2';
  } else if (percentageDifference >= thresholds.L1) {
    return 'L1';
  }
  return 'none';
}