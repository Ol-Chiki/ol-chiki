
'use client';

import type { OlChikiNumber } from '@/types/ol-chiki';
import { olChikiNumbers } from '@/lib/ol-chiki-data';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Volume2 } from 'lucide-react';
import { useState, useRef } from 'react';
import { cn } from '@/lib/utils';

const LONG_PRESS_DURATION = 700; // milliseconds

export default function LearnNumbers() {
  const [activeCardId, setActiveCardId] = useState<string | null>(null);
  const [longPressedNumber, setLongPressedNumber] = useState<OlChikiNumber | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const longPressTimerRef = useRef<NodeJS.Timeout | null>(null);

  const handleInteractionStart = (num: OlChikiNumber) => {
    if (longPressTimerRef.current) {
      clearTimeout(longPressTimerRef.current);
    }
    setActiveCardId(num.id); // Highlight on mousedown/touchstart
    longPressTimerRef.current = setTimeout(() => {
      setLongPressedNumber(num);
      setIsDialogOpen(true);
      longPressTimerRef.current = null; // Clear timer once dialog is triggered
    }, LONG_PRESS_DURATION);
  };

  const handleInteractionEnd = (num: OlChikiNumber) => {
    if (longPressTimerRef.current) {
      clearTimeout(longPressTimerRef.current);
      longPressTimerRef.current = null;
       // If timer is cleared before firing, it's a click (or short tap)
      // Set activeCardId to highlight on click as well
      setActiveCardId(num.id);
    }
  };

  const handleDialogClose = () => {
    setIsDialogOpen(false);
    setTimeout(() => setLongPressedNumber(null), 300);
  };

  return (
    <div className="p-2 sm:p-4 md:p-6">
      <h2 className="text-xl sm:text-2xl md:text-3xl font-bold mb-2 sm:mb-4 text-primary tracking-tight">Ol Chiki Numbers</h2>
      <ScrollArea className="h-[calc(100vh-160px)] sm:h-[calc(100vh-180px)] md:h-[calc(100vh-200px)]">
        <div className="grid grid-cols-5 gap-2 sm:gap-3">
          {olChikiNumbers.map((num) => (
            <Card
              key={num.id}
              onMouseDown={() => handleInteractionStart(num)}
              onMouseUp={() => handleInteractionEnd(num)}
              onMouseLeave={() => {if(longPressTimerRef.current) {clearTimeout(longPressTimerRef.current); longPressTimerRef.current = null;}}}
              onTouchStart={() => handleInteractionStart(num)}
              onTouchEnd={() => handleInteractionEnd(num)}
              className={cn(
                "shadow-md hover:shadow-lg hover:scale-105 transition-all duration-200 flex flex-col justify-between cursor-pointer select-none",
                activeCardId === num.id && "ring-2 ring-primary scale-105 shadow-xl"
              )}
            >
              <CardHeader className="p-2 text-center">
                <CardTitle className="text-lg sm:text-xl md:text-2xl text-center font-mono text-accent leading-tight">
                   {num.olChiki} ({num.digitString})
                </CardTitle>
              </CardHeader>
              <CardContent className="p-2 pt-1 text-center">
                <p className="text-[10px] sm:text-xs md:text-sm font-semibold text-primary">
                  {num.englishWord}
                </p>
                 <CardDescription className="text-[10px] sm:text-xs text-muted-foreground mt-1">
                    {num.santaliWord}
                  </CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
      </ScrollArea>

      {longPressedNumber && (
        <Dialog open={isDialogOpen} onOpenChange={(open) => {
          if (!open) {
            handleDialogClose();
          } else {
            setIsDialogOpen(true);
          }
        }}>
          <DialogContent className="sm:max-w-xs w-10/12 aspect-[4/5] bg-card text-card-foreground flex flex-col items-center justify-center p-4 rounded-lg shadow-2xl overflow-hidden">
            <div className="text-center flex flex-col items-center justify-center h-full">
              <p className="font-mono text-primary leading-none mb-3 sm:mb-4 text-6xl sm:text-7xl md:text-[90px]">
                {longPressedNumber.olChiki} ({longPressedNumber.digitString})
              </p>
              <p className="font-semibold text-accent mt-1 sm:mt-2 text-xl sm:text-2xl">
                {longPressedNumber.englishWord}
              </p>
              <p className="text-muted-foreground mt-1 text-lg sm:text-xl">{longPressedNumber.santaliWord}</p>
              <Button 
                variant="ghost" 
                size="icon" 
                className="mt-4 sm:mt-6 text-primary hover:bg-primary/10 rounded-full p-2"
                onClick={() => console.log(`Play sound for ${longPressedNumber.englishWord} / ${longPressedNumber.santaliWord}`)}
                aria-label={`Play pronunciation for ${longPressedNumber.englishWord}`}
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
