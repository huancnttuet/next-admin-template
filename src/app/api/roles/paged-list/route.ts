import { NextRequest } from 'next/server';
import { GET as getRoles } from '@/app/api/roles/route';

export const runtime = 'nodejs';

export async function GET(req: NextRequest) {
  return getRoles(req);
}
