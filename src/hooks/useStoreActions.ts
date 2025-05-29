
import { useNavigationStore } from '@/stores/navigationStore';
import { useAuthStore } from '@/stores/authStore';
import { useUIStore } from '@/stores/uiStore';
import { useQuizStore } from '@/stores/quizStore';
import React from 'react';

/**
 * Custom hook to consolidate access to Zustand store actions.
 * This helps in de-cluttering components and provides a single point of access for store interactions.
 */
export const useStoreActions = () => {
  const navigationActions = useNavigationStore(state => ({
    setActiveView: state.setActiveView,
    setQuizSetNumber: state.setQuizSetNumber,
    navigateToQuiz: state.navigateToQuiz,
    goBack: state.goBack,
    resetNavigation: state.resetNavigation,
  }));

  const authActions = useAuthStore(state => ({
    setUser: state.setUser,
    setLoading: state.setLoading,
    skipAuth: state.skipAuth,
    clearSkipAuth: state.clearSkipAuth,
    checkAuthStatus: state.checkAuthStatus,
  }));

  const uiActions = useUIStore(state => ({
    setClientReady: state.setClientReady,
    setSplashSeen: state.setSplashSeen,
    setCurrentYear: state.setCurrentYear,
    setAppLoading: state.setAppLoading,
    setFeatureLoading: state.setFeatureLoading,
    clearAllLoadingStates: state.clearAllLoadingStates,
    setError: state.setError,
    clearError: state.clearError,
  }));

  const quizActions = useQuizStore(state => ({
    startQuiz: state.startQuiz,
    answerQuestion: state.answerQuestion,
    nextQuestion: state.nextQuestion,
    setQuizData: state.setQuizData,
    saveQuizResult: state.saveQuizResult,
    updateProgress: state.updateProgress,
    resetQuizState: state.resetQuizState,
    loadResultsForUser: state.loadResultsForUser,
  }));

  // Use React.useMemo to ensure the returned object reference is stable
  // if the individual action objects are stable (which they are from Zustand).
  return React.useMemo(() => ({
    ...navigationActions,
    ...authActions,
    ...uiActions,
    ...quizActions,
  }), [navigationActions, authActions, uiActions, quizActions]);
};

// Hook to select multiple state slices reactively
export const useCombinedStore = <TState, TSlice>(
  selector: (state: TState) => TSlice
) => {
  const navigationState = useNavigationStore();
  const authState = useAuthStore();
  const uiState = useUIStore();
  const quizState = useQuizStore();

  // Note: This creates a new object on every render.
  // For performance-critical scenarios with many components using this,
  // you might pass the selector directly to each store or use more granular selectors.
  // However, Zustand's default equality check (shallow) for selectors helps.
  const combinedState = {
    navigation: navigationState,
    auth: authState,
    ui: uiState,
    quiz: quizState,
  } as unknown as TState; // Cast to TState for the selector

  return selector(combinedState);
};
