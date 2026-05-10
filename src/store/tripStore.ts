import { create } from 'zustand';
import type { Trip, TripFilters, SortOptions } from '@/types/types';

interface TripState {
  trips: Trip[];
  currentTrip: Trip | null;
  filters: TripFilters;
  sortOptions: SortOptions;
  isLoading: boolean;
  setTrips: (trips: Trip[]) => void;
  addTrip: (trip: Trip) => void;
  updateTrip: (id: string, trip: Partial<Trip>) => void;
  deleteTrip: (id: string) => void;
  setCurrentTrip: (trip: Trip | null) => void;
  setFilters: (filters: TripFilters) => void;
  setSortOptions: (sortOptions: SortOptions) => void;
  getFilteredTrips: () => Trip[];
}

export const useTripStore = create<TripState>((set, get) => ({
  trips: [],
  currentTrip: null,
  filters: {},
  sortOptions: { field: 'createdAt', order: 'desc' },
  isLoading: false,

  setTrips: (trips) => set({ trips }),

  addTrip: (trip) =>
    set((state) => ({
      trips: [trip, ...state.trips],
    })),

  updateTrip: (id, tripData) =>
    set((state) => ({
      trips: state.trips.map((trip) =>
        trip.id === id ? { ...trip, ...tripData } : trip
      ),
      currentTrip:
        state.currentTrip?.id === id
          ? { ...state.currentTrip, ...tripData }
          : state.currentTrip,
    })),

  deleteTrip: (id) =>
    set((state) => ({
      trips: state.trips.filter((trip) => trip.id !== id),
      currentTrip: state.currentTrip?.id === id ? null : state.currentTrip,
    })),

  setCurrentTrip: (trip) => set({ currentTrip: trip }),

  setFilters: (filters) => set({ filters }),

  setSortOptions: (sortOptions) => set({ sortOptions }),

  getFilteredTrips: () => {
    const { trips, filters, sortOptions } = get();
    let filtered = [...trips];

    // Apply filters
    if (filters.status) {
      filtered = filtered.filter((trip) => trip.status === filters.status);
    }

    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      filtered = filtered.filter(
        (trip) =>
          trip.name.toLowerCase().includes(searchLower) ||
          trip.description.toLowerCase().includes(searchLower)
      );
    }

    if (filters.startDate) {
      filtered = filtered.filter(
        (trip) => new Date(trip.startDate) >= new Date(filters.startDate!)
      );
    }

    if (filters.endDate) {
      filtered = filtered.filter(
        (trip) => new Date(trip.endDate) <= new Date(filters.endDate!)
      );
    }

    // Apply sorting
    filtered.sort((a, b) => {
      const aValue = a[sortOptions.field as keyof Trip];
      const bValue = b[sortOptions.field as keyof Trip];

      if (aValue === undefined || bValue === undefined) return 0;
      if (aValue < bValue) return sortOptions.order === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortOptions.order === 'asc' ? 1 : -1;
      return 0;
    });

    return filtered;
  },
}));
