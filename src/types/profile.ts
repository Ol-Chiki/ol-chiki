
import type { SupabaseUser } from '@/contexts/supabase-auth-context';

export interface ProfileData {
  displayName?: string;
  // Add other profile-specific fields here if needed beyond SupabaseUser
}

export interface PredefinedAvatar {
  id: string;
  url: string;
  name: string;
  'data-ai-hint'?: string;
}

export interface ProfileConfigType {
  maxDisplayNameLength: number;
  allowedImageTypes: string[];
  maxImageSizeMB: number;
}
