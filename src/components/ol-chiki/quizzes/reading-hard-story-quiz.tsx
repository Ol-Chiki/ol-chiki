
'use client';

import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { ArrowLeft, Construction } from 'lucide-react';

interface ReadingHardStoryQuizProps {
  quizSetNumber: number | null;
  onQuizComplete: () => void;
}

export default function ReadingHardStoryQuiz({ quizSetNumber, onQuizComplete }: ReadingHardStoryQuizProps) {
 if (quizSetNumber === null) {
    return (
      <div className="p-4 md:p-6 flex flex-col items-center justify-center min-h-[calc(100vh-250px)]">
        <p className="text-destructive">Error: Quiz set number not provided.</p>
        <Button onClick={onQuizComplete} className="mt-4">Back to Quiz Selection</Button>
      </div>
    );
  }
  return (
    <div className="p-4 md:p-6 max-w-2xl mx-auto">
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="text-2xl text-primary text-center">Hard: Story Comprehension - Quiz Set {quizSetNumber}</CardTitle>
        </CardHeader>
        <CardContent className="text-center space-y-6 py-10">
          <Construction className="h-20 w-20 text-primary mx-auto mb-4" />
          <p className="text-lg text-muted-foreground">
            This quiz level ("Story Comprehension") is currently under construction.
          </p>
          <img data-ai-hint="story book" src="https://placehold.co/300x200.png" alt="Under Construction" className="mx-auto rounded-md shadow-md my-4" />
          <Button onClick={onQuizComplete} variant="outline">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Quiz Selection
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}

    