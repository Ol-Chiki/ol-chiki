
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type { QuizState, QuizActions, QuizQuestion, QuizResult } from '@/types/stores';

const initialState: QuizState = {
  currentQuizId: null,
  currentQuizData: null,
  currentQuestionIndex: 0,
  userAnswers: {},
  quizResults: {},
  quizProgress: {},
};

const getStorageKey = (base: string, userId?: string | null) => {
  return `${base}_${userId || 'anonymous'}`;
}

export const useQuizStore = create<QuizState & QuizActions>()(
  persist(
    (set, get) => ({
      ...initialState,
      startQuiz: (quizId, questions) => {
        set({
          currentQuizId: quizId,
          currentQuizData: questions,
          currentQuestionIndex: 0,
          userAnswers: {},
          appLoadingMessage: null, // from UIStore if it were combined or accessed via custom hook
        });
      },
      answerQuestion: (questionId, answer) => {
        set((state) => ({
          userAnswers: { ...state.userAnswers, [questionId]: answer },
        }));
      },
      nextQuestion: () => {
        set((state) => ({
          currentQuestionIndex: Math.min(
            state.currentQuestionIndex + 1,
            (state.currentQuizData?.length || 1) -1
          ),
        }));
      },
      setQuizData: (quizId, data) => {
        // This might be used if quiz data is fetched asynchronously
        set({ currentQuizData: data, currentQuizId: quizId });
      },
      saveQuizResult: (quizId, result) => {
        // Here, quizId should be the full identifier like "reading-basic-identify-words_set1"
        set((state) => ({
          quizResults: { ...state.quizResults, [quizId]: result },
          currentQuizId: null, // Reset current quiz after saving
          currentQuizData: null,
          currentQuestionIndex: 0,
          userAnswers: {},
        }));
        // Persist to localStorage directly (Zustand persist middleware handles the main state)
        // The key for localStorage should include userId
        // This part of the logic is more complex and typically involves getting userId from authStore
        // For simplicity in this example, we'll assume quizId already contains user context if needed
        // or it's handled by a wrapper action.
        // Example: if (typeof window !== 'undefined') {
        //   const userSpecificKey = getStorageKey(`quizResult_${quizId}`, authStore.getState().user?.id);
        //   localStorage.setItem(userSpecificKey, JSON.stringify(result));
        // }
      },
      updateProgress: (quizId, progress) => {
        set((state) => ({
          quizProgress: { ...state.quizProgress, [quizId]: progress },
        }));
      },
      resetQuizState: (quizId) => {
        if (quizId) {
          set((state) => ({
            quizResults: { ...state.quizResults, [quizId]: undefined! }, // Clearing specific result
            quizProgress: { ...state.quizProgress, [quizId]: 0 },
            // Reset current quiz if it matches
            currentQuizId: state.currentQuizId === quizId ? null : state.currentQuizId,
            currentQuizData: state.currentQuizId === quizId ? null : state.currentQuizData,
            currentQuestionIndex: state.currentQuizId === quizId ? 0 : state.currentQuestionIndex,
            userAnswers: state.currentQuizId === quizId ? {} : state.userAnswers,
          }));
        } else {
          set(initialState); // Reset all quiz states
        }
      },
      loadResultsForUser: (userId: string) => {
        // This would be more complex, iterating over known quiz types/levels
        // and constructing localStorage keys to load all relevant results.
        // For now, this is a placeholder.
        // Example: if (typeof window !== 'undefined') {
        //   const loadedResults = {};
        //   // ... logic to load from localStorage based on userId ...
        //   set({ quizResults: loadedResults });
        // }
      }
    }),
    {
      name: 'ol-chiki-quiz-storage', // General key for Zustand's own persistence of its state
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ // Persist results and progress
        quizResults: state.quizResults,
        quizProgress: state.quizProgress,
      }),
    }
  )
);

