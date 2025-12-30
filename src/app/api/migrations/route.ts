import { NextResponse } from 'next/server';
import { runMigrations } from '@/lib/migrations';

export async function POST() {
  try {
    await runMigrations();
    return NextResponse.json(
      { message: 'Migrations completed successfully' },
      { status: 200 }
    );
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Migration failed';
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
}
