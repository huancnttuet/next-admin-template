import { NextRequest, NextResponse } from 'next/server';
import { Permissions } from '@/configs/rbac';
import { guardApiPermission } from '@/lib/api-rbac';
import {
  deletePromocodeById,
  findPromocodeById,
  updatePromocodeById,
  updatePromocodeSchema,
} from '@/repos/promocodes';

export const runtime = 'nodejs';

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const denied = await guardApiPermission(req, Permissions.PromocodesRead);
    if (denied) return denied;

    const { id } = await params;
    const promocode = await findPromocodeById(id);
    if (!promocode) {
      return NextResponse.json(
        { message: 'Promocode not found' },
        { status: 404 },
      );
    }

    return NextResponse.json(promocode);
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
    const denied = await guardApiPermission(req, Permissions.PromocodesWrite);
    if (denied) return denied;

    const body = await req.json();
    const parsed = updatePromocodeSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { message: 'Invalid payload', errors: parsed.error.flatten() },
        { status: 400 },
      );
    }

    const { id } = await params;
    const promocode = await updatePromocodeById(id, parsed.data);

    if (!promocode) {
      return NextResponse.json(
        { message: 'Promocode not found' },
        { status: 404 },
      );
    }

    return NextResponse.json(promocode);
  } catch (error) {
    const message =
      error instanceof Error ? error.message : 'Internal Server Error';

    return NextResponse.json({ message }, { status: 500 });
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
    const denied = await guardApiPermission(req, Permissions.PromocodesWrite);
    if (denied) return denied;

    const { id } = await params;
    const deleted = await deletePromocodeById(id);

    if (!deleted) {
      return NextResponse.json(
        { message: 'Promocode not found' },
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
