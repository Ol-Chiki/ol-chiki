
import type { NavItemConfig, ActiveView } from '@/types/navigation';
import type { AllStores } from '@/types/stores';
import { GraduationCap, Sparkles, ClipboardEdit, Gamepad2, User as UserIcon } from 'lucide-react';

export const bottomNavigationConfig: NavItemConfig[] = [
  {
    id: 'basic-hub',
    label: 'Basic',
    icon: GraduationCap,
    action: (stores: AllStores) => stores.navigationStore.setActiveView('basic-hub'),
    isActive: (activeView: ActiveView) => ['basic-hub', 'alphabet', 'numbers', 'words'].includes(activeView),
  },
  {
    id: 'sentence',
    label: 'Santad AI',
    icon: Sparkles,
    action: (stores: AllStores) => stores.navigationStore.setActiveView('sentence'),
    isActive: (activeView: ActiveView) => activeView === 'sentence',
  },
  {
    id: 'practice-hub',
    label: 'Practice',
    icon: ClipboardEdit,
    action: (stores: AllStores) => stores.navigationStore.setActiveView('practice-hub'),
    isActive: (activeView: ActiveView) =>
      activeView.startsWith('practice-') ||
      activeView.startsWith('reading-') ||
      activeView.startsWith('writing-'),
  },
  {
    id: 'game',
    label: 'Game Zone',
    icon: Gamepad2,
    action: (stores: AllStores) => stores.navigationStore.setActiveView('game'),
    isActive: (activeView: ActiveView) => activeView === 'game',
  },
  {
    id: 'profile', // This ID will be used for navigation to the profile page
    label: 'Profile', // Initial label, can be dynamic based on auth state
    icon: UserIcon,
    action: (stores: AllStores) => {
      // This action will directly navigate to the /profile page
      // Assuming useRouter is available or a navigation service is used
      // For now, we'll let the BottomNavigation component handle the direct link.
      // Or, if OlChikiApp handles top-level routing, this could set a specific view that OlChikiApp interprets.
      // For simplicity with a dedicated /profile route, this action might not set an ActiveView.
      // The BottomNavigation component itself will handle the router.push('/profile').
      // Alternatively, we can set activeView to 'profile' if ContentRenderer handles /profile.
      // For now, let setActiveView('profile') if /profile is rendered by ContentRenderer.
      // If /profile is a separate Next.js page, this action might be different or not needed.
      // Assuming /profile is a view rendered by ContentRenderer for consistency.
      // stores.navigationStore.setActiveView('profile'); // If profile is part of ContentRenderer
      // If /profile is a standalone page, the BottomNavigation component's onClick for this
      // item would use router.push('/profile').
    },
    isActive: (activeView: ActiveView) => activeView === 'profile',
    // isVisible can be used to show "Login" if not authenticated, etc.
  },
];

export const iconColorClasses: Record<string, string> = {
    'basic-hub': 'text-teal-500',
    'sentence': 'text-fuchsia-500',
    'practice-hub': 'text-sky-500',
    'game': 'text-violet-500',
    'profile': 'text-orange-500', // Default color for profile icon
  };
