
'use client';

import React, { useState, useEffect, useCallback } from 'react'; 
import type { GameLevel } from '@/types/ol-chiki';
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { StarRating } from '@/components/ui/star-rating';
import TranscriptionChallenge from '@/components/ol-chiki/games/transcription-challenge';
import { useAuth } from '@/contexts/supabase-auth-context'; // Updated import
import { 
  Type, ListChecks, Lock, Play, ChevronDown, Puzzle, FilePenLine, CaseUpper,
  AudioLines, AudioWaveform, Shuffle, ALargeSmall, Milestone, CheckSquare, SquarePen,
  SearchSlash, Keyboard, TextSelect, Pipette, Eraser, Gauge, Timer,
  MessageSquareText, BookText, Gamepad2
} from 'lucide-react'; 

const initialGameLevelsData: Omit<GameLevel, 'stars'>[] = [
  {
    id: 'transcribe-chars',
    title: 'Character Transcription',
    description: 'Test your knowledge of Ol Chiki character transliterations.',
    icon: Type,
    isLocked: false,
    questionCount: 10, 
    gameComponentIdentifier: 'TranscriptionChallengeChars',
  },
  {
    id: 'transcribe-numbers',
    title: 'Number Transcription',
    description: 'Transcribe Ol Chiki numbers to their English transliterations.',
    icon: ListChecks,
    isLocked: false, 
    questionCount: 10,
    gameComponentIdentifier: 'TranscriptionChallengeNumbers',
  },
  {
    id: 'word-matching',
    title: 'Word Matching',
    description: 'Match Ol Chiki words with their English translations.',
    icon: Puzzle,
    isLocked: true, 
    questionCount: 15,
    gameComponentIdentifier: 'WordMatchingGame',
  },
  {
    id: 'guess-letter',
    title: 'Guess the Letter',
    description: 'A letter is missing from a word, can you guess it?',
    icon: CaseUpper,
    isLocked: true, 
    questionCount: 12,
    gameComponentIdentifier: 'GuessTheLetterGame',
  },
  {
    id: 'sentence-scramble',
    title: 'Sentence Scramble',
    description: 'Unscramble Ol Chiki words to form a correct sentence.',
    icon: FilePenLine,
    isLocked: true, 
    questionCount: 10,
    gameComponentIdentifier: 'SentenceScrambleGame',
  },
  {
    id: 'char-sound-match',
    title: 'Character Sound Match',
    description: 'Match Ol Chiki characters to their sounds.',
    icon: AudioLines,
    isLocked: true,
    questionCount: 15,
    gameComponentIdentifier: 'CharacterSoundMatch',
  },
  {
    id: 'number-sound-match',
    title: 'Number Sound Match',
    description: 'Match Ol Chiki numbers to their spoken names.',
    icon: AudioWaveform,
    isLocked: true,
    questionCount: 15,
    gameComponentIdentifier: 'NumberSoundMatch',
  },
  {
    id: 'word-scramble-olchiki',
    title: 'Ol Chiki Word Scramble',
    description: 'Unscramble letters to form Ol Chiki words.',
    icon: Shuffle,
    isLocked: true,
    questionCount: 10,
    gameComponentIdentifier: 'WordScrambleOlChiki',
  },
  {
    id: 'form-word-from-letters',
    title: 'Form Word from Letters',
    description: 'Use given Ol Chiki letters to make a valid word.',
    icon: ALargeSmall,
    isLocked: true,
    questionCount: 10,
    gameComponentIdentifier: 'FormWordFromLetters',
  },
  {
    id: 'form-sentence-from-words',
    title: 'Form Sentence from Words',
    description: 'Arrange Ol Chiki words to form a correct sentence.',
    icon: Milestone,
    isLocked: true,
    questionCount: 8,
    gameComponentIdentifier: 'FormSentenceFromWords',
  },
  {
    id: 'select-correct-transliteration-mcq',
    title: 'Select Transliteration (MCQ)',
    description: 'Choose the correct English transliteration for an Ol Chiki character.',
    icon: CheckSquare,
    isLocked: true,
    questionCount: 20,
    gameComponentIdentifier: 'SelectCorrectTransliterationMCQ',
  },
  {
    id: 'select-correct-olchiki-mcq',
    title: 'Select Ol Chiki (MCQ)',
    description: 'Choose the correct Ol Chiki character for an English transliteration.',
    icon: SquarePen,
    isLocked: true,
    questionCount: 20,
    gameComponentIdentifier: 'SelectCorrectOlChikiMCQ',
  },
  {
    id: 'find-the-imposter-char',
    title: 'Find The Imposter Character',
    description: 'Identify the Ol Chiki character that doesn\'t belong in a set.',
    icon: SearchSlash,
    isLocked: true,
    questionCount: 10,
    gameComponentIdentifier: 'FindTheImposterChar',
  },
  {
    id: 'type-english-word-from-olchiki',
    title: 'Type English Word (from Ol Chiki)',
    description: 'See an Ol Chiki word, type its English translation.',
    icon: Keyboard,
    isLocked: true,
    questionCount: 15,
    gameComponentIdentifier: 'TypeEnglishWordFromOlChiki',
  },
  {
    id: 'type-olchiki-word-from-english',
    title: 'Type Ol Chiki Word (from English)',
    description: 'See an English word, type its Ol Chiki translation.',
    icon: Keyboard, 
    isLocked: true,
    questionCount: 15,
    gameComponentIdentifier: 'TypeOlChikiWordFromEnglish',
  },
  {
    id: 'sentence-translation-match-game',
    title: 'Sentence Translation Match',
    description: 'Match Ol Chiki sentences to their English translations.',
    icon: TextSelect,
    isLocked: true,
    questionCount: 10,
    gameComponentIdentifier: 'SentenceTranslationMatchGame',
  },
  {
    id: 'fill-blank-char-in-word',
    title: 'Fill Blank: Character in Word',
    description: 'Complete an Ol Chiki word by filling in the missing character.',
    icon: Pipette,
    isLocked: true,
    questionCount: 15,
    gameComponentIdentifier: 'FillBlankCharInWord',
  },
  {
    id: 'fill-blank-word-in-sentence',
    title: 'Fill Blank: Word in Sentence',
    description: 'Complete an Ol Chiki sentence by filling in the missing word.',
    icon: Eraser,
    isLocked: true,
    questionCount: 10,
    gameComponentIdentifier: 'FillBlankWordInSentence',
  },
  {
    id: 'speed-transcribe-chars-timed',
    title: 'Speed Transcribe Characters (Timed)',
    description: 'Transcribe as many characters as you can in a limited time.',
    icon: Gauge,
    isLocked: true,
    questionCount: 25, 
    gameComponentIdentifier: 'SpeedTranscribeCharsTimed',
  },
  {
    id: 'speed-match-words-timed',
    title: 'Speed Match Words (Timed)',
    description: 'Quickly match Ol Chiki words to their English translations.',
    icon: Timer,
    isLocked: true,
    questionCount: 20, 
    gameComponentIdentifier: 'SpeedMatchWordsTimed',
  },
  {
    id: 'dialogue-completion-game',
    title: 'Dialogue Completion',
    description: 'Complete short Ol Chiki dialogues.',
    icon: MessageSquareText,
    isLocked: true,
    questionCount: 8,
    gameComponentIdentifier: 'DialogueCompletionGame',
  },
  {
    id: 'story-comprehension-quiz-game',
    title: 'Story Comprehension Quiz',
    description: 'Read a short Ol Chiki story and answer questions.',
    icon: BookText,
    isLocked: true,
    questionCount: 5, 
    gameComponentIdentifier: 'StoryComprehensionQuizGame',
  },
];

const getLocalStorageKey = (userId: string | undefined | null) => {
  return userId ? `olChikiGameLevels_${userId}` : 'olChikiGameLevels_anonymous';
};

const GameHub = React.memo(function GameHub() {
  const { user } = useAuth(); 
  const [levels, setLevels] = useState<GameLevel[]>(() => 
    initialGameLevelsData.map(level => ({...level, stars: 0}))
  );
  const [activeGameLevelId, setActiveGameLevelId] = useState<string | null>(null);
  const [localStorageKey, setLocalStorageKey] = useState<string>(getLocalStorageKey(user?.id));

  useEffect(() => {
    setLocalStorageKey(getLocalStorageKey(user?.id)); // Use user.id from Supabase
  }, [user]);

  useEffect(() => {
    const storedLevelsData = localStorage.getItem(localStorageKey);
    let newLevelsState: GameLevel[];

    if (storedLevelsData) {
      try {
        const storedStarsArray: Array<{ id: string; stars: number }> = JSON.parse(storedLevelsData);
        newLevelsState = initialGameLevelsData.map(initialLevel => {
          const storedLevelProgress = storedStarsArray.find(s => s.id === initialLevel.id);
          return {
            ...initialLevel, 
            stars: storedLevelProgress ? storedLevelProgress.stars : 0,
          };
        });
      } catch (error) {
        console.error("Failed to parse game levels from localStorage for key:", localStorageKey, error);
        newLevelsState = initialGameLevelsData.map(level => ({ ...level, stars: 0 }));
      }
    } else {
      newLevelsState = initialGameLevelsData.map(level => ({ ...level, stars: 0 }));
    }
    setLevels(newLevelsState);
  }, [localStorageKey]);


  const handleGameStart = (levelId: string) => {
    const levelToStart = levels.find(l => l.id === levelId);
    if (levelToStart && !levelToStart.isLocked) {
      setActiveGameLevelId(levelId);
    }
  };

  const handleGameComplete = useCallback((levelId: string, earnedStars: number) => {
    let newLevelsState: GameLevel[] = [];
    setLevels(prevLevels => {
      newLevelsState = prevLevels.map(level =>
        level.id === levelId
          ? { ...level, stars: Math.max(level.stars, earnedStars) } 
          : level
      );
      try {
        const levelsToStore = newLevelsState.map(l => ({ id: l.id, stars: l.stars }));
        localStorage.setItem(localStorageKey, JSON.stringify(levelsToStore));
      } catch (error) {
        console.error("Failed to save game levels to localStorage for key:", localStorageKey, error);
      }
      return newLevelsState;
    });
    setActiveGameLevelId(null); 
  }, [localStorageKey]); 

  const handleExitGame = () => {
    setActiveGameLevelId(null);
  };

  const activeGame = levels.find(level => level.id === activeGameLevelId);

  const implementedGameIdentifiers = ['TranscriptionChallengeChars', 'TranscriptionChallengeNumbers'];

  if (activeGame) {
    if (activeGame.gameComponentIdentifier === 'TranscriptionChallengeChars') {
      return (
        <TranscriptionChallenge
          level={activeGame}
          onGameComplete={(stars) => handleGameComplete(activeGame.id, stars)}
          onExit={handleExitGame}
          challengeType="characters"
        />
      );
    } else if (activeGame.gameComponentIdentifier === 'TranscriptionChallengeNumbers') {
       return (
        <TranscriptionChallenge
          level={activeGame}
          onGameComplete={(stars) => handleGameComplete(activeGame.id, stars)}
          onExit={handleExitGame}
          challengeType="numbers"
        />
      );
    } else if (!implementedGameIdentifiers.includes(activeGame.gameComponentIdentifier) && !activeGame.isLocked) {
      return (
        <div className="p-4 md:p-6 text-center flex flex-col items-center justify-center min-h-[calc(100vh-200px)]">
          <Gamepad2 className="w-16 h-16 text-primary mb-4" />
          <h3 className="text-2xl font-bold mb-4 text-primary">{activeGame.title}</h3>
          <p className="text-muted-foreground mb-6">This game is under construction. Check back soon!</p>
          <img data-ai-hint="construction worker" src="https://placehold.co/300x200.png" alt="Under Construction" className="mx-auto mb-6 rounded shadow-md" />
          <Button onClick={handleExitGame} variant="outline">Back to Game Hub</Button>
        </div>
      );
    }
    return (
      <div className="p-4 md:p-6 text-center">
        <h3 className="text-2xl font-bold mb-4 text-destructive">Error</h3>
        <p className="text-muted-foreground mb-6">Game component for "{activeGame.title}" not found or game is locked.</p>
        <Button onClick={handleExitGame} variant="outline">Back to Game Hub</Button>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-6">
      <h2 className="text-3xl font-bold mb-4 text-primary tracking-tight text-center">Game Zone Path</h2>
      <p className="text-muted-foreground mb-10 text-center">Follow the winding path to test your Ol Chiki skills!</p>
      
      <div className="w-full max-w-2xl mx-auto">
        {levels.map((level, index) => (
          <React.Fragment key={level.id}>
            <div className={`flex w-full py-2.5 ${index % 2 === 0 ? 'justify-start' : 'sm:justify-end justify-center'}`}>
              {index % 2 !== 0 && <div className="w-1/4 flex-shrink-0 hidden sm:block"></div>}
              
              <Card 
                className={`w-full sm:w-3/4 shadow-lg transition-shadow duration-300 
                            ${level.isLocked ? 'opacity-70 cursor-not-allowed bg-card' : 'hover:shadow-xl cursor-pointer bg-card'}`}
                onClick={() => !level.isLocked && handleGameStart(level.id)}
                aria-disabled={level.isLocked}
                tabIndex={level.isLocked ? -1 : 0}
              >
                <CardHeader className="flex flex-row items-center justify-between p-3 sm:p-4 space-x-2 sm:space-x-3">
                  <div className="flex items-center space-x-2 sm:space-x-3.5 min-w-0"> 
                    <div className={`p-2 sm:p-2.5 rounded-full ${level.isLocked ? 'bg-muted' : 'bg-primary/10'}`}>
                       <level.icon className={`h-7 w-7 sm:h-8 sm:w-8 md:h-9 md:w-9 ${level.isLocked ? 'text-muted-foreground' : 'text-primary'}`} />
                    </div>
                    <div className="min-w-0 flex-grow"> 
                      <CardTitle className="text-base sm:text-lg font-semibold text-accent leading-tight truncate">{level.title}</CardTitle>
                      <CardDescription className="text-xs text-muted-foreground mt-0.5 truncate">{level.description}</CardDescription>
                      {!level.isLocked && <StarRating rating={level.stars} size={16} className="mt-1"/>}
                      {level.isLocked && <p className="text-xs text-muted-foreground mt-1">Locked</p>}
                    </div>
                  </div>
                  
                  <div className="flex-shrink-0">
                    {!level.isLocked && (
                      <Button 
                        variant="default" 
                        size="icon" 
                        className="h-8 w-8 sm:h-9 sm:w-9 p-0 rounded-full shadow-md"
                        onClick={(e) => { e.stopPropagation(); !level.isLocked && handleGameStart(level.id); }}
                        aria-label={`Play ${level.title}`}
                      >
                        <Play className="h-4 w-4 sm:h-5 sm:w-5" />
                      </Button>
                    )}
                    {level.isLocked && (
                      <Lock className="h-6 w-6 sm:h-7 sm:w-7 text-muted-foreground" />
                    )}
                  </div>
                </CardHeader>
              </Card>
              
              {index % 2 === 0 && <div className="w-1/4 flex-shrink-0 hidden sm:block"></div>}
            </div>

            {index < levels.length - 1 && (
               <div className={`flex h-10 sm:h-14 w-full items-center justify-center`}>
                 <ChevronDown className="h-8 w-8 sm:h-10 sm:w-10 text-primary/40" />
              </div>
            )}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
});
GameHub.displayName = 'GameHub';
export default GameHub;
