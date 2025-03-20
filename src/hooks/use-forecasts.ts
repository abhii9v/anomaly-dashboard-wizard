import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  fetchForecastEvents,
  fetchForecastEventWithDetails,
  fetchUpcomingEvents,
  createForecastEvent,
  updateForecastEvent,
  getForecastEventStatistics,
  type ForecastEvent
} from '@/services/forecastService';

// Query keys for caching and invalidation
export const forecastKeys = {
  all: ['forecasts'] as const,
  lists: () => [...forecastKeys.all, 'list'] as const,
  list: (priority?: string) => [...forecastKeys.lists(), priority] as const,
  upcoming: (limit: number) => [...forecastKeys.lists(), 'upcoming', limit] as const,
  details: () => [...forecastKeys.all, 'detail'] as const,
  detail: (id: number) => [...forecastKeys.details(), id] as const,
  statistics: () => [...forecastKeys.all, 'stats'] as const,
};

/**
 * Hook to get all forecast events, optionally filtered by priority
 */
export function useForecastEvents(priority?: string) {
  return useQuery({
    queryKey: forecastKeys.list(priority),
    queryFn: () => fetchForecastEvents(priority),
  });
}

/**
 * Hook to get upcoming forecast events
 */
export function useUpcomingEvents(limit = 4) {
  return useQuery({
    queryKey: forecastKeys.upcoming(limit),
    queryFn: () => fetchUpcomingEvents(limit),
  });
}

/**
 * Hook to get forecast event details with related data
 */
export function useForecastEventDetails(id: number) {
  return useQuery({
    queryKey: forecastKeys.detail(id),
    queryFn: () => fetchForecastEventWithDetails(id),
    enabled: id > 0, // Only run query if we have an ID
  });
}

/**
 * Hook to get forecast statistics
 */
export function useForecastStatistics() {
  return useQuery({
    queryKey: forecastKeys.statistics(),
    queryFn: () => getForecastEventStatistics(),
  });
}

/**
 * Hook to create a new forecast event
 */
export function useCreateForecastEvent() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (event: Omit<ForecastEvent, 'id' | 'created_at' | 'updated_at'>) => 
      createForecastEvent(event),
    onSuccess: () => {
      // Invalidate relevant queries
      queryClient.invalidateQueries({ queryKey: forecastKeys.lists() });
      queryClient.invalidateQueries({ queryKey: forecastKeys.statistics() });
    },
  });
}

/**
 * Hook to update forecast event
 */
export function useUpdateForecastEvent() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, updates }: { 
      id: number; 
      updates: Partial<Omit<ForecastEvent, 'id' | 'created_at' | 'updated_at'>>
    }) => updateForecastEvent(id, updates),
    onSuccess: (_, variables) => {
      // Invalidate specific event details and lists
      queryClient.invalidateQueries({ queryKey: forecastKeys.detail(variables.id) });
      queryClient.invalidateQueries({ queryKey: forecastKeys.lists() });
    },
  });
}