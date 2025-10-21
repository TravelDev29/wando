import { NextRequest, NextResponse } from 'next/server';
import { addLog } from '@/lib/log-buffer';

export async function POST(request: NextRequest) {
  // Block in production for security
  if (process.env.NODE_ENV === 'production') {
    return NextResponse.json(
      { error: 'Not available in production' },
      { status: 403 }
    );
  }

  try {
    const entry = await request.json();
    addLog(entry);
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
  }
}
