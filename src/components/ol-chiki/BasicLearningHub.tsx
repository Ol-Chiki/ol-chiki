
'use client';

import type { LucideIcon } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Type, ListOrdered, FileText, ArrowRight } from 'lucide-react';
// Ensure ActiveView type is accessible, e.g., by exporting from page.tsx or defining globally
// For this example, we'll assume ActiveView is available or define it if needed.
// If page.tsx exports it: import type { ActiveView } from '@/app/page'; 
// For now, let's define it locally to avoid import issues if not exported:
type ActiveView = 
  | 'basic-hub' 
  | 'alphabet' 
  | 'numbers' 
  | 'words' 
  | 'sentence' 
  | 'practice-hub'
  | 'reading-practice-hub'
  | 'writing-practice-hub'
  | 'writing-quiz-basic'
  | 'game';


interface BasicLearningHubProps {
  onSectionSelect: (viewId: ActiveView) => void;
}

interface HubItem {
  id: Exclude<ActiveView, 'basic-hub' | 'sentence' | 'practice-hub' | 'reading-practice-hub' | 'writing-practice-hub' | 'writing-quiz-basic' | 'game'>;
  title: string;
  description: string;
  icon: LucideIcon;
}

const hubItems: HubItem[] = [
  { id: 'alphabet', title: 'Learn Alphabet', description: 'Explore the foundational Ol Chiki characters and their sounds.', icon: Type },
  { id: 'numbers', title: 'Learn Numbers', description: 'Master Ol Chiki numerals from zero to one hundred.', icon: ListOrdered },
  { id: 'words', title: 'Learn Vocabulary', description: 'Discover common Ol Chiki words across various categories.', icon: FileText },
];

export default function BasicLearningHub({ onSectionSelect }: BasicLearningHubProps) {
  return (
    <div className="p-4 md:p-6">
      <h2 className="text-3xl font-bold mb-8 text-primary tracking-tight text-center">
        Basic Learning Hub
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 max-w-4xl mx-auto">
        {hubItems.map((item) => (
          <Card 
            key={item.id} 
            className="shadow-lg hover:shadow-2xl transition-all duration-300 cursor-pointer group bg-card flex flex-col overflow-hidden rounded-xl border-2 border-transparent hover:border-primary/50"
            onClick={() => onSectionSelect(item.id)}
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
                    Go to {item.title.split(' ')[1]} <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
