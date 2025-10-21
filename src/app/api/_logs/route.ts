import { NextRequest, NextResponse } from 'next/server';
import { getLogs, getLogStats } from '@/lib/log-buffer';

export async function GET(request: NextRequest) {
  // Block in production for security
  if (process.env.NODE_ENV === 'production') {
    return NextResponse.json(
      { error: 'Not available in production' },
      { status: 403 }
    );
  }

  const { searchParams } = new URL(request.url);
  const level = searchParams.get('level');
  const limit = parseInt(searchParams.get('limit') || '50');

  const logs = getLogs(level || undefined, limit);
  const stats = getLogStats();

  return NextResponse.json({
    logs,
    stats,
  });
}
