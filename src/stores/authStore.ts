
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type { AuthState, AuthActions, SupabaseUser } from '@/types/stores';

const initialState: AuthState = {
  user: null,
  isLoading: true, // Start with loading true until auth status is checked
  hasSkippedAuth: false,
  isAuthenticated: false,
};

export const useAuthStore = create<AuthState & AuthActions>()(
  persist(
    (set, get) => ({
      ...initialState,
      setUser: (user) => set({ user, isAuthenticated: !!user, isLoading: false }),
      setLoading: (loading) => set({ isLoading: loading }),
      skipAuth: () => {
        if (typeof window !== 'undefined') localStorage.setItem('olChikiHasSkippedAuth', 'true');
        set({ hasSkippedAuth: true, isLoading: false });
      },
      clearSkipAuth: () => {
        if (typeof window !== 'undefined') localStorage.removeItem('olChikiHasSkippedAuth');
        set({ hasSkippedAuth: false });
      },
      checkAuthStatus: () => {
        // This function will be called by AuthGuard, which uses the Supabase context.
        // For now, it handles the localStorage part of skipped auth.
        const skipped = typeof window !== 'undefined' && localStorage.getItem('olChikiHasSkippedAuth') === 'true';
        if (skipped && !get().user) {
          set({ hasSkippedAuth: true, isLoading: false });
        } else if (!get().user) {
           set({ isLoading: false }); // If no user and not skipped, set loading to false
        }
      },
    }),
    {
      name: 'ol-chiki-auth-storage',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ hasSkippedAuth: state.hasSkippedAuth }), // Only persist skip status for this example
    }
  )
);
