
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type { QuizState, QuizActions, QuizQuestionData, QuizResultData } from '@/types/stores';
import { QUIZ_RESULTS_STORAGE_KEY_PREFIX } from '@/utils/constants';

const initialState: QuizState = {
  currentQuizId: null,
  currentQuizQuestions: null,
  currentQuestionIndex: 0,
  userAnswers: {},
  quizResults: {}, // Key will be like 'reading-basic-identify-words_set1_USERID'
  quizProgress: {},
};

export const useQuizStore = create<QuizStore>()(
  persist(
    (set, get) => ({
      ...initialState,
      startQuiz: (quizId, questions) => {
        set({
          currentQuizId: quizId,
          currentQuizQuestions: questions,
          currentQuestionIndex: 0,
          userAnswers: {},
        });
      },
      answerQuestion: (questionId, answer) => {
        set((state) => ({
          userAnswers: { ...state.userAnswers, [questionId]: answer },
        }));
      },
      nextQuestion: () => {
        set((state) => {
          const currentQuestions = state.currentQuizQuestions;
          if (currentQuestions && state.currentQuestionIndex < currentQuestions.length - 1) {
            return { currentQuestionIndex: state.currentQuestionIndex + 1 };
          }
          return {}; // No change if already at the last question or no questions
        });
      },
      setQuizData: (quizId, data) => { // Could be used if questions are fetched async
        set({ currentQuizQuestions: data, currentQuizId: quizId });
      },
      saveQuizResult: (result: QuizResultData) => {
        // The result.quizId should already be user-specific if needed
        // e.g. result.quizId = `reading-basic-identify-words_set1_${userId}`
        // The quizStore itself doesn't need to know about userId here, the caller forms the quizId.
        set((state) => ({
          quizResults: { ...state.quizResults, [result.quizType + '_' + (result.quizSetNumber || 'global')]: result },
          currentQuizId: null,
          currentQuizQuestions: null,
          currentQuestionIndex: 0,
          userAnswers: {},
        }));
      },
      updateProgress: (quizId, progress) => {
        set((state) => ({
          quizProgress: { ...state.quizProgress, [quizId]: progress },
        }));
      },
      resetQuizState: (quizIdToReset?: string) => {
        if (quizIdToReset) {
          set((state) => {
            const newResults = { ...state.quizResults };
            delete newResults[quizIdToReset];
            const newProgress = { ...state.quizProgress };
            delete newProgress[quizIdToReset];
            return {
              quizResults: newResults,
              quizProgress: newProgress,
              currentQuizId: state.currentQuizId === quizIdToReset ? null : state.currentQuizId,
              currentQuizQuestions: state.currentQuizId === quizIdToReset ? null : state.currentQuizQuestions,
              currentQuestionIndex: state.currentQuizId === quizIdToReset ? 0 : state.currentQuestionIndex,
              userAnswers: state.currentQuizId === quizIdToReset ? {} : state.userAnswers,
            };
          });
        } else { // Reset all
          set({
            currentQuizId: null,
            currentQuizQuestions: null,
            currentQuestionIndex: 0,
            userAnswers: {},
            // quizResults and quizProgress are persisted, so they are not reset here unless explicitly needed.
            // If a full reset of persisted results is needed, that's a different action.
          });
        }
      },
      loadResultsForUser: (userId: string) => {
        // This is a conceptual placeholder.
        // In a real app, you might iterate through known quiz types/levels,
        // construct localStorage keys using QUIZ_RESULTS_STORAGE_KEY_PREFIX + userId + quizSpecificId,
        // and populate the quizResults state.
        // For now, the persist middleware handles loading the entire quizResults object.
        // This function can be enhanced if specific per-user loading logic from localStorage is needed
        // outside of what the persist middleware does.
      }
    }),
    {
      name: 'ol-chiki-quiz-storage-v2',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        quizResults: state.quizResults, // Persist results
        quizProgress: state.quizProgress // Persist progress
      }),
    }
  )
);
