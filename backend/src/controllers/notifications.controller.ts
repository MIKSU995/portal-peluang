import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// GET /api/notifications
export const getNotifications = async (req: Request, res: Response) => {
  try {
    const userId = (req.query.userId as string) || 'user-demo';

    const notifications = await prisma.notification.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' }
    });

    return res.status(200).json(notifications);
  } catch (error) {
    return res.status(500).json({ message: 'Gagal mengambil notifikasi' });
  }
};

// PATCH /api/notifications/:id/read (Tandai 1 notifikasi dibaca)
export const markNotificationAsRead = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    await prisma.notification.update({
      where: { id },
      data: { isRead: true }
    });
    return res.status(200).json({ message: 'Tandai dibaca berhasil' });
  } catch (error) {
    return res.status(500).json({ message: 'Gagal memperbarui notifikasi' });
  }
};

// PATCH /api/notifications/read-all (Tandai semua dibaca)
export const markAllAsRead = async (req: Request, res: Response) => {
  try {
    const userId = (req.body.userId as string) || 'user-demo';
    await prisma.notification.updateMany({
      where: { userId, isRead: false },
      data: { isRead: true }
    });
    return res.status(200).json({ message: 'Semua notifikasi ditandai dibaca' });
  } catch (error) {
    return res.status(500).json({ message: 'Gagal memperbarui notifikasi' });
  }
};