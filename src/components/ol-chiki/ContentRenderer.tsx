
'use client';

import React, { Suspense } from 'react';
import { useComponentLoader } from '@/hooks/useComponentLoader';
import ErrorBoundary from '@/components/error-boundary'; // Ensure this exists
import { useNavigationStore } from '@/stores/navigationStore';

const ContentRenderer: React.FC = () => {
  const { LoadedComponent, isLoading, error, FallbackComponent, activeView } = useComponentLoader();
  const currentQuizSetNumber = useNavigationStore((state) => state.currentQuizSetNumber);
  const setActiveView = useNavigationStore((state) => state.setActiveView); // For quiz onComplete

  if (error) {
    // This could be a more specific error display component
    return (
      <div className="p-4 text-center text-destructive">
        Error loading content: {error.message}
      </div>
    );
  }
  
  // Props that might be needed by various components
  // This can be refined based on actual component needs
  const commonProps: any = {
    // For hubs that select sections
    onSectionSelect: setActiveView,
    // For hubs that select levels
    onLevelSelect: setActiveView,
    // For quiz selection hubs
    onSelectQuiz: (quizNumber: number, targetView?: ActiveView) => {
      // targetView is used if the quiz selection needs to specify which quiz component to load
      // For now, ReadingQuizSelectionHub calls setActiveView('reading-quiz-identify-words') directly
      // This logic can be enhanced if `useAppNavigation` hook handles this better.
      // For now, we assume page.tsx or OlChikiApp.tsx passes this via a context or direct prop.
      // This ContentRenderer might not be the best place to handle `setCurrentQuizSetNumber`
      // as it's not directly involved in the navigation action for selecting a quiz set.
      // Let's assume the component loaded will use the stores directly or props from OlChikiApp.
      useNavigationStore.getState().navigateToQuiz(quizNumber, targetView || activeView); // A bit of a workaround
    },
    // For quizzes
    quizSetNumber: currentQuizSetNumber,
    onQuizComplete: () => {
      // Navigate back to the appropriate selection hub
      // This logic is tricky here and ideally handled by the quiz component or a navigation service
      if (activeView.includes('reading-quiz-identify-words')) setActiveView('reading-quiz-selection-hub');
      else if (activeView.includes('reading-easy-match-word-image-quiz')) setActiveView('reading-easy-selection-hub');
      // Add more else if for other quiz types...
      else if (activeView.includes('writing-quiz-basic')) setActiveView('writing-basic-selection-hub');
      // ... and so on for other writing quizzes
      else setActiveView('basic-hub'); // Default fallback
    },
    // For writing practice quiz
    level: activeView.startsWith('writing-quiz-') ? activeView.split('-')[2]?.toUpperCase() : undefined,

    // For back navigation from selection hubs
    onBack: () => {
        if (activeView.startsWith('reading-') && activeView.endsWith('-selection-hub')) setActiveView('reading-practice-hub');
        else if (activeView.startsWith('writing-') && activeView.endsWith('-selection-hub')) setActiveView('writing-practice-hub');
        else useNavigationStore.getState().goBack(); // General goBack
    }
  };


  // Conditionally pass props only if the component expects them
  // This is a simplified way; a more robust solution would check component prop types.
  let specificProps = {};
  if (activeView.includes('hub') || activeView.includes('selection')) {
      specificProps = { onSectionSelect: commonProps.onSectionSelect, onLevelSelect: commonProps.onLevelSelect, onSelectQuiz: commonProps.onSelectQuiz, onBack: commonProps.onBack};
  } else if (activeView.includes('quiz')) {
      specificProps = { quizSetNumber: commonProps.quizSetNumber, onQuizComplete: commonProps.onQuizComplete, level: commonProps.level };
  }


  if (LoadedComponent) {
    return (
      <ErrorBoundary>
        <Suspense fallback={<FallbackComponent />}>
          <LoadedComponent {...specificProps} />
        </Suspense>
      </ErrorBoundary>
    );
  }

  // Fallback if LoadedComponent is null (e.g., during extreme edge cases of initial load)
  return <FallbackComponent />;
};

export default React.memo(ContentRenderer);
