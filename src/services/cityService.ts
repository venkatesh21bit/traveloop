import { supabase } from '@/db/supabase';
import type { City, Activity, ActivityCategory } from '@/types/types';

// Fetch all cities
export async function fetchCities(): Promise<City[]> {
  const { data, error } = await supabase
    .from('cities')
    .select('*')
    .order('name');

  if (error) throw error;
  
  return data.map(city => ({
    id: city.id,
    name: city.name,
    country: city.country,
    region: city.region,
    description: city.description,
    image: city.image,
    costIndex: city.cost_index,
    rating: city.rating,
    popularActivities: city.popular_activities || [],
    weather: city.weather,
    bestTimeToVisit: city.best_time_to_visit,
  }));
}

// Fetch city by ID
export async function fetchCityById(id: string): Promise<City | null> {
  const { data, error } = await supabase
    .from('cities')
    .select('*')
    .eq('id', id)
    .maybeSingle();

  if (error) throw error;
  if (!data) return null;

  return {
    id: data.id,
    name: data.name,
    country: data.country,
    region: data.region,
    description: data.description,
    image: data.image,
    costIndex: data.cost_index,
    rating: data.rating,
    popularActivities: data.popular_activities || [],
    weather: data.weather,
    bestTimeToVisit: data.best_time_to_visit,
  };
}

// Fetch all activity categories
export async function fetchActivityCategories(): Promise<ActivityCategory[]> {
  const { data, error } = await supabase
    .from('activity_categories')
    .select('*')
    .order('name');

  if (error) throw error;

  return data.map(cat => ({
    id: cat.id,
    name: cat.name,
    icon: cat.icon,
    color: cat.color,
  }));
}

// Fetch activities by city
export async function fetchActivitiesByCity(cityId: string): Promise<Activity[]> {
  const { data, error } = await supabase
    .from('activities')
    .select(`
      *,
      category:activity_categories(*)
    `)
    .eq('city_id', cityId)
    .order('rating', { ascending: false });

  if (error) throw error;

  return data.map(activity => ({
    id: activity.id,
    name: activity.name,
    description: activity.description,
    categoryId: activity.category_id,
    category: {
      id: activity.category.id,
      name: activity.category.name,
      icon: activity.category.icon,
      color: activity.category.color,
    },
    cityId: activity.city_id,
    duration: activity.duration,
    price: parseFloat(activity.price),
    rating: parseFloat(activity.rating),
    images: activity.images || [],
    tags: activity.tags || [],
  }));
}

// Fetch all activities
export async function fetchActivities(): Promise<Activity[]> {
  const { data, error } = await supabase
    .from('activities')
    .select(`
      *,
      category:activity_categories(*)
    `)
    .order('rating', { ascending: false });

  if (error) throw error;

  return data.map(activity => ({
    id: activity.id,
    name: activity.name,
    description: activity.description,
    categoryId: activity.category_id,
    category: {
      id: activity.category.id,
      name: activity.category.name,
      icon: activity.category.icon,
      color: activity.category.color,
    },
    cityId: activity.city_id,
    duration: activity.duration,
    price: parseFloat(activity.price),
    rating: parseFloat(activity.rating),
    images: activity.images || [],
    tags: activity.tags || [],
  }));
}

// Fetch activity by ID
export async function fetchActivityById(id: string): Promise<Activity | null> {
  const { data, error } = await supabase
    .from('activities')
    .select(`
      *,
      category:activity_categories(*)
    `)
    .eq('id', id)
    .maybeSingle();

  if (error) throw error;
  if (!data) return null;

  return {
    id: data.id,
    name: data.name,
    description: data.description,
    categoryId: data.category_id,
    category: {
      id: data.category.id,
      name: data.category.name,
      icon: data.category.icon,
      color: data.category.color,
    },
    cityId: data.city_id,
    duration: data.duration,
    price: parseFloat(data.price),
    rating: parseFloat(data.rating),
    images: data.images || [],
    tags: data.tags || [],
  };
}
