/**
 * Mock Credits Provider - localStorage-backed implementation
 *
 * Stores credits state in browser localStorage for development/testing.
 * Phase 2: Replace with Supabase-backed implementation.
 */

import type { CreditsProvider, UsageData } from './types';

const STORAGE_KEY = 'wando:credits';
const DEFAULT_BALANCE = 50; // Free tier default
const DEFAULT_FREE_TRIP_AVAILABLE = true;

interface CreditsState {
  balance: number;
  usage: UsageData;
  freeTripUsed: boolean;
  lastUpdated: string;
}

function getDefaultState(): CreditsState {
  return {
    balance: DEFAULT_BALANCE,
    usage: {
      trips: 0,
      pdfs: 0,
    },
    freeTripUsed: !DEFAULT_FREE_TRIP_AVAILABLE,
    lastUpdated: new Date().toISOString(),
  };
}

function loadState(): CreditsState {
  if (typeof window === 'undefined') {
    // SSR safety
    return getDefaultState();
  }

  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) {
      return getDefaultState();
    }
    return JSON.parse(stored) as CreditsState;
  } catch (error) {
    console.warn('Failed to load credits state from localStorage:', error);
    return getDefaultState();
  }
}

function saveState(state: CreditsState): void {
  if (typeof window === 'undefined') {
    return;
  }

  try {
    const updated: CreditsState = {
      ...state,
      lastUpdated: new Date().toISOString(),
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  } catch (error) {
    console.error('Failed to save credits state to localStorage:', error);
  }
}

class MockCreditsProvider implements CreditsProvider {
  private getState(): CreditsState {
    return loadState();
  }

  private setState(state: CreditsState): void {
    saveState(state);
  }

  getBalance(): number {
    return this.getState().balance;
  }

  async grant(amount: number, reason?: string): Promise<void> {
    const state = this.getState();
    const newBalance = state.balance + amount;
    this.setState({
      ...state,
      balance: Math.max(0, newBalance),
    });

    // Placeholder for future analytics
    if (reason) {
      console.log(`Credits granted: ${amount} (reason: ${reason})`);
    }
  }

  async deduct(amount: number, reason?: string): Promise<boolean> {
    const state = this.getState();
    if (state.balance < amount) {
      // Placeholder for future analytics
      if (reason) {
        console.log(
          `Credits deduction failed: ${amount} requested, ${state.balance} available (reason: ${reason})`
        );
      }
      return false;
    }

    const newBalance = state.balance - amount;
    this.setState({
      ...state,
      balance: Math.max(0, newBalance),
    });

    // Placeholder for future analytics
    if (reason) {
      console.log(`Credits deducted: ${amount} (reason: ${reason})`);
    }

    return true;
  }

  getUsage(): UsageData {
    return { ...this.getState().usage };
  }

  async incTrip(): Promise<void> {
    const state = this.getState();
    this.setState({
      ...state,
      usage: {
        ...state.usage,
        trips: state.usage.trips + 1,
      },
    });
  }

  async incPdf(): Promise<void> {
    const state = this.getState();
    this.setState({
      ...state,
      usage: {
        ...state.usage,
        pdfs: state.usage.pdfs + 1,
      },
    });
  }

  getFreeTripUsed(): boolean {
    return this.getState().freeTripUsed;
  }

  async markFreeTripUsed(): Promise<void> {
    const state = this.getState();
    this.setState({
      ...state,
      freeTripUsed: true,
    });
  }
}

// Export singleton instance
export const mockCreditsProvider = new MockCreditsProvider();
