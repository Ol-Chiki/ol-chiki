
'use client';

import ProfileApp from '@/components/profile/ProfileApp';
import ErrorBoundary from '@/components/error-boundary'; // Re-use global one or create profile-specific

export default function ProfilePageEntry() {
  // This entry point is kept minimal.
  // It can handle route-level loading/error boundaries if needed,
  // but most logic is delegated to ProfileApp.
  return (
    // Using a global error boundary or you can create one specific for the profile section.
    <ErrorBoundary fallbackMessage="The profile page encountered an error.">
      <ProfileApp />
    </ErrorBoundary>
  );
}
