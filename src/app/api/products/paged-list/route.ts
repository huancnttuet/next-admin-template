import { NextRequest } from 'next/server';
import { GET as getProducts } from '@/app/api/products/route';

export const runtime = 'nodejs';

export async function GET(req: NextRequest) {
  return getProducts(req);
}
