
// types/auth.ts

// Matches SupabaseUser for now, but can be made more generic later
export interface User {
  id: string;
  email: string | undefined; // Supabase user email can be undefined
  displayName?: string; // From user_metadata
  dateOfBirth?: string; // From user_metadata
  city?: string; // From user_metadata
  state?: string; // From user_metadata
  provider?: string; // e.g., 'email', 'google'
  createdAt?: string; // Supabase specific: created_at
  updatedAt?: string; // Supabase specific: updated_at
  // Supabase specific, can be mapped
  app_metadata?: {
    provider?: string;
    providers?: string[];
    [key: string]: any;
  };
  user_metadata?: {
    display_name?: string;
    avatar_url?: string;
    picture?: string;
    full_name?: string;
    name?: string;
    date_of_birth?: string;
    city?: string;
    state?: string;
    [key: string]: any;
  };
}

export interface AuthFormData {
  email: string;
  password: string;
  displayName: string;
  dob: string; // Store as string, format YYYY-MM-DD
  city: string;
  state: string;
  confirmPassword?: string; // For signup
}

export interface FormErrors {
  email?: string;
  password?: string;
  displayName?: string;
  dob?: string;
  city?: string;
  state?: string;
  confirmPassword?: string;
  general?: string; // For general form errors
}

export interface SignUpData extends Omit<AuthFormData, 'confirmPassword'> {
  // Specific fields for signup if different from AuthFormData for submission
}

export interface AuthConfig {
  googleClientId?: string; // Optional, might not be needed client-side if Supabase handles it
  redirectUrls: {
    success: string;
    error: string;
    signOut: string;
  };
  validation: {
    passwordMinLength: number;
    displayNameMinLength: number;
    maxAge: number; // Example: 120
    minAge: number; // Example: 13
  };
}
