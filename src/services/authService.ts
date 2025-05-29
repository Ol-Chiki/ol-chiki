
// services/authService.ts
import { supabase } from '@/lib/supabase/client';
import type { User, SignUpData, AuthFormData } from '@/types/auth';
import type { AuthError, Session, User as SupabaseAuthUser, UserResponse, SignInWithPasswordCredentials, SignUpWithPasswordCredentials } from '@supabase/supabase-js';

// Helper to map Supabase user to our app's User type
const mapSupabaseUserToAppUser = (supabaseUser: SupabaseAuthUser | null): User | null => {
  if (!supabaseUser) return null;
  return {
    id: supabaseUser.id,
    email: supabaseUser.email,
    displayName: supabaseUser.user_metadata?.display_name || supabaseUser.email?.split('@')[0],
    dateOfBirth: supabaseUser.user_metadata?.date_of_birth,
    city: supabaseUser.user_metadata?.city,
    state: supabaseUser.user_metadata?.state,
    provider: supabaseUser.app_metadata?.provider,
    createdAt: supabaseUser.created_at,
    updatedAt: supabaseUser.updated_at,
    // Include these for direct use if needed, or ensure they're mapped
    user_metadata: supabaseUser.user_metadata,
    app_metadata: supabaseUser.app_metadata,
  };
};

interface AppAuthResponse {
  user: User | null;
  session: Session | null; // Can be useful for token management if needed directly
  error: AuthError | null;
}

export const authService = {
  signInWithEmail: async (credentials: SignInWithPasswordCredentials): Promise<AppAuthResponse> => {
    console.log("AuthService: Attempting email sign-in", credentials.email);
    const { data, error } = await supabase.auth.signInWithPassword(credentials);
    return { user: mapSupabaseUserToAppUser(data.user), session: data.session, error };
  },

  signUpWithEmail: async (credentials: SignUpWithPasswordCredentials): Promise<AppAuthResponse> => {
    console.log("AuthService: Attempting email sign-up", credentials.email);
    const { data, error } = await supabase.auth.signUp(credentials);
    // User object might contain the user even if email confirmation is pending.
    // Session might be null until email is confirmed.
    return { user: mapSupabaseUserToAppUser(data.user), session: data.session, error };
  },

  signInWithGoogle: async (): Promise<{ session: Session | null; error: AuthError | null }> => {
    console.log("AuthService: Attempting Google sign-in");
    // signInWithOAuth initiates a redirect, so the user/session is typically handled by onAuthStateChange.
    // It returns { data: { provider, url }, error }, not user/session directly.
    // We only care about the error here if the initiation fails.
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: typeof window !== 'undefined' ? window.location.origin : undefined,
      },
    });
    // If there's an error here, it's usually about the initiation of the OAuth flow.
    // The actual user data will come via onAuthStateChange after redirect.
    return { session: null, error }; // Placeholder session
  },

  signOut: async (): Promise<{ error: AuthError | null }> => {
    console.log("AuthService: Signing out");
    return supabase.auth.signOut();
  },

  getCurrentUser: async (): Promise<User | null> => {
    console.log("AuthService: Getting current user session");
    const { data: { session } } = await supabase.auth.getSession();
    return mapSupabaseUserToAppUser(session?.user ?? null);
  },
  
  // updateUserMetadata: async (metadata: Partial<AuthFormData>): Promise<{ user: User | null, error: AuthError | null}> => {
  //   const { data, error } = await supabase.auth.updateUser({
  //     data: {
  //       display_name: metadata.displayName,
  //       date_of_birth: metadata.dob,
  //       city: metadata.city,
  //       state: metadata.state,
  //     }
  //   });
  //   return { user: mapSupabaseUserToAppUser(data.user), error };
  // }
  // refreshToken is typically handled automatically by the Supabase client library.
  // Exposing it might be needed for very specific scenarios.
};

// Type for the authService object
export type AppAuthService = typeof authService;
