
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type { UIState, UIActions } from '@/types/stores';
import { SPLASH_SEEN_KEY } from '@/utils/constants';

const initialState: UIState = {
  isClient: false,
  splashSeenThisSession: false,
  currentYear: new Date().getFullYear().toString(),
  appLoadingMessage: null,
  featureLoadingStates: {},
  globalError: null,
};

export const useUIStore = create<UIState & UIActions>()(
  persist(
    (set) => ({
      ...initialState,
      setClientReady: () => set({ isClient: true }),
      setSplashSeen: () => {
        if (typeof window !== 'undefined') sessionStorage.setItem(SPLASH_SEEN_KEY, 'true');
        set({ splashSeenThisSession: true });
      },
      checkSplashStatus: () => { // New action to check on init
        if (typeof window !== 'undefined' && sessionStorage.getItem(SPLASH_SEEN_KEY) === 'true') {
          set({ splashSeenThisSession: true });
        }
      },
      setCurrentYear: (year) => set({ currentYear: year }),
      setAppLoadingMessage: (message) => set({ appLoadingMessage: message }),
      setFeatureLoading: (key, loading) =>
        set((state) => ({
          featureLoadingStates: { ...state.featureLoadingStates, [key]: loading },
        })),
      clearAllFeatureLoading: () => set({ featureLoadingStates: {} }),
      setGlobalError: (error) => set({ globalError: error, appLoadingMessage: null }),
      clearGlobalError: () => set({ globalError: null }),
    }),
    {
      name: 'ol-chiki-ui-storage-v2',
      storage: createJSONStorage(() => sessionStorage), // For session-specific UI state
      partialize: (state) => ({ splashSeenThisSession: state.splashSeenThisSession, currentYear: state.currentYear }),
    }
  )
);
