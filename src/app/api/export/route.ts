import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { checkRateLimit, getClientIp } from '@/lib/rate-limit';

export async function GET(request: NextRequest) {
  try {
    // Rate limiting
    const clientIp = getClientIp(request);
    if (!checkRateLimit(clientIp)) {
      return NextResponse.json(
        {
          error:
            'Too many requests. Please wait a moment before trying again.',
        },
        { status: 429 }
      );
    }

    const result = await query(
      `SELECT id, created_at, entry_date, entry_time_label, mood, anxiety, energy, notes, triggers, helped, felt_safe 
       FROM mood_entries 
       ORDER BY entry_date DESC, created_at DESC`
    );

    // Set headers for file download
    return new NextResponse(JSON.stringify(result.rows, null, 2), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Content-Disposition': `attachment; filename="rideeta-entries-${new Date().toISOString().split('T')[0]}.json"`,
      },
    });
  } catch (error) {
    console.error('Error exporting entries:', error);
    return NextResponse.json(
      { error: 'Failed to export entries' },
      { status: 500 }
    );
  }
}
