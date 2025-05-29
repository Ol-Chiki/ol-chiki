
// app/auth/page.tsx - New Simplified Entry Point
'use client';

import React, { useEffect } from 'react';
import { AuthContainer } from '@/components/auth/AuthContainer';
import { useAuthStore } from '@/stores/authStore';
import { useRouter } from 'next/navigation';
import { authConfig } from '@/config/authConfig';
import { Loader2 } from 'lucide-react';

export default function AuthPageEntry() {
  const { isAuthenticated, loading: authLoading, checkAuthStatus } = useAuthStore(state => ({
      isAuthenticated: state.isAuthenticated,
      loading: state.loading,
      checkAuthStatus: state.checkAuthStatus
  }));
  const router = useRouter();

  useEffect(() => {
    // This effect ensures that if the user is already authenticated
    // (e.g., due to a persisted session), they are redirected away from /auth.
    // Also calls checkAuthStatus on mount to correctly initialize hasSkippedAuth
    // and potentially load user from persisted session via onAuthStateChange in SupabaseAuthProvider.
    checkAuthStatus(); 
    if (isAuthenticated) {
      router.replace(authConfig.redirectUrls.success);
    }
  }, [isAuthenticated, router, checkAuthStatus]);

  // This loading state is primarily for the initial check.
  // AuthContainer has its own internal loading for form submissions.
  if (authLoading && !isAuthenticated) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-background p-4">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
        <p className="mt-4 text-muted-foreground">Initializing...</p>
      </div>
    );
  }
  
  // If authenticated after loading, the useEffect above will redirect.
  // If not authenticated, render AuthContainer.
  return <AuthContainer />;
}
