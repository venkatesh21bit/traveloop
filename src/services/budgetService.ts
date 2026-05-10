import { supabase } from '@/db/supabase';
import type { Budget } from '@/types/types';

// Fetch budget for a trip
export async function fetchBudget(tripId: string): Promise<Budget | null> {
  const { data, error } = await supabase
    .from('budgets')
    .select('*')
    .eq('trip_id', tripId)
    .maybeSingle();

  if (error) throw error;
  
  if (!data) return null;
  
  // Transform snake_case to camelCase
  return {
    id: data.id,
    tripId: data.trip_id,
    totalBudget: data.total_budget || 0,
    transportCost: data.transport_cost || 0,
    accommodationCost: data.accommodation_cost || 0,
    foodCost: data.food_cost || 0,
    activitiesCost: data.activities_cost || 0,
    miscellaneousCost: data.miscellaneous_cost || 0,
    expenses: [],
  };
}

// Create or update budget
export async function upsertBudget(data: {
  tripId: string;
  totalBudget?: number;
  transportCost?: number;
  accommodationCost?: number;
  foodCost?: number;
  activitiesCost?: number;
  miscellaneousCost?: number;
}): Promise<Budget> {
  const budgetData: any = {
    trip_id: data.tripId,
  };

  if (data.totalBudget !== undefined) budgetData.total_budget = data.totalBudget;
  if (data.transportCost !== undefined) budgetData.transport_cost = data.transportCost;
  if (data.accommodationCost !== undefined) budgetData.accommodation_cost = data.accommodationCost;
  if (data.foodCost !== undefined) budgetData.food_cost = data.foodCost;
  if (data.activitiesCost !== undefined) budgetData.activities_cost = data.activitiesCost;
  if (data.miscellaneousCost !== undefined) budgetData.miscellaneous_cost = data.miscellaneousCost;

  const { data: budget, error } = await supabase
    .from('budgets')
    .upsert(budgetData, { onConflict: 'trip_id' })
    .select()
    .single();

  if (error) throw error;
  
  // Transform snake_case to camelCase
  return {
    id: budget.id,
    tripId: budget.trip_id,
    totalBudget: budget.total_budget || 0,
    transportCost: budget.transport_cost || 0,
    accommodationCost: budget.accommodation_cost || 0,
    foodCost: budget.food_cost || 0,
    activitiesCost: budget.activities_cost || 0,
    miscellaneousCost: budget.miscellaneous_cost || 0,
    expenses: [],
  };
}

// Calculate total activities cost from itinerary
export async function calculateActivitiesCost(tripId: string): Promise<number> {
  const { data, error } = await supabase
    .from('trip_stops')
    .select(`
      itinerary_days(
        activities:itinerary_activities(cost)
      )
    `)
    .eq('trip_id', tripId);

  if (error) throw error;

  let total = 0;
  if (data) {
    for (const stop of data) {
      if (stop.itinerary_days) {
        for (const day of stop.itinerary_days) {
          if (day.activities) {
            for (const activity of day.activities) {
              total += Number(activity.cost) || 0;
            }
          }
        }
      }
    }
  }

  return total;
}

// Calculate accommodation cost estimate
export async function calculateAccommodationCost(
  tripId: string,
  costPerNight: number = 100
): Promise<number> {
  const { data, error } = await supabase
    .from('trips')
    .select('start_date, end_date')
    .eq('id', tripId)
    .single();

  if (error) throw error;

  const startDate = new Date(data.start_date);
  const endDate = new Date(data.end_date);
  const nights = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));

  return nights * costPerNight;
}

// Calculate food cost estimate
export async function calculateFoodCost(
  tripId: string,
  costPerDay: number = 50
): Promise<number> {
  const { data, error } = await supabase
    .from('trips')
    .select('start_date, end_date')
    .eq('id', tripId)
    .single();

  if (error) throw error;

  const startDate = new Date(data.start_date);
  const endDate = new Date(data.end_date);
  const days = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)) + 1;

  return days * costPerDay;
}

// Calculate transport cost estimate
export async function calculateTransportCost(tripId: string): Promise<number> {
  const { data, error } = await supabase
    .from('trip_stops')
    .select('id')
    .eq('trip_id', tripId);

  if (error) throw error;

  // Estimate: $200 per city connection
  const stops = data?.length || 0;
  const connections = Math.max(0, stops - 1);
  return connections * 200;
}

// Auto-calculate and update budget
export async function autoCalculateBudget(
  tripId: string,
  options: {
    accommodationPerNight?: number;
    foodPerDay?: number;
    miscellaneousPerDay?: number;
  } = {}
): Promise<Budget> {
  const {
    accommodationPerNight = 100,
    foodPerDay = 50,
    miscellaneousPerDay = 30,
  } = options;

  // Calculate each category
  const [activitiesCost, accommodationCost, foodCost, transportCost] = await Promise.all([
    calculateActivitiesCost(tripId),
    calculateAccommodationCost(tripId, accommodationPerNight),
    calculateFoodCost(tripId, foodPerDay),
    calculateTransportCost(tripId),
  ]);

  // Calculate miscellaneous
  const { data: trip } = await supabase
    .from('trips')
    .select('start_date, end_date')
    .eq('id', tripId)
    .single();

  const days = trip
    ? Math.ceil((new Date(trip.end_date).getTime() - new Date(trip.start_date).getTime()) / (1000 * 60 * 60 * 24)) + 1
    : 1;

  const miscellaneousCost = days * miscellaneousPerDay;

  const totalBudget =
    transportCost + accommodationCost + foodCost + activitiesCost + miscellaneousCost;

  // Upsert budget
  return await upsertBudget({
    tripId,
    totalBudget,
    transportCost,
    accommodationCost,
    foodCost,
    activitiesCost,
    miscellaneousCost,
  });
}
