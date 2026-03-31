import { NextRequest, NextResponse } from 'next/server';
import { Permissions } from '@/configs/rbac';
import { guardApiPermission } from '@/lib/api-rbac';
import { seedUsersIfEmpty } from '@/repos/users';

export const runtime = 'nodejs';

export async function POST(req: NextRequest) {
  try {
    const denied = await guardApiPermission(req, Permissions.UsersWrite);
    if (denied) return denied;

    const result = await seedUsersIfEmpty();
    return NextResponse.json(result);
  } catch (error) {
    const message =
      error instanceof Error ? error.message : 'Internal Server Error';
    return NextResponse.json({ message }, { status: 500 });
  }
}
