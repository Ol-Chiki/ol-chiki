
'use client';

import type { LucideIcon } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Speaker, Image as ImageIcon, Text, BookOpenText, FileQuestion, ArrowRight, Lock, SpellCheck } from 'lucide-react';
import type { ActiveView } from '@/app/page';
import { useToast } from '@/hooks/use-toast';

interface ReadingPracticeHubProps {
  onLevelSelect: (viewId: ActiveView) => void;
}

interface LevelItem {
  id: string; 
  viewId: ActiveView; 
  title: string;
  description: string;
  icon: LucideIcon;
  isAvailable: boolean;
}

const readingLevels: LevelItem[] = [
  {
    id: 'reading-basic-identify-words',
    viewId: 'reading-quiz-selection-hub', 
    title: 'Basic: Identify Words',
    description: 'Select one of 50 quiz sets. Each set has 10 questions to identify Ol Chiki words.',
    icon: SpellCheck,
    isAvailable: true
  },
  {
    id: 'reading-easy-match-word-image',
    viewId: 'reading-easy-selection-hub', 
    title: 'Easy: Match Words to Pictures',
    description: 'Match simple Ol Chiki words with their visual representations across 50 quiz sets.',
    icon: ImageIcon,
    isAvailable: true // Mark as available to test navigation
  },
  {
    id: 'reading-intermediate-phrases',
    viewId: 'reading-intermediate-selection-hub', 
    title: 'Intermediate: Read Short Phrases',
    description: 'Practice reading and understanding common Ol Chiki phrases via 50 quiz sets.',
    icon: Text,
    isAvailable: true // Mark as available
  },
  {
    id: 'reading-hard-story',
    viewId: 'reading-hard-selection-hub', 
    title: 'Hard: Story Comprehension',
    description: 'Read short stories in Ol Chiki and answer comprehension questions. 50 sets available.',
    icon: BookOpenText,
    isAvailable: true // Mark as available
  },
  {
    id: 'reading-expert-mcq',
    viewId: 'reading-expert-selection-hub', 
    title: 'Expert: MCQ Translation Quiz',
    description: 'Translate English sentences by choosing the correct Ol Chiki option. 50 sets available.',
    icon: FileQuestion,
    isAvailable: true // Mark as available
  },
];

export default function ReadingPracticeHub({ onLevelSelect }: ReadingPracticeHubProps) {
  const { toast } = useToast();

  const handleLevelClick = (level: LevelItem) => {
    if (level.isAvailable) {
      onLevelSelect(level.viewId);
    } else {
      toast({ title: "Coming Soon!", description: `The "${level.title}" level is under development.` });
    }
  };

  return (
    <div className="p-4 md:p-6">
      <h2 className="text-3xl font-bold mb-8 text-primary tracking-tight text-center">
        Reading Practice Levels
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {readingLevels.map((level) => (
          <Card
            key={level.id}
            className={`shadow-lg transition-all duration-300 group bg-card flex flex-col overflow-hidden rounded-xl border-2
                        ${level.isAvailable ? 'hover:shadow-2xl cursor-pointer hover:border-primary/50' : 'opacity-60 cursor-not-allowed bg-muted/50'}`}
            onClick={() => handleLevelClick(level)}
            aria-disabled={!level.isAvailable}
          >
            <CardHeader className="p-5 bg-primary/5 group-hover:bg-primary/10 transition-colors">
              <div className="flex items-center space-x-3">
                <div className={`p-2.5 rounded-full ${level.isAvailable ? 'bg-primary text-primary-foreground' : 'bg-muted-foreground/30 text-muted-foreground'}`}>
                  <level.icon className="h-7 w-7" />
                </div>
                <div>
                  <CardTitle className={`text-xl ${level.isAvailable ? 'text-accent group-hover:text-primary' : 'text-muted-foreground'} transition-colors`}>{level.title}</CardTitle>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-5 flex-grow">
              <CardDescription className={`text-sm ${level.isAvailable ? 'text-foreground/80' : 'text-muted-foreground/80'} mb-3`}>
                {level.description}
              </CardDescription>
            </CardContent>
            <div className="p-5 pt-0 mt-auto">
              {level.isAvailable ? (
                <Button variant="outline" className="w-full group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                    Start Level <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              ) : (
                <Button variant="outline" disabled className="w-full">
                    Coming Soon <Lock className="ml-2 h-4 w-4" />
                </Button>
              )}
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}

    