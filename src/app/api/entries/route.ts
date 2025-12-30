import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { CreateMoodEntrySchema } from '@/lib/schemas';
import { checkRateLimit, getClientIp } from '@/lib/rate-limit';
import { getLoggedInUserId } from '@/lib/session';

export async function POST(request: NextRequest) {
  try {
    const userId = await getLoggedInUserId();
    if (!userId) {
      return NextResponse.json(
        { error: 'Please login to save a check-in.' },
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

    const body = await request.json();

    // Validation
    const validationResult = CreateMoodEntrySchema.safeParse(body);
    if (!validationResult.success) {
      // Log validation errors for debugging but return a gentle message
      console.error('Validation failed:', validationResult.error.flatten().fieldErrors);
      return NextResponse.json(
        {
          error: 'Something went wrong saving your reflection. Please try again.',
        },
        { status: 400 }
      );
    }

    const data = validationResult.data;

    // Insert into database (scoped to user)
    const result = await query(
      `INSERT INTO mood_entries 
        (user_id, entry_date, entry_time_label, mood, anxiety, energy, notes, triggers, helped, felt_safe, person_name)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, 'Blue Hour')
       RETURNING id, created_at, entry_date, entry_time_label, mood, anxiety, energy, notes, triggers, helped, felt_safe`,
      [
        userId,
        data.entry_date,
        data.entry_time_label || null,
        data.mood,
        data.anxiety,
        data.energy,
        data.notes || null,
        data.triggers.length > 0 ? data.triggers : null,
        data.helped.length > 0 ? data.helped : null,
        data.felt_safe,
      ]
    );

    if (result.rows.length === 0) {
      return NextResponse.json(
        { error: 'Failed to create entry' },
        { status: 500 }
      );
    }

    return NextResponse.json(result.rows[0], { status: 201 });
  } catch (error) {
    console.error('Error creating mood entry:', error);
    return NextResponse.json(
      { error: 'Something went wrong. Please try again.' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const userId = await getLoggedInUserId();
    if (!userId) {
      return NextResponse.json(
        { error: 'Please login to view your reflections.' },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const filter = searchParams.get('filter');

    let sql = `SELECT id, created_at, entry_date, entry_time_label, mood, anxiety, energy, notes, triggers, helped, felt_safe 
               FROM mood_entries
               WHERE user_id = $1`;
    const params: (string | number | boolean | null)[] = [userId];

    if (filter === 'low_mood') {
      sql += ` AND mood <= $2`;
      params.push(3);
    } else if (filter === 'high_anxiety') {
      sql += ` AND anxiety >= $2`;
      params.push(8);
    } else if (filter === 'not_safe') {
      sql += ` AND felt_safe = $2`;
      params.push(false);
    }

    sql += ` ORDER BY entry_date DESC, created_at DESC`;

    const result = await query(sql, params);

    return NextResponse.json(result.rows);
  } catch (error) {
    console.error('Error fetching mood entries:', error);
    return NextResponse.json(
      { error: 'Failed to fetch entries' },
      { status: 500 }
    );
  }
}
