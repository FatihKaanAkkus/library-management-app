import type { Request, Response, NextFunction } from 'express';
import { createUserSchema } from '@/validators/user-schemas';
import { fromError } from 'zod-validation-error';
import { returnBookSchema } from '@/validators/book-schemas';

export const validateCreateUser = (req: Request, res: Response, next: NextFunction) => {
  const result = createUserSchema.safeParse(req.body);

  if (!result.success) {
    const validationError = fromError(result.error);
    res.status(400).json({ message: validationError.toString() });
    return;
  }

  req.body = result.data;
  next();
};

export const validateReturnBook = (req: Request, res: Response, next: NextFunction) => {
  const result = returnBookSchema.safeParse(req.body);

  if (!result.success) {
    const validationError = fromError(result.error);
    res.status(400).json({ message: validationError.toString() });
    return;
  }

  next();
};
