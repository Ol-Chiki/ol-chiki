
import React from 'react';
import { useNavigationStore } from '@/stores/navigationStore';
import { useAuthStore } from '@/stores/authStore';
import { useUIStore } from '@/stores/uiStore';
import { useQuizStore } from '@/stores/quizStore';
import type { AllStores } from '@/types/stores';

/**
 * Custom hook to consolidate access to Zustand store actions.
 */
export const useStoreActions = (): AllStores => {
  // Navigation Store
  const navigationStore = useNavigationStore();

  // Auth Store
  const authStore = useAuthStore();

  // UI Store
  const uiStore = useUIStore();
  const { checkSplashStatus: _checkSplashStatus, ...restUiActions } = uiStore; // Exclude checkSplashStatus

  // Quiz Store
  const quizStore = useQuizStore();


  return React.useMemo(() => ({
    navigationStore,
    authStore,
    uiStore,
    quizStore,
  }), [navigationStore, authStore, uiStore, quizStore]);
};

// Selector hook for convenience if needed, but direct use of stores is also fine.
export const useSelectFromStores = <T>(selector: (stores: AllStores) => T): T => {
  const stores = useStoreActions(); // This gets all state slices and actions
  return selector(stores);
};
