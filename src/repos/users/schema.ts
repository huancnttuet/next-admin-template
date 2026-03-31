import { z } from 'zod';

export const createUserSchema = z.object({
  fullName: z.string().min(1),
  userName: z.string().min(1),
  email: z.string().email(),
  isVerify: z.boolean().optional().default(false),
  isLock: z.boolean().optional().default(false),
});

export const updateUserSchema = createUserSchema.partial();
