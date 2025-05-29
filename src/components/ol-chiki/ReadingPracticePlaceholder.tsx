
'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Construction } from 'lucide-react';

// This component might be deprecated or reused for specific "Coming Soon" quiz levels.
// For now, ReadingPracticeHub serves as the main placeholder for various reading levels.

export default function ReadingPracticePlaceholder() {
  return (
    <div className="p-4 md:p-6 flex flex-col items-center justify-center text-center min-h-[calc(100vh-250px)]">
      <Construction className="h-16 w-16 text-primary mb-6" />
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader>
          <CardTitle className="text-2xl text-primary">Reading Practice Level</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground text-lg">
            This specific reading practice exercise is under construction.
          </p>
          <p className="text-muted-foreground mt-2">
            Please select a level from the Reading Practice Hub. More interactive exercises will be available soon!
          </p>
           <img data-ai-hint="reading book" src="https://placehold.co/300x200.png" alt="Reading Practice Coming Soon" className="mt-6 mx-auto rounded-md shadow-md" />
        </CardContent>
      </Card>
    </div>
  );
}
