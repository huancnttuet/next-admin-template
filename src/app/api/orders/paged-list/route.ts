import { NextRequest } from 'next/server';
import { GET as getOrders } from '@/app/api/orders/route';

export const runtime = 'nodejs';

export async function GET(req: NextRequest) {
  return getOrders(req);
}
