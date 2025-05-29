
// Share Service
// Encapsulates logic for using the Web Share API or clipboard fallback

export interface ShareData {
  title?: string;
  text?: string;
  url?: string;
}

export class ShareService {
  static async share(shareData: ShareData): Promise<{ success: boolean; message: string; method: 'native' | 'clipboard' | 'none' }> {
    if (typeof window === 'undefined') {
      return { success: false, message: 'Sharing not available outside browser.', method: 'none' };
    }

    const defaultShareData: ShareData = {
      title: "Let's Learn Ol Chiki",
      text: "Check out this app to learn the Ol Chiki script for the Santali language!",
      url: window.location.origin,
      ...shareData,
    };
    
    try {
      if (navigator.share && navigator.canShare && navigator.canShare(defaultShareData)) {
        await navigator.share(defaultShareData);
        return { success: true, message: 'App link shared successfully.', method: 'native' };
      } else if (navigator.clipboard && defaultShareData.url) {
        await navigator.clipboard.writeText(defaultShareData.url);
        return { success: true, message: 'App link copied to clipboard. You can paste it to share.', method: 'clipboard' };
      } else {
        return { success: false, message: 'Sharing not supported on this browser. Please copy the link manually.', method: 'none' };
      }
    } catch (error) {
      console.error('Error sharing:', error);
      const message = error instanceof Error ? error.message : 'Could not share.';
      return { success: false, message: `Share Error: ${message}`, method: 'none' };
    }
  }
}
