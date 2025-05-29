
'use client';

import { Button, type ButtonProps } from '@/components/ui/button';
import { Share2 } from 'lucide-react';
import { useShareApp } from '@/hooks/useShareApp';
import { cn } from '@/lib/utils';
import type { ShareData } from '@/services/shareService';

interface ShareButtonProps extends Omit<ButtonProps, 'onClick'> {
  shareData?: Partial<ShareData>;
  buttonText?: string;
}

export const ShareButton: React.FC<ShareButtonProps> = ({ shareData, buttonText = "Share this App", className, ...props }) => {
  const { handleShareApp } = useShareApp();

  return (
    <Button variant="default" onClick={() => handleShareApp(shareData)} className={cn(className)} {...props}>
      <Share2 className="mr-2 h-4 w-4" />
      {buttonText}
    </Button>
  );
};
