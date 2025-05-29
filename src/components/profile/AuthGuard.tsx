
'use client';

import React from 'react';
import { useAuth } from '@/contexts/supabase-auth-context';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Languages, LogIn } from 'lucide-react';

interface ProfileAuthGuardProps {
  children: React.ReactNode;
  promptMessage?: string;
}

export const ProfileAuthGuard: React.FC<ProfileAuthGuardProps> = ({ children, promptMessage }) => {
  const { user, loading } = useAuth();
  const router = useRouter();

  if (loading) {
    return <LoadingSpinner message="Loading user profile..." />;
  }

  if (!user) {
    return (
        <Card className="mx-auto w-full max-w-md shadow-xl text-center">
          <CardHeader className="p-6 sm:p-8">
            <Languages className="mx-auto h-12 w-12 text-primary mb-3" />
            <CardTitle className="text-2xl font-bold tracking-tight text-primary">Let's Learn Ol Chiki</CardTitle>
            <CardDescription className="mt-1 text-md">
              {promptMessage || "Your Learning Journey Awaits"}
            </CardDescription>
          </CardHeader>
          <CardContent className="p-6 pt-0 sm:p-8 sm:pt-0">
            <p className="text-muted-foreground mb-6 text-sm">
              Please log in or sign up to access your profile and dashboard features.
            </p>
            <Button onClick={() => router.push('/auth')} className="w-full">
              <LogIn className="mr-2 h-4 w-4" />
              Login / Sign Up
            </Button>
          </CardContent>
        </Card>
    );
  }

  return <>{children}</>;
};
