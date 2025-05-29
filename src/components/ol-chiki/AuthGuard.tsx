
'use client';

import React from 'react';
import { useAuthGuard } from '@/hooks/useAuthGuard';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import { useUIStore } from '@/stores/uiStore';
import { AUTH_LOADING_MESSAGE } from '@/utils/constants';

interface AuthGuardProps {
  children: React.ReactNode;
}

const AuthGuard: React.FC<AuthGuardProps> = ({ children }) => {
  const splashSeenThisSession = useUIStore((state) => state.splashSeenThisSession);
  const { isAuthLoading, canRenderChildren } = useAuthGuard(splashSeenThisSession);

  if (isAuthLoading && splashSeenThisSession) {
    // Only show auth loading if splash is done, otherwise splash screen handles initial loading
    return <LoadingSpinner message={AUTH_LOADING_MESSAGE} />;
  }

  if (canRenderChildren && splashSeenThisSession) {
    return <>{children}</>;
  }

  // If splash is not seen, OlChikiApp will render SplashScreen.
  // If auth is not resolved AND splash is seen, useAuthGuard shows loader.
  // If not authenticated/skipped AND splash is seen, useAuthGuard handles redirect.
  // This return is a fallback for states handled by SplashScreen or redirection.
  return null;
};

export default AuthGuard;
