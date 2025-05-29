
'use client';

import { useCallback } from 'react';
import { ShareService, type ShareData } from '@/services/shareService';
import { useToast } from '@/hooks/use-toast';

export const useShareApp = () => {
  const { toast } = useToast();

  const handleShare = useCallback(async (shareData?: Partial<ShareData>) => {
    const result = await ShareService.share(shareData || {});
    if (result.success) {
      toast({ title: result.method === 'native' ? 'Thanks for sharing!' : 'Link Copied!', description: result.message });
    } else {
      toast({ title: 'Share Error', description: result.message, variant: 'destructive' });
    }
  }, [toast]);

  return {
    handleShareApp: handleShare,
  };
};
