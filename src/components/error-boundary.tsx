
'use client';

import React, { Component, ErrorInfo, ReactNode } from 'react';
import { Button } from '@/components/ui/button';
import { AlertTriangle } from 'lucide-react';
import { useUIStore } from '@/stores/uiStore'; // For global error handling

interface Props {
  children: ReactNode;
  fallbackMessage?: string;
}

interface State {
  hasError: boolean;
  error?: Error;
  errorInfo?: ErrorInfo;
}

class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Uncaught error in ErrorBoundary:", error, errorInfo);
    this.setState({ errorInfo });
    // Optionally, use a global error state from UIStore
    // useUIStore.getState().setGlobalError(error.message || "An unknown error occurred.");
  }

  private handleRetry = () => {
    this.setState({ hasError: false, error: undefined, errorInfo: undefined });
    // Attempt to reload the page or specific component.
    // For a general boundary, reloading the page might be the simplest.
    if (typeof window !== 'undefined') {
        window.location.reload();
    }
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="flex flex-col items-center justify-center min-h-[calc(100vh-200px)] text-center p-4 bg-background">
          <AlertTriangle className="w-16 h-16 text-destructive mb-4" />
          <h1 className="text-2xl font-bold text-destructive mb-2">
            {this.props.fallbackMessage || "Oops! Something went wrong."}
          </h1>
          <p className="text-muted-foreground mb-4">
            We encountered an unexpected error. Please try again.
          </p>
          {process.env.NODE_ENV === 'development' && this.state.error && (
            <details className="mb-4 p-3 border rounded-md bg-destructive/10 text-left text-xs w-full max-w-lg overflow-auto shadow-inner">
              <summary className="cursor-pointer font-semibold text-destructive">
                Error Details (Development Mode)
              </summary>
              <pre className="mt-2 whitespace-pre-wrap text-destructive-foreground">
                {this.state.error.stack || this.state.error.message}
                {this.state.errorInfo && (
                  <>
                    {'\n\nComponent Stack:\n'}
                    {this.state.errorInfo.componentStack}
                  </>
                )}
              </pre>
            </details>
          )}
          <Button onClick={this.handleRetry} variant="outline">
            Try Again
          </Button>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
