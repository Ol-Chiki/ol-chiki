
'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { useNavigationStore } from '@/stores/navigationStore';
import { componentRegistry } from '@/config/componentRegistry';
import type { ActiveView, ComponentConfig } from '@/types/navigation';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import { useUIStore } from '@/stores/uiStore';
import { useStoreActions } from './useStoreActions';


export function useComponentLoader() {
  const activeView = useNavigationStore((state) => state.activeView);
  const { uiStore } = useStoreActions(); // Get all store actions/state

  const [LoadedComponent, setLoadedComponent] = useState<React.ComponentType<any> | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const currentConfig = useMemo(() => componentRegistry[activeView] || componentRegistry.error, [activeView]);

  useEffect(() => {
    let isMounted = true;
    setIsLoading(true);
    setError(null);
    uiStore.setFeatureLoading(activeView, true);


    const loadComponent = async () => {
      try {
        const { component: componentLoader, storeActions, params } = currentConfig;
        if (storeActions) {
            // storeActions(stores, params); // How to get 'stores' here?
            // For now, we assume storeActions are not used or handled differently
        }
        const { default: Component } = await componentLoader();
        if (isMounted) {
          setLoadedComponent(() => Component); // Use functional update
        }
      } catch (err:any) {
        console.error(`Error loading component for view: ${activeView}`, err);
        if (isMounted) {
          setError(err);
          setLoadedComponent(() => componentRegistry.error.component as unknown as React.ComponentType<any>); // Fallback to error component
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
          uiStore.setFeatureLoading(activeView, false);
        }
      }
    };

    loadComponent();

    return () => {
      isMounted = false;
    };
  }, [activeView, currentConfig, uiStore]);

  const FallbackComponent = currentConfig.fallback || LoadingSpinner;

  return { LoadedComponent, isLoading, error, FallbackComponent, activeView };
}
