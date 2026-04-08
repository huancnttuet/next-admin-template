import { NextRequest, NextResponse } from 'next/server';
import { Permissions } from '@/configs/rbac';
import { guardApiPermission } from '@/lib/api-rbac';
import {
  createOrderSchema,
  findOrdersPaged,
  insertOrder,
  ORDER_STATUS_VALUES,
} from '@/repos/orders';

export const runtime = 'nodejs';

function toOrderStatus(value: string | null) {
  if (!value) return undefined;
  const normalized = value.toUpperCase();
  return ORDER_STATUS_VALUES.includes(
    normalized as (typeof ORDER_STATUS_VALUES)[number],
  )
    ? (normalized as (typeof ORDER_STATUS_VALUES)[number])
    : undefined;
}

export async function GET(req: NextRequest) {
  try {
    const denied = await guardApiPermission(req, Permissions.OrdersRead);
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
    const status = toOrderStatus(
      searchParams.get('Status') || searchParams.get('status'),
    );

    const result = await findOrdersPaged({
      page: Number.isFinite(page) && page > 0 ? page : 1,
      pageSize: Number.isFinite(pageSize) && pageSize > 0 ? pageSize : 10,
      keyword,
      status,
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
    const denied = await guardApiPermission(req, Permissions.OrdersWrite);
    if (denied) return denied;

    const body = await req.json();
    const parsed = createOrderSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { message: 'Invalid payload', errors: parsed.error.flatten() },
        { status: 400 },
      );
    }

    const order = await insertOrder(parsed.data);
    return NextResponse.json(order, { status: 201 });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : 'Internal Server Error';
    const isDuplicateError =
      typeof message === 'string' &&
      message.includes('E11000 duplicate key error');

    return NextResponse.json(
      {
        message: isDuplicateError ? 'Order id already exists' : message,
      },
      { status: isDuplicateError ? 409 : 500 },
    );
  }
}
