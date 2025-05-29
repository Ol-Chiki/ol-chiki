
'use client';

import { useState, useCallback } from 'react';
import { useProfileStore } from '@/stores/profileStore';
import { FileService } from '@/services/fileService';
import { readFileAsDataURL, validateImageFile } from '@/utils/fileUtils';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/supabase-auth-context'; // To get updateUserProfilePhoto

export const useFileUpload = () => {
  const { selectedFile, setSelectedFile, previewImage, setPreviewImage, setLoading, setError } = useProfileStore();
  const { user, updateUserProfilePhoto: updateSupabaseUserPhoto } = useAuth(); // From Supabase context
  const { toast } = useToast();

  const handleFileChange = useCallback(async (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      const validation = validateImageFile(file);
      if (!validation.isValid) {
        toast({ title: 'Invalid File', description: validation.error, variant: 'destructive' });
        setSelectedFile(null);
        setPreviewImage(null);
        return;
      }
      setSelectedFile(file);
      try {
        const dataUrl = await readFileAsDataURL(file);
        setPreviewImage(dataUrl);
      } catch (e) {
        toast({ title: 'Error Reading File', description: 'Could not preview the image.', variant: 'destructive' });
        setPreviewImage(null);
      }
    } else {
      setSelectedFile(null);
      setPreviewImage(null);
    }
  }, [setSelectedFile, setPreviewImage, toast]);

  const handleUploadPhoto = useCallback(async () => {
    if (!selectedFile || !user) {
      toast({ title: 'No File or User', description: 'Please select a file and ensure you are logged in.', variant: 'destructive' });
      return;
    }
    setLoading(true);
    setError(null);
    try {
      // In a real app, FileService.uploadProfilePhoto would upload to your backend/Supabase Storage
      // and return a persistent URL.
      const storageUrl = await FileService.uploadProfilePhoto(user.id, selectedFile);
      
      // Update the user's profile photo in Supabase Auth user_metadata
      await updateSupabaseUserPhoto(storageUrl); // This updates the user object in useAuth context
      
      toast({ title: 'Photo Uploaded', description: 'Your profile photo has been conceptually updated.' });
      // The user object in useAuth will re-render components that use it, showing the new photo.
      // We clear local state as the source of truth is now the auth user object.
      setSelectedFile(null); 
      setPreviewImage(null); 
    } catch (e: any) {
      setError(e.message || 'Failed to upload photo.');
      toast({ title: 'Upload Failed', description: e.message || 'Could not upload photo.', variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  }, [selectedFile, user, setLoading, setError, toast, updateSupabaseUserPhoto, setSelectedFile, setPreviewImage]);

  const clearSelection = useCallback(() => {
    setSelectedFile(null);
    setPreviewImage(null);
    if (typeof document !== 'undefined') {
        const fileInput = document.getElementById('photoUpload') as HTMLInputElement;
        if (fileInput) fileInput.value = ''; // Clear the native file input
    }
  }, [setSelectedFile, setPreviewImage]);

  return {
    selectedFile,
    previewImage,
    handleFileChange,
    handleUploadPhoto,
    clearSelection,
    isLoading: useProfileStore((s) => s.isLoading), // Get isLoading from store
  };
};
