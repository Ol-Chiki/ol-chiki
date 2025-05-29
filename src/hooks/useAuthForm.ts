
// hooks/useAuthForm.ts
import type React from 'react';
import { useCallback } from 'react';
import { useAuthStore } from '@/stores/authStore';
import type { AuthFormData, FormErrors } from '@/types/auth';
import { authValidationSchema, validateField as validateSingleField, validateForm as validateFullForm } from '@/utils/authValidation';

interface UseAuthFormReturn {
  formData: AuthFormData;
  formErrors: FormErrors;
  authMode: 'signin' | 'signup';
  updateField: (field: keyof AuthFormData, value: string) => void;
  validateField: (field: keyof AuthFormData) => boolean; // Returns true if valid
  validateForm: () => boolean; // Returns true if form is valid
  handleSubmit: (onSubmitSuccess: (data: AuthFormData) => Promise<void>) => (e?: React.FormEvent) => Promise<void>;
  setFormError: (field: keyof FormErrors, error: string) => void;
  clearErrors: () => void;
}

export const useAuthForm = (): UseAuthFormReturn => {
  const {
    formData,
    formErrors,
    authMode,
    updateFormField,
    setFormError: setStoreFormError,
    clearErrors: clearStoreErrors,
    setIsSubmitting,
  } = useAuthStore(state => ({
    formData: state.formData,
    formErrors: state.formErrors,
    authMode: state.authMode,
    updateFormField: state.updateFormField,
    setFormError: state.setFormError,
    clearErrors: state.clearErrors,
    setIsSubmitting: state.setIsSubmitting,
  }));

  const updateField = useCallback((field: keyof AuthFormData, value: string) => {
    updateFormField(field, value);
  }, [updateFormField]);

  const validateField = useCallback((field: keyof AuthFormData): boolean => {
    const value = formData[field] || '';
    const error = validateSingleField(field, value, authValidationSchema, formData);
    setStoreFormError(field, error || ''); // Update store with error or clear it
    return !error;
  }, [formData, setStoreFormError]);

  const validateForm = useCallback((): boolean => {
    const errors = validateFullForm(formData, authValidationSchema, authMode === 'signup');
    // Update store with all errors
    for (const key in authValidationSchema) {
        const fieldKey = key as keyof FormErrors;
        setStoreFormError(fieldKey, errors[fieldKey] || '');
    }
    if (errors.general) {
        setStoreFormError('general', errors.general);
    }
    return Object.keys(errors).length === 0;
  }, [formData, authMode, setStoreFormError]);

  const handleSubmit = useCallback(
    (onSubmitSuccess: (data: AuthFormData) => Promise<void>) => async (e?: React.FormEvent) => {
      if (e) e.preventDefault();
      setIsSubmitting(true);
      if (validateForm()) {
        try {
          await onSubmitSuccess(formData);
          // Success is handled by the onSubmitSuccess callback (e.g., toast, redirect)
        } catch (apiError: any) {
          setStoreFormError('general', apiError.message || 'An unexpected error occurred during submission.');
        } finally {
          // setIsSubmitting(false); // Should be set by the calling auth method in useAuthentication
        }
      } else {
        setIsSubmitting(false); // Form validation failed
      }
    },
    [validateForm, formData, onSubmitSuccess, setIsSubmitting, setStoreFormError]
  );

  return {
    formData,
    formErrors,
    authMode,
    updateField,
    validateField,
    validateForm,
    handleSubmit,
    setFormError: setStoreFormError, // Expose this if direct error setting is needed
    clearErrors: clearStoreErrors,
  };
};
