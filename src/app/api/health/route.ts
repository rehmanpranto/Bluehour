import { NextResponse } from 'next/server';

export async function GET() {
  const checks = {
    nodeEnv: process.env.NODE_ENV || 'not set',
    hasDatabaseUrl: !!process.env.DATABASE_URL,
    databaseUrlPrefix: process.env.DATABASE_URL ? process.env.DATABASE_URL.substring(0, 20) + '...' : 'not set',
    timestamp: new Date().toISOString(),
  };

  return NextResponse.json(checks);
}
