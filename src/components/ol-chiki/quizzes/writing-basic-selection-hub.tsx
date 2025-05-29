
'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { StarRating } from '@/components/ui/star-rating';
import { ArrowRight, Edit3, ArrowLeft } from 'lucide-react'; 
import { useAuth } from '@/contexts/supabase-auth-context'; // Updated import
import { useState, useEffect, useCallback } from 'react';

interface WritingBasicSelectionHubProps {
  onSelectQuiz: (quizNumber: number) => void;
  onBack: () => void;
}

interface QuizScoreData {
  score: number;
  totalQuestions: number;
  stars: number;
}

const TOTAL_QUIZZES = 50;
const WRITING_QUIZ_BASIC_SCORES_STORAGE_KEY_PREFIX_BASE = 'olChikiWritingQuizScores_Basic_';


export default function WritingBasicSelectionHub({ onSelectQuiz, onBack }: WritingBasicSelectionHubProps) {
  const { user } = useAuth();
  const [quizScores, setQuizScores] = useState<Record<number, QuizScoreData>>({});

  const getStorageKeyForSet = useCallback((quizSetNumber: number) => {
    const userId = user?.id || 'anonymous'; // Use user.id from Supabase
    return `${WRITING_QUIZ_BASIC_SCORES_STORAGE_KEY_PREFIX_BASE}${userId}_set${quizSetNumber}`;
  }, [user]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const loadedScores: Record<number, QuizScoreData> = {};
      for (let i = 1; i <= TOTAL_QUIZZES; i++) {
        const storageKey = getStorageKeyForSet(i);
        try {
          const storedScore = localStorage.getItem(storageKey);
          if (storedScore) {
            loadedScores[i] = JSON.parse(storedScore);
          }
        } catch (error) {
          console.error(`Error loading basic writing quiz score for set ${i} from localStorage:`, error);
        }
      }
      setQuizScores(loadedScores);
    }
  }, [user, getStorageKeyForSet]);

  const quizNumbers = Array.from({ length: TOTAL_QUIZZES }, (_, i) => i + 1);

  return (
    <div className="p-4 md:p-6 max-w-3xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl sm:text-3xl font-bold text-primary tracking-tight">
          Basic Writing: Select Set
        </h2>
        <Button variant="outline" onClick={onBack}>
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to Writing Levels
        </Button>
      </div>
      <ScrollArea className="h-[calc(100vh-250px)] pr-3">
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-4">
          {quizNumbers.map((num) => {
            const scoreData = quizScores[num];
            return (
              <Card
                key={num}
                className="shadow-md hover:shadow-lg transition-shadow duration-200 cursor-pointer group bg-card hover:border-primary/50 border-2 border-transparent flex flex-col justify-between"
                onClick={() => onSelectQuiz(num)}
              >
                <CardHeader className="p-3 text-center items-center group-hover:bg-primary/5 transition-colors">
                  <Edit3 className="h-8 w-8 text-primary group-hover:scale-110 transition-transform" />
                </CardHeader>
                <CardContent className="p-3 pt-1 text-center flex-grow flex flex-col items-center justify-center">
                  <p className="text-sm sm:text-base font-semibold text-accent group-hover:text-primary transition-colors">
                    Quiz Set {num}
                  </p>
                  {scoreData && (
                    <div className="mt-1.5">
                      <StarRating rating={scoreData.stars} size={14} />
                      <p className="text-xs text-muted-foreground">
                        {scoreData.score}/{scoreData.totalQuestions}
                      </p>
                    </div>
                  )}
                </CardContent>
                <div className="p-3 pt-0 text-center text-xs text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity">
                  Start Quiz <ArrowRight className="inline h-3 w-3" />
                </div>
              </Card>
            );
          })}
        </div>
      </ScrollArea>
    </div>
  );
}
