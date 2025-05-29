
'use client';

import { useState, useEffect, useCallback } from 'react';
import { olChikiCharacters, shuffleArray } from '@/lib/ol-chiki-data';
import type { OlChikiCharacter } from '@/types/ol-chiki';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { RefreshCw, CheckCircle, XCircle, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';

const QUIZ_SIZE = 5; // Number of pairs per round

interface QuizItem {
  id: string;
  value: string; // Ol Chiki char or transliteration
  type: 'olChiki' | 'transliteration';
  originalId: string; // To match pairs
  selected: boolean;
  matched: boolean;
  feedback: 'correct' | 'incorrect' | null;
}

export default function CharacterQuiz() {
  const [quizItems, setQuizItems] = useState<QuizItem[]>([]);
  const [selectedOlChiki, setSelectedOlChiki] = useState<QuizItem | null>(null);
  const [selectedTransliteration, setSelectedTransliteration] = useState<QuizItem | null>(null);
  const [score, setScore] = useState(0);
  const [matchedPairs, setMatchedPairs] = useState(0);
  const [isChecking, setIsChecking] = useState(false);

  const setupQuiz = useCallback(() => {
    const shuffledChars = shuffleArray(olChikiCharacters).slice(0, QUIZ_SIZE);
    const olChikiSide: QuizItem[] = shuffleArray(
      shuffledChars.map(char => ({
        id: `oc-${char.id}`,
        value: char.olChiki,
        type: 'olChiki',
        originalId: char.id,
        selected: false,
        matched: false,
        feedback: null,
      }))
    );
    const transliterationSide: QuizItem[] = shuffleArray(
      shuffledChars.map(char => ({
        id: `tr-${char.id}`,
        value: char.transliteration,
        type: 'transliteration',
        originalId: char.id,
        selected: false,
        matched: false,
        feedback: null,
      }))
    );
    setQuizItems([...olChikiSide, ...transliterationSide]);
    setSelectedOlChiki(null);
    setSelectedTransliteration(null);
    setScore(0);
    setMatchedPairs(0);
    setIsChecking(false);
  }, []);

  useEffect(() => {
    setupQuiz();
  }, [setupQuiz]);

  const handleItemClick = (item: QuizItem) => {
    if (isChecking || item.matched || item.selected) return;

    setQuizItems(prev => prev.map(i => i.id === item.id ? { ...i, selected: true, feedback: null } : i));

    if (item.type === 'olChiki') {
      setSelectedOlChiki(item);
      if (selectedOlChiki) { // Deselect previous if any
         setQuizItems(prev => prev.map(i => i.id === selectedOlChiki.id ? { ...i, selected: false } : i));
      }
    } else {
      setSelectedTransliteration(item);
       if (selectedTransliteration) { // Deselect previous if any
         setQuizItems(prev => prev.map(i => i.id === selectedTransliteration.id ? { ...i, selected: false } : i));
      }
    }
  };

  useEffect(() => {
    if (selectedOlChiki && selectedTransliteration) {
      setIsChecking(true);
      const isMatch = selectedOlChiki.originalId === selectedTransliteration.originalId;

      if (isMatch) {
        setScore(s => s + 1);
        setMatchedPairs(mp => mp + 1);
        setQuizItems(prev =>
          prev.map(i =>
            i.id === selectedOlChiki.id || i.id === selectedTransliteration.id
              ? { ...i, matched: true, selected: false, feedback: 'correct' }
              : i
          )
        );
        setSelectedOlChiki(null);
        setSelectedTransliteration(null);
        setIsChecking(false);
      } else {
        setQuizItems(prev =>
          prev.map(i =>
            i.id === selectedOlChiki.id || i.id === selectedTransliteration.id
              ? { ...i, selected: true, feedback: 'incorrect' } // Keep selected true to show feedback
              : i
          )
        );
        setTimeout(() => {
          setQuizItems(prev =>
            prev.map(i =>
              i.id === selectedOlChiki.id || i.id === selectedTransliteration.id
                ? { ...i, selected: false, feedback: null } // Reset selection and feedback
                : i
            )
          );
          setSelectedOlChiki(null);
          setSelectedTransliteration(null);
          setIsChecking(false);
        }, 1000);
      }
    }
  }, [selectedOlChiki, selectedTransliteration]);

  const olChikiItems = quizItems.filter(item => item.type === 'olChiki');
  const transliterationItems = quizItems.filter(item => item.type === 'transliteration');

  if (quizItems.length === 0) {
    return <div className="p-4 text-center">Loading quiz...</div>;
  }

  if (matchedPairs === QUIZ_SIZE) {
    return (
      <div className="p-4 md:p-6 text-center flex flex-col items-center justify-center min-h-[calc(100vh-200px)]">
        <Sparkles className="w-16 h-16 text-primary mb-4" />
        <h2 className="text-3xl font-bold mb-4 text-primary">Round Complete!</h2>
        <p className="text-xl mb-6 text-foreground">Your score: {score} / {QUIZ_SIZE}</p>
        <p className="text-sm text-muted-foreground mb-6">
          Quiz results contribute to your overall ranking! (Leaderboard coming soon)
        </p>
        <Button onClick={setupQuiz} size="lg">
          <RefreshCw className="mr-2 h-5 w-5" />
          Play Again
        </Button>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-6">
      <h2 className="text-3xl font-bold mb-2 text-primary tracking-tight">Character Matching Quiz</h2>
      <p className="text-muted-foreground mb-6">Match the Ol Chiki characters with their English transliterations. Current Score: {score}</p>

      <div className="grid grid-cols-2 gap-4 md:gap-8 items-start">
        <div className="space-y-3">
          <h3 className="text-xl font-semibold text-center text-accent">Ol Chiki Characters</h3>
          {olChikiItems.map(item => (
            <Card
              key={item.id}
              onClick={() => handleItemClick(item)}
              className={cn(
                "p-4 text-center cursor-pointer transition-all duration-300 ease-in-out transform hover:scale-105",
                item.selected && !item.matched && "ring-2 ring-primary shadow-lg scale-105",
                item.matched && "bg-green-100 dark:bg-green-900 border-green-500 opacity-60 cursor-default",
                item.feedback === 'correct' && "border-green-500 animate-pulse",
                item.feedback === 'incorrect' && "border-red-500 animate-shake",
                selectedOlChiki?.id === item.id && "bg-primary/10"
              )}
            >
              <CardContent className="p-0">
                <span className="text-4xl font-mono">{item.value}</span>
                {item.feedback === 'correct' && <CheckCircle className="inline-block ml-2 h-6 w-6 text-green-500" />}
                {item.feedback === 'incorrect' && <XCircle className="inline-block ml-2 h-6 w-6 text-red-500" />}
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="space-y-3">
          <h3 className="text-xl font-semibold text-center text-accent">Transliterations</h3>
          {transliterationItems.map(item => (
            <Card
              key={item.id}
              onClick={() => handleItemClick(item)}
              className={cn(
                "p-4 text-center cursor-pointer transition-all duration-300 ease-in-out transform hover:scale-105",
                item.selected && !item.matched && "ring-2 ring-primary shadow-lg scale-105",
                item.matched && "bg-green-100 dark:bg-green-900 border-green-500 opacity-60 cursor-default",
                item.feedback === 'correct' && "border-green-500 animate-pulse",
                item.feedback === 'incorrect' && "border-red-500 animate-shake",
                selectedTransliteration?.id === item.id && "bg-primary/10"
              )}
            >
              <CardContent className="p-0">
                <span className="text-2xl">{item.value}</span>
                 {item.feedback === 'correct' && <CheckCircle className="inline-block ml-2 h-6 w-6 text-green-500" />}
                {item.feedback === 'incorrect' && <XCircle className="inline-block ml-2 h-6 w-6 text-red-500" />}
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
      <div className="mt-8 text-center">
        <Button onClick={setupQuiz} variant="outline">
          <RefreshCw className="mr-2 h-4 w-4" />
          Reset Quiz
        </Button>
      </div>
    </div>
  );
}
