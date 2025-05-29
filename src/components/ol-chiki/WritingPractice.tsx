'use client';

import { useState, useEffect, useMemo, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { olChikiCharacters } from '@/lib/ol-chiki-data';
import { RefreshCw, ChevronLeft, ChevronRight, Lightbulb, CheckCircle } from 'lucide-react';

// Sample English sentences for users to translate and type in Ol Chiki
// For a 10-question quiz, we'll select from these or a larger pool.
const allSampleEnglishSentences = [
  "What is your name?",
  "Learn Ol Chiki Script",
  "This is a house",
  "Wake up in the morning",
  "The dog is barking",
  "I am reading a book",
  "My village is beautiful",
  "Water is life",
  "The sun rises in the east",
  "Eat your food slowly"
];

const QUIZ_LENGTH = 10;

interface WritingPracticeQuizProps {
  level: string; // e.g., "Basic"
  onQuizComplete: () => void; // Callback when quiz is finished
}

export default function WritingPracticeQuiz({ level, onQuizComplete }: WritingPracticeQuizProps) {
  const [quizSentences, setQuizSentences] = useState<string[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [typedOlChiki, setTypedOlChiki] = useState('');
  const [englishTransliteration, setEnglishTransliteration] = useState('');
  const [isKeyboardVisible, setIsKeyboardVisible] = useState(true); // Start with keyboard visible
  // Future state: [userAnswers, setUserAnswers] = useState<string[]>([]);
  // Future state: [score, setScore] = useState(0);
  // Future state: [isQuizFinished, setIsQuizFinished] = useState(false);


  // Initialize quiz sentences (can be expanded based on level later)
  useEffect(() => {
    // Shuffle and pick QUIZ_LENGTH sentences
    const shuffled = [...allSampleEnglishSentences].sort(() => 0.5 - Math.random());
    setQuizSentences(shuffled.slice(0, QUIZ_LENGTH));
    setCurrentQuestionIndex(0);
    setTypedOlChiki('');
  }, [level]);


  const olChikiToEngMap = useMemo(() => {
    const map = new Map<string, string>();
    olChikiCharacters.forEach(char => {
      if (!map.has(char.olChiki) || char.transliteration.length < (map.get(char.olChiki)?.length ?? Infinity)) {
        map.set(char.olChiki, char.transliteration);
      }
    });
    // Add common punctuation/symbols that pass through
    map.set(' ', ' ');
    map.set('?', '?');
    map.set('!', '!');
    map.set('᱾', '.'); 
    return map;
  }, []);

  useEffect(() => {
    let transliterationResult = '';
    for (let i = 0; i < typedOlChiki.length; i++) {
      const char = typedOlChiki[i];
      transliterationResult += (olChikiToEngMap.get(char) || char); // Keep unknown chars
       if (char !== ' ' && i < typedOlChiki.length -1 && typedOlChiki[i+1] !== ' ' && olChikiToEngMap.has(char) && olChikiToEngMap.has(typedOlChiki[i+1])) {
         // Add space between transliterated Ol Chiki units, but not for regular chars or trailing space
         if (olChikiToEngMap.get(char) !== ' ' && olChikiToEngMap.get(typedOlChiki[i+1]) !== ' ') {
            transliterationResult += ' ';
         }
      }
    }
    setEnglishTransliteration(transliterationResult.trim().replace(/ +/g, ' '));
  }, [typedOlChiki, olChikiToEngMap]);

  const handleCharacterInput = useCallback((char: string) => {
    setTypedOlChiki(prev => prev + char);
  }, []);

  const handleBackspace = useCallback(() => {
    setTypedOlChiki(prev => prev.slice(0, -1));
  }, []);

  const handleSpace = useCallback(() => {
    setTypedOlChiki(prev => prev + ' ');
  }, []);

  const nextQuestion = useCallback(() => {
    if (currentQuestionIndex < quizSentences.length - 1) {
      // Here, you would typically save/evaluate the current answer
      // For now, just move to next question
      setCurrentQuestionIndex(prev => prev + 1);
      setTypedOlChiki(''); 
    } else {
      // Last question - potentially trigger quiz finish
      console.log("Quiz finished (placeholder)");
      onQuizComplete(); // Navigate back
    }
  }, [currentQuestionIndex, quizSentences.length, onQuizComplete]);

  const prevQuestion = useCallback(() => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1);
      setTypedOlChiki(''); // Or load previously typed answer for this question
    }
  }, [currentQuestionIndex]);
  
  const clearInput = useCallback(() => {
    setTypedOlChiki('');
  }, []);

  const keyboardRows = useMemo(() => [
    olChikiCharacters.slice(0, 10),
    olChikiCharacters.slice(10, 20),
    olChikiCharacters.slice(20, 30),
  ], []);

  if (quizSentences.length === 0) {
    return <div className="p-4 text-center">Loading quiz...</div>;
  }

  return (
    <div className="p-2 sm:p-4 md:p-6 max-w-3xl mx-auto flex flex-col space-y-3 sm:space-y-4">
      <h2 className="text-2xl sm:text-3xl font-bold text-primary tracking-tight text-center">
        {level} Level Writing Quiz
      </h2>
      <CardDescription className="text-center text-muted-foreground -mt-2 mb-2">
        Question {currentQuestionIndex + 1} of {quizSentences.length}. Translate the English sentence into Ol Chiki.
      </CardDescription>

      <Card className="shadow-md">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-base sm:text-lg text-primary">English Sentence to Translate:</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-md sm:text-lg font-sans text-center p-2 sm:p-3 bg-secondary/20 rounded-md min-h-[3em] select-text">
            {quizSentences[currentQuestionIndex]}
          </p>
        </CardContent>
      </Card>

      <Card className="shadow-md">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-base sm:text-lg text-primary">Your Ol Chiki Typing:</CardTitle>
          <Button onClick={clearInput} variant="outline" size="sm">
            <RefreshCw className="mr-2 h-3 w-3 sm:h-4 sm:w-4" /> Clear
          </Button>
        </CardHeader>
        <CardContent
          className="text-xl sm:text-2xl font-mono p-2 sm:p-4 border border-input rounded-md min-h-[80px] sm:min-h-[100px] focus:outline-none focus:ring-2 focus:ring-primary cursor-text bg-background"
          onClick={() => setIsKeyboardVisible(true)}
          tabIndex={0} 
          aria-label="Ol Chiki typing area, click to show virtual keyboard"
        >
          {typedOlChiki || <span className="text-muted-foreground text-sm sm:text-base">Click here and use virtual keyboard...</span>}
        </CardContent>
      </Card>

      {isKeyboardVisible && (
        <Card className="mt-2 p-2 sm:p-3 shadow-lg sticky bottom-16 md:bottom-auto bg-card border-2 border-primary/50 z-20">
          <div className="flex justify-between items-center mb-1 sm:mb-2">
            <CardTitle className="text-center text-sm sm:text-md text-primary">Ol Chiki Virtual Keyboard</CardTitle>
            <Button variant="ghost" size="sm" onClick={() => setIsKeyboardVisible(false)} className="text-muted-foreground hover:text-primary text-xs sm:text-sm">Hide</Button>
          </div>
          <div className="space-y-1">
            {keyboardRows.map((row, rowIndex) => (
              <div key={rowIndex} className="flex justify-center space-x-0.5 sm:space-x-1">
                {row.map(charData => (
                  <Button
                    key={charData.id}
                    variant="outline"
                    className="p-1 text-sm sm:text-base font-mono flex-1 min-w-[24px] sm:min-w-[32px] h-8 sm:h-10 hover:bg-primary/10 active:bg-primary/20"
                    onClick={() => handleCharacterInput(charData.olChiki)}
                    title={charData.transliteration}
                  >
                    {charData.olChiki}
                  </Button>
                ))}
              </div>
            ))}
            <div className="flex justify-center space-x-1 sm:space-x-2 pt-1">
              <Button variant="default" className="flex-grow-[3] p-1.5 sm:p-2 text-xs sm:text-sm h-8 sm:h-10" onClick={handleSpace}>Space</Button>
              <Button variant="destructive" className="flex-grow-[2] p-1.5 sm:p-2 text-xs sm:text-sm h-8 sm:h-10" onClick={handleBackspace}>Backspace</Button>
            </div>
          </div>
        </Card>
      )}

      {typedOlChiki && (
         <Card className="mt-2 shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm sm:text-base text-accent">Your Input (English Transliteration):</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs sm:text-sm p-2 sm:p-3 bg-secondary/10 rounded-md text-center min-h-[2em] select-text">
              {englishTransliteration || <span className="text-muted-foreground">Transliteration will appear here...</span>}
            </p>
          </CardContent>
        </Card>
      )}
       <div className="flex justify-between items-center mt-4">
        <Button onClick={prevQuestion} variant="outline" disabled={currentQuestionIndex === 0}>
          <ChevronLeft className="mr-2 h-4 w-4" /> Previous
        </Button>
        {currentQuestionIndex < quizSentences.length - 1 ? (
          <Button onClick={nextQuestion} variant="default">
            Next Question <ChevronRight className="ml-2 h-4 w-4" />
          </Button>
        ) : (
          <Button onClick={onQuizComplete}  className="bg-green-600 hover:bg-green-700 text-white">
            Finish Quiz <CheckCircle className="ml-2 h-4 w-4" />
          </Button>
        )}
      </div>
       <div className="h-16"></div> {/* Spacer for bottom nav */}
    </div>
  );
}