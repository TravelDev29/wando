'use client';

import React, { Component, ErrorInfo, ReactNode } from 'react';
import { logger } from '@/lib/logger';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
  errorInfo?: ErrorInfo;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    this.setState({ error, errorInfo });

    // Log the error
    logger.error('React Error Boundary caught an error', error.stack, {
      componentStack: errorInfo.componentStack,
      errorBoundary: true,
    });
  }

  private handleCopyDetails = () => {
    const { error, errorInfo } = this.state;
    if (!error) return;

    const details = {
      error: {
        name: error.name,
        message: error.message,
        stack: error.stack,
      },
      errorInfo: {
        componentStack: errorInfo?.componentStack,
      },
      timestamp: new Date().toISOString(),
      userAgent: navigator.userAgent,
      url: window.location.href,
    };

    navigator.clipboard.writeText(JSON.stringify(details, null, 2));
  };

  private handleReport = async () => {
    const { error, errorInfo } = this.state;
    if (!error) return;

    try {
      await fetch('/api/_log', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          level: 'error',
          message: `Error Boundary: ${error.message}`,
          stack: error.stack,
          context: {
            componentStack: errorInfo?.componentStack,
            errorBoundary: true,
            userAgent: navigator.userAgent,
            url: window.location.href,
          },
          timestamp: new Date().toISOString(),
        }),
      });
    } catch (err) {
      console.error('Failed to report error:', err);
    }
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <div className="max-w-md w-full bg-white shadow-lg rounded-lg p-6">
            <div className="flex items-center mb-4">
              <div className="flex-shrink-0">
                <svg
                  className="h-8 w-8 text-red-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L4.268 19.5c-.77.833.192 2.5 1.732 2.5z"
                  />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-lg font-medium text-gray-900">
                  Something went wrong
                </h3>
                <p className="text-sm text-gray-500">
                  An unexpected error occurred. The error has been logged.
                </p>
              </div>
            </div>

            {process.env.NODE_ENV === 'development' && (
              <div className="mt-4">
                <details className="mb-4">
                  <summary className="cursor-pointer text-sm text-gray-600 hover:text-gray-800">
                    Error Details
                  </summary>
                  <pre className="mt-2 text-xs bg-gray-100 p-2 rounded overflow-auto max-h-32">
                    {this.state.error?.stack}
                  </pre>
                </details>

                <div className="flex space-x-2">
                  <button
                    onClick={this.handleCopyDetails}
                    className="px-3 py-1 text-xs bg-gray-100 hover:bg-gray-200 rounded"
                  >
                    Copy Details
                  </button>
                  <button
                    onClick={this.handleReport}
                    className="px-3 py-1 text-xs bg-blue-100 hover:bg-blue-200 text-blue-800 rounded"
                  >
                    Report Error
                  </button>
                </div>
              </div>
            )}

            <div className="mt-4">
              <button
                onClick={() => window.location.reload()}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded"
              >
                Reload Page
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
