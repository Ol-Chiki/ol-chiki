
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type { NavigationState, NavigationActions, ActiveView } from '@/types/stores';

const initialState: NavigationState = {
  activeView: 'splash', // Start with splash
  currentQuizSetNumber: null,
  navigationHistory: ['splash'],
};

export const useNavigationStore = create<NavigationState & NavigationActions>()(
  persist(
    (set, get) => ({
      ...initialState,
      setActiveView: (view) => {
        if (view !== get().activeView) {
          get().pushHistory(view);
          set({ activeView: view });
        }
      },
      setQuizSetNumber: (number) => set({ currentQuizSetNumber: number }),
      navigateToQuiz: (quizNumber, targetView) => {
        get().pushHistory(targetView);
        set({ currentQuizSetNumber: quizNumber, activeView: targetView });
      },
      goBack: () => {
        const history = get().navigationHistory;
        if (history.length > 1) {
          const newHistory = [...history];
          newHistory.pop(); // Remove current view
          const previousView = newHistory[newHistory.length - 1];
          set({ activeView: previousView, navigationHistory: newHistory });
        }
      },
      pushHistory: (view) => {
        set((state) => {
          const newHistory = [...state.navigationHistory, view];
          // Limit history size if needed, e.g., to 10
          return { navigationHistory: newHistory.slice(-10) };
        });
      },
      resetNavigation: () => {
        set(initialState);
        get().pushHistory('splash'); // Ensure splash is initial after reset
      }
    }),
    {
      name: 'ol-chiki-navigation-storage',
      storage: createJSONStorage(() => sessionStorage), // or localStorage
      partialize: (state) => ({ activeView: state.activeView, currentQuizSetNumber: state.currentQuizSetNumber }), // Persist only specific parts
    }
  )
);
