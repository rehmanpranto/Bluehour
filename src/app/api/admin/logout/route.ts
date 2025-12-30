import { NextResponse } from 'next/server';

export async function POST() {
  return NextResponse.json(
    {
      error:
        'This endpoint is no longer available. You are already signed out of any admin area.',
    },
    { status: 410 }
  );
}
