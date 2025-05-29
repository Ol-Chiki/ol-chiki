
import type { LucideIcon } from 'lucide-react';

export interface DashboardCardConfig {
  id: string;
  title: string;
  icon: LucideIcon;
  dataField?: string; // Key to look up in a potential dashboard data object
  defaultTextLoggedIn: string;
  defaultTextLoggedOut: string;
  aiHint?: string;
}

export interface DashboardData {
  dayStreak?: number;
  overallPerformance?: string; // Could be a percentage or descriptive text
  ranking?: string; // e.g., "Top 10%" or "#5"
  testResultsSummary?: string; // e.g., "View Scores"
  [key: string]: any; // For extensibility
}
