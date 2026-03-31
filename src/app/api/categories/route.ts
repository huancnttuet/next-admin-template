import { NextRequest, NextResponse } from 'next/server';
import { Permissions } from '@/configs/rbac';
import { guardApiPermission } from '@/lib/api-rbac';
import {
  createCategorySchema,
  findCategoriesPaged,
  insertCategory,
} from '@/repos/categories';

export const runtime = 'nodejs';

export async function GET(req: NextRequest) {
  try {
    const denied = await guardApiPermission(req, Permissions.CategoriesRead);
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
    const isActive =
      isActiveRaw === null
        ? undefined
        : isActiveRaw === 'true'
          ? true
          : isActiveRaw === 'false'
            ? false
            : undefined;

    const result = await findCategoriesPaged({
      page: Number.isFinite(page) && page > 0 ? page : 1,
      pageSize: Number.isFinite(pageSize) && pageSize > 0 ? pageSize : 10,
      keyword,
      isActive,
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
    const denied = await guardApiPermission(req, Permissions.CategoriesWrite);
    if (denied) return denied;

    const body = await req.json();
    const parsed = createCategorySchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { message: 'Invalid payload', errors: parsed.error.flatten() },
        { status: 400 },
      );
    }

    const category = await insertCategory(parsed.data);
    return NextResponse.json(category, { status: 201 });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : 'Internal Server Error';
    const isDuplicateError =
      typeof message === 'string' &&
      message.includes('E11000 duplicate key error');

    return NextResponse.json(
      {
        message: isDuplicateError
          ? 'Category slug or name already exists'
          : message,
      },
      { status: isDuplicateError ? 409 : 500 },
    );
  }
}
