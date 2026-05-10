import { create } from 'zustand';
import type { ItineraryDay, ItineraryActivity, ItineraryViewMode } from '@/types/types';

interface ItineraryState {
  days: ItineraryDay[];
  viewMode: ItineraryViewMode;
  selectedDay: ItineraryDay | null;
  isLoading: boolean;
  setDays: (days: ItineraryDay[]) => void;
  addDay: (day: ItineraryDay) => void;
  updateDay: (id: string, day: Partial<ItineraryDay>) => void;
  deleteDay: (id: string) => void;
  addActivity: (dayId: string, activity: ItineraryActivity) => void;
  updateActivity: (dayId: string, activityId: string, activity: Partial<ItineraryActivity>) => void;
  deleteActivity: (dayId: string, activityId: string) => void;
  reorderActivities: (dayId: string, activities: ItineraryActivity[]) => void;
  setViewMode: (mode: ItineraryViewMode) => void;
  setSelectedDay: (day: ItineraryDay | null) => void;
  checkTimeConflict: (dayId: string, startTime: string, endTime: string, excludeActivityId?: string) => boolean;
}

export const useItineraryStore = create<ItineraryState>((set, get) => ({
  days: [],
  viewMode: 'timeline',
  selectedDay: null,
  isLoading: false,

  setDays: (days) => set({ days }),

  addDay: (day) =>
    set((state) => ({
      days: [...state.days, day],
    })),

  updateDay: (id, dayData) =>
    set((state) => ({
      days: state.days.map((day) =>
        day.id === id ? { ...day, ...dayData } : day
      ),
    })),

  deleteDay: (id) =>
    set((state) => ({
      days: state.days.filter((day) => day.id !== id),
    })),

  addActivity: (dayId, activity) =>
    set((state) => ({
      days: state.days.map((day) =>
        day.id === dayId
          ? { ...day, activities: [...day.activities, activity] }
          : day
      ),
    })),

  updateActivity: (dayId, activityId, activityData) =>
    set((state) => ({
      days: state.days.map((day) =>
        day.id === dayId
          ? {
              ...day,
              activities: day.activities.map((activity) =>
                activity.id === activityId
                  ? { ...activity, ...activityData }
                  : activity
              ),
            }
          : day
      ),
    })),

  deleteActivity: (dayId, activityId) =>
    set((state) => ({
      days: state.days.map((day) =>
        day.id === dayId
          ? {
              ...day,
              activities: day.activities.filter(
                (activity) => activity.id !== activityId
              ),
            }
          : day
      ),
    })),

  reorderActivities: (dayId, activities) =>
    set((state) => ({
      days: state.days.map((day) =>
        day.id === dayId ? { ...day, activities } : day
      ),
    })),

  setViewMode: (mode) => set({ viewMode: mode }),

  setSelectedDay: (day) => set({ selectedDay: day }),

  checkTimeConflict: (dayId, startTime, endTime, excludeActivityId) => {
    const { days } = get();
    const day = days.find((d) => d.id === dayId);
    
    if (!day) return false;

    const newStart = new Date(`2000-01-01T${startTime}`);
    const newEnd = new Date(`2000-01-01T${endTime}`);

    return day.activities.some((activity) => {
      if (excludeActivityId && activity.id === excludeActivityId) {
        return false;
      }

      const actStart = new Date(`2000-01-01T${activity.startTime}`);
      const actEnd = new Date(`2000-01-01T${activity.endTime}`);

      return (
        (newStart >= actStart && newStart < actEnd) ||
        (newEnd > actStart && newEnd <= actEnd) ||
        (newStart <= actStart && newEnd >= actEnd)
      );
    });
  },
}));
