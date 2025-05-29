
// components/auth/AuthForm.tsx
import React from 'react';
import { AuthTabs } from './AuthTabs';
import { Button as FormButton } from '@/components/ui/form/Button'; // Use the new form Button
import { useAuthStore } from '@/stores/authStore';

export const AuthForm: React.FC = () => {
  const { authMode, setAuthMode, isSubmitting } = useAuthStore(state => ({
      authMode: state.authMode,
      setAuthMode: state.setAuthMode,
      isSubmitting: state.isSubmitting
  }));

  return (
    <div>
      <AuthTabs />
      <FormButton
        variant="link"
        type="button"
        onClick={() => setAuthMode(authMode === 'signup' ? 'signin' : 'signup')}
        className="w-full text-sm mt-4"
        disabled={isSubmitting}
      >
        {authMode === 'signup' ? 'Already have an account? Sign In' : "Don't have an account? Sign Up"}
      </FormButton>
    </div>
  );
};
