import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { User } from '@/types/types';

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  updateUser: (user: Partial<User>) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,

      login: async (email: string, password: string) => {
        set({ isLoading: true });
        void password;
        try {
          // Simulate API call
          await new Promise((resolve) => setTimeout(resolve, 1000));
          
          // Mock user data
          const mockUser: User = {
            id: '1',
            name: 'Travel Explorer',
            email: email,
            avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=TravelExplorer',
            bio: 'Passionate traveler exploring the world',
            createdAt: new Date().toISOString(),
          };
          
          const mockToken = 'mock-jwt-token-' + Date.now();
          
          set({
            user: mockUser,
            token: mockToken,
            isAuthenticated: true,
            isLoading: false,
          });
        } catch (error) {
          set({ isLoading: false });
          throw error;
        }
      },

      signup: async (name: string, email: string, password: string) => {
        set({ isLoading: true });
        void password;
        try {
          // Simulate API call
          await new Promise((resolve) => setTimeout(resolve, 1000));
          
          const mockUser: User = {
            id: Date.now().toString(),
            name: name,
            email: email,
            avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${name}`,
            createdAt: new Date().toISOString(),
          };
          
          const mockToken = 'mock-jwt-token-' + Date.now();
          
          set({
            user: mockUser,
            token: mockToken,
            isAuthenticated: true,
            isLoading: false,
          });
        } catch (error) {
          set({ isLoading: false });
          throw error;
        }
      },

      logout: () => {
        set({
          user: null,
          token: null,
          isAuthenticated: false,
        });
      },

      updateUser: (userData: Partial<User>) => {
        set((state) => ({
          user: state.user ? { ...state.user, ...userData } : null,
        }));
      },
    }),
    {
      name: 'traveloop-auth',
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);
