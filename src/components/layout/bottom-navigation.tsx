
'use client';

import React from 'react';
import { cn } from '@/lib/utils';
import type { SupabaseUser } from '@/contexts/supabase-auth-context';
import type { ActiveView } from '@/types/navigation';
import { bottomNavigationConfig, iconColorClasses } from '@/config/navigationConfig';
import { useStoreActions } from '@/hooks/useStoreActions';
import { usePathname, useRouter } from 'next/navigation';


interface BottomNavigationProps {
  // Props will now come from stores or be handled internally if simple enough
  activeView: ActiveView; // Still needed to highlight the correct item
  onNavChange: (viewId: ActiveView) => void; // From navigationStore via OlChikiApp
  onProfileClick: () => void; // To navigate to /profile
  currentUser: SupabaseUser | null; // From authStore via OlChikiApp
}

export default function BottomNavigation({
  activeView,
  onNavChange, // This will now primarily use store actions via config
  onProfileClick,
  currentUser,
}: BottomNavigationProps) {
  const stores = useStoreActions();
  const router = useRouter();
  const pathname = usePathname();


  const getProfileLabel = () => {
    if (currentUser && currentUser.user_metadata?.display_name) {
      const namePart = currentUser.user_metadata.display_name.split(' ')[0];
      return namePart.length > 8 ? namePart.substring(0, 7) + '...' : namePart;
    }
    return 'Profile';
  };

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 flex h-16 items-center justify-around border-t bg-card text-card-foreground shadow-[0_-2px_5px_-1px_rgba(0,0,0,0.1)]">
      {bottomNavigationConfig.map((item) => {
        if (item.isVisible && !item.isVisible(stores)) {
          return null;
        }

        let isActive = item.isActive ? item.isActive(activeView, stores) : activeView === item.id;
        // Special handling for profile if it's a separate route
        if (item.id === 'profile' && pathname === '/profile') {
            isActive = true;
        }


        const effectiveIconColor = isActive
          ? 'text-primary'
          : iconColorClasses[item.id] || 'text-accent'; // Fallback to accent

        const labelColor = isActive ? 'text-primary' : 'text-accent';
        const IconComponent = item.icon;
        const itemLabel = item.id === 'profile' ? getProfileLabel() : item.label;

        const handleClick = () => {
          if (item.id === 'profile') {
            onProfileClick(); // Uses router.push('/profile') from OlChikiApp
          } else {
            item.action(stores); // Dispatches store action, e.g., setActiveView
          }
        };

        return (
          <button
            key={item.id}
            onClick={handleClick}
            className={cn(
              'flex h-full flex-1 flex-col items-center justify-center p-2 transition-colors duration-200 ease-in-out hover:bg-accent/20',
              isActive && 'border-t-2 border-primary'
            )}
            aria-label={itemLabel}
            aria-current={isActive ? 'page' : undefined}
          >
            <IconComponent className={cn("h-5 w-5 sm:h-6 sm:w-6", effectiveIconColor)} />
            <span className={cn("mt-1 text-[10px] sm:text-xs leading-tight truncate max-w-[50px] xs:max-w-[60px]", labelColor)}>{itemLabel}</span>
          </button>
        );
      })}
    </nav>
  );
}
