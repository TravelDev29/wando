'use client';

import { useState, useEffect } from 'react';
import { useCredits } from '@/hooks/use-credits';
import { Button } from '@/components/ui/button';

/**
 * Dev Credits Testing Page
 *
 * Manual verification page for credits functionality.
 * Access at /dev/credits when running dev server.
 */
export default function DevCreditsPage() {
  const credits = useCredits();
  const [balance, setBalance] = useState(0);
  const [usage, setUsage] = useState({ trips: 0, pdfs: 0 });
  const [freeTripUsed, setFreeTripUsed] = useState(false);
  const [loading, setLoading] = useState(false);

  const refreshState = () => {
    setBalance(credits.getBalance());
    setUsage(credits.getUsage());
    setFreeTripUsed(credits.getFreeTripUsed());
  };

  useEffect(() => {
    refreshState();
  }, []);

  const handleGrant = async () => {
    setLoading(true);
    await credits.grant(10, 'dev_test');
    refreshState();
    setLoading(false);
  };

  const handleDeduct = async () => {
    setLoading(true);
    const success = await credits.deduct(5, 'dev_test');
    if (!success) {
      alert('Insufficient credits!');
    }
    refreshState();
    setLoading(false);
  };

  const handleIncTrip = async () => {
    setLoading(true);
    await credits.incTrip();
    refreshState();
    setLoading(false);
  };

  const handleIncPdf = async () => {
    setLoading(true);
    await credits.incPdf();
    refreshState();
    setLoading(false);
  };

  const handleMarkFreeTrip = async () => {
    setLoading(true);
    await credits.markFreeTripUsed();
    refreshState();
    setLoading(false);
  };

  const handleReset = () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('wando:credits');
      refreshState();
    }
  };

  return (
    <div className="min-h-screen p-8 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Credits Dev Testing</h1>

      <div className="space-y-6">
        {/* Current State */}
        <div className="border rounded-lg p-4 space-y-2">
          <h2 className="text-lg font-semibold">Current State</h2>
          <div>
            <strong>Balance:</strong> {balance} credits
          </div>
          <div>
            <strong>Trips:</strong> {usage.trips}
          </div>
          <div>
            <strong>PDFs:</strong> {usage.pdfs}
          </div>
          <div>
            <strong>Free Trip Used:</strong> {freeTripUsed ? 'Yes' : 'No'}
          </div>
        </div>

        {/* Actions */}
        <div className="border rounded-lg p-4 space-y-3">
          <h2 className="text-lg font-semibold">Actions</h2>
          <div className="flex flex-wrap gap-2">
            <Button onClick={handleGrant} disabled={loading}>
              Grant 10 Credits
            </Button>
            <Button onClick={handleDeduct} disabled={loading}>
              Deduct 5 Credits
            </Button>
            <Button onClick={handleIncTrip} disabled={loading}>
              Increment Trip
            </Button>
            <Button onClick={handleIncPdf} disabled={loading}>
              Increment PDF
            </Button>
            <Button onClick={handleMarkFreeTrip} disabled={loading}>
              Mark Free Trip Used
            </Button>
            <Button
              onClick={handleReset}
              disabled={loading}
              variant="destructive"
            >
              Reset (Clear localStorage)
            </Button>
          </div>
        </div>

        {/* Info */}
        <div className="text-sm text-muted-foreground">
          <p>
            This page is for development testing only. Credits are stored in
            localStorage with key: <code>wando:credits</code>
          </p>
        </div>
      </div>
    </div>
  );
}
