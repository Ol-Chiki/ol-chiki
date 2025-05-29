
'use client';

import { useEffect } from 'react';
import { useDashboardStore } from '@/stores/dashboardStore';
import { useAuthStore } from '@/stores/authStore'; // Assuming Supabase user ID comes from here or useAuth context

export const useDashboardData = () => {
  const { dashboardData, isLoading, error, fetchDashboardData } = useDashboardStore();
  const { user } = useAuthStore(); // Or useAuth from Supabase context if preferred

  useEffect(() => {
    if (user?.id) {
      fetchDashboardData(user.id);
    }
  }, [user?.id, fetchDashboardData]);

  return {
    dashboardData,
    isLoading,
    error,
    refreshDashboardData: user?.id ? () => fetchDashboardData(user.id) : () => {},
  };
};
