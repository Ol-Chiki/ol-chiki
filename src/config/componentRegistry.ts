
import React from 'react'; // Ensured React is imported
import type { ActiveView, ComponentConfig } from '@/types/navigation';
import LoadingSpinner from '@/components/ui/LoadingSpinner';

// Define simple components for error display
const ErrorDisplayComponent = () => {
  return (
    <div className="flex items-center justify-center h-full text-destructive p-4 text-center">
      An unexpected error occurred. Please try again later.
    </div>
  );
};

const ErrorLoadingFallbackComponent = () => {
  return (
    <div className="flex items-center justify-center h-full text-muted-foreground p-4 text-center">
      Loading error view...
    </div>
  );
};


// Helper for dynamic imports
// The 'component' property in ComponentConfig now directly stores the loader function.
const dynamicImport = (
  loader: () => Promise<{ default: React.ComponentType<any> }>,
  fallback?: React.ComponentType<any>
): ComponentConfig => ({
  component: loader,
  fallback: fallback || LoadingSpinner,
});

export const componentRegistry: Record<ActiveView, ComponentConfig> = {
  // Core Views
  splash: dynamicImport(() => import('@/components/splash-screen')),
  loading: { component: async () => ({ default: LoadingSpinner }), fallback: LoadingSpinner }, // Generic loading view
  auth: dynamicImport(() => import('@/app/auth/page')),
  profile: dynamicImport(() => import('@/app/profile/page')),

  // Basic Learning Hub and its children
  'basic-hub': dynamicImport(() => import('@/components/ol-chiki/basic-learning-hub')),
  alphabet: dynamicImport(() => import('@/components/ol-chiki/learn-alphabet')),
  numbers: dynamicImport(() => import('@/components/ol-chiki/learn-numbers')),
  words: dynamicImport(() => import('@/components/ol-chiki/learn-words')),

  // Santad AI / Sentence Practice
  sentence: dynamicImport(() => import('@/components/ol-chiki/sentence-practice')),

  // Practice Hub and its children
  'practice-hub': dynamicImport(() => import('@/components/ol-chiki/practice-hub')),

  // Reading Practice Hub and its children
  'reading-practice-hub': dynamicImport(() => import('@/components/ol-chiki/reading-practice-hub')),
  'reading-quiz-selection-hub': dynamicImport(() => import('@/components/ol-chiki/quizzes/reading-quiz-selection-hub')),
  'reading-quiz-identify-words': dynamicImport(() => import('@/components/ol-chiki/quizzes/reading-quiz-identify-words')),
  'reading-easy-selection-hub': dynamicImport(() => import('@/components/ol-chiki/quizzes/reading-easy-selection-hub')),
  'reading-easy-match-word-image-quiz': dynamicImport(() => import('@/components/ol-chiki/quizzes/reading-easy-match-word-image-quiz')),
  'reading-intermediate-selection-hub': dynamicImport(() => import('@/components/ol-chiki/quizzes/reading-intermediate-selection-hub')),
  'reading-intermediate-phrases-quiz': dynamicImport(() => import('@/components/ol-chiki/quizzes/reading-intermediate-phrases-quiz')),
  'reading-hard-selection-hub': dynamicImport(() => import('@/components/ol-chiki/quizzes/reading-hard-selection-hub')),
  'reading-hard-story-quiz': dynamicImport(() => import('@/components/ol-chiki/quizzes/reading-hard-story-quiz')),
  'reading-expert-selection-hub': dynamicImport(() => import('@/components/ol-chiki/quizzes/reading-expert-selection-hub')),
  'reading-expert-mcq-quiz': dynamicImport(() => import('@/components/ol-chiki/quizzes/reading-expert-mcq-quiz')),

  // Writing Practice Hub and its children
  'writing-practice-hub': dynamicImport(() => import('@/components/ol-chiki/writing-practice-hub')),
  'writing-basic-selection-hub': dynamicImport(() => import('@/components/ol-chiki/quizzes/writing-basic-selection-hub')),
  'writing-quiz-basic': dynamicImport(() => import('@/components/ol-chiki/WritingPracticeQuiz')),
  'writing-easy-selection-hub': dynamicImport(() => import('@/components/ol-chiki/quizzes/writing-easy-selection-hub')),
  'writing-quiz-easy': dynamicImport(() => import('@/components/ol-chiki/quizzes/writing-easy-quiz')),
  'writing-intermediate-selection-hub': dynamicImport(() => import('@/components/ol-chiki/quizzes/writing-intermediate-selection-hub')),
  'writing-quiz-intermediate': dynamicImport(() => import('@/components/ol-chiki/quizzes/writing-intermediate-quiz')),
  'writing-medium-selection-hub': dynamicImport(() => import('@/components/ol-chiki/quizzes/writing-medium-selection-hub')),
  'writing-quiz-medium': dynamicImport(() => import('@/components/ol-chiki/quizzes/writing-medium-quiz')),
  'writing-hard-selection-hub': dynamicImport(() => import('@/components/ol-chiki/quizzes/writing-hard-selection-hub')),
  'writing-quiz-hard': dynamicImport(() => import('@/components/ol-chiki/quizzes/writing-hard-quiz')),
  'writing-expert-selection-hub': dynamicImport(() => import('@/components/ol-chiki/quizzes/writing-expert-selection-hub')),
  'writing-quiz-expert': dynamicImport(() => import('@/components/ol-chiki/quizzes/writing-expert-quiz')),

  // Game Zone
  game: dynamicImport(() => import('@/components/ol-chiki/game-hub')),

  // Error view
  error: {
    component: async () => ({ default: ErrorDisplayComponent }),
    fallback: ErrorLoadingFallbackComponent,
  },
};
