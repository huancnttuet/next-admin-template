import { NextRequest } from 'next/server';
import { GET as getCategories } from '@/app/api/categories/route';

export const runtime = 'nodejs';

export async function GET(req: NextRequest) {
  return getCategories(req);
}
