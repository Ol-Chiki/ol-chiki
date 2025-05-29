
'use client';

import React from 'react';
import { useUIStore } from '@/stores/uiStore';
import LoadingSpinner from '@/components/ui/LoadingSpinner';

/**
 * LoadingStateManager component to display global loading states.
 * It can be enhanced to show different types of loaders or messages.
 */
const LoadingStateManager: React.FC = () => {
  const appLoadingMessage = useUIStore((state) => state.appLoadingMessage);
  // const featureLoadingStates = useUIStore((state) => state.featureLoadingStates);

  // Example: Check if any feature is loading
  // const isAnyFeatureLoading = Object.values(featureLoadingStates).some(loading => loading);

  if (appLoadingMessage) {
    return (
      <div className="fixed inset-0 z-[100] flex items-center justify-center bg-background/80 backdrop-blur-sm">
        <LoadingSpinner message={appLoadingMessage} size="lg" />
      </div>
    );
  }

  // Placeholder for more granular feature loading indicators if needed
  // if (isAnyFeatureLoading) {
  //   return <div>Specific feature loading...</div>;
  // }

  return null; // No global loading state active
};

export default LoadingStateManager;
