
'use client';

import type { OlChikiWord } from '@/types/ol-chiki';
import { categorizedOlChikiWords } from '@/lib/ol-chiki-data';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Tag } from 'lucide-react';

export default function LearnWords() {
  const categories = Object.keys(categorizedOlChikiWords);

  return (
    <div className="p-4 md:p-6">
      <h2 className="text-2xl sm:text-3xl font-bold mb-6 text-primary tracking-tight text-center">
        Learn Ol Chiki Vocabulary
      </h2>
      <ScrollArea className="h-[calc(100vh-230px)] pr-3"> {/* Adjusted height and added padding for scrollbar */}
        {categories.length > 0 ? (
          <Accordion type="multiple" className="w-full space-y-3 sm:space-y-4">
            {categories.map((category) => (
              <AccordionItem 
                value={category} 
                key={category} 
                className="border border-border bg-card rounded-lg shadow-sm hover:shadow-md transition-shadow"
              >
                <AccordionTrigger className="px-4 sm:px-6 py-3 sm:py-4 text-lg sm:text-xl font-semibold text-accent hover:no-underline hover:bg-secondary/20 rounded-t-lg data-[state=open]:rounded-b-none data-[state=open]:border-b data-[state=open]:border-border transition-colors">
                  <div className="flex items-center">
                    <Tag className="mr-2 sm:mr-3 h-5 w-5 sm:h-6 sm:w-6 text-primary" />
                    {category}
                  </div>
                </AccordionTrigger>
                <AccordionContent className="p-3 sm:p-4 rounded-b-lg border-t border-border bg-background/50">
                  {categorizedOlChikiWords[category] && categorizedOlChikiWords[category].length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
                      {categorizedOlChikiWords[category].map((word: OlChikiWord) => (
                        <Card 
                          key={word.id} 
                          className="shadow-md hover:shadow-lg transition-shadow duration-200 flex flex-col bg-card/90 backdrop-blur-sm overflow-hidden rounded-md"
                        >
                          <CardHeader className="p-3 text-center">
                            <CardTitle className="text-2xl sm:text-3xl font-mono text-accent leading-tight">
                              {word.olChiki}
                            </CardTitle>
                          </CardHeader>
                          <CardContent className="p-3 pt-0 text-center flex-grow flex flex-col justify-center">
                            <p className="text-base sm:text-lg font-semibold text-primary">
                              {word.transliteration}
                            </p>
                            <CardDescription className="text-sm text-foreground mt-0.5">
                              {word.english}
                            </CardDescription>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  ) : (
                    <p className="text-muted-foreground text-center py-4">No words found in this category yet.</p>
                  )}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        ) : (
          <p className="text-center text-muted-foreground text-lg mt-10">
            No vocabulary categories found.
          </p>
        )}
      </ScrollArea>
    </div>
  );
}
