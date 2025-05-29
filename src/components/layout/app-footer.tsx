
'use client';

import { useUIStore } from '@/stores/uiStore';
import { APP_NAME } from '@/utils/constants';

export default function AppFooter() {
  const currentYear = useUIStore((state) => state.currentYear);

  return (
    <footer className="bg-secondary text-secondary-foreground p-4 text-center text-sm mt-auto">
      <p>&copy; {currentYear} {APP_NAME}. Learn and explore the Ol Chiki script.</p>
    </footer>
  );
}
