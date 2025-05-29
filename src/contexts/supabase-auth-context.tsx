
'use client';

import type { AuthUser, Session, User as SupabaseAuthUserType, UserCredentials } from '@supabase/supabase-js';
import { supabase } from '@/lib/supabase/client';
import React, { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';
import { useAuthStore } from '@/stores/authStore'; // Import the new Zustand store
import type { User as AppUser } from '@/types/auth'; // Import your app's User type

// Supabase User object might contain user_metadata for custom fields like displayName
export interface SupabaseUser extends SupabaseAuthUserType {
  user_metadata: {
    display_name?: string;
    avatar_url?: string;
    picture?: string; // Often used by Google
    full_name?: string; // Often used by Google
    name?: string; // Sometimes used by Google
    date_of_birth?: string;
    city?: string;
    state?: string;
    [key: string]: any;
  };
}

// The old context type, kept for reference during transition if other parts of app still use it.
// Ideally, this context will be deprecated and removed.
interface LegacyAuthContextType {
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

const LegacyAuthContext = createContext<LegacyAuthContextType | undefined>(undefined);

export const SupabaseAuthProvider = ({ children }: { children: ReactNode }) => {
  const { toast } = useToast();
  const router = useRouter();
  
  // Get actions from the Zustand store
  const { _setUserAndSession, setLoading: setStoreLoading, checkAuthStatus } = useAuthStore();

  // These states are now primarily for the LegacyAuthContext, if still used.
  // The Zustand store is the new source of truth.
  const [legacyUser, setLegacyUser] = useState<SupabaseUser | null>(null);
  const [legacySession, setLegacySession] = useState<Session | null>(null);
  const [legacyLoading, setLegacyLoading] = useState(true);


  useEffect(() => {
    setStoreLoading(true); // Signal store that we are checking initial status
    checkAuthStatus(); // Initialize skip status from localStorage via store

    const { data: authListener } = supabase.auth.onAuthStateChange(async (_event, session) => {
      const supabaseUser = session?.user as SupabaseUser ?? null;
      let updatedUserForStore = supabaseUser;

      if (_event === 'SIGNED_IN' && supabaseUser) {
        let currentDisplayName = supabaseUser.user_metadata?.display_name;
        let metadataNeedsUpdate = false;
        let newMetadata = { ...supabaseUser.user_metadata };

        if (!currentDisplayName) {
          const googleName = supabaseUser.user_metadata?.full_name || supabaseUser.user_metadata?.name;
          if (googleName) {
            newMetadata.display_name = googleName;
            metadataNeedsUpdate = true;
          }
        }
        
        // This is more of a conceptual placeholder. In a real app, this data should be set
        // during the OAuth signup flow or profile completion, not assumed from generic user_metadata.
        // For now, we are just illustrating that user_metadata can hold these.
        // If these fields are populated by Google OAuth scopes, they'd be in user_metadata.
        // if (!newMetadata.date_of_birth && supabaseUser.user_metadata?.birthdate) { /* hypothetical */ }


        if (metadataNeedsUpdate) {
          try {
            const { data: updatedUserData, error: updateError } = await supabase.auth.updateUser({
              data: newMetadata
            });
            if (updateError) {
              console.warn('Failed to update user_metadata post-signin:', updateError.message);
            } else if (updatedUserData.user) {
               updatedUserForStore = updatedUserData.user as SupabaseUser;
            }
          } catch (e) {
            console.warn('Error during attempt to update user_metadata post-Google sign-in:', e);
          }
        }
        // Use the potentially updated user for store and legacy context
        _setUserAndSession({ ...session, user: updatedUserForStore } as Session);
        setLegacySession({ ...session, user: updatedUserForStore } as Session);
        setLegacyUser(updatedUserForStore);

        toast({ title: 'Signed in successfully!', description: `Welcome ${updatedUserForStore?.user_metadata?.display_name || updatedUserForStore?.email}!` });
        // router.push('/'); // Redirection is now handled by AuthContainer or individual pages based on authStore.isAuthenticated
      
      } else if (_event === 'SIGNED_OUT') {
        _setUserAndSession(null);
        setLegacySession(null);
        setLegacyUser(null);
        // Toast and redirect for sign out is handled by useAuthentication hook or store's signOut action
      } else if (session) { // For other events like USER_UPDATED, TOKEN_REFRESHED
        _setUserAndSession(session);
        setLegacySession(session);
        setLegacyUser(session?.user as SupabaseUser ?? null);
      } else { // If session is null for other reasons
        _setUserAndSession(null);
        setLegacySession(null);
        setLegacyUser(null);
      }

      setStoreLoading(false);
      setLegacyLoading(false);
    });
    
    // Initial session check
    supabase.auth.getSession().then(({ data: { session } }) => {
      _setUserAndSession(session);
      setLegacySession(session);
      setLegacyUser(session?.user as SupabaseUser ?? null);
      setStoreLoading(false);
      setLegacyLoading(false);
    });

    return () => {
      authListener?.subscription.unsubscribe();
    };
  }, [_setUserAndSession, setStoreLoading, toast, checkAuthStatus, router]);


  // --- Legacy Context Provider Values ---
  // These methods now largely delegate to the store or authService, or are becoming obsolete
  // For the purpose of this refactor, they remain to avoid breaking other parts of the app
  // that might still be using the old useAuth() hook.
  const legacySignInWithGoogle = async () => {
    // This should ideally be called via useAuthStore().signInWithGoogle() from the UI
    console.warn("Legacy signInWithGoogle called from context. Prefer using authStore.");
    useAuthStore.getState().signInWithGoogle(); // Call store action
    return { error: null }; // Placeholder return
  };

  const legacySignUpWithEmail = async (email: string, pass: string, displayName: string, dob: string, city?: string, stateName?: string) => {
    console.warn("Legacy signUpWithEmail called from context. Prefer using authStore.");
    // This is complex, as the store's signUpWithEmail takes a data object.
    // For simplicity, this legacy function is now less functional.
    const signUpData = { email, password: pass, displayName, dob, city: city || '', state: stateName || '', confirmPassword: pass };
    useAuthStore.getState().signUpWithEmail(signUpData);
    return { user: null, session: null, error: null }; // Placeholder
  };
  // ... other legacy methods would also be placeholders or call store actions ...
  const legacySignOut = async () => {
    useAuthStore.getState().signOut();
    return { error: null };
  }

  const legacyContextValue: LegacyAuthContextType = {
    user: legacyUser,
    session: legacySession,
    loading: legacyLoading,
    signInWithGoogle: legacySignInWithGoogle,
    signUpWithEmail: legacySignUpWithEmail,
    signInWithEmail: async (email, password) => { 
        useAuthStore.getState().signInWithEmail(email, password); 
        return { user: null, session: null, error: null }; 
    },
    logOut: legacySignOut,
    hasSkippedAuth: useAuthStore.getState().hasSkippedAuth, // Get from store
    skipAuth: () => useAuthStore.getState().skipAuth(),
    clearSkipAuth: () => { /* This logic is handled internally by store on login */},
    updateUserDisplayName: async (displayName: string) => {
        const { data, error } = await supabase.auth.updateUser({ data: { display_name: displayName }});
        if (data.user) _setUserAndSession({ ...legacySession, user: data.user } as Session); // Update store
        return { user: data.user as SupabaseUser, error };
    },
    updateUserProfilePhoto: async (photoURL: string) => {
        const { data, error } = await supabase.auth.updateUser({ data: { avatar_url: photoURL }});
        if (data.user) _setUserAndSession({ ...legacySession, user: data.user } as Session); // Update store
        return { user: data.user as SupabaseUser, error };
    },
  };


  return (
    <LegacyAuthContext.Provider value={legacyContextValue}>
      {children}
    </LegacyAuthContext.Provider>
  );
};

// This hook should ideally be deprecated and components should use useAuthStore
export const useAuth = () => {
  const context = useContext(LegacyAuthContext);
  if (context === undefined) {
    // This error might occur if a component using the old useAuth() is rendered outside SupabaseAuthProvider
    // For the new auth system, components should import useAuthStore directly.
    console.warn('Legacy useAuth context is undefined. Ensure SupabaseAuthProvider is correctly wrapping your app. New components should prefer useAuthStore.');
    // Return a fallback to prevent outright crashing, but functionality will be limited.
    return {
        user: null, session: null, loading: true, 
        signInWithGoogle: () => Promise.resolve({error:null}),
        signUpWithEmail: () => Promise.resolve({user:null, session:null, error:null}),
        signInWithEmail: () => Promise.resolve({user:null, session:null, error:null}),
        logOut: () => Promise.resolve({error:null}), 
        hasSkippedAuth: false, 
        skipAuth: () => {}, 
        clearSkipAuth: () => {},
        updateUserDisplayName: () => Promise.resolve({user:null, error:null}),
        updateUserProfilePhoto: () => Promise.resolve({user:null, error:null})
    } as LegacyAuthContextType;
  }
  return context;
};

