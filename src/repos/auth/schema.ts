import { z } from 'zod';

export const registerPayloadSchema = z
  .object({
    firstName: z.string().min(1),
    lastName: z.string().min(1),
    email: z.string().email(),
    password: z.string().min(6),
    confirmPassword: z.string().min(1),
  })
  .refine((data) => data.password === data.confirmPassword, {
    path: ['confirmPassword'],
    message: 'Passwords do not match',
  });

export const loginPayloadSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});
