
// Placeholder Profile Service
// In a real app, this would interact with your backend or Supabase directly
// for operations not covered by supabase.auth.updateUser

import { supabase } from '@/lib/supabase/client';
import type { SupabaseUser } from '@/contexts/supabase-auth-context';

export class ProfileService {
  // Supabase handles displayName and photoURL via supabase.auth.updateUser
  // This service could be used for other profile fields stored in a separate 'profiles' table

  static async updateUserDisplayName(displayName: string): Promise<SupabaseUser> {
    const { data: { user }, error } = await supabase.auth.updateUser({
      data: { display_name: displayName }
    });
    if (error) throw error;
    if (!user) throw new Error("User not found after update.");
    return user as SupabaseUser;
  }

  // photoURL update is also handled by supabase.auth.updateUser with 'avatar_url'
  static async updateUserProfilePhoto(photoURL: string): Promise<SupabaseUser> {
     const { data: { user }, error } = await supabase.auth.updateUser({
      data: { avatar_url: photoURL }
    });
    if (error) throw error;
    if (!user) throw new Error("User not found after update.");
    return user as SupabaseUser;
  }

  // Example: If you stored DOB in a separate 'profiles' table
  static async updateUserDOB(userId: string, dob: string): Promise<void> {
    console.log(`ProfileService: Conceptually updating DOB for ${userId} to ${dob}`);
    // const { error } = await supabase
    //   .from('profiles')
    //   .update({ date_of_birth: dob })
    //   .eq('id', userId);
    // if (error) throw error;
    await new Promise(resolve => setTimeout(resolve, 500)); // Simulate API call
  }

  static handleApiError(error: unknown): never {
    // Basic error handling, can be expanded
    if (error instanceof Error) {
      console.error("Profile Service Error:", error.message);
      throw new Error(`Profile operation failed: ${error.message}`);
    }
    console.error("Profile Service Error:", error);
    throw new Error("An unknown error occurred during a profile operation.");
  }
}
