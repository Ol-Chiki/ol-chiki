
'use client';

import type { OlChikiCharacter } from '@/types/ol-chiki';
import { olChikiCharacters } from '@/lib/ol-chiki-data';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Volume2 } from 'lucide-react';
import { useState, useRef } from 'react';
import { cn } from '@/lib/utils';

const LONG_PRESS_DURATION = 700; // milliseconds

export default function LearnAlphabet() {
  const [activeCardId, setActiveCardId] = useState<string | null>(null);
  const [longPressedCharacter, setLongPressedCharacter] = useState<OlChikiCharacter | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const longPressTimerRef = useRef<NodeJS.Timeout | null>(null);

  const handleInteractionStart = (character: OlChikiCharacter) => {
    if (longPressTimerRef.current) {
      clearTimeout(longPressTimerRef.current);
    }

    setActiveCardId(character.id); // Highlight on mousedown/touchstart

    longPressTimerRef.current = setTimeout(() => {
      setLongPressedCharacter(character);
      setIsDialogOpen(true);
      longPressTimerRef.current = null; // Clear timer once dialog is triggered
    }, LONG_PRESS_DURATION);
  };

  const handleInteractionEnd = (character: OlChikiCharacter) => {
    if (longPressTimerRef.current) {
      clearTimeout(longPressTimerRef.current);
      longPressTimerRef.current = null;
      // If timer is cleared before firing, it's a click (or short tap)
      // Set activeCardId to highlight on click as well
      setActiveCardId(character.id);
    }
    // If dialog didn't open, it was a click, keep activeCardId for highlight
    // If dialog opened, activeCardId is already set
  };

  const handleDialogClose = () => {
    setIsDialogOpen(false);
    // Delay clearing to allow for fade-out animations if any
    setTimeout(() => setLongPressedCharacter(null), 300); 
  };


  return (
    <div className="p-2 sm:p-4 md:p-6">
      <h2 className="text-xl sm:text-2xl md:text-3xl font-bold mb-2 sm:mb-4 text-primary tracking-tight">Ol Chiki Alphabet</h2>
      <ScrollArea className="h-[calc(100vh-160px)] sm:h-[calc(100vh-180px)] md:h-[calc(100vh-200px)]">
        <div className="grid grid-cols-5 gap-2 sm:gap-3">
          {olChikiCharacters.map((char) => (
            <Card
              key={char.id}
              onMouseDown={() => handleInteractionStart(char)}
              onMouseUp={() => handleInteractionEnd(char)}
              onMouseLeave={() => {if(longPressTimerRef.current) {clearTimeout(longPressTimerRef.current); longPressTimerRef.current = null;}}}
              onTouchStart={() => handleInteractionStart(char)}
              onTouchEnd={() => handleInteractionEnd(char)}
              className={cn(
                "shadow-md hover:shadow-lg hover:scale-105 transition-all duration-200 flex flex-col justify-between cursor-pointer select-none",
                activeCardId === char.id && "ring-2 ring-primary scale-105 shadow-xl"
              )}
            >
              <CardHeader className="p-2 text-center">
                <CardTitle className="text-2xl sm:text-3xl md:text-4xl lg:text-4xl text-center font-mono text-accent leading-tight">
                  {char.olChiki}
                </CardTitle>
              </CardHeader>
              <CardContent className="p-2 pt-1 text-center">
                <p className="text-xs sm:text-sm md:text-base font-semibold text-primary">
                  {char.transliteration}
                </p>
                {char.pronunciation && (
                  <CardDescription className="text-xs text-muted-foreground mt-1">
                    ({char.pronunciation})
                  </CardDescription>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      </ScrollArea>

      {longPressedCharacter && (
        <Dialog open={isDialogOpen} onOpenChange={(open) => {
          if (!open) {
            handleDialogClose();
          } else {
            setIsDialogOpen(true); 
          }
        }}>
          <DialogContent className="sm:max-w-xs w-10/12 aspect-[4/5] bg-card text-card-foreground flex flex-col items-center justify-center p-4 rounded-lg shadow-2xl overflow-hidden">
            <div className="text-center flex flex-col items-center justify-center h-full">
              <p className="font-mono text-primary leading-none mb-3 sm:mb-4 text-7xl sm:text-8xl md:text-[100px]">
                {longPressedCharacter.olChiki}
              </p>
              <p className="font-semibold text-accent mt-1 sm:mt-2 text-2xl sm:text-3xl">{longPressedCharacter.transliteration}</p>
              {longPressedCharacter.pronunciation && (
                <p className="text-muted-foreground mt-1 text-lg sm:text-xl">({longPressedCharacter.pronunciation})</p>
              )}
              <Button 
                variant="ghost" 
                size="icon" 
                className="mt-4 sm:mt-6 text-primary hover:bg-primary/10 rounded-full p-2" 
                onClick={() => console.log(`Play sound for ${longPressedCharacter.transliteration}`)}
                aria-label={`Play pronunciation for ${longPressedCharacter.transliteration}`}
              >
                <Volume2 className="h-6 w-6 sm:h-7 sm:w-7" />
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
