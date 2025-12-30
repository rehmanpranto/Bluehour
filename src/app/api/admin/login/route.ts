import { NextRequest, NextResponse } from 'next/server';
import { AdminLoginSchema } from '@/lib/admin-schemas';
import { verifyAdminPassword } from '@/lib/admin-auth';
import { checkRateLimit, getClientIp } from '@/lib/rate-limit';

export async function POST(request: NextRequest) {
  return NextResponse.json(
    {
      error:
        'This endpoint is no longer available. Please use your regular account login.',
    },
    { status: 410 }
  );
}
