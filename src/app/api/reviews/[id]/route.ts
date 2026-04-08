import { NextRequest, NextResponse } from 'next/server';
import { Permissions } from '@/configs/rbac';
import { guardApiPermission } from '@/lib/api-rbac';
import {
  deleteReviewById,
  findReviewById,
  updateReviewById,
  updateReviewSchema,
} from '@/repos/reviews';

export const runtime = 'nodejs';

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const denied = await guardApiPermission(req, Permissions.ReviewsRead);
    if (denied) return denied;

    const { id } = await params;
    const review = await findReviewById(id);
    if (!review) {
      return NextResponse.json(
        { message: 'Review not found' },
        { status: 404 },
      );
    }
    return NextResponse.json(review);
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
    const denied = await guardApiPermission(req, Permissions.ReviewsWrite);
    if (denied) return denied;

    const body = await req.json();
    const parsed = updateReviewSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { message: 'Invalid payload', errors: parsed.error.flatten() },
        { status: 400 },
      );
    }

    const { id } = await params;
    const review = await updateReviewById(id, parsed.data);
    if (!review) {
      return NextResponse.json(
        { message: 'Review not found' },
        { status: 404 },
      );
    }
    return NextResponse.json(review);
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
    const denied = await guardApiPermission(req, Permissions.ReviewsWrite);
    if (denied) return denied;

    const { id } = await params;
    const deleted = await deleteReviewById(id);
    if (!deleted) {
      return NextResponse.json(
        { message: 'Review not found' },
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
