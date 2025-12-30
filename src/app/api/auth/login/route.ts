import { NextRequest, NextResponse } from 'next/server';
import { LoginSchema } from '@/lib/schemas';
import { verifyUserCredentials, findUserByEmail, createUser } from '@/lib/auth';
import { checkRateLimit, getClientIp } from '@/lib/rate-limit';

export async function POST(request: NextRequest) {
  try {
    const nodeEnv = process.env.NODE_ENV;
    const isProduction = nodeEnv === 'production';

    const clientIp = getClientIp(request);
    if (!checkRateLimit(`login:${clientIp}`)) {
      return NextResponse.json(
        { error: 'Too many login attempts. Please try again later.' },
        { status: 429 }
      );
    }

    const body = await request.json();

    // Validate input
    const validatedData = LoginSchema.parse(body);

    // Dev-only: support a demo/test account without manual setup
    if (!isProduction && validatedData.email === 'test@bluehour.local') {
      const testPassword = 'test12345';

      let existing = await findUserByEmail(validatedData.email);
      if (!existing) {
        await createUser(validatedData.email, testPassword, 'Test User');
        existing = await findUserByEmail(validatedData.email);
      }

      // If they typed the wrong password, keep this behavior predictable.
      if (validatedData.password !== testPassword || !existing) {
        return NextResponse.json(
          { error: 'Invalid email or password.' },
          { status: 401 }
        );
      }

      const response = NextResponse.json(
        {
          message: 'Login successful!',
          user: {
            id: existing.id,
            email: existing.email,
            full_name: existing.full_name,
          },
        },
        { status: 200 }
      );

      response.cookies.set('userId', existing.id, {
        httpOnly: true,
        secure: isProduction,
        sameSite: 'lax',
        maxAge: 60 * 60 * 24 * 7,
        path: '/',
      });

      return response;
    }

    // Verify credentials
    const user = await verifyUserCredentials(
      validatedData.email,
      validatedData.password
    );

    if (!user) {
      return NextResponse.json(
        { error: 'Invalid email or password.' },
        { status: 401 }
      );
    }

    // Create response with secure cookie
    const response = NextResponse.json(
      {
        message: 'Login successful!',
        user: {
          id: user.id,
          email: user.email,
          full_name: user.full_name,
        },
      },
      { status: 200 }
    );

    // Set secure session cookie
    response.cookies.set('userId', user.id, {
      httpOnly: true,
      secure: isProduction,
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: '/',
    });

    return response;
  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }
    return NextResponse.json({ error: 'Login failed' }, { status: 500 });
  }
}
