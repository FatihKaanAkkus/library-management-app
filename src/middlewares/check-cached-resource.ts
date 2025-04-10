import type { Request, Response, NextFunction } from 'express';
import cache from '@/config/cache';
import { keys } from '@/helpers/cache-keys';

export const checkCachedUsers = async (req: Request, res: Response, next: NextFunction) => {
  const cacheKey = keys.user.index();
  const cachedUsers = await cache.get(cacheKey);
  if (cachedUsers) {
    res.status(200).json(cachedUsers);
    return;
  }

  res.locals.cacheKey = cacheKey;
  next();
};

export const checkCachedUser = async (req: Request<{ id: string }>, res: Response, next: NextFunction) => {
  const { id } = req.params;
  const cacheKey = keys.user.show(id);
  const cachedUser = await cache.get(cacheKey);
  if (cachedUser) {
    res.status(200).json(cachedUser);
    return;
  }

  res.locals.cacheKey = cacheKey;
  next();
};

export const checkCachedBooks = async (req: Request, res: Response, next: NextFunction) => {
  const cacheKey = keys.book.index();
  const cachedBooks = await cache.get(cacheKey);
  if (cachedBooks) {
    res.status(200).json(cachedBooks);
    return;
  }

  res.locals.cacheKey = cacheKey;
  next();
};

export const checkCachedBook = async (req: Request<{ id: string }>, res: Response, next: NextFunction) => {
  const { id } = req.params;
  const cacheKey = keys.book.show(id);
  const cachedBook = await cache.get(cacheKey);
  if (cachedBook) {
    res.status(200).json(cachedBook);
    return;
  }

  res.locals.cacheKey = cacheKey;
  next();
};
