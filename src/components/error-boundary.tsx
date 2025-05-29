
'use client';

import React, { Component, ErrorInfo, ReactNode } from 'react';
import { Button } from '@/components/ui/button';
import { AlertTriangle } from 'lucide-react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Uncaught error:", error, errorInfo);
    // You could also log the error to an error reporting service here
  }

  private handleRetry = () => {
    this.setState({ hasError: false, error: undefined });
    // Potentially, you could try to re-render or redirect,
    // but simply resetting allows the children to try rendering again.
    // For more complex recovery, you might need to navigate or refresh.
    window.location.reload(); 
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="flex flex-col items-center justify-center min-h-[calc(100vh-200px)] text-center p-4">
          <AlertTriangle className="w-16 h-16 text-destructive mb-4" />
          <h1 className="text-2xl font-bold text-destructive mb-2">Oops! Something went wrong.</h1>
          <p className="text-muted-foreground mb-4">
            We encountered an unexpected error. Please try again.
          </p>
          {process.env.NODE_ENV === 'development' && this.state.error && (
            <details className="mb-4 p-2 border rounded bg-destructive/10 text-left text-xs w-full max-w-lg overflow-auto">
              <summary className="cursor-pointer font-semibold">Error Details (Development Mode)</summary>
              <pre className="mt-2 whitespace-pre-wrap">{this.state.error.stack || this.state.error.message}</pre>
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
