import { NextRequest, NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';
import type { Permission } from '@/configs/rbac';
import { hasPermission } from '@/lib/rbac';

export async function guardApiPermission(
  req: NextRequest,
  requiredPermission: Permission,
): Promise<NextResponse | null> {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

  if (!token) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  if (!hasPermission(token.permissions, requiredPermission)) {
    return NextResponse.json({ message: 'Forbidden' }, { status: 403 });
  }

  return null;
}
