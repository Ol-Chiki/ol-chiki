
import { profileConfig } from '@/config/profileConfig';

export function validateDisplayName(name: string): { isValid: boolean; error?: string } {
  if (!name.trim()) {
    return { isValid: false, error: 'Display name cannot be empty.' };
  }
  if (name.length > profileConfig.maxDisplayNameLength) {
    return { isValid: false, error: `Display name cannot exceed ${profileConfig.maxDisplayNameLength} characters.` };
  }
  // Add other validation rules if needed (e.g., disallowed characters)
  return { isValid: true };
}
