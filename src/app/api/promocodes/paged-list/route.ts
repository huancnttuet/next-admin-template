import { NextRequest } from 'next/server';
import { GET as getPromocodes } from '@/app/api/promocodes/route';

export const runtime = 'nodejs';

export async function GET(req: NextRequest) {
  return getPromocodes(req);
}
