
// components/auth/AuthContainer.tsx
import React, { useEffect } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button as FormButton } from '@/components/ui/form/Button'; // Use the new form button
import { AuthForm } from './AuthForm';
import { useAuthStore } from '@/stores/authStore';
import { useRouter } from 'next/navigation';
import { useAuthentication } from '@/hooks/useAuthentication'; // For skipAuth
import { SkipForward, Loader2 } from 'lucide-react';
import { authConfig } from '@/config/authConfig';

interface AuthContainerProps {
  // onAuthSuccess could be handled by store listener or router effect
  // redirectPath is now handled by authConfig
}

export const AuthContainer: React.FC<AuthContainerProps> = () => {
  const { 
    authMode, 
    isAuthenticated, 
    loading: authStoreLoading, // General auth loading
    isSubmitting, // Form submission loading
    skipAuth: skipAuthAction, // Action from store
    error: authError
  } = useAuthStore();
  
  const router = useRouter();
  // const { skipAuth: performSkipAuth } = useAuthentication(); // Old skipAuth, now directly from store

  useEffect(() => {
    if (isAuthenticated) {
      router.push(authConfig.redirectUrls.success);
    }
  }, [isAuthenticated, router]);

  if (authStoreLoading && !isAuthenticated) { // Only show main loader if not yet authenticated and initial check is running
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-background p-4">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
        <p className="mt-4 text-muted-foreground">Loading authentication status...</p>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-primary/10 via-background to-secondary/10 p-4">
      <Card className="w-full max-w-md shadow-2xl">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl font-bold tracking-tight text-primary">
            {authMode === 'signup' ? 'Create Your Account' : 'Welcome Back!'}
          </CardTitle>
          <CardDescription>
            {authMode === 'signup'
              ? 'Join us to start your Ol Chiki learning journey. Display Name and Date of Birth are required.'
              : 'Sign in to continue your progress.'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <AuthForm />
        </CardContent>
        <CardFooter className="flex flex-col items-center pt-6">
          <FormButton 
            onClick={skipAuthAction} 
            variant="ghost" 
            className="text-muted-foreground hover:text-primary" 
            disabled={isSubmitting}
          >
            <SkipForward className="mr-2 h-4 w-4" />
            Skip for now
          </FormButton>
        </CardFooter>
      </Card>
    </div>
  );
};
