
'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/stores/authStore';
import { useUIStore } from '@/stores/uiStore'; // For global loading messages
// import { useNavigationStore } from '@/stores/navigationStore'; // Might not be needed here directly
import { AUTH_LOADING_MESSAGE } from '@/utils/constants';

/**
 * Hook to manage authentication state and perform redirects.
 * To be used by AuthGuard components.
 */
export function useAuthGuard(isSplashSeen?: boolean) { // isSplashSeen is more for the main app guard
  const router = useRouter();
  const { user, isLoading: isAuthLoading, hasSkippedAuth, checkAuthStatus } = useAuthStore();
  const { setAppLoadingMessage } = useUIStore();
  // const { setActiveView } = useNavigationStore();

  useEffect(() => {
    checkAuthStatus(); 
  }, [checkAuthStatus]);

  useEffect(() => {
    // This hook, when used by ProfileAuthGuard, doesn't need splash screen logic.
    // The ProfileAuthGuard will render a login prompt if not authenticated.
    // The main app guard handles initial redirects to /auth.

    if (isAuthLoading) {
      // Profile-specific loading state might be handled by ProfileLoadingStateManager
      // or a local spinner within the component using this hook.
      // setAppLoadingMessage(AUTH_LOADING_MESSAGE); 
    } else {
      // setAppLoadingMessage(null);
    }

  }, [isAuthLoading, setAppLoadingMessage]);

  // For ProfileAuthGuard, canRenderChildren means the user is authenticated.
  // hasSkippedAuth is not relevant for viewing the profile content itself.
  const canRenderProfileContent = !!user;

  return {
    isAuthenticated: !!user,
    isAuthLoading,
    canRenderChildren: canRenderProfileContent, 
  };
}
