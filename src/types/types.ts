// Core Type Definitions for Traveloop

export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  bio?: string;
  createdAt: string;
}

export interface Trip {
  id: string;
  userId: string;
  name: string;
  description: string;
  coverImage?: string;
  startDate: string;
  endDate: string;
  budget: number;
  travelStyle?: string;
  interests?: string[];
  groupSize?: number;
  status: 'draft' | 'planned' | 'ongoing' | 'completed';
  createdAt: string;
  updatedAt: string;
  stops?: TripStop[];
}

export interface TripStop {
  id: string;
  tripId: string;
  cityId: string;
  city: City;
  startDate: string;
  endDate: string;
  duration: number;
  order: number;
  itineraryDays?: ItineraryDay[];
}

export interface City {
  id: string;
  name: string;
  country: string;
  region?: string;
  description: string;
  image: string;
  costIndex: number;
  rating: number;
  popularActivities: string[];
  weather?: string;
  bestTimeToVisit?: string;
}

export interface Activity {
  id: string;
  name: string;
  description: string;
  categoryId: string;
  category: ActivityCategory;
  cityId: string;
  duration: number;
  price: number;
  rating: number;
  images: string[];
  tags: string[];
}

export interface ActivityCategory {
  id: string;
  name: string;
  icon: string;
  color: string;
}

export interface ItineraryDay {
  id: string;
  tripStopId: string;
  date: string;
  dayNumber: number;
  activities: ItineraryActivity[];
}

export interface ItineraryActivity {
  id: string;
  itineraryDayId: string;
  activityId: string;
  activity: Activity;
  startTime: string;
  endTime: string;
  duration: number;
  cost: number;
  notes?: string;
  order: number;
}

export interface Budget {
  id: string;
  tripId: string;
  totalBudget: number;
  transportCost: number;
  accommodationCost: number;
  foodCost: number;
  activitiesCost: number;
  miscellaneousCost: number;
  expenses: Expense[];
}

export interface Expense {
  id: string;
  budgetId: string;
  category: 'transport' | 'accommodation' | 'food' | 'activities' | 'miscellaneous';
  amount: number;
  description: string;
  date: string;
}

export interface PackingList {
  id: string;
  tripId: string;
  items: PackingItem[];
}

export interface PackingItem {
  id: string;
  packingListId: string;
  name: string;
  category: 'clothing' | 'electronics' | 'documents' | 'toiletries' | 'miscellaneous';
  isPacked: boolean;
  order: number;
}

export interface TripNote {
  id: string;
  tripId: string;
  dayId?: string;
  content: string;
  createdAt: string;
  updatedAt: string;
}

export interface SharedTrip {
  id: string;
  tripId: string;
  shareId: string;
  isPublic: boolean;
  createdAt: string;
  expiresAt?: string;
}

// Form Types
export interface LoginForm {
  email: string;
  password: string;
  rememberMe?: boolean;
}

export interface SignupForm {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  agreeToTerms: boolean;
}

export interface TripFormStep1 {
  name: string;
  description: string;
  coverImage?: string;
  startDate: Date | undefined;
  endDate: Date | undefined;
}

export interface TripFormStep2 {
  budget: number;
  travelStyle: string;
  interests: string[];
  groupSize: number;
}

export interface TripFormStep3 {
  cities: { cityId: string; duration: number }[];
}

// API Response Types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

// Filter and Sort Types
export interface TripFilters {
  status?: Trip['status'];
  startDate?: string;
  endDate?: string;
  search?: string;
}

export interface CityFilters {
  country?: string;
  budget?: number;
  weather?: string;
  popularity?: number;
  activities?: string[];
  search?: string;
}

export interface ActivityFilters {
  categoryId?: string;
  cityId?: string;
  minPrice?: number;
  maxPrice?: number;
  minRating?: number;
  search?: string;
}

export type SortOrder = 'asc' | 'desc';

export interface SortOptions {
  field: string;
  order: SortOrder;
}

// Stats Types
export interface DashboardStats {
  totalTrips: number;
  upcomingTrips: number;
  completedTrips: number;
  totalDestinations: number;
  totalBudget: number;
}

// View Mode Types
export type ItineraryViewMode = 'timeline' | 'calendar' | 'list';

// Theme Types
export type Theme = 'light' | 'dark';
