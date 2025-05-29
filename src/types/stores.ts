
import type { SupabaseUser } from '@/contexts/supabase-auth-context';
import type { ActiveView } from './navigation';

// --- Navigation Store ---
export interface NavigationState {
  activeView: ActiveView;
  currentQuizSetNumber: number | null;
  navigationHistory: ActiveView[];
}
export interface NavigationActions {
  setActiveView: (view: ActiveView) => void;
  setQuizSetNumber: (number: number | null) => void;
  navigateToQuiz: (quizNumber: number, targetView: ActiveView) => void;
  goBack: () => void;
  resetNavigation: () => void;
  pushHistory: (view: ActiveView) => void; // Internal helper, exposed if needed
}
export type NavigationStore = NavigationState & NavigationActions;

// --- Auth Store ---
export interface AuthState {
  user: SupabaseUser | null;
  isLoading: boolean; // Renamed from 'loading' for clarity
  hasSkippedAuth: boolean;
  isAuthenticated: boolean; // Derived state based on user presence
}
export interface AuthActions {
  setUser: (user: SupabaseUser | null) => void; // Called by Supabase context listener
  setLoading: (loading: boolean) => void; // Called by Supabase context listener
  skipAuth: () => void; // Action when user explicitly skips
  clearSkipAuth: () => void; // When user logs in after skipping
  checkAuthStatus: () => void; // To check localStorage for skipped status on init
  // login/logout actions will be handled by the Supabase context and call setUser/setLoading
}
export type AuthStore = AuthState & AuthActions;

// --- UI Store ---
export interface UIState {
  isClient: boolean;
  splashSeenThisSession: boolean;
  currentYear: string;
  appLoadingMessage: string | null; // Global loading message e.g. "Initializing app..."
  featureLoadingStates: Record<string, boolean>; // For specific features e.g. {'quizData': true}
  globalError: string | null; // For global, non-component-specific errors
}
export interface UIActions {
  setClientReady: () => void;
  setSplashSeen: () => void;
  setCurrentYear: (year: string) => void;
  setAppLoadingMessage: (message: string | null) => void;
  setFeatureLoading: (key: string, loading: boolean) => void;
  clearAllFeatureLoading: () => void;
  setGlobalError: (error: string | null) => void;
  clearGlobalError: () => void;
}
export type UIStore = UIState & UIActions;

// --- Quiz Store ---
export interface QuizQuestionData { // Example, to be defined more specifically per quiz type
  id: string;
  questionText: string;
  options: string[];
  correctAnswer: string;
  type: 'mcq' | 'identify-word' | 'writing-prompt'; // Example types
}
export interface QuizResultData {
  score: number;
  totalQuestions: number;
  stars: number;
  timestamp: number;
  quizType: string; // e.g. 'reading-basic-identify-words'
  quizSetNumber: number | null;
}
export interface QuizState {
  currentQuizId: string | null; // e.g. 'reading-basic-identify-words_set1'
  currentQuizQuestions: QuizQuestionData[] | null;
  currentQuestionIndex: number;
  userAnswers: Record<string, any>; // Keyed by questionId
  // Store results in a way that can be keyed by a composite ID (quizType_setNumber_userId)
  // For simplicity, Zustand will persist the 'quizResults' object.
  // The keys within quizResults should be unique enough.
  quizResults: Record<string, QuizResultData>; // Key: e.g. "reading-basic-identify-words_set1"
  quizProgress: Record<string, number>; // Key: e.g. "reading-basic-identify-words_set1", value: question index or percentage
}
export interface QuizActions {
  startQuiz: (quizId: string, questions: QuizQuestionData[]) => void;
  answerQuestion: (questionId: string, answer: any) => void;
  nextQuestion: () => void;
  setQuizData: (quizId: string, data: QuizQuestionData[]) => void;
  saveQuizResult: (result: QuizResultData) => void;
  updateProgress: (quizId: string, progress: number) => void;
  resetQuizState: (quizId?: string) => void;
  loadResultsForUser: (userId: string) => void; // To load from localStorage if needed, or this store manages it
}
export type QuizStore = QuizState & QuizActions;

// --- Combined Store Type for Hooks ---
export interface AllStores {
  navigationStore: NavigationStore;
  authStore: AuthStore;
  uiStore: UIStore;
  quizStore: QuizStore;
  // Add other stores if they are created
}
