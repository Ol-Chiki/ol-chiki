
// utils/formHelpers.ts
import type React from 'react';

/**
 * Prevents default form submission behavior.
 * @param e The form event.
 */
export const preventFormDefault = (e: React.FormEvent) => {
  e.preventDefault();
};

// Add other form-related utility functions here if needed
// e.g., functions to serialize form data, handle specific input types, etc.
