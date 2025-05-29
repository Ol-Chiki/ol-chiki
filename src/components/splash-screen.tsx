
'use client';

import { useEffect, useState } from 'react';
import { Languages } from 'lucide-react';

interface SplashScreenProps {
  onComplete: () => void;
}

export default function SplashScreen({ onComplete }: SplashScreenProps) {
  const [step, setStep] = useState(0); // 0: initial, 1: bg orange + logo flash, 2: text shown, 3: finished (fading out)

  useEffect(() => {
    const timers: NodeJS.Timeout[] = [];
    if (step === 0) {
      timers.push(setTimeout(() => setStep(1), 200)); // Start animation quickly
    } else if (step === 1) {
      // Logo flash animation is handled by CSS (1 second duration)
      timers.push(setTimeout(() => setStep(2), 1000)); // Show text after flash duration
    } else if (step === 2) {
      timers.push(setTimeout(() => {
        setStep(3); // Start fade out
      }, 1500)); // Duration text is visible
    } else if (step === 3) {
      timers.push(setTimeout(() => {
        onComplete(); // Call onComplete after fade out animation (500ms)
      }, 500));
    }
    return () => timers.forEach(clearTimeout);
  }, [step, onComplete]);

  return (
    <div
      className={`
        fixed inset-0 flex flex-col items-center justify-center transition-all duration-500 ease-in-out
        ${step >= 1 ? 'bg-primary' : 'bg-background'}
        ${step === 3 ? 'opacity-0' : 'opacity-100'}
      `}
    >
      <div className={`transition-opacity duration-500 ${step < 3 ? 'opacity-100' : 'opacity-0'}`}>
        <Languages
          className={`
            h-24 w-24 sm:h-32 sm:w-32 md:h-40 md:w-40
            transition-colors duration-500
            ${step >= 1 ? 'text-primary-foreground' : 'text-primary'}
            ${step === 1 ? 'animate-subtle-flash' : ''}
          `}
        />
      </div>
      <h1
        className={`
          mt-6 text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight
          transition-all duration-700 ease-in-out
          ${step >= 1 ? 'text-primary-foreground' : 'text-primary'}
          ${step === 2 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'}
          ${step === 3 ? 'opacity-0' : ''}
        `}
      >
        Let's Learn Ol Chiki
      </h1>
    </div>
  );
}
