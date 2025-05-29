
// hooks/useAuthentication.ts
import { useCallback } from 'react';
import { useAuthStore } from '@/stores/authStore';
import { authService, type AppAuthService } from '@/services/authService'; // Assuming AppAuthService type is exported
import type { AuthFormData, SignUpData } from '@/types/auth';
import { useRouter } from 'next/navigation'; // For redirects
import { useToast } from '@/hooks/use-toast'; // For notifications
import { authConfig } from '@/config/authConfig';

export const useAuthentication = () => {
  const { 
    setLoading, 
    setError: setStoreError, // Generic error for the store
    setFormError, // Specific form field errors
    _setUserAndSession, // Internal store action to set user from Supabase session
    setIsSubmitting,
    clearErrors,
    formData, // get formData for signup
    validateForm,
  } = useAuthStore();
  
  const router = useRouter();
  const { toast } = useToast();

  const handleAuthResponse = useCallback((user: any, error: any, successMessage: string, mode?: 'signin' | 'signup') => {
    if (error) {
      const errorMessage = error.message || 'An unknown authentication error occurred.';
      setStoreError(errorMessage);
      setFormError('general', errorMessage); // Show error on form
      toast({ title: 'Authentication Failed', description: errorMessage, variant: 'destructive' });
      return false;
    }
    if (user) {
      // User is set by onAuthStateChange listener which calls _setUserAndSession
      toast({ title: 'Success!', description: successMessage });
      // clearErrors(); // Clear form errors on success
      // router.push(authConfig.redirectUrls.success); // Redirect on success
      return true;
    }
    return false;
  }, [setStoreError, setFormError, toast, clearErrors, router]);

  const signInWithGoogle = useCallback(async () => {
    setIsSubmitting(true);
    setLoading(true);
    clearErrors();
    const { error } = await authService.signInWithGoogle();
    setIsSubmitting(false);
    setLoading(false);
    if (error) {
       handleAuthResponse(null, error, ''); // Error toast will be shown
    }
    // Successful initiation will redirect; user object set by onAuthStateChange
  }, [setIsSubmitting, setLoading, clearErrors, handleAuthResponse]);

  const signInWithEmail = useCallback(async (email: string, pass: string) => {
    setIsSubmitting(true);
    setLoading(true);
    clearErrors();
    const { user, error } = await authService.signInWithEmail({ email, password: pass });
    setIsSubmitting(false);
    setLoading(false);
    return handleAuthResponse(user, error, 'Signed in successfully!');
  }, [setIsSubmitting, setLoading, clearErrors, handleAuthResponse]);

  const signUpWithEmail = useCallback(async (signupData: AuthFormData) => {
    setIsSubmitting(true);
    setLoading(true);
    clearErrors();
    const { email, password, displayName, dob, city, state } = signupData;

    const credentials = {
      email,
      password,
      options: {
        data: {
          display_name: displayName,
          date_of_birth: dob,
          city: city || undefined,
          state: state || undefined,
        }
      }
    };
    
    const { user, error } = await authService.signUpWithEmail(credentials);
    setIsSubmitting(false);
    setLoading(false);
    if (error) {
      return handleAuthResponse(null, error, '');
    }
    // Supabase sends a confirmation email by default. User will be in response but session might be null.
    // onAuthStateChange will reflect user state after confirmation or if auto-confirm is on.
    toast({ title: 'Signup Successful!', description: 'Please check your email to verify your account.' });
    // Potentially redirect to a "check your email page" or login page
    return true;
  }, [setIsSubmitting, setLoading, clearErrors, toast, handleAuthResponse]);

  const signOut = useCallback(async () => {
    setLoading(true);
    const { error } = await authService.signOut();
    setLoading(false); // Handled by onAuthStateChange setting user to null
    if (error) {
      toast({ title: 'Sign Out Error', description: error.message, variant: 'destructive' });
    } else {
      toast({ title: 'Signed Out', description: 'You have been signed out successfully.' });
      router.push(authConfig.redirectUrls.signOut);
    }
  }, [setLoading, toast, router]);

  return {
    signInWithGoogle,
    signInWithEmail,
    signUpWithEmail,
    signOut,
  };
};
