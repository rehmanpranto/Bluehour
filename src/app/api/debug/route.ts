import { NextRequest, NextResponse } from 'next/server';
import { getLoggedInUserId } from '@/lib/session';

export async function POST(request: NextRequest) {
  try {
    const userId = await getLoggedInUserId();
    const body = await request.json();

    return NextResponse.json({
      userId: userId || 'NO_USER_ID',
      receivedData: body,
      dataTypes: {
        entry_date: typeof body.entry_date,
        mood: typeof body.mood,
        anxiety: typeof body.anxiety,
        energy: typeof body.energy,
        felt_safe: typeof body.felt_safe,
      },
      nodeEnv: process.env.NODE_ENV,
      hasDatabaseUrl: !!process.env.DATABASE_URL,
    });
  } catch (error) {
    return NextResponse.json({ 
      error: error instanceof Error ? error.message : 'Unknown error' 
    }, { status: 500 });
  }
}
