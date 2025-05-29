
'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/stores/authStore';
import { useUIStore } from '@/stores/uiStore';
import { useNavigationStore } from '@/stores/navigationStore';
import { AUTH_LOADING_MESSAGE } from '@/utils/constants';

/**
 * Hook to manage authentication state and perform redirects.
 * To be used by the AuthGuard component.
 */
export function useAuthGuard(isSplashSeen: boolean) {
  const router = useRouter();
  const { user, isLoading: isAuthLoading, hasSkippedAuth, checkAuthStatus } = useAuthStore();
  const { setActiveView } = useNavigationStore();
  const { setAppLoadingMessage } = useUIStore();

  useEffect(() => {
    checkAuthStatus(); // Check localStorage for skip status on mount
  }, [checkAuthStatus]);

  useEffect(() => {
    if (!isSplashSeen) {
      setAppLoadingMessage(null); // No auth check/redirect until splash is done
      return;
    }

    if (isAuthLoading) {
      setAppLoadingMessage(AUTH_LOADING_MESSAGE);
      return;
    }

    setAppLoadingMessage(null); // Clear loading message once auth state is resolved

    if (!user && !hasSkippedAuth) {
      // User is not logged in and hasn't skipped auth.
      // Instead of router.push, set activeView to 'auth' if /auth is handled by ContentRenderer
      // Or, if /auth is a separate Next.js page, router.push is correct.
      // For this refactor, assuming /auth is a separate page:
      router.push('/auth');
    } else if (user || hasSkippedAuth) {
      // User is logged in or has skipped. Ensure they are on a valid app view.
      // This logic can be enhanced. For example, if the current view is 'auth' but they are logged in,
      // redirect to 'basic-hub'. For now, OlChikiApp will handle initial view.
    }

  }, [user, isAuthLoading, hasSkippedAuth, isSplashSeen, router, setAppLoadingMessage, setActiveView]);

  const canRenderChildren = user || hasSkippedAuth;

  return {
    isAuthenticated: !!user,
    isAuthLoading, // Expose this for the AuthGuard component
    canRenderChildren, // True if user is logged in OR has skipped auth
  };
}
