
'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import { categorizedOlChikiWords, shuffleArray, type OlChikiWord } from '@/lib/ol-chiki-data';
import { useAuth } from '@/contexts/supabase-auth-context'; // Updated import

const QUIZ_LENGTH = 10;
const NUM_OPTIONS = 4;
const READING_QUIZ_SCORES_STORAGE_KEY_PREFIX = 'olChikiReadingQuizScores_';

interface QuizQuestion {
  olChikiWord: OlChikiWord;
  options: string[]; // English word options
  correctEnglish: string;
}

export function useReadingIdentifyWordsQuiz(quizSetNumber: number | null, onQuizActuallyComplete: () => void) {
  const { user } = useAuth();
  const [allWords, setAllWords] = useState<OlChikiWord[]>([]);
  const [quizQuestions, setQuizQuestions] = useState<QuizQuestion[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [isAnswerSubmitted, setIsAnswerSubmitted] = useState(false);
  const [quizPhase, setQuizPhase] = useState<'loading' | 'playing' | 'finished'>('loading');

  useEffect(() => {
    const flattenedWords = Object.values(categorizedOlChikiWords).flat();
    if (flattenedWords.length < NUM_OPTIONS) {
      console.error("Not enough unique words available to create the reading quiz.");
      setAllWords([]);
      setQuizPhase('finished'); 
      return;
    }
    setAllWords(shuffleArray(flattenedWords));
  }, []);

  const generateQuizQuestions = useCallback(() => {
    if (allWords.length === 0 || quizSetNumber === null) {
       if(allWords.length > 0 && quizSetNumber !== null) setQuizPhase('playing'); 
      return;
    }
    setQuizPhase('loading');

    const offset = (quizSetNumber -1) % Math.max(1, (allWords.length - QUIZ_LENGTH +1)); 
    const wordsForThisSet = shuffleArray([...allWords]); 
    let selectedQuizWords = wordsForThisSet.slice(offset, offset + QUIZ_LENGTH);
    
    if (selectedQuizWords.length < QUIZ_LENGTH && selectedQuizWords.length > 0) {
        const needed = QUIZ_LENGTH - selectedQuizWords.length;
        selectedQuizWords.push(...wordsForThisSet.slice(0, needed));
    }

    if (selectedQuizWords.length === 0 && allWords.length > 0) {
        selectedQuizWords.push(...allWords.slice(0, QUIZ_LENGTH));
    }
     if (selectedQuizWords.length === 0) {
        setQuizPhase('finished'); 
        return;
    }

    const newQuestions = selectedQuizWords.map(correctWord => {
      const distractors: string[] = [];
      const availableDistractors = allWords.filter(w => w.id !== correctWord.id && w.english.toLowerCase() !== correctWord.english.toLowerCase());
      const shuffledDistractors = shuffleArray(availableDistractors);

      for (let i = 0; i < NUM_OPTIONS - 1 && i < shuffledDistractors.length; i++) {
        distractors.push(shuffledDistractors[i].english);
      }
      let placeholderCounter = 0;
      while (distractors.length < NUM_OPTIONS - 1) {
        const placeholderOption = `Placeholder Option ${++placeholderCounter}`;
        if (!distractors.includes(placeholderOption) && correctWord.english !== placeholderOption) {
          distractors.push(placeholderOption);
        } else {
          distractors.push(`Alt Placeholder ${Math.random().toString(36).substring(7)}`);
        }
      }

      const options = shuffleArray([correctWord.english, ...distractors]);
      return {
        olChikiWord: correctWord,
        options: options,
        correctEnglish: correctWord.english,
      };
    });

    setQuizQuestions(newQuestions);
    setCurrentQuestionIndex(0);
    setScore(0);
    setSelectedAnswer(null);
    setIsAnswerSubmitted(false);
    setQuizPhase('playing');
  }, [allWords, quizSetNumber]);

  useEffect(() => {
    if (allWords.length > 0 && quizSetNumber !== null) {
      generateQuizQuestions();
    }
  }, [allWords, quizSetNumber, generateQuizQuestions]);

  const handleAnswerSelect = useCallback((option: string) => {
    if (isAnswerSubmitted) return;
    setSelectedAnswer(option);
  }, [isAnswerSubmitted]);

  const handleSubmitAnswer = useCallback(() => {
    if (!selectedAnswer || isAnswerSubmitted || quizQuestions.length === 0) return;

    setIsAnswerSubmitted(true);
    const currentQuestion = quizQuestions[currentQuestionIndex];
    if (selectedAnswer === currentQuestion.correctEnglish) {
      setScore(prevScore => prevScore + 1);
    }
  }, [selectedAnswer, isAnswerSubmitted, quizQuestions, currentQuestionIndex]);

  const handleNextQuestion = useCallback(() => {
    if (currentQuestionIndex < quizQuestions.length - 1) {
      setCurrentQuestionIndex(prevIndex => prevIndex + 1);
      setSelectedAnswer(null);
      setIsAnswerSubmitted(false);
    } else {
      setQuizPhase('finished');
      if (quizSetNumber !== null && quizQuestions.length > 0) {
        const userId = user?.id || 'anonymous'; // Use user.id from Supabase
        const storageKey = `${READING_QUIZ_SCORES_STORAGE_KEY_PREFIX}${userId}`;
        const finalStars = Math.round((score / quizQuestions.length) * 5);
        
        try {
            const allScores = JSON.parse(localStorage.getItem(storageKey) || '{}');
            allScores[quizSetNumber] = { 
              score: score, 
              totalQuestions: quizQuestions.length,
              stars: finalStars 
            };
            localStorage.setItem(storageKey, JSON.stringify(allScores));
        } catch (error) {
            console.error("Error saving reading quiz score to localStorage:", error);
        }
      }
    }
  }, [currentQuestionIndex, quizQuestions.length, score, quizSetNumber, user]);

  const currentQuestion = useMemo(() => {
    if (quizQuestions.length > 0 && currentQuestionIndex < quizQuestions.length) {
      return quizQuestions[currentQuestionIndex];
    }
    return null;
  }, [quizQuestions, currentQuestionIndex]);

  const progress = useMemo(() => {
    if (quizQuestions.length > 0) {
      return ((currentQuestionIndex + 1) / quizQuestions.length) * 100;
    }
    return 0;
  }, [currentQuestionIndex, quizQuestions.length]);

  const finalStars = useMemo(() => {
     if (quizQuestions.length > 0) {
        return Math.round((score / quizQuestions.length) * 5);
     }
     return 0;
  }, [score, quizQuestions.length]);

  return {
    quizPhase,
    currentQuestion,
    currentQuestionIndex,
    quizQuestions,
    score,
    selectedAnswer,
    isAnswerSubmitted,
    progress,
    finalStars,
    handleAnswerSelect,
    handleSubmitAnswer,
    handleNextQuestion,
    generateNewQuizSet: generateQuizQuestions, 
    onQuizComplete: onQuizActuallyComplete, 
  };
}
