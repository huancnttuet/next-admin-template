import { NextRequest, NextResponse } from 'next/server';
import { Permissions } from '@/configs/rbac';
import { guardApiPermission } from '@/lib/api-rbac';
import { deleteReviewsByIds } from '@/repos/reviews';

export const runtime = 'nodejs';

export async function POST(req: NextRequest) {
  try {
    const denied = await guardApiPermission(req, Permissions.ReviewsWrite);
    if (denied) return denied;

    const body = await req.json();
    const ids = Array.isArray(body?.ids) ? body.ids : [];

    if (ids.length === 0) {
      return NextResponse.json(
        { message: 'ids is required and must be a non-empty array' },
        { status: 400 },
      );
    }

    const result = await deleteReviewsByIds(ids);
    return NextResponse.json(result);
  } catch (error) {
    const message =
      error instanceof Error ? error.message : 'Internal Server Error';
    return NextResponse.json({ message }, { status: 500 });
  }
}
