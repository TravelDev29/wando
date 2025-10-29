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
 * const { balance } = useCredits();
 * const credits = useCredits();
 * await credits.deduct(10, 'trip_generation');
 * ```
 */
export function useCredits(): CreditsProvider & { balance: number | null } {
  const provider = mockCreditsProvider;
  return Object.assign(provider, {
    get balance(): number | null {
      try {
        return provider.getBalance();
      } catch {
        return null;
      }
    },
  }) as CreditsProvider & { balance: number | null };
}
