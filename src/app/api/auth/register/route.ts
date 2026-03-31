import { NextResponse } from 'next/server';
import { registerAuthUser, registerPayloadSchema } from '@/repos/auth';
import { createLoginResult } from '@/repos/auth';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = registerPayloadSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        {
          message: 'Invalid payload',
          errors: parsed.error.flatten(),
        },
        { status: 400 },
      );
    }

    const user = await registerAuthUser(parsed.data);
    const loginResult = await createLoginResult(user);

    const response = NextResponse.json(loginResult, { status: 201 });
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

    if (message === 'EMAIL_ALREADY_EXISTS') {
      return NextResponse.json(
        { message: 'Email already exists' },
        { status: 409 },
      );
    }

    return NextResponse.json({ message }, { status: 500 });
  }
}
