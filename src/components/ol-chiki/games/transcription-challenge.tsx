
'use client';

import { useState, useEffect, useCallback } from 'react';
import type { GameLevel, TranscriptionQuestion, OlChikiCharacter, OlChikiNumber } from '@/types/ol-chiki';
import { olChikiCharacters, olChikiNumbers, shuffleArray } from '@/lib/ol-chiki-data';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { StarRating } from '@/components/ui/star-rating';
import { Progress } from '@/components/ui/progress';
import { CheckCircle, XCircle, Award, ArrowRight, Loader2 } from 'lucide-react';

interface TranscriptionChallengeProps {
  level: GameLevel;
  onGameComplete: (scoreOutOf5: number) => void;
  onExit: () => void;
  challengeType: 'characters' | 'numbers';
}

export default function TranscriptionChallenge({ level, onGameComplete, onExit, challengeType }: TranscriptionChallengeProps) {
  const [questions, setQuestions] = useState<TranscriptionQuestion[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswer, setUserAnswer] = useState('');
  const [score, setScore] = useState(0);
  const [gamePhase, setGamePhase] = useState<'loading'| 'playing' | 'feedback' | 'finished'>('loading');
  const [feedback, setFeedback] = useState<'correct' | 'incorrect' | null>(null);

  const loadQuestions = useCallback(() => {
    setGamePhase('loading');
    let sourceData: (OlChikiCharacter | OlChikiNumber)[];
    if (challengeType === 'characters') {
      sourceData = olChikiCharacters;
    } else { // 'numbers'
      sourceData = olChikiNumbers.filter(n => n.value <= 100); // Use all numbers up to 100
    }

    const shuffledData = shuffleArray(sourceData);
    const questionCount = Math.min(level.questionCount, shuffledData.length); // Ensure we don't ask for more questions than available

    const selectedQuestions = shuffledData.slice(0, questionCount).map(item => ({
      id: item.id,
      olChiki: item.olChiki,
      correctAnswer: challengeType === 'characters' ? (item as OlChikiCharacter).transliteration.toLowerCase() : (item as OlChikiNumber).digitString.toLowerCase(),
    }));
    setQuestions(selectedQuestions);
    setGamePhase('playing');
  }, [level.questionCount, challengeType]);

  useEffect(() => {
    loadQuestions();
    setCurrentQuestionIndex(0);
    setScore(0);
    setUserAnswer('');
    setFeedback(null);
  }, [level, loadQuestions]);

  const handleSubmitAnswer = () => {
    if (!questions.length || gamePhase !== 'playing') return;

    const currentQuestion = questions[currentQuestionIndex];
    const isCorrect = userAnswer.trim().toLowerCase() === currentQuestion.correctAnswer;

    if (isCorrect) {
      setScore(s => s + 1);
      setFeedback('correct');
    } else {
      setFeedback('incorrect');
    }
    setGamePhase('feedback');

    setTimeout(() => {
      if (currentQuestionIndex < questions.length - 1) {
        setCurrentQuestionIndex(prev => prev + 1);
        setUserAnswer('');
        setFeedback(null);
        setGamePhase('playing');
      } else {
        setGamePhase('finished');
      }
    }, 1500); // Show feedback for 1.5 seconds
  };

  if (gamePhase === 'loading' || (!questions.length && gamePhase === 'playing')) {
    return (
      <div className="p-4 md:p-6 max-w-lg mx-auto flex flex-col items-center justify-center min-h-[300px]">
        <Loader2 className="h-12 w-12 text-primary animate-spin mb-4" />
        <p className="text-muted-foreground">Loading questions...</p>
      </div>
    );
  }

  if (gamePhase === 'finished') {
    const finalStars = questions.length > 0 ? Math.round((score / questions.length) * 5) : 0;
    return (
      <div className="p-4 md:p-6 max-w-md mx-auto text-center">
        <Card className="shadow-xl">
          <CardHeader>
            <CardTitle className="text-3xl font-bold text-primary">Game Over!</CardTitle>
            <CardDescription>You completed the {level.title} challenge.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Award className="h-20 w-20 text-yellow-500 mx-auto" />
            <p className="text-xl font-semibold">Your Score: {score} / {questions.length}</p>
            <StarRating rating={finalStars} size={32} className="justify-center" />
            <p className="text-xs text-muted-foreground pt-2">
              Your performance contributes to your overall ranking! (Leaderboard coming soon)
            </p>
          </CardContent>
          <CardFooter className="flex flex-col space-y-4">
            <Button onClick={() => onGameComplete(finalStars)} className="w-full">
              Continue to Game Hub
            </Button>
            <Button onClick={onExit} variant="outline" className="w-full">
              Exit Game
            </Button>
          </CardFooter>
        </Card>
      </div>
    );
  }

  const currentQuestion = questions[currentQuestionIndex];
  const progress = questions.length > 0 ? ((currentQuestionIndex +1) / questions.length) * 100 : 0;

  return (
    <div className="p-4 md:p-6 max-w-lg mx-auto">
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="text-2xl text-primary">{level.title}</CardTitle>
          <CardDescription>Question {currentQuestionIndex + 1} of {questions.length}</CardDescription>
          <Progress value={progress} className="w-full mt-2 h-2" />
        </CardHeader>
        <CardContent className="space-y-6 text-center">
          <div className="my-8">
            <p className="text-sm text-muted-foreground mb-2">Transcribe this Ol Chiki {challengeType === 'characters' ? 'character' : 'number'}:</p>
            <p className="text-6xl md:text-7xl font-mono text-accent py-4 bg-secondary/20 rounded-md">
              {currentQuestion.olChiki}
            </p>
          </div>

          {gamePhase === 'feedback' && feedback === 'correct' && (
            <div className="flex items-center justify-center p-3 rounded-md bg-green-100 dark:bg-green-900 border border-green-500 text-green-700 dark:text-green-300">
              <CheckCircle className="h-6 w-6 mr-2" /> Correct!
            </div>
          )}
          {gamePhase === 'feedback' && feedback === 'incorrect' && (
            <div className="flex items-center justify-center p-3 rounded-md bg-red-100 dark:bg-red-900 border border-red-500 text-red-700 dark:text-red-300">
              <XCircle className="h-6 w-6 mr-2" /> Incorrect. The answer was: {currentQuestion.correctAnswer}
            </div>
          )}

          <form onSubmit={(e) => { e.preventDefault(); handleSubmitAnswer(); }} className="space-y-4">
            <Input
              type="text"
              placeholder={`Enter ${challengeType === 'characters' ? 'transliteration' : 'number'}`}
              value={userAnswer}
              onChange={(e) => setUserAnswer(e.target.value)}
              className="text-center text-lg"
              disabled={gamePhase === 'feedback'}
              autoFocus
            />
            <Button type="submit" className="w-full" disabled={gamePhase === 'feedback' || userAnswer.trim() === ''}>
              Submit Answer <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </form>
        </CardContent>
        <CardFooter>
          <Button onClick={onExit} variant="link" className="mx-auto text-muted-foreground">
            Exit Game
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
