import { NextRequest, NextResponse } from 'next/server';
import { Permissions } from '@/configs/rbac';
import { guardApiPermission } from '@/lib/api-rbac';
import {
  createProductSchema,
  findProductsPaged,
  insertProduct,
} from '@/repos/products';

export const runtime = 'nodejs';

export async function GET(req: NextRequest) {
  try {
    const denied = await guardApiPermission(req, Permissions.ProductsRead);
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
    const category =
      searchParams.get('Category') || searchParams.get('category') || undefined;
    const categoriesFromParams = [
      ...searchParams.getAll('Categories'),
      ...searchParams.getAll('categories'),
    ]
      .flatMap((value) => value.split(','))
      .map((value) => value.trim())
      .filter((value) => value.length > 0);
    const categories =
      categoriesFromParams.length > 0 ? categoriesFromParams : undefined;
    const isActiveRaw =
      searchParams.get('IsActive') || searchParams.get('isActive');
    const isActive =
      isActiveRaw === null
        ? undefined
        : isActiveRaw === 'true'
          ? true
          : isActiveRaw === 'false'
            ? false
            : undefined;
    const isFeaturedRaw =
      searchParams.get('IsFeatured') || searchParams.get('isFeatured');
    const isFeatured =
      isFeaturedRaw === null
        ? undefined
        : isFeaturedRaw === 'true'
          ? true
          : isFeaturedRaw === 'false'
            ? false
            : undefined;

    const result = await findProductsPaged({
      page: Number.isFinite(page) && page > 0 ? page : 1,
      pageSize: Number.isFinite(pageSize) && pageSize > 0 ? pageSize : 10,
      keyword,
      category,
      categories,
      isActive,
      isFeatured,
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
    const denied = await guardApiPermission(req, Permissions.ProductsWrite);
    if (denied) return denied;

    const body = await req.json();
    const parsed = createProductSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { message: 'Invalid payload', errors: parsed.error.flatten() },
        { status: 400 },
      );
    }

    const product = await insertProduct(parsed.data);
    return NextResponse.json(product, { status: 201 });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : 'Internal Server Error';
    const isDuplicateError =
      typeof message === 'string' &&
      message.includes('E11000 duplicate key error');

    return NextResponse.json(
      {
        message: isDuplicateError
          ? 'Product name or sku already exists'
          : message,
      },
      { status: isDuplicateError ? 409 : 500 },
    );
  }
}
