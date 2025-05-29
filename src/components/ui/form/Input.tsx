
// components/ui/form/Input.tsx
import React from 'react';
import { cn } from '@/lib/utils';
import { Input as ShadcnInput, type InputProps as ShadcnInputProps } from "@/components/ui/input"; // Use original ShadCN

interface InputProps extends ShadcnInputProps {
  // Add any custom props if needed
}

export const Input: React.FC<InputProps> = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, ...props }, ref) => {
    return (
      <ShadcnInput
        className={cn(
          // Add any base styles specific to this refactored Input if necessary
          // "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);
Input.displayName = "FormInput"; // Changed display name to avoid conflict with ShadCN's
