
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type { UIState, UIActions } from '@/types/stores';

const initialState: UIState = {
  isClient: false,
  splashSeenThisSession: false,
  currentYear: new Date().getFullYear().toString(), // Initialize directly, can be updated client-side
  appLoadingMessage: null,
  loadingStates: {},
  error: null,
};

export const useUIStore = create<UIState & UIActions>()(
  persist(
    (set, get) => ({
      ...initialState,
      setClientReady: () => set({ isClient: true }),
      setSplashSeen: () => {
        if (typeof window !== 'undefined') sessionStorage.setItem('olChikiSplashSeen', 'true');
        set({ splashSeenThisSession: true });
      },
      setCurrentYear: (year) => set({ currentYear: year }),
      setAppLoading: (message) => set({ appLoadingMessage: message }),
      setFeatureLoading: (key, loading) =>
        set((state) => ({
          loadingStates: { ...state.loadingStates, [key]: loading },
        })),
      clearAllLoadingStates: () => set({ loadingStates: {} }),
      setError: (error) => set({ error, appLoadingMessage: null }), // Clear loading when error occurs
      clearError: () => set({ error: null }),
    }),
    {
      name: 'ol-chiki-ui-storage',
      storage: createJSONStorage(() => sessionStorage), // For session-specific UI state
      partialize: (state) => ({ splashSeenThisSession: state.splashSeenThisSession }),
    }
  )
);
