
import { create } from 'zustand';
import type { DashboardData } from '@/types/dashboard';

interface DashboardState {
  dashboardData: DashboardData | null;
  isLoading: boolean;
  error: string | null;
}

interface DashboardActions {
  setDashboardData: (data: DashboardData) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  fetchDashboardData: (userId: string) => Promise<void>; // Placeholder
}

export type DashboardStore = DashboardState & DashboardActions;

const initialState: DashboardState = {
  dashboardData: null,
  isLoading: false,
  error: null,
};

export const useDashboardStore = create<DashboardStore>()(
  (set) => ({
    ...initialState,
    setDashboardData: (data) => set({ dashboardData: data, isLoading: false, error: null }),
    setLoading: (loading) => set({ isLoading: loading }),
    setError: (error) => set({ error: error, isLoading: false }),
    fetchDashboardData: async (userId: string) => {
      set({ isLoading: true, error: null });
      // Placeholder: In a real app, this would call a service to fetch data.
      // For now, let's simulate a delay and set some mock data.
      console.log(`Conceptual: Fetching dashboard data for userId: ${userId}`);
      await new Promise(resolve => setTimeout(resolve, 1000));
      try {
        // const dataFromService = await DashboardService.fetchData(userId);
        const mockData: DashboardData = {
          dayStreak: 0, // Default to 0 for now
          overallPerformance: 'Coming Soon',
          ranking: 'View Rank',
          testResultsSummary: 'Quiz Scores',
        };
        set({ dashboardData: mockData, isLoading: false });
      } catch (e: any) {
        set({ error: e.message || 'Failed to load dashboard data.', isLoading: false });
      }
    },
  })
);
