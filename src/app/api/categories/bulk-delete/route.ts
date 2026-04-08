import { ObjectId } from 'mongodb';
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { Permissions } from '@/configs/rbac';
import { guardApiPermission } from '@/lib/api-rbac';
import { deleteCategoriesByIds } from '@/repos/categories';

export const runtime = 'nodejs';

const bulkDeleteSchema = z.object({
  ids: z.array(z.string().min(1)).min(1),
});

export async function POST(req: NextRequest) {
  try {
    const denied = await guardApiPermission(req, Permissions.CategoriesWrite);
    if (denied) return denied;

    const body = await req.json();
    const parsed = bulkDeleteSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { message: 'Invalid payload', errors: parsed.error.flatten() },
        { status: 400 },
      );
    }

    const invalidIds = parsed.data.ids.filter((id) => !ObjectId.isValid(id));
    if (invalidIds.length > 0) {
      return NextResponse.json(
        {
          message: 'Some category ids are invalid',
          invalidIds,
        },
        { status: 400 },
      );
    }

    const result = await deleteCategoriesByIds(parsed.data.ids);

    return NextResponse.json({
      message: 'Bulk deleted successfully',
      ...result,
    });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : 'Internal Server Error';
    return NextResponse.json({ message }, { status: 500 });
  }
}
