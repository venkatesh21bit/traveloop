import { supabase } from '@/db/supabase';
import type { ItineraryDay, ItineraryActivity } from '@/types/types';

// Fetch itinerary days for a trip stop
export async function fetchItineraryDays(tripStopId: string): Promise<ItineraryDay[]> {
  const { data, error } = await supabase
    .from('itinerary_days')
    .select(`
      *,
      activities:itinerary_activities(
        *,
        activity:activities(
          *,
          category:activity_categories(*)
        )
      )
    `)
    .eq('trip_stop_id', tripStopId)
    .order('day_number', { ascending: true });

  if (error) throw error;
  return data || [];
}

// Fetch all itinerary days for a trip
export async function fetchTripItinerary(tripId: string) {
  const { data, error } = await supabase
    .from('trip_stops')
    .select(`
      *,
      city:cities(*),
      itinerary_days(
        *,
        activities:itinerary_activities(
          *,
          activity:activities(
            *,
            category:activity_categories(*)
          )
        )
      )
    `)
    .eq('trip_id', tripId)
    .order('stop_order', { ascending: true });

  if (error) throw error;
  return data || [];
}

// Create itinerary day
export async function createItineraryDay(data: {
  tripStopId: string;
  date: string;
  dayNumber: number;
}): Promise<ItineraryDay> {
  const { data: day, error } = await supabase
    .from('itinerary_days')
    .insert({
      trip_stop_id: data.tripStopId,
      date: data.date,
      day_number: data.dayNumber,
    })
    .select()
    .single();

  if (error) throw error;
  return day;
}

// Add activity to itinerary
export async function addItineraryActivity(data: {
  itineraryDayId: string;
  activityId: string;
  startTime: string;
  endTime: string;
  duration: number;
  cost: number;
  notes?: string;
  order: number;
}): Promise<ItineraryActivity> {
  const { data: activity, error } = await supabase
    .from('itinerary_activities')
    .insert({
      itinerary_day_id: data.itineraryDayId,
      activity_id: data.activityId,
      start_time: data.startTime,
      end_time: data.endTime,
      duration: data.duration,
      cost: data.cost,
      notes: data.notes,
      activity_order: data.order,
    })
    .select(`
      *,
      activity:activities(
        *,
        category:activity_categories(*)
      )
    `)
    .single();

  if (error) throw error;
  return activity;
}

// Update itinerary activity
export async function updateItineraryActivity(
  id: string,
  data: Partial<{
    startTime: string;
    endTime: string;
    duration: number;
    cost: number;
    notes: string;
    order: number;
  }>
): Promise<void> {
  const updateData: any = {};
  if (data.startTime) updateData.start_time = data.startTime;
  if (data.endTime) updateData.end_time = data.endTime;
  if (data.duration !== undefined) updateData.duration = data.duration;
  if (data.cost !== undefined) updateData.cost = data.cost;
  if (data.notes !== undefined) updateData.notes = data.notes;
  if (data.order !== undefined) updateData.activity_order = data.order;

  const { error } = await supabase
    .from('itinerary_activities')
    .update(updateData)
    .eq('id', id);

  if (error) throw error;
}

// Delete itinerary activity
export async function deleteItineraryActivity(id: string): Promise<void> {
  const { error } = await supabase
    .from('itinerary_activities')
    .delete()
    .eq('id', id);

  if (error) throw error;
}

// Reorder itinerary activities
export async function reorderItineraryActivities(
  activities: Array<{ id: string; order: number }>
): Promise<void> {
  const updates = activities.map((activity) =>
    supabase
      .from('itinerary_activities')
      .update({ activity_order: activity.order })
      .eq('id', activity.id)
  );

  await Promise.all(updates);
}

// Check for time conflicts
export async function checkTimeConflicts(
  itineraryDayId: string,
  startTime: string,
  endTime: string,
  excludeActivityId?: string
): Promise<boolean> {
  let query = supabase
    .from('itinerary_activities')
    .select('id, start_time, end_time')
    .eq('itinerary_day_id', itineraryDayId);

  if (excludeActivityId) {
    query = query.neq('id', excludeActivityId);
  }

  const { data, error } = await query;

  if (error) throw error;

  if (!data || data.length === 0) return false;

  // Check for overlaps
  const newStart = new Date(`2000-01-01T${startTime}`);
  const newEnd = new Date(`2000-01-01T${endTime}`);

  for (const activity of data) {
    const existingStart = new Date(`2000-01-01T${activity.start_time}`);
    const existingEnd = new Date(`2000-01-01T${activity.end_time}`);

    // Check if times overlap
    if (
      (newStart >= existingStart && newStart < existingEnd) ||
      (newEnd > existingStart && newEnd <= existingEnd) ||
      (newStart <= existingStart && newEnd >= existingEnd)
    ) {
      return true; // Conflict found
    }
  }

  return false; // No conflicts
}
