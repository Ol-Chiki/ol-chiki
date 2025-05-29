
'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { StarRating } from '@/components/ui/star-rating';
import { Loader2, CheckCircle, XCircle, ArrowRight, RefreshCw } from 'lucide-react';
import { useReadingIdentifyWordsQuiz } from '@/hooks/use-reading-identify-words-quiz';

interface ReadingQuizIdentifyWordsProps {
  quizSetNumber: number | null;
  onQuizComplete: () => void;
}

const ReadingQuizIdentifyWords: React.FC<ReadingQuizIdentifyWordsProps> = React.memo(({ quizSetNumber, onQuizComplete: onQuizActuallyComplete }) => {
  const {
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
    generateNewQuizSet,
  } = useReadingIdentifyWordsQuiz(quizSetNumber, onQuizActuallyComplete);

  if (quizSetNumber === null) {
    return (
      <div className="p-4 md:p-6 flex flex-col items-center justify-center min-h-[calc(100vh-250px)]">
        <p className="text-destructive">Error: Quiz set number not provided.</p>
        <Button onClick={onQuizActuallyComplete} className="mt-4">Back to Quiz Selection</Button>
      </div>
    );
  }
  
  if (quizPhase === 'loading' || (quizPhase === 'playing' && !currentQuestion && quizQuestions.length === 0)) {
    return (
      <div className="p-4 md:p-6 flex flex-col items-center justify-center min-h-[calc(100vh-250px)]">
        <Loader2 className="h-12 w-12 text-primary animate-spin mb-4" />
        <p className="text-muted-foreground">Loading quiz questions for Set {quizSetNumber}...</p>
      </div>
    );
  }

  if (quizPhase === 'finished') {
    return (
      <div className="p-4 md:p-6 max-w-md mx-auto text-center">
        <Card className="shadow-xl">
          <CardHeader>
            <CardTitle className="text-3xl font-bold text-primary">Quiz Set {quizSetNumber} Complete!</CardTitle>
            <p className="text-sm text-muted-foreground">Basic: Identify Words</p>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-xl font-semibold">Your Score: {score} / {quizQuestions.length}</p>
            <StarRating rating={finalStars} size={32} className="justify-center" />
            <p className="text-sm text-muted-foreground mt-2">
              Practice makes perfect! Your scores contribute to your overall progress.
            </p>
          </CardContent>
          <CardFooter className="flex flex-col space-y-3 sm:flex-row sm:space-y-0 sm:space-x-3">
            <Button onClick={generateNewQuizSet} variant="outline" className="w-full sm:w-auto">
              <RefreshCw className="mr-2 h-4 w-4" /> Play New Set
            </Button>
            <Button onClick={onQuizActuallyComplete} className="w-full sm:w-auto">
              Back to Quiz Selection <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </CardFooter>
        </Card>
      </div>
    );
  }

  if (!currentQuestion) {
    return (
      <div className="p-4 md:p-6 flex flex-col items-center justify-center min-h-[calc(100vh-250px)]">
        <Loader2 className="h-12 w-12 text-primary animate-spin mb-4" />
        <p className="text-muted-foreground">Preparing quiz...</p>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-6 max-w-2xl mx-auto">
      <h2 className="text-2xl sm:text-3xl font-bold text-primary tracking-tight text-center mb-1">
        Quiz Set {quizSetNumber}
      </h2>
      <p className="text-sm text-center text-muted-foreground mb-4">Basic: Identify Words</p>
      <Card className="shadow-lg">
        <CardHeader>
          <div className="flex justify-between items-center mb-2">
            <CardTitle className="text-lg text-primary">Question {currentQuestionIndex + 1} of {quizQuestions.length}</CardTitle>
            <p className="text-sm text-muted-foreground">Score: {score}</p>
          </div>
          <Progress value={progress} className="w-full h-2" />
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="text-center my-6">
            <p className="text-sm text-muted-foreground mb-2">What is the English meaning of this Ol Chiki word?</p>
            <p className="text-5xl sm:text-6xl font-mono text-accent py-4 bg-secondary/20 rounded-md select-none">
              {currentQuestion.olChikiWord.olChiki}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
            {currentQuestion.options.map((option, index) => (
              <Button
                key={index}
                variant={selectedAnswer === option ? "default" : "outline"}
                className={`p-4 h-auto text-base sm:text-lg justify-center transition-all duration-200
                  ${isAnswerSubmitted && option === currentQuestion.correctEnglish ? 'bg-green-500 hover:bg-green-600 text-white border-green-500' : ''}
                  ${isAnswerSubmitted && selectedAnswer === option && option !== currentQuestion.correctEnglish ? 'bg-red-500 hover:bg-red-600 text-white border-red-500' : ''}
                  ${isAnswerSubmitted && option !== currentQuestion.correctEnglish && selectedAnswer !== option ? 'opacity-70' : ''}
                `}
                onClick={() => handleAnswerSelect(option)}
                disabled={isAnswerSubmitted}
              >
                {option}
              </Button>
            ))}
          </div>

          {isAnswerSubmitted && (
            <div className={`mt-4 p-3 rounded-md text-center font-semibold
              ${selectedAnswer === currentQuestion.correctEnglish ? 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300' : 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300'}`}
            >
              {selectedAnswer === currentQuestion.correctEnglish
                ? <><CheckCircle className="inline mr-2 h-5 w-5" />Correct!</>
                : <><XCircle className="inline mr-2 h-5 w-5" />Incorrect! The correct answer was: {currentQuestion.correctEnglish}</>}
            </div>
          )}
        </CardContent>
        <CardFooter className="flex justify-end mt-4">
          {!isAnswerSubmitted ? (
            <Button onClick={handleSubmitAnswer} disabled={!selectedAnswer} className="min-w-[120px]">
              Submit
            </Button>
          ) : (
            <Button onClick={handleNextQuestion} className="min-w-[120px]">
              {currentQuestionIndex < quizQuestions.length - 1 ? 'Next Question' : 'Finish Quiz'}
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          )}
        </CardFooter>
      </Card>
    </div>
  );
});
ReadingQuizIdentifyWords.displayName = 'ReadingQuizIdentifyWords';
export default ReadingQuizIdentifyWords;
