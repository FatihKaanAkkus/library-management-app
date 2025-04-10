import { Request, Response } from 'express';
import prisma from '@/database/prisma-client';
import { CreateUserSchema } from '@/validators/user-schemas';
import { ReturnBookSchema } from '@/validators/book-schemas';
import cache from '@/config/cache';
import { keys } from '@/helpers/cache-keys';

/**
 * Indexes all users in the database.
 */
export async function indexUsers(req: Request, res: Response) {
  const users = await prisma.user.findMany({
    select: {
      id: true,
      name: true,
    },
  });

  await cache.set(res.locals.cacheKey as string, users);

  res.status(200).json(users);
}

/**
 * Creates a new user in the database.
 * Invalidates the user index cache after successfull operation.
 */
export async function createUser(req: Request, res: Response) {
  const { name } = req.body as CreateUserSchema;

  await prisma.user.create({
    data: {
      name,
    },
  });

  await cache.del(keys.user.index()); // <-- Invalidate the cache

  res.status(201).send();
}

/**
 * Shows a specific user by ID.
 */
export async function showUser(req: Request<{ id: string }>, res: Response) {
  const { id } = req.params;

  const user = await prisma.user.findUnique({
    where: { id: Number(id) },
    select: {
      id: true,
      name: true,
      books: {
        select: {
          name: true,
        },
      },
      ratings: {
        select: {
          userScore: true,
          book: {
            select: {
              name: true,
            },
          },
        },
      },
    },
  });

  if (!user) {
    res.status(404).json({ message: 'User not found' });
    return;
  }

  const { books, ratings, ...rest } = user;

  const flattenedRatings = ratings.map((rating) => {
    const { book, ...rest } = rating;
    return { ...book, ...rest };
  });

  const response = {
    ...rest,
    books: {
      past: flattenedRatings,
      present: books,
    },
  };

  await cache.set(res.locals.cacheKey, response);

  res.status(200).json(response);
}

/**
 * Performs the action of borrowing a book by a user.
 * Invalidates multiple caches after successfull operation.
 */
export async function borrowBook(req: Request<{ userId: string; bookId: string }>, res: Response) {
  const { userId, bookId } = req.params;

  const user = await prisma.user.findUnique({
    where: { id: Number(userId) },
  });

  if (!user) {
    res.status(404).json({ message: 'User not found' });
    return;
  }

  const book = await prisma.book.findUnique({
    where: { id: Number(bookId) },
    select: {
      id: true,
      userId: true,
      user: true,
    },
  });

  if (!book) {
    res.status(404).json({ message: 'Book not found' });
    return;
  }

  if (book.userId) {
    if (book.userId !== user.id) {
      res.status(409).json({
        message: `Book already borrowed by another user (${book.user?.name})`,
      });
    } else {
      res.status(409).json({
        message: 'Book already borrowed by this user',
      });
    }
    return;
  }

  await prisma.user.update({
    where: { id: Number(user.id) },
    data: {
      books: {
        connect: {
          id: Number(book.id),
        },
      },
    },
  });

  await cache.mdel([
    keys.user.show(userId), // <-- Invalidate the cache
    keys.book.show(bookId),
  ]);

  res.status(204).send();
}

/**
 * Performs the action of returning a book by a user with a rating score.
 * Invalidates multiple caches after successfull operation.
 */
export async function returnBook(req: Request<{ userId: string; bookId: string }>, res: Response) {
  const { userId, bookId } = req.params;

  const user = await prisma.user.findUnique({
    where: { id: Number(userId) },
  });

  if (!user) {
    res.status(404).json({ message: 'User not found' });
    return;
  }

  const book = await prisma.book.findUnique({
    where: { id: Number(bookId) },
    select: {
      id: true,
      userId: true,
      ratingCount: true,
      ratingTotal: true,
    },
  });

  if (!book) {
    res.status(404).json({ message: 'Book not found' });
    return;
  }
  if (!book.userId) {
    res.status(409).json({ message: 'Book not borrowed' });
    return;
  }
  if (book.userId !== user.id) {
    res.status(409).json({ message: 'Book not borrowed by this user' });
    return;
  }

  const { score } = req.body as ReturnBookSchema;

  const count = book.ratingCount + 1;
  const total = book.ratingTotal + Number(score);
  const average = total / count;

  await prisma.rating.create({
    data: {
      userId: Number(user.id),
      bookId: Number(book.id),
      userScore: Number(score),
    },
  });

  await prisma.book.update({
    where: { id: Number(book.id) },
    data: {
      ratingCount: count,
      ratingTotal: total,
      score: average,
      user: {
        disconnect: {
          id: Number(user.id),
        },
      },
    },
  });

  await cache.mdel([
    keys.user.show(userId), // <-- Invalidate the cache
    keys.book.show(bookId),
    keys.book.index(),
  ]);

  res.status(204).send();
}
