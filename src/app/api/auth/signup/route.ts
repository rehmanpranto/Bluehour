import { NextRequest, NextResponse } from 'next/server';
import { SignUpSchema } from '@/lib/schemas';
import { createUser, findUserByEmail } from '@/lib/auth';
import { checkRateLimit, getClientIp } from '@/lib/rate-limit';

export async function POST(request: NextRequest) {
  try {
    const clientIp = getClientIp(request);
    if (!checkRateLimit(`signup:${clientIp}`)) {
      return NextResponse.json(
        { error: 'Too many signup attempts. Please try again later.' },
        { status: 429 }
      );
    }

    const body = await request.json();
    
    // Validate input
    const validatedData = SignUpSchema.parse(body);
    
    // Check if user already exists
    const existingUser = await findUserByEmail(validatedData.email);
    if (existingUser) {
      return NextResponse.json(
        { error: 'Email already registered. Please login instead.' },
        { status: 409 }
      );
    }
    
    // Create user
    const user = await createUser(
      validatedData.email,
      validatedData.password,
      validatedData.full_name
    );
    
    return NextResponse.json(
      {
        message: 'Account created successfully!',
        user: {
          id: user.id,
          email: user.email,
          full_name: user.full_name,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json(
        { error: error.message },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { error: 'Failed to create account' },
      { status: 500 }
    );
  }
}
