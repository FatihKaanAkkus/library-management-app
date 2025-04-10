import { Router } from 'express';
import { validateCreateBook } from '@/middlewares/validate-book';
import * as bookController from '@/controllers/book-controller';
import { checkCachedBook, checkCachedBooks } from '@/middlewares/check-cached-resource';

const router = Router();

router.get('/', [checkCachedBooks], bookController.indexBooks);
router.post('/', [validateCreateBook], bookController.createBook);
router.get('/:id', [checkCachedBook], bookController.showBook);

export default router;
