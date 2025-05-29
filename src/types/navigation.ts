
import type { LucideIcon } from 'lucide-react';
import type { AllStores } from './stores'; // Will be created

// Re-defining ActiveView based on current app structure and future needs
export type ActiveView =
  | 'splash' // New implicit view for splash screen
  | 'auth' // For the /auth page
  | 'basic-hub'
  | 'alphabet'
  | 'numbers'
  | 'words'
  | 'sentence' // Santad AI / Sentence Practice
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
  | 'game'
  | 'profile' // For the /profile page
  | 'loading' // Generic loading view
  | 'error'; // Generic error view

export interface NavItemConfig {
  id: string; // Could be an ActiveView or a special action like 'logout'
  label: string;
  icon: LucideIcon;
  action: (stores: AllStores) => void; // Action to dispatch or navigation to trigger
  isActive?: (activeView: ActiveView, stores: AllStores) => boolean;
  isVisible?: (stores: AllStores) => boolean;
}

// For component registry
export interface ComponentConfig {
  component: () => Promise<{ default: React.ComponentType<any> }>; // Allow any props for now
  preload?: boolean;
  storeActions?: (stores: AllStores, params?: any) => void; // Actions to call on load
  fallback?: React.ComponentType;
}
