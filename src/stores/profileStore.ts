
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type { ProfileData } from '@/types/profile';

// This store is for client-side UI state related to the profile editing experience.
// Actual user profile data (displayName, photoURL) comes from authStore (SupabaseUser).

interface ProfileUIState {
  isEditingName: boolean;
  selectedFile: File | null;
  previewImage: string | null; // For image upload preview
  isLoading: boolean; // For profile update operations
  error: string | null;
}

interface ProfileUIActions {
  toggleEditingName: () => void;
  setSelectedFile: (file: File | null) => void;
  setPreviewImage: (image: string | null) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  resetEditState: () => void;
}

export type ProfileStore = ProfileUIState & ProfileUIActions;

const initialState: ProfileUIState = {
  isEditingName: false,
  selectedFile: null,
  previewImage: null,
  isLoading: false,
  error: null,
};

export const useProfileStore = create<ProfileStore>()(
  // No persistence needed for this UI-specific store, as it's transient.
  (set) => ({
    ...initialState,
    toggleEditingName: () => set((state) => ({ isEditingName: !state.isEditingName, error: null })),
    setSelectedFile: (file) => set({ selectedFile: file, error: null }),
    setPreviewImage: (image) => set({ previewImage: image, error: null }),
    setLoading: (loading) => set({ isLoading: loading }),
    setError: (error) => set({ error: error, isLoading: false }),
    resetEditState: () => set({
      isEditingName: false,
      selectedFile: null,
      previewImage: null,
      isLoading: false,
      error: null,
    }),
  })
);
