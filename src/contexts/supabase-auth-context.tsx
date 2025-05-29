
'use client';

import type { AuthUser, Session, User, UserCredentials } from '@supabase/supabase-js';
import { supabase } from '@/lib/supabase/client';
import React, { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';

// Supabase User object might contain user_metadata for custom fields like displayName
export interface SupabaseUser extends User {
  user_metadata: {
    display_name?: string;
    avatar_url?: string;
    picture?: string; // Common for OAuth providers like Google
    full_name?: string; // Common from Google
    name?: string; // Also common from Google
    date_of_birth?: string;
    city?: string;
    state?: string;
    [key: string]: any;
  };
}

interface AuthContextType {
  user: SupabaseUser | null;
  session: Session | null;
  loading: boolean;
  signInWithGoogle: () => Promise<{ error: any }>;
  signUpWithEmail: (email: string, pass: string, displayName: string, dob: string, city?: string, stateName?: string) => Promise<{ user: SupabaseUser | null; session: Session | null; error: any }>;
  signInWithEmail: (email: string, pass: string) => Promise<{ user: SupabaseUser | null; session: Session | null; error: any }>;
  logOut: () => Promise<{ error: any }>;
  hasSkippedAuth: boolean;
  skipAuth: () => void;
  clearSkipAuth: () => void;
  updateUserDisplayName: (displayName: string) => Promise<{ user: SupabaseUser | null; error: any }>;
  updateUserProfilePhoto: (photoURL: string) => Promise<{ user: SupabaseUser | null; error: any }>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const SupabaseAuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<SupabaseUser | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [hasSkippedAuth, setHasSkippedAuth] = useState(false);
  const router = useRouter();
  const { toast } = useToast();

  useEffect(() => {
    const storedSkipStatus = typeof window !== 'undefined' ? localStorage.getItem('hasSkippedAuth') : null;
    if (storedSkipStatus === 'true') {
      setHasSkippedAuth(true);
    }

    const getSession = async () => {
      const { data: { session: currentSession }, error } = await supabase.auth.getSession();
      if (error) {
        console.error('Error getting session:', error);
        setLoading(false);
        return;
      }
      setSession(currentSession);
      setUser(currentSession?.user as SupabaseUser ?? null);
      setLoading(false);

      if (currentSession?.user) {
        localStorage.removeItem('hasSkippedAuth');
        setHasSkippedAuth(false);
      }
    }
    getSession();


    const { data: authListener } = supabase.auth.onAuthStateChange(async (_event, newSession) => {
      setSession(newSession);
      const newUser = newSession?.user as SupabaseUser ?? null;
      setUser(newUser);

      if (_event === 'SIGNED_IN' && newUser) {
        toast({ title: 'Signed in successfully!', description: `Welcome ${newUser.user_metadata?.display_name || newUser.email}!` });
        router.push('/'); 
        // Attempt to set display_name from Google profile if not already set
        if (!newUser.user_metadata?.display_name) {
          const googleName = newUser.user_metadata?.full_name || newUser.user_metadata?.name;
          if (googleName) {
            try {
              const { data: updatedUserData, error: updateError } = await supabase.auth.updateUser({
                data: { display_name: googleName }
              });
              if (updateError) {
                console.warn('Failed to update display_name from Google profile post-signin:', updateError.message);
              } else if (updatedUserData.user) {
                setUser(updatedUserData.user as SupabaseUser); // Update local user state immediately
              }
            } catch (e) {
              console.warn('Error during attempt to update display_name post-Google sign-in:', e);
            }
          }
        }
      } else if (_event === 'SIGNED_OUT') {
        // Toast and redirect handled by explicit logOut function
      }


      setLoading(false);
      if (newSession?.user) {
        localStorage.removeItem('hasSkippedAuth');
        setHasSkippedAuth(false);
      }
    });

    return () => {
      authListener?.subscription.unsubscribe();
    };
  }, [router, toast]);


  const signInWithGoogle = async () => {
    setLoading(true);
    // Ensure window.location.origin is used for redirectTo, which is standard for client-side.
    // The `redirectTo` is where Supabase redirects the user *after* Google auth & Supabase callback.
    // For a 403 error from Google, the issue is likely not this `redirectTo`, but the
    // "Authorized redirect URIs" in your Google Cloud Console for your OAuth client ID,
    // which MUST include your Supabase project's callback URL:
    // e.g., https://<YOUR_PROJECT_REF>.supabase.co/auth/v1/callback
    // Also, check your OAuth Consent Screen settings in Google Cloud Console.
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: typeof window !== 'undefined' ? window.location.origin : undefined,
      }
    });
    setLoading(false);
    if (error) {
      console.error('Google sign-in error:', error);
      if (error.message.includes('Popup closed by user') || error.message.includes('popup_closed_by_user')) {
        toast({ title: 'Sign-In Cancelled', description: 'Google Sign-In was cancelled or the pop-up was closed.', variant: 'default' });
      } else if (error.message.includes('Access denied') || error.message.includes('popup_blocked_by_browser') || (error as any).code === 'popup_blocked' || (error as any).code === 'auth/popup-blocked') {
        toast({ title: 'Pop-up Blocked', description: 'Google Sign-In pop-up was blocked. Please disable your pop-up blocker and try again.', variant: 'destructive' });
      } else if (error.message.includes('403')) {
         toast({ title: 'Google Sign-In Error (403)', description: "Access denied by Google. Please ensure your Google Cloud OAuth client ID and Supabase settings (especially Redirect URIs) are correctly configured.", variant: 'destructive' });
      }
      else {
        toast({ title: 'Google Sign-In Error', description: error.message || 'Failed to sign in with Google.', variant: 'destructive' });
      }
    }
    return { error };
  };

  const signUpWithEmail = async (email: string, pass: string, displayName: string, dob: string, city?: string, stateName?: string) => {
    setLoading(true);
    if (!displayName || !dob) {
      toast({ title: 'Missing Information', description: 'Display Name and Date of Birth are required.', variant: 'destructive' });
      setLoading(false);
      return { user: null, session: null, error: { message: 'Display Name and DOB required.'} as any };
    }
    const { data, error } = await supabase.auth.signUp({
      email,
      password: pass,
      options: {
        data: {
          display_name: displayName,
          date_of_birth: dob,
          city: city || null,
          state: stateName || null,
        }
      }
    });
    setLoading(false);
    if (error) {
      console.error('Email sign-up error:', error);
      toast({ title: 'Email Sign-Up Error', description: error.message || 'Failed to sign up.', variant: 'destructive' });
    } else if (data.user) {
      if (data.session && data.user) { 
         // onAuthStateChange handles the "SIGNED_IN" event
      } else { 
        toast({ title: 'Sign-Up Successful!', description: `Welcome ${displayName}! Please check your email to verify your account.` });
      }
    }
    return { user: data.user as SupabaseUser, session: data.session, error };
  };

  const signInWithEmail = async (email: string, pass: string) => {
    setLoading(true);
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password: pass,
    });
    setLoading(false);
    if (error) {
      console.error('Email sign-in error:', error);
      toast({ title: 'Email Sign-In Error', description: error.message || 'Failed to sign in.', variant: 'destructive' });
    }
    // onAuthStateChange handles "SIGNED_IN"
    return { user: data.user as SupabaseUser, session: data.session, error };
  };

  const logOut = async () => {
    setLoading(true);
    const { error } = await supabase.auth.signOut();
    setLoading(false);
    if (error) {
      console.error('Sign out error:', error);
      toast({ title: 'Sign Out Error', description: error.message || 'Failed to sign out.', variant: 'destructive' });
    } else {
      setUser(null);
      setSession(null);
      toast({ title: 'Signed out', description: 'You have been signed out.' });
      router.push('/auth');
    }
    return { error };
  };

  const skipAuth = () => {
    if (typeof window !== 'undefined') localStorage.setItem('hasSkippedAuth', 'true');
    setHasSkippedAuth(true);
    router.push('/');
  };

  const clearSkipAuth = () => {
    if (typeof window !== 'undefined') localStorage.removeItem('hasSkippedAuth');
    setHasSkippedAuth(false);
  }

  const updateUserDisplayName = async (displayName: string) => {
    if (!user) return { user: null, error: { message: 'User not authenticated' } as any };
    setLoading(true);
    const { data, error } = await supabase.auth.updateUser({
      data: { display_name: displayName }
    });
    setLoading(false);
    if (error) {
      toast({ title: 'Update Error', description: error.message || 'Failed to update display name.', variant: 'destructive' });
    } else if (data.user) {
      setUser(data.user as SupabaseUser);
      toast({ title: 'Success', description: 'Display name updated.' });
    }
    return { user: data.user as SupabaseUser, error };
  };

  const updateUserProfilePhoto = async (photoURL: string) => {
    if (!user) return { user: null, error: { message: 'User not authenticated' } as any};
    setLoading(true);
    // Placeholder: Actual upload to Supabase Storage would happen before this.
    // This function would typically be called with the public URL from Supabase Storage.
    const { data, error } = await supabase.auth.updateUser({
      data: { avatar_url: photoURL } // Supabase often uses avatar_url for profile pictures
    });
    setLoading(false);
    if (error) {
      console.error('Error updating profile photo:', error);
      toast({ title: 'Photo Update Error', description: error.message || 'Failed to update photo.', variant: 'destructive' });
    } else if (data.user) {
      setUser(data.user as SupabaseUser);
      toast({ title: 'Profile Photo Updated', description: 'Your new profile photo has been set.' });
    }
    return { user: data.user as SupabaseUser, error };
  };


  return (
    <AuthContext.Provider value={{
      user,
      session,
      loading,
      signInWithGoogle,
      signUpWithEmail,
      signInWithEmail,
      logOut,
      hasSkippedAuth,
      skipAuth,
      clearSkipAuth,
      updateUserDisplayName,
      updateUserProfilePhoto
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within a SupabaseAuthProvider');
  }
  return context;
};

