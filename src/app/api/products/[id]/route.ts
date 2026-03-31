import { NextRequest, NextResponse } from 'next/server';
import { Permissions } from '@/configs/rbac';
import { guardApiPermission } from '@/lib/api-rbac';
import {
  deleteProductById,
  findProductById,
  updateProductById,
  updateProductSchema,
} from '@/repos/products';

export const runtime = 'nodejs';

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const denied = await guardApiPermission(req, Permissions.ProductsRead);
    if (denied) return denied;

    const { id } = await params;
    const product = await findProductById(id);
    if (!product) {
      return NextResponse.json(
        { message: 'Product not found' },
        { status: 404 },
      );
    }
    return NextResponse.json(product);
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
    const denied = await guardApiPermission(req, Permissions.ProductsWrite);
    if (denied) return denied;

    const body = await req.json();
    const parsed = updateProductSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { message: 'Invalid payload', errors: parsed.error.flatten() },
        { status: 400 },
      );
    }

    const { id } = await params;
    const product = await updateProductById(id, parsed.data);
    if (!product) {
      return NextResponse.json(
        { message: 'Product not found' },
        { status: 404 },
      );
    }
    return NextResponse.json(product);
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
    const denied = await guardApiPermission(req, Permissions.ProductsWrite);
    if (denied) return denied;

    const { id } = await params;
    const deleted = await deleteProductById(id);
    if (!deleted) {
      return NextResponse.json(
        { message: 'Product not found' },
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
