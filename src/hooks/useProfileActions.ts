
'use client';

import { useCallback } from 'react';
import { useProfileStore } from '@/stores/profileStore';
import { useAuth } from '@/contexts/supabase-auth-context'; // For Supabase user and update functions
import { ProfileService } from '@/services/profileService';
import { useToast } from '@/hooks/use-toast';
import { validateDisplayName } from '@/utils/validationUtils';
import type { PredefinedAvatar } from '@/types/profile';

export const useProfileActions = () => {
  const { isEditingName, toggleEditingName: storeToggleEditingName, setLoading, setError } = useProfileStore();
  const { user, updateUserDisplayName: updateSupabaseUserDisplayName, updateUserProfilePhoto: updateSupabaseUserProfilePhoto } = useAuth();
  const { toast } = useToast();

  const handleSaveDisplayName = useCallback(async (newName: string) => {
    const validation = validateDisplayName(newName);
    if (!validation.isValid) {
      toast({ title: 'Invalid Name', description: validation.error, variant: 'destructive' });
      return;
    }
    if (!user || newName.trim() === (user.user_metadata?.display_name || '')) {
      storeToggleEditingName(); // Just close if no change or empty or no user
      return;
    }

    setLoading(true);
    setError(null);
    try {
      await updateSupabaseUserDisplayName(newName.trim()); // This updates user in useAuth context
      toast({ title: 'Success', description: 'Display name updated successfully.' });
      storeToggleEditingName(); // Close editing mode
    } catch (e: any) {
      setError(e.message || 'Failed to update display name.');
      toast({ title: 'Update Failed', description: e.message || 'Could not update display name.', variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  }, [user, storeToggleEditingName, setLoading, setError, toast, updateSupabaseUserDisplayName]);

  const handleSelectPredefinedAvatar = useCallback(async (avatar: PredefinedAvatar) => {
    if (!user) {
      toast({ title: 'Not Logged In', description: 'Please log in to select an avatar.', variant: 'destructive' });
      return;
    }
    setLoading(true);
    setError(null);
    try {
      await updateSupabaseUserProfilePhoto(avatar.url); // Updates user_metadata.avatar_url
      toast({ title: 'Avatar Updated', description: `${avatar.name} selected as your avatar.` });
    } catch (e: any) {
      setError(e.message || 'Failed to update avatar.');
      toast({ title: 'Avatar Update Failed', description: e.message || 'Could not set avatar.', variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  }, [user, setLoading, setError, toast, updateSupabaseUserProfilePhoto]);

  return {
    isEditingName,
    toggleEditingName: storeToggleEditingName,
    handleSaveDisplayName,
    handleSelectPredefinedAvatar,
    isLoading: useProfileStore((s) => s.isLoading), // Get isLoading from store
    error: useProfileStore((s) => s.error),
  };
};
