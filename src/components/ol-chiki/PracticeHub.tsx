
'use client';

import type { LucideIcon } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { LibraryBig, Keyboard, ArrowRight } from 'lucide-react';
import type { ActiveView } from '@/app/page';

interface PracticeHubProps {
  onSectionSelect: (viewId: ActiveView) => void;
}

interface HubItem {
  id: Exclude<ActiveView, 'practice-hub' | 'writing-quiz-basic' | 'basic-hub' | 'alphabet' | 'numbers' | 'words' | 'sentence' | 'game' >; // More specific type for IDs here
  title: string;
  description: string;
  icon: LucideIcon;
}

const hubItems: HubItem[] = [
  { 
    id: 'reading-practice-hub', 
    title: 'Reading Practice', 
    description: 'Sharpen your Ol Chiki reading skills with various exercises.', 
    icon: LibraryBig 
  },
  { 
    id: 'writing-practice-hub', 
    title: 'Writing Practice', 
    description: 'Practice writing Ol Chiki characters, words, and sentences.', 
    icon: Keyboard 
  },
];

export default function PracticeHub({ onSectionSelect }: PracticeHubProps) {
  return (
    <div className="p-4 md:p-6">
      <h2 className="text-3xl font-bold mb-8 text-primary tracking-tight text-center">
        Practice Zone
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8 max-w-3xl mx-auto">
        {hubItems.map((item) => (
          <Card 
            key={item.id} 
            className="shadow-lg hover:shadow-2xl transition-all duration-300 cursor-pointer group bg-card flex flex-col overflow-hidden rounded-xl border-2 border-transparent hover:border-primary/50"
            onClick={() => onSectionSelect(item.id as ActiveView)}
          >
            <CardHeader className="p-6 bg-primary/5 group-hover:bg-primary/10 transition-colors">
              <div className="flex items-center space-x-4">
                <div className="p-3 bg-primary text-primary-foreground rounded-full">
                  <item.icon className="h-8 w-8" />
                </div>
                <div>
                  <CardTitle className="text-2xl text-accent group-hover:text-primary transition-colors">{item.title}</CardTitle>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-6 flex-grow">
              <CardDescription className="text-md text-foreground/80 mb-4">
                {item.description}
              </CardDescription>
            </CardContent>
            <div className="p-6 pt-0 mt-auto">
                 <Button variant="outline" className="w-full group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                    Go to {item.title.split(' ')[0]} <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
