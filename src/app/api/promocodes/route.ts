import { NextRequest, NextResponse } from 'next/server';
import { Permissions } from '@/configs/rbac';
import { guardApiPermission } from '@/lib/api-rbac';
import {
  createPromocodeSchema,
  findPromocodesPaged,
  insertPromocode,
} from '@/repos/promocodes';

export const runtime = 'nodejs';

export async function GET(req: NextRequest) {
  try {
    const denied = await guardApiPermission(req, Permissions.PromocodesRead);
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
    const isActiveRaw =
      searchParams.get('IsActive') || searchParams.get('isActive');
    const discountTypeRaw =
      searchParams.get('DiscountType') || searchParams.get('discountType');
    const isActive =
      isActiveRaw === null
        ? undefined
        : isActiveRaw === 'true'
          ? true
          : isActiveRaw === 'false'
            ? false
            : undefined;
    const discountType =
      discountTypeRaw === 'percent' || discountTypeRaw === 'fixed'
        ? discountTypeRaw
        : undefined;

    const result = await findPromocodesPaged({
      page: Number.isFinite(page) && page > 0 ? page : 1,
      pageSize: Number.isFinite(pageSize) && pageSize > 0 ? pageSize : 10,
      keyword,
      isActive,
      discountType,
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
    const denied = await guardApiPermission(req, Permissions.PromocodesWrite);
    if (denied) return denied;

    const body = await req.json();
    const parsed = createPromocodeSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { message: 'Invalid payload', errors: parsed.error.flatten() },
        { status: 400 },
      );
    }

    const promocode = await insertPromocode(parsed.data);
    return NextResponse.json(promocode, { status: 201 });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : 'Internal Server Error';
    const isDuplicateError =
      typeof message === 'string' &&
      message.includes('E11000 duplicate key error');

    return NextResponse.json(
      {
        message: isDuplicateError ? 'Promocode code already exists' : message,
      },
      { status: isDuplicateError ? 409 : 500 },
    );
  }
}
