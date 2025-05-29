
import type { SupabaseUser } from '@/contexts/supabase-auth-context'; // Assuming this type is still relevant
import type { ActiveView } from './navigation';

export interface NavigationState {
  activeView: ActiveView;
  currentQuizSetNumber: number | null; // Changed from number to number | null
  navigationHistory: ActiveView[];
}
export interface NavigationActions {
  setActiveView: (view: ActiveView) => void;
  setQuizSetNumber: (number: number | null) => void;
  navigateToQuiz: (quizNumber: number, targetView: ActiveView) => void;
  goBack: () => void;
  resetNavigation: () => void;
  pushHistory: (view: ActiveView) => void;
}
export type NavigationStore = NavigationState & NavigationActions;

export interface AuthState {
  user: SupabaseUser | null;
  isLoading: boolean; // Renamed from 'loading' for clarity with UIStore
  hasSkippedAuth: boolean;
  isAuthenticated: boolean; // Derived state
}
export interface AuthActions {
  setUser: (user: SupabaseUser | null) => void;
  setLoading: (loading: boolean) => void;
  skipAuth: () => void;
  clearSkipAuth: () => void;
  checkAuthStatus: () => void; // Will likely interact with Supabase context
  // login/logout actions might call Supabase functions and then setUser
}
export type AuthStore = AuthState & AuthActions;


export interface UIState {
  isClient: boolean;
  splashSeenThisSession: boolean;
  currentYear: string;
  appLoadingMessage: string | null; // For global loading messages
  loadingStates: Record<string, boolean>; // For specific component/feature loading
  error: string | null; // For global errors
}
export interface UIActions {
  setClientReady: () => void;
  setSplashSeen: () => void;
  setCurrentYear: (year: string) => void;
  setAppLoading: (message: string | null) => void;
  setFeatureLoading: (key: string, loading: boolean) => void;
  clearAllLoadingStates: () => void;
  setError: (error: string | null) => void;
  clearError: () => void;
}
export type UIStore = UIState & UIActions;

export interface QuizQuestion {
  // Define a generic quiz question structure if possible, or use 'any' for now
  id: string;
  text: string;
  options?: string[];
  answer: string | number;
  type: string; // e.g., 'mcq', 'identify-word'
}

export interface QuizResult {
  score: number;
  totalQuestions: number;
  stars: number;
  timestamp: number;
}

export interface QuizState {
  // Keyed by a unique quiz identifier (e.g., `level_difficulty_setNumber`)
  currentQuizId: string | null;
  currentQuizData: QuizQuestion[] | null; // Array of questions for the current quiz
  currentQuestionIndex: number;
  userAnswers: Record<string, any>; // Keyed by questionId
  quizResults: Record<string, QuizResult>; // Keyed by quizId_setNumber
  quizProgress: Record<string, number>; // Keyed by quizId_setNumber, stores percentage or question index
}

export interface QuizActions {
  startQuiz: (quizId: string, questions: QuizQuestion[]) => void;
  answerQuestion: (questionId: string, answer: any) => void;
  nextQuestion: () => void;
  setQuizData: (quizId: string, data: QuizQuestion[]) => void; // More generic data setting
  saveQuizResult: (quizId: string, result: QuizResult) => void;
  updateProgress: (quizId: string, progress: number) => void; // Progress as percentage or question number
  resetQuizState: (quizId?: string) => void; // Reset specific or all quiz states
  loadResultsForUser: (userId: string) => void; // To load from localStorage
}
export type QuizStore = QuizState & QuizActions;

// Combined store type for hooks
export interface AllStores {
  navigationStore: NavigationStore;
  authStore: AuthStore;
  uiStore: UIStore;
  quizStore: QuizStore;
}
