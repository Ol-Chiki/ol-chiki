
import type { LucideIcon } from 'lucide-react';
import type { AllStores } from './stores'; // Updated import path if needed

// Re-defining ActiveView for the new architecture
export type ActiveView =
  | 'splash'        // Initial screen
  | 'loading'       // Generic loading state for async operations
  | 'auth'          // Authentication page /auth
  | 'profile'       // Profile page /profile
  | 'error'         // Generic error display view
  | 'basic-hub'
  | 'alphabet'
  | 'numbers'
  | 'words'
  | 'sentence'      // Santad AI / Sentence Practice
  | 'practice-hub'
  // Reading
  | 'reading-practice-hub'
  | 'reading-quiz-selection-hub'
  | 'reading-quiz-identify-words'
  | 'reading-easy-selection-hub'
  | 'reading-easy-match-word-image-quiz'
  | 'reading-intermediate-selection-hub'
  | 'reading-intermediate-phrases-quiz'
  | 'reading-hard-selection-hub'
  | 'reading-hard-story-quiz'
  | 'reading-expert-selection-hub'
  | 'reading-expert-mcq-quiz'
  // Writing
  | 'writing-practice-hub'
  | 'writing-basic-selection-hub'
  | 'writing-quiz-basic'
  | 'writing-easy-selection-hub'
  | 'writing-quiz-easy'
  | 'writing-intermediate-selection-hub'
  | 'writing-quiz-intermediate'
  | 'writing-medium-selection-hub'
  | 'writing-quiz-medium'
  | 'writing-hard-selection-hub'
  | 'writing-quiz-hard'
  | 'writing-expert-selection-hub'
  | 'writing-quiz-expert'
  | 'game';

export interface NavItemConfig {
  id: string; // Should map to an ActiveView for main sections
  label: string;
  icon: LucideIcon;
  action: (stores: AllStores) => void;
  isActive?: (activeView: ActiveView, stores: AllStores) => boolean; // activeView from navigationStore
  isVisible?: (stores: AllStores) => boolean;
}

// For component registry
export interface ComponentConfig {
  component: () => Promise<{ default: React.ComponentType<any> }>; // For React.lazy
  preload?: boolean; // For future use with more advanced preloading
  storeActions?: (stores: AllStores, params?: any) => void; // Actions to dispatch on load/mount
  fallback?: React.ComponentType<any>; // Specific fallback for this component
  requiresAuth?: boolean; // If true, AuthGuard will protect it
}
