
import React from 'react';
import type { ActiveView, ComponentConfig } from '@/types/navigation';
import LoadingSpinner from '@/components/ui/LoadingSpinner';

// Define simple components for error display using React.createElement to avoid JSX parsing issues in .ts file
const ErrorDisplayComponent = () => {
  return React.createElement(
    'div',
    { className: "flex items-center justify-center h-full text-destructive p-4 text-center" },
    'An unexpected error occurred. Please try again later.'
  );
};

const ErrorLoadingFallbackComponent = () => {
  return React.createElement(
    'div',
    { className: "flex items-center justify-center h-full text-muted-foreground p-4 text-center" },
    'Loading error view...'
  );
};

// Helper for dynamic imports
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
  loading: { component: async () => ({ default: LoadingSpinner }), fallback: LoadingSpinner },
  auth: dynamicImport(() => import('@/app/auth/page')), // Assuming /auth is a page component
  profile: dynamicImport(() => import('@/app/profile/page')), // Assuming /profile is a page component

  // Basic Learning Hub and its children
  'basic-hub': dynamicImport(() => import('@/components/ol-chiki/BasicLearningHub')), // Ensure PascalCase if filename is so
  alphabet: dynamicImport(() => import('@/components/ol-chiki/LearnAlphabet')),
  numbers: dynamicImport(() => import('@/components/ol-chiki/LearnNumbers')),
  words: dynamicImport(() => import('@/components/ol-chiki/LearnWords')),

  // Santad AI / Sentence Practice
  sentence: dynamicImport(() => import('@/components/ol-chiki/SentencePractice')),

  // Practice Hub and its children
  'practice-hub': dynamicImport(() => import('@/components/ol-chiki/PracticeHub')),

  // Reading Practice Hub and its children
  'reading-practice-hub': dynamicImport(() => import('@/components/ol-chiki/ReadingPracticeHub')),
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
  'writing-practice-hub': dynamicImport(() => import('@/components/ol-chiki/WritingPracticeHub')),
  'writing-basic-selection-hub': dynamicImport(() => import('@/components/ol-chiki/quizzes/writing-basic-selection-hub')),
  'writing-quiz-basic': dynamicImport(() => import('@/components/ol-chiki/WritingPracticeQuiz')), // Corrected PascalCase
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
  game: dynamicImport(() => import('@/components/ol-chiki/GameHub')), // Ensure PascalCase if filename is so

  // Error view
  error: {
    component: async () => ({ default: ErrorDisplayComponent }),
    fallback: ErrorLoadingFallbackComponent,
  },
};
