
'use client';

import React, { useEffect } from 'react';
import { useUIStore } from '@/stores/uiStore';
import { useAuthStore } from '@/stores/authStore';
import { useNavigationStore } from '@/stores/navigationStore';
import { useStoreActions } from '@/hooks/useStoreActions'; // For combined actions

import SplashScreen from '@/components/splash-screen'; // Assuming this component exists and is refactored
import AuthGuard from './AuthGuard';
import ContentRenderer from './ContentRenderer';
import BottomNavigation from '@/components/layout/bottom-navigation';
import LoadingStateManager from './LoadingStateManager'; // To display global loading messages

import { GraduationCap } from 'lucide-react'; // Example icon
import { APP_NAME } from '@/utils/constants';
import { useRouter } from 'next/navigation';


const OlChikiApp: React.FC = () => {
  const {
    isClient,
    splashSeenThisSession,
    currentYear,
    setClientReady,
    setSplashSeen,
    checkSplashStatus, // Action from UIStore
    setCurrentYear,
  } = useUIStore();

  const { user, checkAuthStatus } = useAuthStore();
  const { activeView, setActiveView } = useNavigationStore();
  const router = useRouter();


  useEffect(() => {
    setClientReady();
    checkSplashStatus(); // Check session storage for splash status
    checkAuthStatus(); // Check local storage for auth skip status
    setCurrentYear(new Date().getFullYear().toString());
  }, [setClientReady, checkSplashStatus, checkAuthStatus, setCurrentYear]);


  if (!isClient) {
    // Render a minimal server-side or pre-hydration loader
    // This helps prevent hydration mismatches if splash logic is client-heavy
    return (
       <div className="flex min-h-screen flex-col items-center justify-center bg-background">
         <GraduationCap className="h-16 w-16 text-primary animate-pulse" />
         <p className="mt-4 text-lg text-muted-foreground">Initializing {APP_NAME}...</p>
       </div>
     );
  }

  if (!splashSeenThisSession) {
    return <SplashScreen onComplete={() => {
      setSplashSeen();
      // After splash, if not authenticated and not skipped, AuthGuard will redirect.
      // Otherwise, if auth is resolved, normal app flow continues.
      // Default to basic-hub after splash if auth allows.
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
      <LoadingStateManager /> {/* For global loading messages like "Authenticating..." */}
      <header className="bg-primary text-primary-foreground p-4 shadow-md flex items-center justify-between sticky top-0 z-40 h-18">
        <div className="flex items-center gap-1 sm:gap-2">
          <GraduationCap className="h-6 w-6" />
          <h1 className="text-base sm:text-xl font-bold tracking-tight leading-tight">{APP_NAME}</h1>
        </div>
        {/* Add any header actions if needed, e.g., settings, if not in bottom nav */}
      </header>

      <main className="flex-grow container mx-auto py-2 px-1 md:py-6 md:px-4 pb-20">
        <AuthGuard>
          <ContentRenderer />
        </AuthGuard>
      </main>

      <BottomNavigation
        activeView={activeView}
        onNavChange={setActiveView}
        onProfileClick={handleProfileNavigation}
        currentUser={user}
      />

      <footer className="bg-secondary text-secondary-foreground p-4 text-center text-sm mt-auto">
        <p>&copy; {currentYear} {APP_NAME}. Learn and explore the Ol Chiki script.</p>
      </footer>
    </div>
  );
};

export default OlChikiApp;
