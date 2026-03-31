import { NextRequest } from 'next/server';
import { GET as getUsers } from '@/app/api/users/route';

export const runtime = 'nodejs';

export async function GET(req: NextRequest) {
  return getUsers(req);
}
