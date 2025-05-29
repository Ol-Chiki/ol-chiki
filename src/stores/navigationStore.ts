
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type { NavigationState, NavigationActions, ActiveView } from '@/types/stores';
import { MAX_HISTORY_LENGTH } from '@/utils/constants';

const initialState: NavigationState = {
  activeView: 'splash', // Start with splash
  currentQuizSetNumber: null,
  navigationHistory: ['splash'],
};

export const useNavigationStore = create<NavigationStore>()(
  persist(
    (set, get) => ({
      ...initialState,
      setActiveView: (view) => {
        if (view !== get().activeView) {
          const currentHistory = get().navigationHistory;
          let newHistory = [...currentHistory, view];
          if (newHistory.length > MAX_HISTORY_LENGTH) {
            newHistory = newHistory.slice(-MAX_HISTORY_LENGTH);
          }
          set({ activeView: view, navigationHistory: newHistory });
        }
      },
      setQuizSetNumber: (number) => set({ currentQuizSetNumber: number }),
      navigateToQuiz: (quizNumber, targetView) => {
        get().setActiveView(targetView); // This will handle history
        set({ currentQuizSetNumber: quizNumber });
      },
      goBack: () => {
        const history = get().navigationHistory;
        if (history.length > 1) {
          const newHistory = [...history];
          newHistory.pop(); // Remove current view
          const previousView = newHistory[newHistory.length - 1];
          set({ activeView: previousView, navigationHistory: newHistory });
        } else if (history.length === 1 && history[0] !== 'basic-hub') {
          // If only one item in history and it's not the main hub, go to main hub
          set({ activeView: 'basic-hub', navigationHistory: ['basic-hub'] });
        }
      },
      pushHistory: (view) => { // Exposed if direct manipulation is needed, but setActiveView handles it
        set((state) => {
          const currentHistory = state.navigationHistory;
          let newHistory = [...currentHistory, view];
          if (newHistory.length > MAX_HISTORY_LENGTH) {
            newHistory = newHistory.slice(-MAX_HISTORY_LENGTH);
          }
          return { navigationHistory: newHistory };
        });
      },
      resetNavigation: () => {
         set({ activeView: 'basic-hub', navigationHistory: ['basic-hub'], currentQuizSetNumber: null });
      }
    }),
    {
      name: 'ol-chiki-navigation-storage-v2', // New key to avoid conflicts with old structure
      storage: createJSONStorage(() => sessionStorage),
      partialize: (state) => ({
        activeView: state.activeView,
        currentQuizSetNumber: state.currentQuizSetNumber,
        navigationHistory: state.navigationHistory,
      }),
    }
  )
);
