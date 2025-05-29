
'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { StarRating } from '@/components/ui/star-rating';
import { ArrowRight, Edit3, ArrowLeft, Construction } from 'lucide-react';
import { useAuth } from '@/contexts/supabase-auth-context'; // Updated import
import { useState, useEffect, useCallback } from 'react';

interface WritingEasySelectionHubProps {
  onSelectQuiz: (quizNumber: number) => void;
  onBack: () => void;
}

interface QuizScoreData {
  score: number;
  totalQuestions: number;
  stars: number;
}

const TOTAL_QUIZZES = 50;
const WRITING_QUIZ_SCORES_STORAGE_KEY_PREFIX_BASE = 'olChikiWritingQuizScores_Easy_'; 

export default function WritingEasySelectionHub({ onSelectQuiz, onBack }: WritingEasySelectionHubProps) {
  const { user } = useAuth();
  const [quizScores, setQuizScores] = useState<Record<number, QuizScoreData>>({});

   const getStorageKeyForSet = useCallback((quizSetNumber: number) => {
    const userId = user?.id || 'anonymous'; // Use user.id from Supabase
    return `${WRITING_QUIZ_SCORES_STORAGE_KEY_PREFIX_BASE}${userId}_set${quizSetNumber}`;
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
          console.error(`Error loading easy writing quiz score for set ${i} from localStorage:`, error);
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
          Easy Writing: Select Set
        </h2>
        <Button variant="outline" onClick={onBack}>
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to Writing Levels
        </Button>
      </div>
      <Card className="shadow-lg my-6">
        <CardHeader>
          <CardTitle className="text-xl text-primary text-center">Under Construction</CardTitle>
        </CardHeader>
        <CardContent className="text-center space-y-4 py-8">
          <Construction className="h-16 w-16 text-primary mx-auto mb-3" />
          <p className="text-md text-muted-foreground">
            This "Easy Writing" quiz level selection is being built.
          </p>
          <img data-ai-hint="construction worker writing" src="https://placehold.co/300x150.png" alt="Under Construction" className="mx-auto rounded-md shadow-md my-3" />
        </CardContent>
      </Card>
      <ScrollArea className="h-[calc(100vh-450px)] pr-3 opacity-50 pointer-events-none">
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-4">
          {quizNumbers.map((num) => {
            const scoreData = quizScores[num];
            return (
              <Card
                key={num}
                className="shadow-md hover:shadow-lg transition-shadow duration-200 cursor-pointer group bg-card hover:border-primary/50 border-2 border-transparent flex flex-col justify-between"
                onClick={() => onSelectQuiz(num)}
                aria-disabled="true"
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
