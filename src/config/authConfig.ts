
// config/authConfig.ts
import type { AuthConfig } from '@/types/auth';

export const authConfig: AuthConfig = {
  // googleClientId: 'YOUR_GOOGLE_CLIENT_ID', // Not typically needed client-side with Supabase
  redirectUrls: {
    success: '/', // Redirect after successful login/signup
    error: '/auth?error=true', // Example error redirect
    signOut: '/auth', // Redirect after sign out
  },
  validation: {
    passwordMinLength: 6,
    displayNameMinLength: 2,
    maxAge: 120, // Max age for DOB validation
    minAge: 13,  // Min age for DOB validation
  },
};
