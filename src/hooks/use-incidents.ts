import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  fetchIncidents,
  fetchIncidentWithDetails,
  createIncident,
  updateIncidentStatus,
  addEscalationLog,
  getIncidentStatistics,
  type Incident,
  type EscalationLog
} from '@/services/incidentService';

// Query keys for caching and invalidation
export const incidentKeys = {
  all: ['incidents'] as const,
  lists: () => [...incidentKeys.all, 'list'] as const,
  list: (status?: string) => [...incidentKeys.lists(), status] as const,
  details: () => [...incidentKeys.all, 'detail'] as const,
  detail: (id: number) => [...incidentKeys.details(), id] as const,
  statistics: () => [...incidentKeys.all, 'stats'] as const,
};

/**
 * Hook to get all incidents, optionally filtered by status
 */
export function useIncidents(status?: string) {
  return useQuery<Incident[]>({
    queryKey: incidentKeys.list(status),
    queryFn: () => fetchIncidents(status),
  });
}

/**
 * Hook to get incident details with related data
 */
export function useIncidentDetails(id: number) {
  return useQuery({
    queryKey: incidentKeys.detail(id),
    queryFn: () => fetchIncidentWithDetails(id),
    enabled: id > 0, // Only run query if we have an ID
  });
}

/**
 * Hook to get incident statistics
 */
export function useIncidentStatistics() {
  return useQuery({
    queryKey: incidentKeys.statistics(),
    queryFn: () => getIncidentStatistics(),
  });
}

/**
 * Hook to create a new incident
 */
export function useCreateIncident() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (incident: Omit<Incident, 'id' | 'created_at' | 'updated_at'>) => 
      createIncident(incident),
    onSuccess: () => {
      // Invalidate all incident lists to refetch them
      queryClient.invalidateQueries({ queryKey: incidentKeys.lists() });
      queryClient.invalidateQueries({ queryKey: incidentKeys.statistics() });
    },
  });
}

/**
 * Hook to update incident status
 */
export function useUpdateIncidentStatus() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, status }: { id: number; status: Incident['status'] }) => 
      updateIncidentStatus(id, status),
    onSuccess: (_, variables) => {
      // Invalidate specific incident details and all lists
      queryClient.invalidateQueries({ queryKey: incidentKeys.detail(variables.id) });
      queryClient.invalidateQueries({ queryKey: incidentKeys.lists() });
      queryClient.invalidateQueries({ queryKey: incidentKeys.statistics() });
    },
  });
}

/**
 * Hook to add escalation log entry
 */
export function useAddEscalationLog() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (logEntry: Omit<EscalationLog, 'id' | 'created_at'>) => 
      addEscalationLog(logEntry),
    onSuccess: (_, variables) => {
      // Invalidate the specific incident details
      queryClient.invalidateQueries({ 
        queryKey: incidentKeys.detail(variables.incident_id) 
      });
    },
  });
}