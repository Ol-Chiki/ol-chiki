
'use client';

import React from 'react';
import { useProfileStore } from '@/stores/profileStore';
import { useDashboardStore } from '@/stores/dashboardStore';
import LoadingSpinner from '@/components/ui/LoadingSpinner'; // Reusable global spinner

// This LoadingStateManager can be more specific to profile/dashboard loading
// or could be enhanced to listen to multiple stores.

export const ProfileLoadingStateManager: React.FC = () => {
  const isProfileLoading = useProfileStore((state) => state.isLoading);
  const isDashboardLoading = useDashboardStore((state) => state.isLoading);
  // Add other relevant loading states here if needed

  if (isProfileLoading) {
    return (
      <div className="fixed inset-0 z-[100] flex items-center justify-center bg-background/80 backdrop-blur-sm">
        <LoadingSpinner message="Updating profile..." size="lg" />
      </div>
    );
  }

  if (isDashboardLoading) {
     return (
      <div className="fixed inset-0 z-[100] flex items-center justify-center bg-background/80 backdrop-blur-sm">
        <LoadingSpinner message="Loading dashboard data..." size="lg" />
      </div>
    );
  }

  return null;
};
