
'use client';

import type { ActiveView } from '@/app/page';
import { useReducer, useCallback, useMemo } from 'react';

interface NavigationState {
  activeView: ActiveView;
  currentQuizSetNumber: number | null;
  // Could add a history stack here for more complex back navigation
}

type NavigationAction =
  | { type: 'NAVIGATE_TO'; payload: { view: ActiveView; quizSetNumber?: number | null } }
  | { type: 'SET_ACTIVE_VIEW'; payload: ActiveView }
  | { type: 'SET_QUIZ_SET_NUMBER'; payload: number | null };

const initialState: NavigationState = {
  activeView: 'basic-hub', // Default view
  currentQuizSetNumber: null,
};

function navigationReducer(state: NavigationState, action: NavigationAction): NavigationState {
  switch (action.type) {
    case 'NAVIGATE_TO':
      return {
        ...state,
        activeView: action.payload.view,
        currentQuizSetNumber: action.payload.quizSetNumber !== undefined ? action.payload.quizSetNumber : state.currentQuizSetNumber,
      };
    case 'SET_ACTIVE_VIEW':
      return {
        ...state,
        activeView: action.payload,
      };
    case 'SET_QUIZ_SET_NUMBER':
      return {
        ...state,
        currentQuizSetNumber: action.payload,
      };
    default:
      return state;
  }
}

export function useAppNavigation() {
  const [state, dispatch] = useReducer(navigationReducer, initialState);

  const navigateTo = useCallback((view: ActiveView, quizSetNumber?: number | null) => {
    dispatch({ type: 'NAVIGATE_TO', payload: { view, quizSetNumber } });
  }, []);

  const setActiveView = useCallback((view: ActiveView) => {
    dispatch({ type: 'SET_ACTIVE_VIEW', payload: view });
  }, []);
  
  const setCurrentQuizSetNumber = useCallback((quizSetNumber: number | null) => {
    dispatch({ type: 'SET_QUIZ_SET_NUMBER', payload: quizSetNumber });
  }, []);

  const navigationFunctions = useMemo(() => ({
    navigateTo,
    setActiveView,
    setCurrentQuizSetNumber,
  }), [navigateTo, setActiveView, setCurrentQuizSetNumber]);

  return {
    activeView: state.activeView,
    currentQuizSetNumber: state.currentQuizSetNumber,
    ...navigationFunctions,
  };
}
