import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// GET /api/applications (Ambil status lamaran user)
export const getUserApplications = async (req: Request, res: Response) => {
  try {
    const userId = (req.query.userId as string) || 'user-demo';

    const applications = await prisma.userApplication.findMany({
      where: { userId },
    });

    // Format menjadi Map { [oppId]: application }
    const appMap: Record<string, any> = {};
    applications.forEach((app) => {
      appMap[app.opportunityId] = app;
    });

    return res.status(200).json(appMap);
  } catch (error) {
    console.error('Error fetching user applications:', error);
    return res.status(500).json({ message: 'Gagal mengambil data pelacakan lamaran' });
  }
};

// PUT /api/applications (Update atau tambah status lamaran)
export const updateApplicationStatus = async (req: Request, res: Response) => {
  try {
    const { opportunityId, status, notes, userId = 'user-demo' } = req.body;

    if (!opportunityId || !status) {
      return res.status(400).json({ message: 'opportunityId dan status wajib diisi' });
    }

    const application = await prisma.userApplication.upsert({
      where: {
        userId_opportunityId: { userId, opportunityId }
      },
      update: { status, notes },
      create: { userId, opportunityId, status, notes }
    });

    return res.status(200).json(application);
  } catch (error) {
    console.error('Error updating application:', error);
    return res.status(500).json({ message: 'Gagal memperbarui status lamaran' });
  }
};

// DELETE /api/applications/:opportunityId (Hapus dari tracker)
export const removeApplication = async (req: Request, res: Response) => {
  try {
    const { opportunityId } = req.params;
    const userId = (req.query.userId as string) || 'user-demo';

    await prisma.userApplication.delete({
      where: {
        userId_opportunityId: { userId, opportunityId }
      }
    });

    return res.status(200).json({ message: 'Berhasil dihapus dari tracker' });
  } catch (error) {
    console.error('Error removing application:', error);
    return res.status(500).json({ message: 'Gagal menghapus lamaran' });
  }
};