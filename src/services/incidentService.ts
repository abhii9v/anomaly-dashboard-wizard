import { supabase } from '@/integrations/supabase/client';
import type { Database } from '@/integrations/supabase/types';

export type Incident = Database['public']['Tables']['incidents']['Row'];
export type AffectedSystem = Database['public']['Tables']['affected_systems']['Row'];
export type RecoveryTimeline = Database['public']['Tables']['recovery_timeline']['Row'];
export type EscalationLog = Database['public']['Tables']['escalation_logs']['Row'];
export type Recommendation = Database['public']['Tables']['recommendations']['Row'];

export interface IncidentWithDetails extends Incident {
  affected_systems: string[];
  recovery_timeline: RecoveryTimeline[];
  escalation_logs: (EscalationLog & { user_name?: string })[];
  recommendations: Recommendation[];
}

export interface IncidentStatistics {
  total: number;
  open: number;
  resolved: number;
  critical: number;
  high: number;
  medium: number;
  low: number;
  falsePositives: number;
  totalFinancialLoss: number;
  avgResolutionTime: number;
}

/**
 * Fetches all incidents, optionally filtered by status
 */
export async function fetchIncidents(status?: string): Promise<Incident[]> {
  let query = supabase
    .from('incidents')
    .select('*')
    .order('detected_at', { ascending: false });
  
  if (status) {
    if (status === 'open') {
      // Open incidents include both 'open' and 'investigating' statuses
      query = query.in('status', ['open', 'investigating']);
    } else {
      query = query.eq('status', status);
    }
  }
  
  const { data, error } = await query;
  
  if (error) throw new Error(`Error fetching incidents: ${error.message}`);
  return data || [];
}

/**
 * Fetches a specific incident with all related data
 */
export async function fetchIncidentWithDetails(id: number): Promise<IncidentWithDetails> {
  // Fetch the main incident
  const { data: incident, error: incidentError } = await supabase
    .from('incidents')
    .select('*')
    .eq('id', id)
    .single();
  
  if (incidentError) throw new Error(`Error fetching incident: ${incidentError.message}`);
  
  // Fetch affected systems
  const { data: affectedSystems, error: systemsError } = await supabase
    .from('affected_systems')
    .select('system_name')
    .eq('incident_id', id);
  
  if (systemsError) throw new Error(`Error fetching affected systems: ${systemsError.message}`);
  
  // Fetch recovery timeline
  const { data: timeline, error: timelineError } = await supabase
    .from('recovery_timeline')
    .select('*')
    .eq('incident_id', id)
    .order('time', { ascending: true });
  
  if (timelineError) throw new Error(`Error fetching recovery timeline: ${timelineError.message}`);
  
  // Fetch escalation logs with user data
  const { data: logs, error: logsError } = await supabase
    .from('escalation_logs')
    .select(`
      *,
      users:user_id (name)
    `)
    .eq('incident_id', id)
    .order('logged_at', { ascending: true });
  
  if (logsError) throw new Error(`Error fetching escalation logs: ${logsError.message}`);
  
  // Format the logs to include user name
  const formattedLogs = logs.map(log => ({
    ...log,
    user_name: log.users?.name
  }));
  
  // Fetch recommendations
  const { data: recommendations, error: recommendationsError } = await supabase
    .from('recommendations')
    .select('*')
    .eq('incident_id', id)
    .order('priority', { ascending: true });
  
  if (recommendationsError) throw new Error(`Error fetching recommendations: ${recommendationsError.message}`);
  
  return {
    ...incident,
    affected_systems: affectedSystems.map(system => system.system_name),
    recovery_timeline: timeline || [],
    escalation_logs: formattedLogs || [],
    recommendations: recommendations || []
  };
}

/**
 * Creates a new incident with related data
 */
export async function createIncident(
  incident: Omit<Incident, 'id' | 'created_at' | 'updated_at'>,
  affectedSystems?: string[],
  recommendations?: string[]
): Promise<Incident> {
  // Start a PostgreSQL transaction
  const { data, error } = await supabase
    .from('incidents')
    .insert([incident])
    .select()
    .single();
  
  if (error) throw new Error(`Error creating incident: ${error.message}`);
  
  const incidentId = data.id;
  
  // Insert affected systems if provided
  if (affectedSystems && affectedSystems.length > 0) {
    const systemsToInsert = affectedSystems.map(system => ({
      incident_id: incidentId,
      system_name: system
    }));
    
    const { error: systemsError } = await supabase
      .from('affected_systems')
      .insert(systemsToInsert);
    
    if (systemsError) throw new Error(`Error adding affected systems: ${systemsError.message}`);
  }
  
  // Insert recommendations if provided
  if (recommendations && recommendations.length > 0) {
    const recommendationsToInsert = recommendations.map((recommendation, index) => ({
      incident_id: incidentId,
      recommendation,
      priority: index + 1
    }));
    
    const { error: recommendationsError } = await supabase
      .from('recommendations')
      .insert(recommendationsToInsert);
    
    if (recommendationsError) throw new Error(`Error adding recommendations: ${recommendationsError.message}`);
  }
  
  return data;
}

/**
 * Updates incident status and sets resolved_at if needed
 */
export async function updateIncidentStatus(
  id: number, 
  status: Incident['status']
): Promise<void> {
  const updates: Partial<Incident> = { 
    status,
    updated_at: new Date().toISOString()
  };
  
  // If status is 'resolved', set the resolved_at timestamp
  if (status === 'resolved') {
    updates.resolved_at = new Date().toISOString();
    
    // Also calculate the duration based on detected_at and resolved_at
    const { data: incident } = await supabase
      .from('incidents')
      .select('detected_at')
      .eq('id', id)
      .single();
    
    if (incident) {
      const detected = new Date(incident.detected_at);
      const resolved = new Date();
      const durationMs = resolved.getTime() - detected.getTime();
      
      // Format duration as "Xh Ym"
      const hours = Math.floor(durationMs / (60 * 60 * 1000));
      const minutes = Math.floor((durationMs % (60 * 60 * 1000)) / (60 * 1000));
      updates.duration = `${hours}h ${minutes}m`;
    }
  }
  
  const { error } = await supabase
    .from('incidents')
    .update(updates)
    .eq('id', id);
  
  if (error) throw new Error(`Error updating incident status: ${error.message}`);
}

/**
 * Adds an escalation log entry
 */
export async function addEscalationLog(
  log: Omit<EscalationLog, 'id' | 'created_at'>
): Promise<EscalationLog> {
  const { data, error } = await supabase
    .from('escalation_logs')
    .insert([log])
    .select()
    .single();
  
  if (error) throw new Error(`Error adding escalation log: ${error.message}`);
  return data;
}

/**
 * Gets incident statistics for the dashboard
 */
export async function getIncidentStatistics(): Promise<IncidentStatistics> {
  // Fetch all incidents
  const { data: incidents, error } = await supabase
    .from('incidents')
    .select('*');
  
  if (error) throw new Error(`Error fetching incident statistics: ${error.message}`);
  
  // Default values
  const stats: IncidentStatistics = {
    total: 0,
    open: 0,
    resolved: 0,
    critical: 0,
    high: 0,
    medium: 0,
    low: 0,
    falsePositives: 0,
    totalFinancialLoss: 0,
    avgResolutionTime: 0
  };
  
  if (!incidents || incidents.length === 0) {
    return stats;
  }
  
  // Calculate statistics
  stats.total = incidents.length;
  stats.open = incidents.filter(i => i.status === 'open' || i.status === 'investigating').length;
  stats.resolved = incidents.filter(i => i.status === 'resolved').length;
  stats.falsePositives = incidents.filter(i => i.status === 'false-positive').length;
  
  // Severity counts
  stats.critical = incidents.filter(i => i.severity === 'critical').length;
  stats.high = incidents.filter(i => i.severity === 'high').length;
  stats.medium = incidents.filter(i => i.severity === 'medium').length;
  stats.low = incidents.filter(i => i.severity === 'low').length;
  
  // Financial impact
  stats.totalFinancialLoss = incidents.reduce((sum, incident) => {
    return sum + (incident.financial_loss || 0);
  }, 0);
  
  // Average resolution time (for resolved incidents)
  const resolvedIncidents = incidents.filter(i => i.duration && i.status === 'resolved');
  if (resolvedIncidents.length > 0) {
    let totalHours = 0;
    
    for (const incident of resolvedIncidents) {
      if (incident.duration) {
        const match = incident.duration.match(/(\d+)h\s+(\d+)m/);
        if (match) {
          const hours = parseInt(match[1]);
          const minutes = parseInt(match[2]);
          totalHours += hours + (minutes / 60);
        }
      }
    }
    
    stats.avgResolutionTime = parseFloat((totalHours / resolvedIncidents.length).toFixed(1));
  }
  
  return stats;
}