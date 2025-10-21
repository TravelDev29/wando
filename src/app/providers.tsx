"use client";

import { useEffect } from 'react';
import { logClientError } from '@/lib/logger';

export function ErrorCaptureProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    // Capture unhandled JavaScript errors
    const handleError = (event: ErrorEvent) => {
      logClientError(event.error, {
        type: 'javascript_error',
        filename: event.filename,
        lineno: event.lineno,
        colno: event.colno,
        message: event.message,
      });
    };

    // Capture unhandled promise rejections
    const handleUnhandledRejection = (event: PromiseRejectionEvent) => {
      logClientError(event.reason, {
        type: 'unhandled_promise_rejection',
        reason: event.reason,
      });
    };

    // Register event listeners
    window.addEventListener('error', handleError);
    window.addEventListener('unhandledrejection', handleUnhandledRejection);

    // Cleanup
    return () => {
      window.removeEventListener('error', handleError);
      window.removeEventListener('unhandledrejection', handleUnhandledRejection);
    };
  }, []);

  return <>{children}</>;
}
