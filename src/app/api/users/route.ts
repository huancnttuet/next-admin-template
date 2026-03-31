import { NextRequest, NextResponse } from 'next/server';
import { Permissions } from '@/configs/rbac';
import { guardApiPermission } from '@/lib/api-rbac';
import { createUserSchema, findUsersPaged, insertUser } from '@/repos/users';

export const runtime = 'nodejs';

function parseBooleanParam(value: string | null): boolean | undefined {
  if (value === null) return undefined;
  if (value === 'true') return true;
  if (value === 'false') return false;
  return undefined;
}

export async function GET(req: NextRequest) {
  try {
    const denied = await guardApiPermission(req, Permissions.UsersRead);
    if (denied) return denied;

    const searchParams = req.nextUrl.searchParams;
    const page = Number(
      searchParams.get('Page') || searchParams.get('page') || '1',
    );
    const pageSize = Number(
      searchParams.get('PageSize') || searchParams.get('pageSize') || '10',
    );
    const keyword =
      searchParams.get('Keyword') || searchParams.get('keyword') || undefined;
    const isVerify = parseBooleanParam(
      searchParams.get('IsVerify') || searchParams.get('isVerify'),
    );
    const isLock = parseBooleanParam(
      searchParams.get('IsLock') || searchParams.get('isLock'),
    );

    const result = await findUsersPaged({
      page: Number.isFinite(page) && page > 0 ? page : 1,
      pageSize: Number.isFinite(pageSize) && pageSize > 0 ? pageSize : 10,
      keyword,
      isVerify,
      isLock,
    });

    return NextResponse.json(result);
  } catch (error) {
    const message =
      error instanceof Error ? error.message : 'Internal Server Error';
    return NextResponse.json({ message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const denied = await guardApiPermission(req, Permissions.UsersWrite);
    if (denied) return denied;

    const body = await req.json();
    const parsed = createUserSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { message: 'Invalid payload', errors: parsed.error.flatten() },
        { status: 400 },
      );
    }

    const user = await insertUser(parsed.data);
    return NextResponse.json(user, { status: 201 });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : 'Internal Server Error';
    const isDuplicateError =
      typeof message === 'string' &&
      message.includes('E11000 duplicate key error');

    return NextResponse.json(
      {
        message: isDuplicateError
          ? 'Email or username already exists'
          : message,
      },
      { status: isDuplicateError ? 409 : 500 },
    );
  }
}
