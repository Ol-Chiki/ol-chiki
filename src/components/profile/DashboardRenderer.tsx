
'use client';

import React from 'react';
import { useAuthStore } from '@/stores/authStore';
import { useDashboardData } from '@/hooks/useDashboardData';
import { dashboardCardsConfig } from '@/config/dashboardConfig';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import LoadingSpinner from '@/components/ui/LoadingSpinner'; // Reusable

export const DashboardRenderer: React.FC = () => {
  const { user, isAuthenticated } = useAuthStore();
  const { dashboardData, isLoading, error } = useDashboardData();

  if (!isAuthenticated && !isLoading) { // Don't show loading for logged out users
    return (
      <>
        <h2 className="text-2xl font-semibold text-center text-primary my-6">Learning Dashboard</h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-2 max-w-2xl mx-auto">
          {dashboardCardsConfig.map((cardConfig) => (
            <Card key={cardConfig.id} className="bg-card/80 backdrop-blur-sm opacity-70">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{cardConfig.title}</CardTitle>
                <cardConfig.icon className="h-5 w-5 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-muted-foreground">{cardConfig.defaultTextLoggedOut}</div>
                <p className="text-xs text-muted-foreground">Log in to see your data.</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </>
    );
  }
  
  if (isLoading) {
    return <LoadingSpinner message="Loading dashboard..." />;
  }

  if (error) {
    return <div className="text-center text-destructive p-4">Error loading dashboard: {error}</div>;
  }

  return (
    <>
      <h2 className="text-2xl font-semibold text-center text-primary my-6">
        Your Learning Dashboard
      </h2>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-2 max-w-2xl mx-auto">
        {dashboardCardsConfig.map((cardConfig) => {
          const dataValue = dashboardData && cardConfig.dataField ? dashboardData[cardConfig.dataField] : cardConfig.defaultTextLoggedIn;
          return (
            <Card key={cardConfig.id} className="bg-card/80 backdrop-blur-sm">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{cardConfig.title}</CardTitle>
                <cardConfig.icon className="h-5 w-5 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div data-ai-hint={cardConfig.aiHint} className="text-2xl font-bold">
                  {dataValue !== undefined && dataValue !== null ? String(dataValue) : cardConfig.defaultTextLoggedIn}
                </div>
                <p className="text-xs text-muted-foreground">
                  {/* You can add more specific subtitles here based on data if needed */}
                  {cardConfig.id === 'dayStreak' ? 'Keep learning daily!' : 
                   cardConfig.id === 'ranking' ? 'Leaderboard coming soon!' :
                   'Track your progress.'}
                </p>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </>
  );
};
