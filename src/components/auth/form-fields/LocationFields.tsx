
// components/auth/form-fields/LocationFields.tsx
import React from 'react';
import { FormField } from './FormField'; // Use the refactored FormField
import type { AuthFormData, FormErrors } from '@/types/auth';
import { MapPin } from 'lucide-react';
import { Input } from '@/components/ui/form/Input';

interface LocationFieldsProps {
  formData: Pick<AuthFormData, 'city' | 'state'>;
  formErrors: Pick<FormErrors, 'city' | 'state'>;
  updateField: (field: 'city' | 'state', value: string) => void;
  validateField?: (field: 'city' | 'state') => void; // Optional for onBlur validation
  disabled?: boolean;
}

export const LocationFields: React.FC<LocationFieldsProps> = ({
  formData,
  formErrors,
  updateField,
  validateField,
  disabled,
}) => {
  return (
    <div className="grid grid-cols-2 gap-4">
      <div className="space-y-1.5">
        <FormField
          id="city"
          label="City (Optional)"
          value={formData.city}
          onChange={(val) => updateField('city', val)}
          onBlur={() => validateField?.('city')}
          error={formErrors.city}
          placeholder="e.g., Ranchi"
          disabled={disabled}
          inputClassName="pl-10"
        >
            <div className="relative">
                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                    id="city"
                    type="text"
                    placeholder="e.g., Ranchi"
                    value={formData.city}
                    onChange={(e) => updateField('city', e.target.value)}
                    onBlur={() => validateField?.('city')}
                    disabled={disabled}
                    className="pl-10"
                />
            </div>
        </FormField>
      </div>
       <div className="space-y-1.5">
        <FormField
          id="state"
          label="State (Optional)"
          value={formData.state}
          onChange={(val) => updateField('state', val)}
          onBlur={() => validateField?.('state')}
          error={formErrors.state}
          placeholder="e.g., Jharkhand"
          disabled={disabled}
          inputClassName="pl-10"
        >
            <div className="relative">
                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                    id="state"
                    type="text"
                    placeholder="e.g., Jharkhand"
                    value={formData.state}
                    onChange={(e) => updateField('state', e.target.value)}
                    onBlur={() => validateField?.('state')}
                    disabled={disabled}
                    className="pl-10"
                />
            </div>
        </FormField>
      </div>
    </div>
  );
};
