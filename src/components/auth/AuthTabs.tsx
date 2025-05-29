
// components/auth/AuthTabs.tsx
import React from 'react';
import { Tabs, TabsList, TabsTrigger, TabsContent as ShadcnTabsContent } from '@/components/ui/tabs'; // Use original ShadCN Tabs
import { EmailAuthForm } from './EmailAuthForm';
import { SocialAuthForm } from './SocialAuthForm';

interface AuthTabsProps {
  // Potentially props to control default tab, etc.
}

export const AuthTabs: React.FC<AuthTabsProps> = () => {
  return (
    <Tabs defaultValue="email" className="w-full">
      <TabsList className="grid w-full grid-cols-2 mb-6">
        <TabsTrigger value="email">Email</TabsTrigger>
        <TabsTrigger value="social">Social</TabsTrigger>
      </TabsList>
      <ShadcnTabsContent value="email">
        <EmailAuthForm />
      </ShadcnTabsContent>
      <ShadcnTabsContent value="social">
        <SocialAuthForm />
      </ShadcnTabsContent>
    </Tabs>
  );
};
