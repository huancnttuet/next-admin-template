import { NextRequest, NextResponse } from 'next/server';
import { Permissions } from '@/configs/rbac';
import { guardApiPermission } from '@/lib/api-rbac';
import {
  deleteCategoryById,
  findCategoryById,
  updateCategoryById,
  updateCategorySchema,
} from '@/repos/categories';

export const runtime = 'nodejs';

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const denied = await guardApiPermission(req, Permissions.CategoriesRead);
    if (denied) return denied;

    const { id } = await params;
    const category = await findCategoryById(id);
    if (!category) {
      return NextResponse.json(
        { message: 'Category not found' },
        { status: 404 },
      );
    }
    return NextResponse.json(category);
  } catch (error) {
    const message =
      error instanceof Error ? error.message : 'Internal Server Error';
    return NextResponse.json({ message }, { status: 500 });
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const denied = await guardApiPermission(req, Permissions.CategoriesWrite);
    if (denied) return denied;

    const body = await req.json();
    const parsed = updateCategorySchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { message: 'Invalid payload', errors: parsed.error.flatten() },
        { status: 400 },
      );
    }

    const { id } = await params;
    const category = await updateCategoryById(id, parsed.data);
    if (!category) {
      return NextResponse.json(
        { message: 'Category not found' },
        { status: 404 },
      );
    }
    return NextResponse.json(category);
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

export async function PATCH(
  req: NextRequest,
  context: { params: Promise<{ id: string }> },
) {
  return PUT(req, context);
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const denied = await guardApiPermission(req, Permissions.CategoriesWrite);
    if (denied) return denied;

    const { id } = await params;
    const deleted = await deleteCategoryById(id);
    if (!deleted) {
      return NextResponse.json(
        { message: 'Category not found' },
        { status: 404 },
      );
    }
    return NextResponse.json({ message: 'Deleted successfully' });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : 'Internal Server Error';
    return NextResponse.json({ message }, { status: 500 });
  }
}
