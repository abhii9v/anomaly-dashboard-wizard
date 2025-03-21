import { supabase } from '@/integrations/supabase/client';
import type { Database } from '@/integrations/supabase/types';

export type ForecastEvent = Database['public']['Tables']['forecast_events']['Row'];
export type HourlyForecast = Database['public']['Tables']['hourly_forecasts']['Row'];
export type AlertLevel = Database['public']['Tables']['alert_levels']['Row'];
export type Resource = Database['public']['Tables']['resources']['Row'];

export interface ForecastEventWithDetails extends ForecastEvent {
  hourly_forecasts: HourlyForecast[];
  alert_levels: AlertLevel[];
  resources: Resource[];
}

export interface ForecastStatistics {
  totalEvents: number;
  totalExpectedTraffic: number;
  totalExpectedRevenue: number;
  totalExpectedAdSpend: number;
  highPriorityCount: number;
  mediumPriorityCount: number;
  lowPriorityCount: number;
  nextEventDate: string | null;
}

/**
 * Fetches all forecast events, optionally filtered by priority
 */
export async function fetchForecastEvents(priority?: string): Promise<ForecastEvent[]> {
  let query = supabase
    .from('forecast_events')
    .select('*')
    .order('date', { ascending: true });
  
  if (priority) {
    query = query.eq('priority', priority);
  }
  
  const { data, error } = await query;
  
  if (error) throw new Error(`Error fetching forecast events: ${error.message}`);
  return data || [];
}

/**
 * Fetches the next upcoming forecast events
 */
export async function fetchUpcomingEvents(limit = 4): Promise<ForecastEvent[]> {
  const today = new Date().toISOString().split('T')[0]; // Format as YYYY-MM-DD
  
  const { data, error } = await supabase
    .from('forecast_events')
    .select('*')
    .gte('date', today)
    .order('date', { ascending: true })
    .limit(limit);
  
  if (error) throw new Error(`Error fetching upcoming events: ${error.message}`);
  return data || [];
}

/**
 * Fetches a specific forecast event with all related data
 */
export async function fetchForecastEventWithDetails(id: number): Promise<ForecastEventWithDetails> {
  // Fetch the main forecast event
  const { data: event, error: eventError } = await supabase
    .from('forecast_events')
    .select('*')
    .eq('id', id)
    .single();
  
  if (eventError) throw new Error(`Error fetching forecast event: ${eventError.message}`);
  
  // Fetch hourly forecasts
  const { data: hourlyForecasts, error: hourlyError } = await supabase
    .from('hourly_forecasts')
    .select('*')
    .eq('event_id', id)
    .order('hour', { ascending: true });
  
  if (hourlyError) throw new Error(`Error fetching hourly forecasts: ${hourlyError.message}`);
  
  // Fetch alert levels
  const { data: alertLevels, error: alertError } = await supabase
    .from('alert_levels')
    .select('*')
    .eq('event_id', id)
    .order('level', { ascending: true });
  
  if (alertError) throw new Error(`Error fetching alert levels: ${alertError.message}`);
  
  // Fetch resources
  const { data: resources, error: resourceError } = await supabase
    .from('resources')
    .select('*')
    .eq('event_id', id)
    .order('name', { ascending: true });
  
  if (resourceError) throw new Error(`Error fetching resources: ${resourceError.message}`);
  
  return {
    ...event,
    hourly_forecasts: hourlyForecasts || [],
    alert_levels: alertLevels || [],
    resources: resources || []
  };
}

/**
 * Creates a new forecast event with related data
 */
export async function createForecastEvent(
  event: Omit<ForecastEvent, 'id' | 'created_at' | 'updated_at'>,
  hourlyForecasts?: Omit<HourlyForecast, 'id' | 'created_at' | 'updated_at' | 'event_id'>[],
  alertLevels?: Omit<AlertLevel, 'id' | 'created_at' | 'updated_at' | 'event_id'>[],
  resources?: Omit<Resource, 'id' | 'created_at' | 'updated_at' | 'event_id'>[]
): Promise<ForecastEvent> {
  // Insert the main forecast event
  const { data, error } = await supabase
    .from('forecast_events')
    .insert([event])
    .select()
    .single();
  
  if (error) throw new Error(`Error creating forecast event: ${error.message}`);
  
  const eventId = data.id;
  
  // Insert hourly forecasts if provided
  if (hourlyForecasts && hourlyForecasts.length > 0) {
    const forecastsToInsert = hourlyForecasts.map(forecast => ({
      ...forecast,
      event_id: eventId
    }));
    
    const { error: hourlyError } = await supabase
      .from('hourly_forecasts')
      .insert(forecastsToInsert);
    
    if (hourlyError) throw new Error(`Error adding hourly forecasts: ${hourlyError.message}`);
  }
  
  // Insert alert levels if provided
  if (alertLevels && alertLevels.length > 0) {
    const alertsToInsert = alertLevels.map(alert => ({
      ...alert,
      event_id: eventId
    }));
    
    const { error: alertError } = await supabase
      .from('alert_levels')
      .insert(alertsToInsert);
    
    if (alertError) throw new Error(`Error adding alert levels: ${alertError.message}`);
  }
  
  // Insert resources if provided
  if (resources && resources.length > 0) {
    const resourcesToInsert = resources.map(resource => ({
      ...resource,
      event_id: eventId
    }));
    
    const { error: resourceError } = await supabase
      .from('resources')
      .insert(resourcesToInsert);
    
    if (resourceError) throw new Error(`Error adding resources: ${resourceError.message}`);
  }
  
  return data;
}

/**
 * Updates an existing forecast event
 */
export async function updateForecastEvent(
  id: number,
  updates: Partial<Omit<ForecastEvent, 'id' | 'created_at' | 'updated_at'>>
): Promise<ForecastEvent> {
  // Add updated_at timestamp
  const updatedEvent = {
    ...updates,
    updated_at: new Date().toISOString()
  };
  
  const { data, error } = await supabase
    .from('forecast_events')
    .update(updatedEvent)
    .eq('id', id)
    .select()
    .single();
  
  if (error) throw new Error(`Error updating forecast event: ${error.message}`);
  return data;
}

/**
 * Updates or adds hourly forecasts for an event
 */
export async function updateHourlyForecasts(
  eventId: number,
  forecasts: Omit<HourlyForecast, 'id' | 'created_at' | 'updated_at' | 'event_id'>[]
): Promise<void> {
  // First delete all existing hourly forecasts for this event
  const { error: deleteError } = await supabase
    .from('hourly_forecasts')
    .delete()
    .eq('event_id', eventId);
  
  if (deleteError) throw new Error(`Error deleting existing hourly forecasts: ${deleteError.message}`);
  
  // Then insert the new forecasts
  if (forecasts.length > 0) {
    const forecastsToInsert = forecasts.map(forecast => ({
      ...forecast,
      event_id: eventId
    }));
    
    const { error: insertError } = await supabase
      .from('hourly_forecasts')
      .insert(forecastsToInsert);
    
    if (insertError) throw new Error(`Error updating hourly forecasts: ${insertError.message}`);
  }
}

/**
 * Updates or adds alert levels for an event
 */
export async function updateAlertLevels(
  eventId: number,
  alertLevels: Omit<AlertLevel, 'id' | 'created_at' | 'updated_at' | 'event_id'>[]
): Promise<void> {
  // First delete all existing alert levels for this event
  const { error: deleteError } = await supabase
    .from('alert_levels')
    .delete()
    .eq('event_id', eventId);
  
  if (deleteError) throw new Error(`Error deleting existing alert levels: ${deleteError.message}`);
  
  // Then insert the new alert levels
  if (alertLevels.length > 0) {
    const alertsToInsert = alertLevels.map(alert => ({
      ...alert,
      event_id: eventId
    }));
    
    const { error: insertError } = await supabase
      .from('alert_levels')
      .insert(alertsToInsert);
    
    if (insertError) throw new Error(`Error updating alert levels: ${insertError.message}`);
  }
}

/**
 * Updates or adds resources for an event
 */
export async function updateResources(
  eventId: number,
  resources: Omit<Resource, 'id' | 'created_at' | 'updated_at' | 'event_id'>[]
): Promise<void> {
  // First delete all existing resources for this event
  const { error: deleteError } = await supabase
    .from('resources')
    .delete()
    .eq('event_id', eventId);
  
  if (deleteError) throw new Error(`Error deleting existing resources: ${deleteError.message}`);
  
  // Then insert the new resources
  if (resources.length > 0) {
    const resourcesToInsert = resources.map(resource => ({
      ...resource,
      event_id: eventId
    }));
    
    const { error: insertError } = await supabase
      .from('resources')
      .insert(resourcesToInsert);
    
    if (insertError) throw new Error(`Error updating resources: ${insertError.message}`);
  }
}

/**
 * Gets forecast events statistics
 */
export async function getForecastEventStatistics(): Promise<ForecastStatistics> {
  // Fetch all forecast events
  const { data: events, error } = await supabase
    .from('forecast_events')
    .select('*');
  
  if (error) throw new Error(`Error fetching forecast statistics: ${error.message}`);
  
  // Default statistics
  const stats: ForecastStatistics = {
    totalEvents: 0,
    totalExpectedTraffic: 0,
    totalExpectedRevenue: 0,
    totalExpectedAdSpend: 0,
    highPriorityCount: 0,
    mediumPriorityCount: 0,
    lowPriorityCount: 0,
    nextEventDate: null
  };
  
  if (!events || events.length === 0) {
    return stats;
  }
  
  // Calculate statistics
  stats.totalEvents = events.length;
  
  // Sum metrics
  stats.totalExpectedTraffic = events.reduce((sum, event) => sum + event.expected_traffic, 0);
  stats.totalExpectedRevenue = events.reduce((sum, event) => sum + event.expected_revenue, 0);
  stats.totalExpectedAdSpend = events.reduce((sum, event) => sum + event.expected_ad_spend, 0);
  
  // Count by priority
  stats.highPriorityCount = events.filter(e => e.priority === 'high').length;
  stats.mediumPriorityCount = events.filter(e => e.priority === 'medium').length;
  stats.lowPriorityCount = events.filter(e => e.priority === 'low').length;
  
  // Find next upcoming event
  const today = new Date().toISOString().split('T')[0];
  const upcomingEvents = events
    .filter(event => event.date >= today)
    .sort((a, b) => a.date.localeCompare(b.date));
  
  if (upcomingEvents.length > 0) {
    stats.nextEventDate = upcomingEvents[0].date;
  }
  
  return stats;
}