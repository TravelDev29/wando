/**
 * Credits System Types & Interfaces
 *
 * Defines the CreditsProvider interface and related types for the credits system.
 * This interface supports both mock (localStorage) and future Supabase implementations.
 */

export interface UsageData {
  trips: number;
  pdfs: number;
}

export interface CreditsProvider {
  /**
   * Get current credit balance
   */
  getBalance(): number;

  /**
   * Grant credits to user (e.g., after purchase, promo)
   * @param amount - Number of credits to grant
   * @param reason - Optional reason for tracking/analytics
   */
  grant(amount: number, reason?: string): Promise<void>;

  /**
   * Deduct credits from user (returns false if insufficient)
   * @param amount - Number of credits to deduct
   * @param reason - Optional reason for tracking/analytics
   * @returns true if deduction succeeded, false if insufficient credits
   */
  deduct(amount: number, reason?: string): Promise<boolean>;

  /**
   * Get current usage statistics
   */
  getUsage(): UsageData;

  /**
   * Increment trip generation count
   */
  incTrip(): Promise<void>;

  /**
   * Increment PDF export count
   */
  incPdf(): Promise<void>;

  /**
   * Check if free trip has been used
   */
  getFreeTripUsed(): boolean;

  /**
   * Mark free trip as used
   */
  markFreeTripUsed(): Promise<void>;
}

/**
 * Error thrown when credits operation fails
 */
export class InsufficientCreditsError extends Error {
  constructor(
    public requested: number,
    public available: number,
    message?: string
  ) {
    super(
      message ??
        `Insufficient credits: requested ${requested}, available ${available}`
    );
    this.name = 'InsufficientCreditsError';
  }
}
