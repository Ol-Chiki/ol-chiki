
// components/auth/EmailAuthForm.tsx
import React from 'react';
import { FormField } from './form-fields/FormField';
import { DatePickerField } from './form-fields/DatePickerField';
import { LocationFields } from './form-fields/LocationFields';
import { Button } from '@/components/ui/form/Button';
import { FormError } from '@/components/ui/form/FormError';
import { useAuthStore } from '@/stores/authStore';
import { useAuthForm } from '@/hooks/useAuthForm';
import { useAuthentication } from '@/hooks/useAuthentication'; // For actual submission
import { Loader2, UserPlus, LogIn } from 'lucide-react';

export const EmailAuthForm: React.FC = () => {
  const { authMode, isSubmitting, error: globalAuthError } = useAuthStore(state => ({
    authMode: state.authMode,
    isSubmitting: state.isSubmitting,
    error: state.error, // General errors from auth operations
  }));

  const { formData, formErrors, updateField, validateField, handleSubmit } = useAuthForm();
  const { signInWithEmail, signUpWithEmail } = useAuthentication(); // Get auth methods

  const onSubmit = async (data: typeof formData) => {
    if (authMode === 'signup') {
      await signUpWithEmail(data); // Pass the full formData
    } else {
      await signInWithEmail(data.email, data.password);
    }
  };
  
  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <FormField
        id="email"
        label="Email"
        type="email"
        placeholder="you@example.com"
        value={formData.email}
        onChange={(val) => updateField('email', val)}
        onBlur={() => validateField('email')}
        error={formErrors.email}
        isRequired
        disabled={isSubmitting}
      />

      {authMode === 'signup' && (
        <>
          <FormField
            id="displayName"
            label="Display Name"
            placeholder="Your Unique Name"
            value={formData.displayName}
            onChange={(val) => updateField('displayName', val)}
            onBlur={() => validateField('displayName')}
            error={formErrors.displayName}
            isRequired
            disabled={isSubmitting}
          />
          <p className="text-xs text-muted-foreground -mt-2">This will be your public name. Choose wisely!</p>
          
          <FormField
            id="dob"
            label="Date of Birth"
            value={formData.dob} // Should be YYYY-MM-DD
            onChange={(val) => updateField('dob', val)} // val is YYYY-MM-DD from DatePickerField
            onBlur={() => validateField('dob')}
            error={formErrors.dob}
            isRequired
            disabled={isSubmitting}
          >
            <DatePickerField
                id="dob-datepicker" // Ensure different ID if FormField passes its own
                value={formData.dob}
                onChange={(val) => updateField('dob', val)}
                onBlur={() => validateField('dob')} // Can trigger validation
                error={formErrors.dob}
            />
          </FormField>
          <p className="text-xs text-muted-foreground -mt-2">Required for account features.</p>

          <LocationFields
            formData={formData}
            formErrors={formErrors}
            updateField={updateField}
            validateField={validateField}
            disabled={isSubmitting}
          />
          <p className="text-xs text-muted-foreground -mt-2">Location helps us tailor content (future).</p>
        </>
      )}

      <FormField
        id="password"
        label="Password"
        type="password"
        placeholder="••••••••"
        value={formData.password}
        onChange={(val) => updateField('password', val)}
        onBlur={() => validateField('password')}
        error={formErrors.password}
        isRequired
        disabled={isSubmitting}
      />

      {authMode === 'signup' && (
        <FormField
          id="confirmPassword"
          label="Confirm Password"
          type="password"
          placeholder="••••••••"
          value={formData.confirmPassword || ''}
          onChange={(val) => updateField('confirmPassword', val)}
          onBlur={() => validateField('confirmPassword')}
          error={formErrors.confirmPassword}
          isRequired
          disabled={isSubmitting}
        />
      )}
      
      {formErrors.general && <FormError message={formErrors.general} />}
      {globalAuthError && !formErrors.general && <FormError message={globalAuthError} />}


      <Button type="submit" className="w-full" isLoading={isSubmitting} disabled={isSubmitting}>
        {isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : 
         (authMode === 'signup' ? <UserPlus className="mr-2 h-4 w-4" /> : <LogIn className="mr-2 h-4 w-4" />)
        }
        {authMode === 'signup' ? 'Sign Up' : 'Sign In'}
      </Button>
    </form>
  );
};
