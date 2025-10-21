import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import '../index.css';
import '../App.css';
import { ThemeProvider } from '../providers/theme-provider';
import { TooltipProvider } from '../components/ui/tooltip';
import { ErrorCaptureProvider } from './providers';
import { ErrorBoundary } from '../components/dev/ErrorBoundary';
import { DebugPanel } from '../components/dev/DebugPanel';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'Wando',
  description: 'Travel planning made easy',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ErrorCaptureProvider>
          <ThemeProvider>
            <TooltipProvider>
              <ErrorBoundary>{children}</ErrorBoundary>
            </TooltipProvider>
          </ThemeProvider>
        </ErrorCaptureProvider>
        {process.env.NEXT_PUBLIC_DEBUG === '1' && <DebugPanel />}
      </body>
    </html>
  );
}
