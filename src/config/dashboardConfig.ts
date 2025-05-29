
import type { DashboardCardConfig } from '@/types/dashboard';
import { CalendarDays, TrendingUp, BarChart3, ClipboardCheck } from 'lucide-react';

export const dashboardCardsConfig: DashboardCardConfig[] = [
  {
    id: 'dayStreak',
    title: 'Day Streak',
    icon: CalendarDays,
    dataField: 'dayStreak',
    defaultTextLoggedIn: '0 Days',
    defaultTextLoggedOut: 'N/A',
    aiHint: 'user activity',
  },
  {
    id: 'overallPerformance',
    title: 'Overall Performance',
    icon: TrendingUp,
    dataField: 'overallPerformance',
    defaultTextLoggedIn: 'Coming Soon',
    defaultTextLoggedOut: 'N/A',
    aiHint: 'statistics chart',
  },
  {
    id: 'ranking',
    title: 'Ranking',
    icon: BarChart3,
    dataField: 'ranking',
    defaultTextLoggedIn: 'View Rank',
    defaultTextLoggedOut: 'N/A',
    aiHint: 'leaderboard medal',
  },
  {
    id: 'testResults',
    title: 'Test Results',
    icon: ClipboardCheck,
    dataField: 'testResultsSummary',
    defaultTextLoggedIn: 'Quiz Scores',
    defaultTextLoggedOut: 'N/A',
    aiHint: 'quiz results',
  },
];
