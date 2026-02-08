import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { authService } from '../lib/authService';

interface User {
  id: string;
  email: string;
  username: string;
  age?: number;
  height_cm?: number;
  current_weight_kg?: number;
  gender?: 'male' | 'female' | 'other';
}

interface AuthStore {
  user: User | null;
  session: any | null;
  isLoading: boolean;
  isInitialized: boolean;
  error: string | null;
  
  // Auth methods
  login: (email: string, password: string) => Promise<boolean>;
  signup: (data: any) => Promise<boolean>;
  logout: () => Promise<void>;
  checkAuth: () => Promise<void>;
  updateUserProfile: (updates: Partial<User>) => Promise<boolean>;
  
  // Utils
  clearError: () => void;
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set, get) => ({
      user: null,
      session: null,
      isLoading: false,
      isInitialized: false,
      error: null,

      login: async (email: string, password: string) => {
        set({ isLoading: true, error: null });
        try {
          const result = await authService.login({ email, password });
          if (result.success && result.user) {
            const profile = await authService.getUserProfile(result.user.id);
            set({
              user: profile,
              session: result.session,
              isLoading: false,
            });
            return true;
          } else {
            set({ error: result.error || 'Login failed', isLoading: false });
            return false;
          }
        } catch (error: any) {
          set({ error: error.message, isLoading: false });
          return false;
        }
      },

      signup: async (data: any) => {
        set({ isLoading: true, error: null });
        try {
          const result = await authService.signup(data);
          if (result.success) {
            set({ isLoading: false });
            return true;
          } else {
            set({ error: result.error || 'Signup failed', isLoading: false });
            return false;
          }
        } catch (error: any) {
          set({ error: error.message, isLoading: false });
          return false;
        }
      },

      logout: async () => {
        set({ isLoading: true });
        try {
          await authService.logout();
          set({ user: null, session: null, isLoading: false });
        } catch (error: any) {
          set({ error: error.message, isLoading: false });
          throw error;
        }
      },

      checkAuth: async () => {
        set({ isLoading: true });
        try {
          const user = await authService.getCurrentUser();
          if (user) {
            const profile = await authService.getUserProfile(user.id);
            set({ user: profile, isLoading: false, isInitialized: true });
          } else {
            set({ user: null, session: null, isLoading: false, isInitialized: true });
          }
        } catch (error: any) {
          set({ user: null, session: null, isLoading: false, isInitialized: true });
        }
      },

      updateUserProfile: async (updates: Partial<User>) => {
        const user = get().user;
        if (!user) return false;

        set({ isLoading: true, error: null });
        try {
          const result = await authService.updateUserProfile(user.id, updates);
          if (result.success) {
            set({ user: result.data, isLoading: false });
            return true;
          } else {
            set({ error: result.error, isLoading: false });
            return false;
          }
        } catch (error: any) {
          set({ error: error.message, isLoading: false });
          return false;
        }
      },

      clearError: () => set({ error: null }),
    }),
    {
      name: 'auth-store',
      partialize: (state) => ({
        user: state.user,
        session: state.session,
      }),
    }
  )
);
