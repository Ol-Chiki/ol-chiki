
'use client';

import { useRouter } from 'next/navigation';
import { Button, type ButtonProps } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { cn } from '@/lib/utils';

interface BackButtonProps extends ButtonProps {
  defaultHref?: string;
  text?: string;
}

export const BackButton: React.FC<BackButtonProps> = ({ defaultHref = '/', text = 'Back', className, ...props }) => {
  const router = useRouter();

  const handleClick = () => {
    // Check if there's a history to go back to within the app.
    // This simple check doesn't distinguish between internal and external history.
    // For more complex scenarios, a custom history stack might be needed.
    if (window.history.length > 2) { // > 2 because current page is one, previous is one
      router.back();
    } else {
      router.push(defaultHref);
    }
  };

  return (
    <Button variant="outline" onClick={handleClick} className={cn(className)} {...props}>
      <ArrowLeft className="mr-2 h-4 w-4" />
      {text}
    </Button>
  );
};
