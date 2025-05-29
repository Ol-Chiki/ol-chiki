
'use client';

import React from 'react';
import { ProfileAuthGuard } from './AuthGuard';
import { ProfileLoadingStateManager } from './LoadingStateManager';
import { ProfileCard } from './ProfileCard';
import { DashboardRenderer } from './DashboardRenderer';
import { BackButton } from '@/components/ui/BackButton';
import { ShareButton } from '@/components/ui/ShareButton';
import { Separator } from '@/components/ui/separator';

export default function ProfileApp() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/10 via-background to-secondary/10 p-4 pt-6 md:p-8">
      <ProfileLoadingStateManager />
      <div className="mb-6 flex justify-start">
        <BackButton defaultHref="/" />
      </div>

      <ProfileAuthGuard promptMessage="View Your Profile & Dashboard">
        {/* Content for authenticated users */}
        <ProfileCard />
        <Separator className="my-8" />
        <DashboardRenderer />
      </ProfileAuthGuard>
      
      <div className="text-center mt-10 max-w-2xl mx-auto">
         <p className="text-muted-foreground text-sm mb-6">
           More dashboard features and profile customization options are on the way!
         </p>
         <ShareButton />
      </div>
    </div>
  );
}
