// backend/src/routes/bookmarks.routes.ts
import { Router } from 'express';
import { toggleBookmark, getMyBookmarks } from '../controllers/bookmarks.controller';
import { authenticateUser } from '../middlewares/auth.middleware';

const router = Router();

router.use(authenticateUser);
router.post('/toggle', toggleBookmark);
router.get('/', getMyBookmarks);

export default router;

