"use client";

type LogLevel = 'debug' | 'info' | 'warn' | 'error';

interface LogEntry {
  level: LogLevel;
  message: string;
  stack?: string;
  context?: Record<string, unknown>;
  timestamp: string;
  requestId?: string;
}

class Logger {
  private isDev = process.env.NODE_ENV === 'development';
  private isDebug = process.env.NEXT_PUBLIC_DEBUG === '1';

  private getTimestamp(): string {
    return new Date().toISOString();
  }

  private getRequestId(): string | undefined {
    if (typeof window === 'undefined') return undefined;
    // Try to get request ID from headers or context
    return (window as Record<string, unknown>).__REQUEST_ID__ as string || document.querySelector('meta[name="x-request-id"]')?.getAttribute('content');
  }

  private formatMessage(level: LogLevel, message: string, context?: Record<string, unknown>): string {
    const timestamp = this.getTimestamp();
    const requestId = this.getRequestId();
    const prefix = `[${timestamp}] [${level.toUpperCase()}]`;
    const requestPrefix = requestId ? `[${requestId}]` : '';
    const contextStr = context ? ` ${JSON.stringify(context)}` : '';
    return `${prefix} ${requestPrefix} ${message}${contextStr}`;
  }

  private getColor(level: LogLevel): string {
    const colors = {
      debug: '\x1b[36m', // cyan
      info: '\x1b[32m',  // green
      warn: '\x1b[33m',  // yellow
      error: '\x1b[31m', // red
    };
    return colors[level];
  }

  private resetColor = '\x1b[0m';

  private logToConsole(level: LogLevel, message: string, context?: Record<string, unknown>): void {
    if (!this.isDev) return;

    const formattedMessage = this.formatMessage(level, message, context);
    const color = this.getColor(level);
    
    console.log(`${color}${formattedMessage}${this.resetColor}`);
  }

  private async logToAPI(level: LogLevel, message: string, stack?: string, context?: Record<string, unknown>): Promise<void> {
    if (!this.isDev) return;

    try {
      const entry: LogEntry = {
        level,
        message,
        stack,
        context,
        timestamp: this.getTimestamp(),
        requestId: this.getRequestId(),
      };

      await fetch('/api/_log', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(entry),
      });
    } catch (error) {
      console.error('Failed to send log to API:', error);
    }
  }

  debug(message: string, context?: Record<string, unknown>): void {
    this.logToConsole('debug', message, context);
    if (this.isDebug) {
      this.logToAPI('debug', message, undefined, context);
    }
  }

  info(message: string, context?: Record<string, unknown>): void {
    this.logToConsole('info', message, context);
    this.logToAPI('info', message, undefined, context);
  }

  warn(message: string, context?: Record<string, unknown>): void {
    this.logToConsole('warn', message, context);
    this.logToAPI('warn', message, undefined, context);
  }

  error(message: string, stack?: string, context?: Record<string, unknown>): void {
    this.logToConsole('error', message, context);
    this.logToAPI('error', message, stack, context);
  }
}

export const logger = new Logger();

export function logClientError(err: unknown, context?: Record<string, unknown>): void {
  const error = err instanceof Error ? err : new Error(String(err));
  const stack = error.stack;
  const message = error.message || 'Unknown error';
  
  logger.error(message, stack, {
    ...context,
    errorType: error.constructor.name,
    userAgent: typeof window !== 'undefined' ? window.navigator.userAgent : undefined,
    url: typeof window !== 'undefined' ? window.location.href : undefined,
  });
}
