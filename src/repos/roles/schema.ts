import { z } from 'zod';
import { ALL_PERMISSIONS } from '@/configs/rbac';

export const createRoleSchema = z.object({
  name: z.string().min(1),
  code: z.string().min(1),
  description: z.string().optional().default(''),
  userIds: z.array(z.string()).optional().default([]),
  permissions: z
    .array(
      z
        .string()
        .refine((value) => (ALL_PERMISSIONS as string[]).includes(value)),
    )
    .optional()
    .default([]),
});

export const updateRoleSchema = createRoleSchema.partial();
