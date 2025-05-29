
'use client';

import React, { useEffect } from 'react';
import { useUIStore } from '@/stores/uiStore';
import { useAuthStore } from '@/stores/authStore';
import { useNavigationStore } from '@/stores/navigationStore';

import SplashScreen from '@/components/splash-screen';
import AuthGuard from './AuthGuard';
import ContentRenderer from './ContentRenderer';
import BottomNavigation from '@/components/layout/bottom-navigation';
import LoadingStateManager from './LoadingStateManager';
import AppHeader from '@/components/layout/app-header';
import AppFooter from '@/components/layout/app-footer'; // New import
import { useRouter } from 'next/navigation';


const OlChikiApp: React.FC = () => {
  const {
    isClient,
    splashSeenThisSession,
    setClientReady,
    setSplashSeen,
    checkSplashStatus,
    setCurrentYear,
  } = useUIStore();

  const { user, checkAuthStatus } = useAuthStore();
  const { activeView, setActiveView } = useNavigationStore();
  const router = useRouter();


  useEffect(() => {
    setClientReady();
    checkSplashStatus(); 
    checkAuthStatus(); 
    setCurrentYear(new Date().getFullYear().toString());
  }, [setClientReady, checkSplashStatus, checkAuthStatus, setCurrentYear]);


  if (!isClient) {
    return (
       <div className="flex min-h-screen flex-col items-center justify-center bg-background">
         {/* Minimal server-side loader, can be enhanced */}
         <p className="mt-4 text-lg text-muted-foreground">Initializing App...</p>
       </div>
     );
  }

  if (!splashSeenThisSession) {
    return <SplashScreen onComplete={() => {
      setSplashSeen();
      if (useAuthStore.getState().user || useAuthStore.getState().hasSkippedAuth) {
        setActiveView('basic-hub');
      }
    }} />;
  }

  const handleProfileNavigation = () => {
    router.push('/profile');
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <LoadingStateManager />
      <AppHeader />

      <main className="flex-grow container mx-auto py-2 px-1 md:py-6 md:px-4 pb-20">
        <AuthGuard>
          <ContentRenderer />
        </AuthGuard>
      </main>

      <BottomNavigation
        activeView={activeView}
        onNavChange={setActiveView} // This will be handled by navigationConfig actions
        onProfileClick={handleProfileNavigation} // Direct navigation
        currentUser={user} // Pass current user for dynamic profile label
      />

      <AppFooter /> {/* Use the new AppFooter component */}
    </div>
  );
};

export default OlChikiApp;
