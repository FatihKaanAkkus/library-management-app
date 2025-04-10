import { Request, Response } from 'express';
import prisma from '@/database/prisma-client';
import { CreateBookSchema } from '@/validators/book-schemas';
import cache from '@/config/cache';
import { keys } from '@/helpers/cache-keys';

/**
 * Indexes all books in the database.
 */
export const indexBooks = async (req: Request, res: Response) => {
  const books = await prisma.book.findMany({
    select: {
      id: true,
      name: true,
      score: true,
    },
  });

  await cache.set(res.locals.cacheKey as string, books);

  res.status(200).json(books);
};

/**
 * Creates a new book in the database.
 * Invalidates the book index cache after successfull operation.
 */
export const createBook = async (req: Request, res: Response) => {
  const { name } = req.body as CreateBookSchema;

  await prisma.book.create({
    data: {
      name,
    },
  });

  await cache.del(keys.book.index()); // <-- Invalidate the cache

  res.status(201).send();
};

/**
 * Shows a specific book by ID.
 */
export const showBook = async (req: Request<{ id: string }>, res: Response) => {
  const { id } = req.params;

  const book = await prisma.book.findUnique({
    where: {
      id: Number(id),
    },
    select: {
      id: true,
      name: true,
      score: true,
    },
  });

  if (!book) {
    res.status(404).json({ message: 'Book not found' });
    return;
  }

  await cache.set(res.locals.cacheKey, book);

  res.status(200).json(book);
};
