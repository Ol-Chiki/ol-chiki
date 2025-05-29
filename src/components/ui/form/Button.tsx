
// components/ui/form/Button.tsx
import React from 'react';
import { cn } from '@/lib/utils';
import { Button as ShadcnButton, type ButtonProps as ShadcnButtonProps } from "@/components/ui/button"; // Use original ShadCN

interface ButtonProps extends ShadcnButtonProps {
  // Add any custom props if needed
  isLoading?: boolean;
}

export const Button: React.FC<ButtonProps> = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, children, isLoading, ...props }, ref) => {
    return (
      <ShadcnButton
        className={cn(
          // Add any base styles specific to this refactored Button if necessary
          // "inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
          className
        )}
        ref={ref}
        disabled={props.disabled || isLoading}
        {...props}
      >
        {isLoading && (
          <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
        )}
        {children}
      </ShadcnButton>
    );
  }
);
Button.displayName = "FormButton"; // Changed display name
