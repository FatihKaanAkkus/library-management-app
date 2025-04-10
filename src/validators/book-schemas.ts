import { z } from 'zod';

export const createBookSchema = z.object({
  name: z.string().min(2).max(255),
});

export const returnBookSchema = z.object({
  score: z.number().min(1).max(10),
});

export type CreateBookSchema = z.infer<typeof createBookSchema>;
export type ReturnBookSchema = z.infer<typeof returnBookSchema>;
