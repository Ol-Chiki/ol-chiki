
'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useAuth, type SupabaseUser } from '@/contexts/supabase-auth-context'; // Updated import
import { useRouter } from 'next/navigation';
import dynamic from 'next/dynamic';
import type { LucideIcon } from 'lucide-react';
import { GraduationCap, Sparkles, ClipboardEdit, Gamepad2, Loader2 } from "lucide-react";

import SplashScreen from '@/components/splash-screen';
import BottomNavigation from '@/components/layout/bottom-navigation';
import ErrorBoundary from '@/components/error-boundary'; 
import { useAppNavigation } from '@/hooks/use-app-navigation'; 

const BasicLearningHub = dynamic(() => import('@/components/ol-chiki/basic-learning-hub'), { loading: () => <AppLoadingSpinner /> });
const LearnAlphabet = dynamic(() => import('@/components/ol-chiki/learn-alphabet'), { loading: () => <AppLoadingSpinner /> });
const LearnNumbers = dynamic(() => import('@/components/ol-chiki/learn-numbers'), { loading: () => <AppLoadingSpinner /> });
const LearnWords = dynamic(() => import('@/components/ol-chiki/learn-words'), { loading: () => <AppLoadingSpinner /> });
const SentencePractice = dynamic(() => import('@/components/ol-chiki/sentence-practice'), { loading: () => <AppLoadingSpinner /> });
const GameHub = dynamic(() => import('@/components/ol-chiki/game-hub'), { loading: () => <AppLoadingSpinner /> });
const PracticeHub = dynamic(() => import('@/components/ol-chiki/practice-hub'), { loading: () => <AppLoadingSpinner /> });

const ReadingPracticeHub = dynamic(() => import('@/components/ol-chiki/reading-practice-hub'), { loading: () => <AppLoadingSpinner /> });
const ReadingQuizSelectionHub = dynamic(() => import('@/components/ol-chiki/quizzes/reading-quiz-selection-hub'), { loading: () => <AppLoadingSpinner /> });
const ReadingQuizIdentifyWords = dynamic(() => import('@/components/ol-chiki/quizzes/reading-quiz-identify-words'), { loading: () => <AppLoadingSpinner /> });
const ReadingEasySelectionHub = dynamic(() => import('@/components/ol-chiki/quizzes/reading-easy-selection-hub'), { loading: () => <AppLoadingSpinner /> });
const ReadingEasyMatchWordImageQuiz = dynamic(() => import('@/components/ol-chiki/quizzes/reading-easy-match-word-image-quiz'), { loading: () => <AppLoadingSpinner /> });
const ReadingIntermediateSelectionHub = dynamic(() => import('@/components/ol-chiki/quizzes/reading-intermediate-selection-hub'), { loading: () => <AppLoadingSpinner /> });
const ReadingIntermediatePhrasesQuiz = dynamic(() => import('@/components/ol-chiki/quizzes/reading-intermediate-phrases-quiz'), { loading: () => <AppLoadingSpinner /> });
const ReadingHardSelectionHub = dynamic(() => import('@/components/ol-chiki/quizzes/reading-hard-selection-hub'), { loading: () => <AppLoadingSpinner /> });
const ReadingHardStoryQuiz = dynamic(() => import('@/components/ol-chiki/quizzes/reading-hard-story-quiz'), { loading: () => <AppLoadingSpinner /> });
const ReadingExpertSelectionHub = dynamic(() => import('@/components/ol-chiki/quizzes/reading-expert-selection-hub'), { loading: () => <AppLoadingSpinner /> });
const ReadingExpertMcqQuiz = dynamic(() => import('@/components/ol-chiki/quizzes/reading-expert-mcq-quiz'), { loading: () => <AppLoadingSpinner /> });

const WritingPracticeHub = dynamic(() => import('@/components/ol-chiki/writing-practice-hub'), { loading: () => <AppLoadingSpinner /> });
const WritingBasicSelectionHub = dynamic(() => import('@/components/ol-chiki/quizzes/writing-basic-selection-hub'), { loading: () => <AppLoadingSpinner /> });
const WritingPracticeQuiz = dynamic(() => import('@/components/ol-chiki/WritingPracticeQuiz'), { loading: () => <AppLoadingSpinner /> }); 
const WritingEasySelectionHub = dynamic(() => import('@/components/ol-chiki/quizzes/writing-easy-selection-hub'), { loading: () => <AppLoadingSpinner /> });
const WritingEasyQuiz = dynamic(() => import('@/components/ol-chiki/quizzes/writing-easy-quiz'), { loading: () => <AppLoadingSpinner /> });
const WritingIntermediateSelectionHub = dynamic(() => import('@/components/ol-chiki/quizzes/writing-intermediate-selection-hub'), { loading: () => <AppLoadingSpinner /> });
const WritingIntermediateQuiz = dynamic(() => import('@/components/ol-chiki/quizzes/writing-intermediate-quiz'), { loading: () => <AppLoadingSpinner /> });
const WritingMediumSelectionHub = dynamic(() => import('@/components/ol-chiki/quizzes/writing-medium-selection-hub'), { loading: () => <AppLoadingSpinner /> });
const WritingMediumQuiz = dynamic(() => import('@/components/ol-chiki/quizzes/writing-medium-quiz'), { loading: () => <AppLoadingSpinner /> });
const WritingHardSelectionHub = dynamic(() => import('@/components/ol-chiki/quizzes/writing-hard-selection-hub'), { loading: () => <AppLoadingSpinner /> });
const WritingHardQuiz = dynamic(() => import('@/components/ol-chiki/quizzes/writing-hard-quiz'), { loading: () => <AppLoadingSpinner /> });
const WritingExpertSelectionHub = dynamic(() => import('@/components/ol-chiki/quizzes/writing-expert-selection-hub'), { loading: () => <AppLoadingSpinner /> });
const WritingExpertQuiz = dynamic(() => import('@/components/ol-chiki/quizzes/writing-expert-quiz'), { loading: () => <AppLoadingSpinner /> });


export type ActiveView =
  | 'basic-hub'
  | 'alphabet'
  | 'numbers'
  | 'words'
  | 'sentence'
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

interface NavItemConfig {
  id: Exclude<ActiveView, 
    'alphabet' | 'numbers' | 'words' | 
    'reading-practice-hub' | 'writing-practice-hub' | 
    'reading-quiz-identify-words' | 'reading-quiz-selection-hub' |
    'reading-easy-selection-hub' | 'reading-easy-match-word-image-quiz' |
    'reading-intermediate-selection-hub' | 'reading-intermediate-phrases-quiz' |
    'reading-hard-selection-hub' | 'reading-hard-story-quiz' |
    'reading-expert-selection-hub' | 'reading-expert-mcq-quiz' |
    'writing-basic-selection-hub' | 'writing-quiz-basic' |
    'writing-easy-selection-hub' | 'writing-quiz-easy' |
    'writing-intermediate-selection-hub' | 'writing-quiz-intermediate' |
    'writing-medium-selection-hub' | 'writing-quiz-medium' |
    'writing-hard-selection-hub' | 'writing-quiz-hard' |
    'writing-expert-selection-hub' | 'writing-quiz-expert'
  >;
  label: string;
  icon: LucideIcon;
}

const AppLoadingSpinner = () => (
  <div className="flex min-h-[calc(100vh-200px)] flex-col items-center justify-center bg-background">
    <Loader2 className="h-12 w-12 animate-spin text-primary" />
    <p className="mt-4 text-muted-foreground">Loading section...</p>
  </div>
);


export default function OlChikiPathPage() {
  const { user, loading: authLoading, hasSkippedAuth } = useAuth(); // Using new Supabase context
  const router = useRouter();
  const { 
    activeView, 
    currentQuizSetNumber, 
    setActiveView, 
    setCurrentQuizSetNumber 
  } = useAppNavigation();

  const [isClient, setIsClient] = useState(false);
  const [splashSeenThisSession, setSplashSeenThisSession] = useState(true); 
  const [currentYear, setCurrentYear] = useState<string>('');
  
  useEffect(() => {
    setIsClient(true);
    if (typeof window !== 'undefined') {
      if (sessionStorage.getItem('splashSeenOlChiki') === 'true') {
        setSplashSeenThisSession(true);
      } else {
        setSplashSeenThisSession(false); 
      }
      setCurrentYear(new Date().getFullYear().toString());
    }
  }, []);

  const handleSplashComplete = () => {
    if (typeof window !== 'undefined') {
      sessionStorage.setItem('splashSeenOlChiki', 'true');
    }
    setSplashSeenThisSession(true);
  };

  useEffect(() => {
    if (!isClient || !splashSeenThisSession) {
      return;
    }
    // With Supabase, loading might mean session is still being fetched.
    // If not loading, no user, and not skipped => redirect.
    if (!authLoading && !user && !hasSkippedAuth) {
      router.push('/auth');
    }
  }, [isClient, splashSeenThisSession, user, authLoading, hasSkippedAuth, router]);


  if (!isClient) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-background">
        <Loader2 className="h-16 w-16 animate-spin text-primary" />
        <p className="mt-4 text-lg text-muted-foreground">Initializing...</p>
      </div>
    );
  }

  if (!splashSeenThisSession) {
    return <SplashScreen onComplete={handleSplashComplete} />;
  }

  if (authLoading && isClient) { // Still show loader if auth is resolving
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-background">
        <Loader2 className="h-16 w-16 animate-spin text-primary" />
        <p className="mt-4 text-lg text-muted-foreground">Loading authentication...</p>
      </div>
    );
  }
  
  // If not loading, and no user, and not skipped auth, and splash has been seen
  // This is the state where redirection should happen but might not if router.push is slow
  if (isClient && !authLoading && !user && !hasSkippedAuth && splashSeenThisSession) {
     return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-background">
        <Loader2 className="h-16 w-16 animate-spin text-primary" />
        <p className="mt-4 text-lg text-muted-foreground">Redirecting...</p>
      </div>
    );
  }


  const bottomNavItems: NavItemConfig[] = [
    { id: 'basic-hub', label: 'Basic', icon: GraduationCap },
    { id: 'sentence', label: 'Santad AI', icon: Sparkles },
    { id: 'practice-hub', label: 'Practice', icon: ClipboardEdit },
    { id: 'game', label: 'Game Zone', icon: Gamepad2 },
  ];

  const handleSelectQuizSet = (quizNumber: number, targetQuizView: ActiveView) => {
    setCurrentQuizSetNumber(quizNumber);
    setActiveView(targetQuizView);
  };

  const renderActiveView = () => {
    switch (activeView) {
      case 'basic-hub':
        return <BasicLearningHub onSectionSelect={setActiveView} />;
      case 'alphabet':
        return <LearnAlphabet />;
      case 'numbers':
        return <LearnNumbers />;
      case 'words':
        return <LearnWords />;
      case 'sentence':
        return <SentencePractice />;
      case 'practice-hub':
        return <PracticeHub onSectionSelect={setActiveView} />;
      // Reading Practice Flows
      case 'reading-practice-hub':
        return <ReadingPracticeHub onLevelSelect={setActiveView} />;
      case 'reading-quiz-selection-hub': 
        return <ReadingQuizSelectionHub onSelectQuiz={(num) => handleSelectQuizSet(num, 'reading-quiz-identify-words')} onBack={() => setActiveView('reading-practice-hub')} />;
      case 'reading-quiz-identify-words': 
        return <ReadingQuizIdentifyWords quizSetNumber={currentQuizSetNumber} onQuizComplete={() => setActiveView('reading-quiz-selection-hub')} />;
      case 'reading-easy-selection-hub':
        return <ReadingEasySelectionHub onSelectQuiz={(num) => handleSelectQuizSet(num, 'reading-easy-match-word-image-quiz')} onBack={() => setActiveView('reading-practice-hub')} />;
      case 'reading-easy-match-word-image-quiz':
        return <ReadingEasyMatchWordImageQuiz quizSetNumber={currentQuizSetNumber} onQuizComplete={() => setActiveView('reading-easy-selection-hub')} />;
      case 'reading-intermediate-selection-hub':
        return <ReadingIntermediateSelectionHub onSelectQuiz={(num) => handleSelectQuizSet(num, 'reading-intermediate-phrases-quiz')} onBack={() => setActiveView('reading-practice-hub')} />;
      case 'reading-intermediate-phrases-quiz':
        return <ReadingIntermediatePhrasesQuiz quizSetNumber={currentQuizSetNumber} onQuizComplete={() => setActiveView('reading-intermediate-selection-hub')} />;
      case 'reading-hard-selection-hub':
        return <ReadingHardSelectionHub onSelectQuiz={(num) => handleSelectQuizSet(num, 'reading-hard-story-quiz')} onBack={() => setActiveView('reading-practice-hub')} />;
      case 'reading-hard-story-quiz':
        return <ReadingHardStoryQuiz quizSetNumber={currentQuizSetNumber} onQuizComplete={() => setActiveView('reading-hard-selection-hub')} />;
      case 'reading-expert-selection-hub':
        return <ReadingExpertSelectionHub onSelectQuiz={(num) => handleSelectQuizSet(num, 'reading-expert-mcq-quiz')} onBack={() => setActiveView('reading-practice-hub')} />;
      case 'reading-expert-mcq-quiz':
        return <ReadingExpertMcqQuiz quizSetNumber={currentQuizSetNumber} onQuizComplete={() => setActiveView('reading-expert-selection-hub')} />;
      
      // Writing Practice Flows
      case 'writing-practice-hub':
        return <WritingPracticeHub onLevelSelect={setActiveView} />;
      case 'writing-basic-selection-hub':
        return <WritingBasicSelectionHub onSelectQuiz={(num) => handleSelectQuizSet(num, 'writing-quiz-basic')} onBack={() => setActiveView('writing-practice-hub')} />;
      case 'writing-quiz-basic':
        return <WritingPracticeQuiz quizSetNumber={currentQuizSetNumber} level="Basic" onQuizComplete={() => setActiveView('writing-basic-selection-hub')} />;
      case 'writing-easy-selection-hub':
        return <WritingEasySelectionHub onSelectQuiz={(num) => handleSelectQuizSet(num, 'writing-quiz-easy')} onBack={() => setActiveView('writing-practice-hub')} />;
      case 'writing-quiz-easy':
        return <WritingEasyQuiz quizSetNumber={currentQuizSetNumber} onQuizComplete={() => setActiveView('writing-easy-selection-hub')} />;
      case 'writing-intermediate-selection-hub':
        return <WritingIntermediateSelectionHub onSelectQuiz={(num) => handleSelectQuizSet(num, 'writing-quiz-intermediate')} onBack={() => setActiveView('writing-practice-hub')} />;
      case 'writing-quiz-intermediate':
        return <WritingIntermediateQuiz quizSetNumber={currentQuizSetNumber} onQuizComplete={() => setActiveView('writing-intermediate-selection-hub')} />;
      case 'writing-medium-selection-hub':
        return <WritingMediumSelectionHub onSelectQuiz={(num) => handleSelectQuizSet(num, 'writing-quiz-medium')} onBack={() => setActiveView('writing-practice-hub')} />;
      case 'writing-quiz-medium':
        return <WritingMediumQuiz quizSetNumber={currentQuizSetNumber} onQuizComplete={() => setActiveView('writing-medium-selection-hub')} />;
      case 'writing-hard-selection-hub':
        return <WritingHardSelectionHub onSelectQuiz={(num) => handleSelectQuizSet(num, 'writing-quiz-hard')} onBack={() => setActiveView('writing-practice-hub')} />;
      case 'writing-quiz-hard':
        return <WritingHardQuiz quizSetNumber={currentQuizSetNumber} onQuizComplete={() => setActiveView('writing-hard-selection-hub')} />;
      case 'writing-expert-selection-hub':
        return <WritingExpertSelectionHub onSelectQuiz={(num) => handleSelectQuizSet(num, 'writing-quiz-expert')} onBack={() => setActiveView('writing-practice-hub')} />;
      case 'writing-quiz-expert':
        return <WritingExpertQuiz quizSetNumber={currentQuizSetNumber} onQuizComplete={() => setActiveView('writing-expert-selection-hub')} />;

      case 'game':
        return <GameHub />;
      default:
        setActiveView('basic-hub'); // Ensure a valid default if somehow lost
        return <BasicLearningHub onSectionSelect={setActiveView} />;
    }
  };

  const handleProfileNavigation = () => {
    router.push('/profile');
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <header className="bg-primary text-primary-foreground p-4 shadow-md flex items-center justify-between sticky top-0 z-40 h-18">
        <div className="flex items-center gap-1 sm:gap-2">
          <GraduationCap className="h-6 w-6" />
          <h1 className="text-base sm:text-xl font-bold tracking-tight leading-tight">Let's Learn Ol Chiki</h1>
        </div>
        {user && (
           <div className="text-xs sm:text-sm hidden sm:block truncate max-w-[150px] sm:max-w-[250px]" title={user.email ?? undefined}>Logged in as: {user.email}</div>
        )}
      </header>

      <main className="flex-grow container mx-auto py-2 px-1 md:py-6 md:px-4 pb-20">
        <ErrorBoundary>
          <React.Suspense fallback={<AppLoadingSpinner />}>
            {renderActiveView()}
          </React.Suspense>
        </ErrorBoundary>
      </main>

      <BottomNavigation
        navItems={bottomNavItems}
        activeView={activeView}
        onNavChange={setActiveView} 
        onProfileClick={handleProfileNavigation}
        currentUser={user}
      />

      <footer className="bg-secondary text-secondary-foreground p-4 text-center text-sm mt-auto">
        <p>&copy; {currentYear} Let's Learn Ol Chiki. Learn and explore the Ol Chiki script.</p>
      </footer>
    </div>
  );
}
