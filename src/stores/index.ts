
// This file can be used to export all stores or create composed selectors/actions.
// For now, we'll just re-export them for easier access.

export { useNavigationStore } from './navigationStore';
export { useAuthStore } from './authStore';
export { useUIStore } from './uiStore';
export { useQuizStore } from './quizStore';

// Example of how you might create a root store or combined hooks if needed later
// import { useNavigationStore, NavigationStore } from './navigationStore';
// ... other store imports

// export const useStore = <T>(selector: (state: RootState) => T) => {
//   const navigation = useNavigationStore(state => state);
//   // ... get other store states
//   return selector({ navigation, /* ... other stores */ });
// };
