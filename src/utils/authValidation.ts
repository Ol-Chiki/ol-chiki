
// utils/authValidation.ts
import type { AuthFormData, FormErrors } from '@/types/auth';
import { authConfig } from '@/config/authConfig'; // Assuming this will be created

export interface ValidationRule {
  test: (value: string, formData?: AuthFormData) => boolean; // formData can be used for cross-field validation like confirmPassword
  message: string;
}

export interface ValidationSchema {
  email: ValidationRule[];
  password: ValidationRule[];
  displayName: ValidationRule[];
  dob: ValidationRule[];
  confirmPassword?: ValidationRule[]; // Optional, only for signup
  city?: ValidationRule[]; // Optional field
  state?: ValidationRule[]; // Optional field
}

// Placeholder validation functions - implement these properly
const isValidEmail = (email: string): boolean => {
  // Basic email regex, consider using a library for robust validation
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
};

const isValidDateOfBirth = (dob: Date | null, minAge: number, maxAge: number): boolean => {
  if (!dob || isNaN(dob.getTime())) return false;
  const today = new Date();
  const birthYear = dob.getFullYear();
  const currentYear = today.getFullYear();
  const age = currentYear - birthYear;

  // Adjust age if birthday hasn't occurred yet this year
  const birthMonth = dob.getMonth();
  const currentMonth = today.getMonth();
  const birthDay = dob.getDate();
  const currentDay = today.getDate();

  if (currentMonth < birthMonth || (currentMonth === birthMonth && currentDay < birthDay)) {
    // age--; // This line would make age one less if birthday hasn't passed.
    // For simplicity here, we just check year difference.
    // More precise age calculation might be needed based on requirements.
  }
  return age >= minAge && age <= maxAge;
};


export const authValidationSchema: ValidationSchema = {
  email: [
    { test: (value) => !!value.trim(), message: 'Email is required' },
    { test: (value) => isValidEmail(value), message: 'Invalid email format' }
  ],
  password: [
    { test: (value) => !!value, message: 'Password is required' },
    { test: (value) => value.length >= authConfig.validation.passwordMinLength, message: `Password must be at least ${authConfig.validation.passwordMinLength} characters` }
  ],
  displayName: [
    { test: (value) => !!value.trim(), message: 'Display name is required for signup' },
    { test: (value) => value.length >= authConfig.validation.displayNameMinLength, message: `Display name must be at least ${authConfig.validation.displayNameMinLength} characters` }
  ],
  dob: [
    { test: (value) => !!value, message: 'Date of birth is required for signup' },
    { 
      test: (value) => {
          const date = new Date(value);
          // Check if the date string was valid enough to create a Date object
          if (isNaN(date.getTime())) return false; 
          // Ensure the date is not in the future or too far in the past
          return isValidDateOfBirth(date, authConfig.validation.minAge, authConfig.validation.maxAge);
      }, 
      message: `Please enter a valid date. Age must be between ${authConfig.validation.minAge} and ${authConfig.validation.maxAge}.`
    }
  ],
  confirmPassword: [
    { test: (value) => !!value, message: 'Confirm password is required' },
    { test: (value, formData) => formData?.password === value, message: 'Passwords do not match' }
  ],
  // City and State are optional, so no 'required' validation unless specified
};

export const validateField = (fieldName: keyof AuthFormData, value: string, schema: ValidationSchema, formData?: AuthFormData): string | null => {
  const rules = schema[fieldName as keyof ValidationSchema];
  if (rules) {
    for (const rule of rules) {
      if (!rule.test(value, formData)) {
        return rule.message;
      }
    }
  }
  return null;
};

export const validateForm = (formData: AuthFormData, schema: ValidationSchema, isSignup: boolean): FormErrors => {
  const errors: FormErrors = {};
  (Object.keys(schema) as Array<keyof ValidationSchema>).forEach((key) => {
    // Skip non-signup fields if not in signup mode
    if (!isSignup && (key === 'displayName' || key === 'dob' || key === 'confirmPassword' || key === 'city' || key === 'state')) {
      return;
    }
    // Only validate confirmPassword if password is also present (relevant for signup)
    if (key === 'confirmPassword' && !isSignup) return;
    
    const fieldName = key as keyof AuthFormData; // Type assertion
    const value = formData[fieldName] || ''; // Ensure value is a string, even if undefined in formData
    const error = validateField(fieldName, value, schema, formData);
    if (error) {
      errors[fieldName] = error;
    }
  });
  return errors;
};
