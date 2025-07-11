
'use client';


import React from 'react';
import OlChikiApp from '@/components/ol-chiki/OlChikiApp';
import { SupabaseAuthProvider } from '@/contexts/supabase-auth-context'; // Keep this for Supabase setup

export default function HomePage() {
  // SupabaseAuthProvider is now in RootLayout.
  // This page mainly renders the OlChikiApp component.
  // OlChikiApp will handle its own state and logic using Zustand stores.
  return (
      <OlChikiApp />
  );
}
