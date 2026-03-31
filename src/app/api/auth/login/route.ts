import { NextResponse } from 'next/server';
import {
  authenticateUser,
  createLoginResult,
  loginPayloadSchema,
} from '@/repos/auth';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = loginPayloadSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        {
          message: 'Invalid payload',
          errors: parsed.error.flatten(),
        },
        { status: 400 },
      );
    }

    const user = await authenticateUser(
      parsed.data.email,
      parsed.data.password,
    );
    if (!user) {
      return NextResponse.json(
        { message: 'Invalid credentials' },
        { status: 401 },
      );
    }

    const loginResult = await createLoginResult(user);
    const response = NextResponse.json(loginResult);
    response.cookies.set('auth-token', loginResult.accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: loginResult.expiresIn,
    });
    return response;
  } catch (error) {
    const message =
      error instanceof Error ? error.message : 'Internal Server Error';
    return NextResponse.json({ message }, { status: 500 });
  }
}
