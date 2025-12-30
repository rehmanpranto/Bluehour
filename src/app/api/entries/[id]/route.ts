import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { checkRateLimit, getClientIp } from '@/lib/rate-limit';
import { getLoggedInUserId } from '@/lib/session';

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const userId = await getLoggedInUserId();
    if (!userId) {
      return NextResponse.json(
        { error: 'Please login to manage your reflections.' },
        { status: 401 }
      );
    }

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

    const { id } = await params;

    // Validate UUID format
    const uuidRegex =
      /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    if (!uuidRegex.test(id)) {
      return NextResponse.json(
        { error: 'Invalid entry ID format' },
        { status: 400 }
      );
    }

    const result = await query('DELETE FROM mood_entries WHERE id = $1 AND user_id = $2', [id, userId]);

    if (result.rowCount === 0) {
      return NextResponse.json(
        { error: 'Entry not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting mood entry:', error);
    return NextResponse.json(
      { error: 'Failed to delete entry' },
      { status: 500 }
    );
  }
}
