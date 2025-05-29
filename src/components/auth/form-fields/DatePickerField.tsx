
// components/auth/form-fields/DatePickerField.tsx
import React from 'react';
import { Button } from '@/components/ui/form/Button'; // Use new form Button
import { Calendar } from '@/components/ui/calendar'; // Use existing ShadCN Calendar
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CalendarDays as CalendarIconLucide } from 'lucide-react';
import { cn } from '@/lib/utils';
import { formatDisplayDate, formatDateToYYYYMMDD } from '@/utils/dateHelpers';
import { useAuthStore } from '@/stores/authStore';

interface DatePickerFieldProps {
  id: string; // from FormField
  value: string; // YYYY-MM-DD
  onChange: (value: string) => void; // Expects YYYY-MM-DD
  onBlur?: () => void;
  error?: string; // from FormField
}

export const DatePickerField: React.FC<DatePickerFieldProps> = ({ id, value, onChange, onBlur, error }) => {
  const { isDatePickerOpen, setIsDatePickerOpen } = useAuthStore(state => ({
    isDatePickerOpen: state.isDatePickerOpen,
    setIsDatePickerOpen: state.setIsDatePickerOpen,
  }));

  const selectedDate = value ? new Date(value + 'T00:00:00') : null; // Ensure correct parsing from YYYY-MM-DD

  return (
    <div className="relative">
      <Popover open={isDatePickerOpen} onOpenChange={setIsDatePickerOpen}>
        <PopoverTrigger asChild>
          <Button
            id={id}
            variant="outline"
            className={cn(
              "w-full justify-start text-left font-normal pl-10 pr-3 py-2 h-10",
              !value && "text-muted-foreground",
              error && "border-destructive"
            )}
            onClick={() => setIsDatePickerOpen(true)}
            onBlur={onBlur} // Propagate onBlur for validation if needed
            type="button"
          >
            {value ? formatDisplayDate(selectedDate) : <span>Pick a date</span>}
          </Button>
        </PopoverTrigger>
        <CalendarIconLucide className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            mode="single"
            selected={selectedDate || undefined}
            onSelect={(date) => {
              if (date) {
                onChange(formatDateToYYYYMMDD(date));
              } else {
                onChange('');
              }
              setIsDatePickerOpen(false);
              if (onBlur) onBlur(); // Trigger validation after selection
            }}
            disabled={(date) => date > new Date() || date < new Date("1900-01-01")} // Example range
            initialFocus
          />
        </PopoverContent>
      </Popover>
    </div>
  );
};
