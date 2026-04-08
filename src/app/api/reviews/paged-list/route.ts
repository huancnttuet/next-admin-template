import { NextRequest } from 'next/server';
import { GET as getReviews } from '@/app/api/reviews/route';

export const runtime = 'nodejs';

export async function GET(req: NextRequest) {
  return getReviews(req);
}
