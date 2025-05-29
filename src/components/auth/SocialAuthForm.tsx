
// components/auth/SocialAuthForm.tsx
import React from 'react';
import { Button } from '@/components/ui/form/Button';
import { useAuthStore } from '@/stores/authStore';
import { useAuthentication } from '@/hooks/useAuthentication';
import { Loader2 } from 'lucide-react';

// Reusable GoogleIcon from the old AuthPage
const GoogleIcon = () => (
  <svg className="mr-2 h-4 w-4" aria-hidden="true" focusable="false" data-prefix="fab" data-icon="google" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 488 512">
    <path fill="currentColor" d="M488 261.8C488 403.3 391.1 504 248 504 110.8 504 0 393.2 0 256S110.8 8 248 8c66.8 0 123 24.5 166.3 64.9l-67.5 64.9C258.5 52.6 94.3 116.6 94.3 256c0 86.5 69.1 156.6 153.7 156.6 98.2 0 135-70.4 140.8-106.9H248v-85.3h236.1c2.3 12.7 3.9 24.9 3.9 41.4z"></path>
  </svg>
);


export const SocialAuthForm: React.FC = () => {
  const { isSubmitting } = useAuthStore(state => ({ isSubmitting: state.isSubmitting }));
  const { signInWithGoogle } = useAuthentication();

  return (
    <div className="space-y-4">
      <Button 
        onClick={signInWithGoogle} 
        className="w-full" 
        variant="outline" 
        isLoading={isSubmitting} // Consider a more granular loading state if needed
        disabled={isSubmitting}
      >
        {isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <GoogleIcon />}
        Sign in with Google
      </Button>
      {/* Add other social providers here if needed, e.g., Facebook, GitHub */}
      <p className="text-xs text-muted-foreground text-center">
        Google Sign-In will use your Google name. Full profile details (DOB, location) can be completed on the profile page.
      </p>
    </div>
  );
};
