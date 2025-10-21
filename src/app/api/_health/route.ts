import { NextResponse } from 'next/server';

export async function GET() {
  const buildTime = process.env.BUILD_TIME || new Date().toISOString();
  const commitHash = process.env.VERCEL_GIT_COMMIT_SHA || process.env.GIT_COMMIT_SHA || 'unknown';
  
  return NextResponse.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    buildTime,
    commitHash,
    environment: process.env.NODE_ENV,
  });
}
