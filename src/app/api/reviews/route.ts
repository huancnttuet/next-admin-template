import { NextRequest, NextResponse } from 'next/server';
import { Permissions } from '@/configs/rbac';
import { guardApiPermission } from '@/lib/api-rbac';
import {
  createReviewSchema,
  findReviewsPaged,
  insertReview,
} from '@/repos/reviews';

export const runtime = 'nodejs';

export async function GET(req: NextRequest) {
  try {
    const denied = await guardApiPermission(req, Permissions.ReviewsRead);
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
    const productId =
      searchParams.get('ProductId') ||
      searchParams.get('productId') ||
      undefined;

    const result = await findReviewsPaged({
      page: Number.isFinite(page) && page > 0 ? page : 1,
      pageSize: Number.isFinite(pageSize) && pageSize > 0 ? pageSize : 10,
      keyword,
      productId,
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
    const denied = await guardApiPermission(req, Permissions.ReviewsWrite);
    if (denied) return denied;

    const body = await req.json();
    const parsed = createReviewSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { message: 'Invalid payload', errors: parsed.error.flatten() },
        { status: 400 },
      );
    }

    const review = await insertReview(parsed.data);
    return NextResponse.json(review, { status: 201 });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : 'Internal Server Error';

    return NextResponse.json({ message }, { status: 500 });
  }
}
