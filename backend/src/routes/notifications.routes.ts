import { Router } from 'express';
import { getNotifications, markNotificationAsRead, markAllAsRead } from '../controllers/notifications.controller';

const router = Router();

router.get('/', getNotifications);
router.patch('/read-all', markAllAsRead);
router.patch('/:id/read', markNotificationAsRead);

export default router;