import React, { Component, ErrorInfo, ReactNode } from 'react';
import { Button } from './button';
import { AlertTriangle, RefreshCw } from 'lucide-react';

interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
  errorInfo?: ErrorInfo;
}

interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
  showDetails?: boolean;
}

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);

    this.setState({
      error,
      errorInfo,
    });

    // Call optional error handler
    this.props.onError?.(error, errorInfo);
  }

  handleReset = () => {
    this.setState({ hasError: false, error: undefined, errorInfo: undefined });
  };

  handleReload = () => {
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="flex flex-col items-center justify-center min-h-[400px] p-8 text-center space-y-4">
          <div className="flex items-center space-x-2 text-destructive">
            <AlertTriangle className="h-8 w-8" />
            <h2 className="text-xl font-semibold">Something went wrong</h2>
          </div>

          <p className="text-muted-foreground max-w-md">
            An unexpected error occurred. You can try refreshing the page or contact support if the problem persists.
          </p>

          {this.props.showDetails && this.state.error && (
            <details className="text-left max-w-2xl w-full">
              <summary className="cursor-pointer text-sm text-muted-foreground hover:text-foreground">
                Error Details
              </summary>
              <div className="mt-2 p-3 bg-muted rounded-md text-xs font-mono overflow-auto max-h-32">
                <div className="text-red-600 font-semibold">{this.state.error.name}</div>
                <div className="text-red-500">{this.state.error.message}</div>
                {this.state.errorInfo?.componentStack && (
                  <div className="mt-2 text-muted-foreground">
                    {this.state.errorInfo.componentStack}
                  </div>
                )}
              </div>
            </details>
          )}

          <div className="flex space-x-2">
            <Button onClick={this.handleReset} variant="outline" size="sm">
              <RefreshCw className="h-4 w-4 mr-2" />
              Try Again
            </Button>
            <Button onClick={this.handleReload} size="sm">
              Reload Page
            </Button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

// Hook version for functional components
export function useErrorHandler() {
  return (error: Error, errorInfo?: ErrorInfo) => {
    console.error('Error caught by useErrorHandler:', error, errorInfo);
    // You could send this to an error reporting service
  };
}

// Simple error display component
export function ErrorDisplay({
  error,
  onRetry,
  className = ""
}: {
  error: Error | string;
  onRetry?: () => void;
  className?: string;
}) {
  const errorMessage = typeof error === 'string' ? error : error.message;

  return (
    <div className={`flex flex-col items-center justify-center p-4 space-y-2 ${className}`}>
      <AlertTriangle className="h-6 w-6 text-destructive" />
      <p className="text-sm text-destructive text-center">{errorMessage}</p>
      {onRetry && (
        <Button onClick={onRetry} variant="outline" size="sm">
          <RefreshCw className="h-4 w-4 mr-2" />
          Retry
        </Button>
      )}
    </div>
  );
}

// Loading fallback component
export function LoadingFallback({ message = "Loading..." }: { message?: string }) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[200px] space-y-2">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      <p className="text-sm text-muted-foreground">{message}</p>
    </div>
  );
}
