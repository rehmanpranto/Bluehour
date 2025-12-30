import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { ImportEntriesSchema } from '@/lib/schemas';
import { checkRateLimit, getClientIp } from '@/lib/rate-limit';

export async function POST(request: NextRequest) {
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

    const body = await request.json();

    // Validation
    const validationResult = ImportEntriesSchema.safeParse(body);
    if (!validationResult.success) {
      return NextResponse.json(
        {
          error:
            'Invalid import data format. Please ensure you are importing a valid JSON export.',
          details: validationResult.error.flatten().fieldErrors,
        },
        { status: 400 }
      );
    }

    const entries = validationResult.data;
    let importedCount = 0;
    let skippedCount = 0;

    // Insert or update entries
    for (const entry of entries) {
      try {
        await query(
          `INSERT INTO mood_entries 
            (id, created_at, entry_date, entry_time_label, mood, anxiety, energy, notes, triggers, helped, felt_safe, person_name)
           VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, 'Rideeta')
           ON CONFLICT (id) DO UPDATE SET
            entry_date = $3,
            entry_time_label = $4,
            mood = $5,
            anxiety = $6,
            energy = $7,
            notes = $8,
            triggers = $9,
            helped = $10,
            felt_safe = $11`,
          [
            entry.id || crypto.randomUUID(),
            entry.created_at || new Date().toISOString(),
            entry.entry_date,
            entry.entry_time_label || null,
            entry.mood,
            entry.anxiety,
            entry.energy,
            entry.notes || null,
            entry.triggers?.length ? entry.triggers : null,
            entry.helped?.length ? entry.helped : null,
            entry.felt_safe,
          ]
        );
        importedCount++;
      } catch {
        skippedCount++;
      }
    }

    return NextResponse.json({
      success: true,
      imported: importedCount,
      skipped: skippedCount,
      message: `Imported ${importedCount} entries${skippedCount > 0 ? ` (${skippedCount} entries skipped)` : ''}.`,
    });
  } catch (error) {
    console.error('Error importing entries:', error);
    return NextResponse.json(
      { error: 'Failed to import entries' },
      { status: 500 }
    );
  }
}
