/**
 * useCredits Hook
 *
 * React hook providing credits functionality to components.
 * Returns the CreditsProvider instance (mock for MVP, Supabase in Phase 2).
 */

import { mockCreditsProvider } from '@/lib/credits/mock';
import type { CreditsProvider } from '@/lib/credits/types';

/**
 * Hook to access credits functionality
 *
 * @example
 * ```tsx
 * const credits = useCredits();
 * const balance = credits.getBalance();
 * await credits.deduct(10, 'trip_generation');
 * ```
 */
export function useCredits(): CreditsProvider {
  return mockCreditsProvider;
}
