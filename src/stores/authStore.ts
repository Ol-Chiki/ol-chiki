
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type { User } from '@/types/auth'; // Adjusted to use User from types/auth.ts
import type { AuthFormData, FormErrors } from '@/types/auth'; // For form state
import type { AuthState as AuthStoreStateAndActions } from '@/types/stores'; // Renaming to avoid conflict
import { AUTH_SKIP_KEY } from '@/utils/constants'; // Assuming this is defined in constants
// For Supabase integration, we'll import Supabase client and types
import { supabase } from '@/lib/supabase/client'; // Assuming this exists
import type { AuthError, Session, User as SupabaseAuthUser, SignUpWithPasswordCredentials } from '@supabase/supabase-js';
import { authConfig } from '@/config/authConfig';
import { authValidationSchema, validateForm } from '@/utils/authValidation';


const initialFormData: AuthFormData = {
  email: '',
  password: '',
  displayName: '',
  dob: '', // Date of Birth
  city: '',   // City
  state: '',  // State
  confirmPassword: '', // Only for signup
};

// Removed SupabaseUser from here as it's defined in supabase-auth-context and User from types/auth is preferred
// type User = SupabaseUser | null; // Adjusted for clarity

const initialAuthState: Omit<AuthStoreStateAndActions, keyof AuthStoreStateAndActions> = {
  user: null,
  isAuthenticated: false,
  loading: true,
  error: null,
  authMode: 'signup',
  formData: { ...initialFormData },
  formErrors: {},
  isSubmitting: false,
  isDatePickerOpen: false,
  hasSkippedAuth: false,
};


export const useAuthStore = create<AuthStoreStateAndActions>()(
  persist(
    (set, get) => ({
      ...initialAuthState,

      // Form state actions
      setAuthMode: (mode) => set({ authMode: mode, error: null, formErrors: {} }),
      updateFormField: (field, value) => {
        set((state) => ({
          formData: { ...state.formData, [field]: value },
          formErrors: { ...state.formErrors, [field]: undefined, general: undefined },
        }));
      },
      setFormError: (field, errorMsg) => {
        set((state) => ({
          formErrors: { ...state.formErrors, [field]: errorMsg },
        }));
      },
      clearErrors: () => set({ error: null, formErrors: {} }),
      validateForm: () => {
        const { formData, authMode } = get();
        const errors = validateForm(formData, authValidationSchema, authMode === 'signup');
        set({ formErrors: errors });
        return Object.keys(errors).length === 0;
      },
      setLoading: (loading) => set({ loading }),
      setIsSubmitting: (isSubmitting) => set({ isSubmitting }),
      setIsDatePickerOpen: (isOpen) => set({ isDatePickerOpen: isOpen }),

      // Authentication methods
      signInWithGoogle: async () => {
        set({ loading: true, error: null, isSubmitting: true });
        console.log("Store: Attempting Google sign-in");
        const { data, error } = await supabase.auth.signInWithOAuth({
          provider: 'google',
          options: {
            redirectTo: typeof window !== 'undefined' ? window.location.origin : undefined,
          },
        });
        if (error) {
          console.error("Store: Google sign-in error", error);
          set({ error: error.message, loading: false, isSubmitting: false, formErrors: { general: error.message } });
        } else {
          console.log("Store: Google sign-in initiated, redirecting...");
          // onAuthStateChange handles success
           set({ loading: false, isSubmitting: false }); // Stop loading for redirect
        }
      },

      signInWithEmail: async (email, password) => {
        // Validate form data from store if needed, or assume parameters are already validated
        set({ loading: true, error: null, isSubmitting: true, formErrors: {} });
        console.log("Store: Attempting email sign-in", email);
        const { data: { user: supaUser, session }, error } = await supabase.auth.signInWithPassword({ email, password });

        if (error) {
          console.error("Store: Email sign-in error", error);
          set({ error: error.message, formErrors: { general: error.message }, loading: false, isSubmitting: false });
        } else if (supaUser) {
          console.log("Store: Email sign-in successful for", supaUser.email);
          // User state will be set by onAuthStateChange in SupabaseAuthProvider
          set({ error: null, loading: false, isSubmitting: false });
        } else {
          console.error("Store: Email sign-in failed, no user returned");
          set({ error: 'Sign in failed. Please check your credentials.', formErrors: { general: 'Invalid credentials' }, loading: false, isSubmitting: false });
        }
      },

      signUpWithEmail: async (signupData) => { // signupData is AuthFormData
         if (!get().validateForm()) { // Use internal form data for validation
          set({isSubmitting: false});
          console.warn("Store: Sign-up validation failed before submit.");
          return;
        }
        set({ loading: true, error: null, isSubmitting: true, formErrors: {} });
        console.log("Store: Attempting email sign-up for", signupData.email);
        
        const credentials: SignUpWithPasswordCredentials = {
          email: signupData.email,
          password: signupData.password,
          options: {
            data: {
              display_name: signupData.displayName,
              date_of_birth: signupData.dob, // Ensure this is YYYY-MM-DD string
              city: signupData.city || null,
              state: signupData.state || null,
            }
          }
        };

        const { data: { user: supaUser, session }, error } = await supabase.auth.signUp(credentials);

        if (error) {
          console.error("Store: Email sign-up error", error);
          set({ error: error.message, formErrors: { general: error.message }, loading: false, isSubmitting: false });
        } else if (supaUser) {
          console.log("Store: Email sign-up successful for", supaUser.email);
           // User state will be set by onAuthStateChange, potentially after email confirmation
          set({ error: null, loading: false, isSubmitting: false });
        } else {
           console.error("Store: Email sign-up failed, no user returned but no error from Supabase.");
           set({ error: 'Sign up process incomplete. Please try again.', formErrors: { general: 'Sign up process incomplete.' }, loading: false, isSubmitting: false });
        }
      },

      signOut: async () => {
        set({ loading: true, error: null });
        console.log("Store: Signing out");
        const { error } = await supabase.auth.signOut();
        if (error) {
          console.error("Store: Sign out error", error);
          set({ error: error.message, loading: false });
        } else {
          console.log("Store: Sign out successful");
          set({ user: null, isAuthenticated: false, error: null, loading: false, formData: {...initialFormData}, formErrors: {}, hasSkippedAuth: false });
        }
      },
      
      // This is for internal use by the AuthProvider primarily
      _setUserAndSession: (session: Session | null) => {
        const supabaseUser = session?.user as SupabaseAuthUser | null; // Explicitly cast to SupabaseAuthUser
        if (supabaseUser) {
          const appUser: User = { // Ensure this User type is correctly imported from types/auth
            id: supabaseUser.id,
            email: supabaseUser.email,
            displayName: supabaseUser.user_metadata?.display_name || supabaseUser.email?.split('@')[0],
            dateOfBirth: supabaseUser.user_metadata?.date_of_birth,
            city: supabaseUser.user_metadata?.city,
            state: supabaseUser.user_metadata?.state,
            provider: supabaseUser.app_metadata?.provider as 'email' | 'google' || 'email', // Type cast
            createdAt: supabaseUser.created_at,
            updatedAt: supabaseUser.updated_at,
            // Include these for direct use if needed, or ensure they're mapped
            // user_metadata: supabaseUser.user_metadata, // This is part of SupabaseUser, not User type
            // app_metadata: supabaseUser.app_metadata,
          };
          set({ user: appUser, isAuthenticated: true, loading: false, error: null, hasSkippedAuth: false });
          if (typeof window !== 'undefined') localStorage.removeItem(AUTH_SKIP_KEY);
        } else {
          set({ user: null, isAuthenticated: false, loading: false, error: null });
        }
      },

      skipAuth: () => {
        console.log("Store: Skipping auth");
        if (typeof window !== 'undefined') localStorage.setItem(AUTH_SKIP_KEY, 'true');
        set({ hasSkippedAuth: true, loading: false, user: null, isAuthenticated: false });
      },

      checkAuthStatus: () => { // Primarily for initializing hasSkippedAuth
        console.log("Store: Checking auth status (skip status)");
        const skipped = typeof window !== 'undefined' && localStorage.getItem(AUTH_SKIP_KEY) === 'true';
        const currentUser = get().user;

        if (currentUser) {
          set({ isAuthenticated: true, loading: false, hasSkippedAuth: false });
        } else if (skipped) {
          set({ hasSkippedAuth: true, isAuthenticated: false, loading: false });
        } else {
          set({ isAuthenticated: false, loading: false, hasSkippedAuth: false });
        }
      },
      
      reset: () => {
        console.log("Store: Resetting auth state");
        set({ ...initialAuthState, loading:false, formData: { ...initialFormData } });
      },
    }),
    {
      name: 'ol-chiki-auth-store-v3',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ 
        user: state.user,
        isAuthenticated: state.isAuthenticated,
        authMode: state.authMode,
        hasSkippedAuth: state.hasSkippedAuth,
      }),
    }
  )
);
