
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type { AuthState, AuthActions, SupabaseUser } from '@/types/stores';
import { AUTH_SKIP_KEY } from '@/utils/constants';

const initialState: AuthState = {
  user: null,
  isLoading: true,
  hasSkippedAuth: false,
  isAuthenticated: false,
};

export const useAuthStore = create<AuthStore>()(
  persist(
    (set, get) => ({
      ...initialState,
      setUser: (user) => {
        set({ user, isAuthenticated: !!user, isLoading: false });
        if (user) { // If user logs in, clear skipped auth status
          if (typeof window !== 'undefined') localStorage.removeItem(AUTH_SKIP_KEY);
          set({ hasSkippedAuth: false });
        }
      },
      setLoading: (loading) => set({ isLoading: loading }),
      skipAuth: () => {
        if (typeof window !== 'undefined') localStorage.setItem(AUTH_SKIP_KEY, 'true');
        set({ hasSkippedAuth: true, isLoading: false, user: null, isAuthenticated: false });
      },
      clearSkipAuth: () => { // Called when user logs in after having skipped
        if (typeof window !== 'undefined') localStorage.removeItem(AUTH_SKIP_KEY);
        set({ hasSkippedAuth: false });
      },
      checkAuthStatus: () => { // To be called on app initialization
        const skipped = typeof window !== 'undefined' && localStorage.getItem(AUTH_SKIP_KEY) === 'true';
        if (skipped && !get().user) { // if skipped and no user is logged in from a previous session
          set({ hasSkippedAuth: true, isLoading: false, isAuthenticated: false });
        } else if (get().user) { // If user was persisted
           set({ isAuthenticated: true, isLoading: false, hasSkippedAuth: false });
        }
        else {
          set({ isLoading: false }); // If no user and not skipped
        }
      },
    }),
    {
      name: 'ol-chiki-auth-storage-v2',
      storage: createJSONStorage(() => localStorage),
      // Persist user for session restoration, isLoading is runtime, isAuthenticated derived
      partialize: (state) => ({ user: state.user, hasSkippedAuth: state.hasSkippedAuth }),
    }
  )
);
