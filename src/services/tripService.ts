import { supabase } from '@/db/supabase';
import type { Trip, TripStop } from '@/types/types';

// Fetch all trips for current user
export async function fetchTrips(): Promise<Trip[]> {
  const { data, error } = await supabase
    .from('trips')
    .select(`
      *,
      stops:trip_stops(
        *,
        city:cities(*)
      )
    `)
    .order('created_at', { ascending: false });

  if (error) throw error;

  return data.map(trip => ({
    id: trip.id,
    userId: trip.user_id,
    name: trip.name,
    description: trip.description || '',
    coverImage: trip.cover_image,
    startDate: trip.start_date,
    endDate: trip.end_date,
    budget: parseFloat(trip.budget),
    travelStyle: trip.travel_style,
    interests: trip.interests || [],
    groupSize: trip.group_size,
    status: trip.status as Trip['status'],
    createdAt: trip.created_at,
    updatedAt: trip.updated_at,
    stops: trip.stops?.map((stop: any) => ({
      id: stop.id,
      tripId: stop.trip_id,
      cityId: stop.city_id,
      city: {
        id: stop.city.id,
        name: stop.city.name,
        country: stop.city.country,
        region: stop.city.region,
        description: stop.city.description,
        image: stop.city.image,
        costIndex: stop.city.cost_index,
        rating: parseFloat(stop.city.rating),
        popularActivities: stop.city.popular_activities || [],
        weather: stop.city.weather,
        bestTimeToVisit: stop.city.best_time_to_visit,
      },
      startDate: stop.start_date,
      endDate: stop.end_date,
      duration: stop.duration,
      order: stop.stop_order,
    })) || [],
  }));
}

// Fetch trip by ID
export async function fetchTripById(id: string): Promise<Trip | null> {
  const { data, error } = await supabase
    .from('trips')
    .select(`
      *,
      stops:trip_stops(
        *,
        city:cities(*)
      )
    `)
    .eq('id', id)
    .maybeSingle();

  if (error) throw error;
  if (!data) return null;

  return {
    id: data.id,
    userId: data.user_id,
    name: data.name,
    description: data.description || '',
    coverImage: data.cover_image,
    startDate: data.start_date,
    endDate: data.end_date,
    budget: parseFloat(data.budget),
    travelStyle: data.travel_style,
    interests: data.interests || [],
    groupSize: data.group_size,
    status: data.status as Trip['status'],
    createdAt: data.created_at,
    updatedAt: data.updated_at,
    stops: data.stops?.map((stop: any) => ({
      id: stop.id,
      tripId: stop.trip_id,
      cityId: stop.city_id,
      city: {
        id: stop.city.id,
        name: stop.city.name,
        country: stop.city.country,
        region: stop.city.region,
        description: stop.city.description,
        image: stop.city.image,
        costIndex: stop.city.cost_index,
        rating: parseFloat(stop.city.rating),
        popularActivities: stop.city.popular_activities || [],
        weather: stop.city.weather,
        bestTimeToVisit: stop.city.best_time_to_visit,
      },
      startDate: stop.start_date,
      endDate: stop.end_date,
      duration: stop.duration,
      order: stop.stop_order,
    })) || [],
  };
}

// Create new trip
export async function createTrip(trip: Omit<Trip, 'id' | 'createdAt' | 'updatedAt' | 'stops'>): Promise<Trip> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Not authenticated');

  const { data, error } = await supabase
    .from('trips')
    .insert({
      user_id: user.id,
      name: trip.name,
      description: trip.description,
      cover_image: trip.coverImage,
      start_date: trip.startDate,
      end_date: trip.endDate,
      budget: trip.budget,
      travel_style: trip.travelStyle,
      interests: trip.interests,
      group_size: trip.groupSize,
      status: trip.status,
    })
    .select()
    .single();

  if (error) throw error;

  return {
    id: data.id,
    userId: data.user_id,
    name: data.name,
    description: data.description || '',
    coverImage: data.cover_image,
    startDate: data.start_date,
    endDate: data.end_date,
    budget: parseFloat(data.budget),
    travelStyle: data.travel_style,
    interests: data.interests || [],
    groupSize: data.group_size,
    status: data.status as Trip['status'],
    createdAt: data.created_at,
    updatedAt: data.updated_at,
    stops: [],
  };
}

// Update trip
export async function updateTrip(id: string, updates: Partial<Trip>): Promise<Trip> {
  const { data, error } = await supabase
    .from('trips')
    .update({
      name: updates.name,
      description: updates.description,
      cover_image: updates.coverImage,
      start_date: updates.startDate,
      end_date: updates.endDate,
      budget: updates.budget,
      travel_style: updates.travelStyle,
      interests: updates.interests,
      group_size: updates.groupSize,
      status: updates.status,
    })
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;

  return {
    id: data.id,
    userId: data.user_id,
    name: data.name,
    description: data.description || '',
    coverImage: data.cover_image,
    startDate: data.start_date,
    endDate: data.end_date,
    budget: parseFloat(data.budget),
    travelStyle: data.travel_style,
    interests: data.interests || [],
    groupSize: data.group_size,
    status: data.status as Trip['status'],
    createdAt: data.created_at,
    updatedAt: data.updated_at,
    stops: [],
  };
}

// Delete trip
export async function deleteTrip(id: string): Promise<void> {
  const { error } = await supabase
    .from('trips')
    .delete()
    .eq('id', id);

  if (error) throw error;
}

// Add trip stop
export async function addTripStop(stop: Omit<TripStop, 'id'>): Promise<TripStop> {
  const { data, error } = await supabase
    .from('trip_stops')
    .insert({
      trip_id: stop.tripId,
      city_id: stop.cityId,
      start_date: stop.startDate,
      end_date: stop.endDate,
      duration: stop.duration,
      stop_order: stop.order,
    })
    .select(`
      *,
      city:cities(*)
    `)
    .single();

  if (error) throw error;

  return {
    id: data.id,
    tripId: data.trip_id,
    cityId: data.city_id,
    city: {
      id: data.city.id,
      name: data.city.name,
      country: data.city.country,
      region: data.city.region,
      description: data.city.description,
      image: data.city.image,
      costIndex: data.city.cost_index,
      rating: parseFloat(data.city.rating),
      popularActivities: data.city.popular_activities || [],
      weather: data.city.weather,
      bestTimeToVisit: data.city.best_time_to_visit,
    },
    startDate: data.start_date,
    endDate: data.end_date,
    duration: data.duration,
    order: data.stop_order,
  };
}

// Delete trip stop
export async function deleteTripStop(id: string): Promise<void> {
  const { error } = await supabase
    .from('trip_stops')
    .delete()
    .eq('id', id);

  if (error) throw error;
}
