
import { profileConfig } from '@/config/profileConfig';

export function validateImageFile(file: File): { isValid: boolean; error?: string } {
  if (!profileConfig.allowedImageTypes.includes(file.type)) {
    return { isValid: false, error: `Invalid file type. Please select a JPG, PNG, or GIF image.` };
  }
  if (file.size > profileConfig.maxImageSizeMB * 1024 * 1024) {
    return { isValid: false, error: `File is too large. Maximum size is ${profileConfig.maxImageSizeMB}MB.` };
  }
  return { isValid: true };
}

export function readFileAsDataURL(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      if (typeof reader.result === 'string') {
        resolve(reader.result);
      } else {
        reject(new Error('Failed to read file as data URL.'));
      }
    };
    reader.onerror = (error) => reject(error);
    reader.readAsDataURL(file);
  });
}
