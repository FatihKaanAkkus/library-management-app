import type { Request, Response, NextFunction } from 'express';
import { createBookSchema } from '@/validators/book-schemas';
import { fromError } from 'zod-validation-error';

export const validateCreateBook = (req: Request, res: Response, next: NextFunction) => {
  const result = createBookSchema.safeParse(req.body);

  if (!result.success) {
    const validationError = fromError(result.error);
    res.status(400).json({ message: validationError.toString() });
    return;
  }

  req.body = result.data;
  next();
};
