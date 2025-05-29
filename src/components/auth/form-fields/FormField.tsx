
// components/auth/form-fields/FormField.tsx
import React from 'react';
import { Label } from '@/components/ui/label'; // Use existing ShadCN Label
import { Input } from '@/components/ui/form/Input'; // Use new form Input
import { FormError } from '@/components/ui/form/FormError';
import type { AuthFormData, FormErrors } from '@/types/auth';

interface FormFieldProps {
  id: keyof AuthFormData;
  label: string;
  type?: string;
  placeholder?: string;
  value: string;
  onChange: (value: string) => void;
  onBlur?: () => void; // For field-level validation on blur
  error?: string;
  isRequired?: boolean;
  children?: React.ReactNode; // For custom inputs like DatePicker
  className?: string;
  inputClassName?: string;
}

export const FormField: React.FC<FormFieldProps> = ({
  id,
  label,
  type = 'text',
  placeholder,
  value,
  onChange,
  onBlur,
  error,
  isRequired,
  children,
  className,
  inputClassName,
}) => {
  return (
    <div className={className || "space-y-1.5"}>
      <Label htmlFor={id}>
        {label} {isRequired && <span className="text-destructive">*</span>}
      </Label>
      {children ? (
        React.cloneElement(children as React.ReactElement, { id, value, onChange, onBlur, error })
      ) : (
        <Input
          id={id}
          name={id}
          type={type}
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onBlur={onBlur}
          className={inputClassName}
          aria-invalid={!!error}
          aria-describedby={error ? `${id}-error` : undefined}
        />
      )}
      {error && <FormError message={error} id={`${id}-error`} />}
    </div>
  );
};
