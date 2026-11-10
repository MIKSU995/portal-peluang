// backend/src/controllers/bookmarks.controller.ts
import { Request, Response } from 'express';
import { prisma } from '../lib/prisma';

export const toggleBookmark = async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: 'Silakan login terlebih dahulu' });
    }

    const { opportunityId } = req.body;
    if (!opportunityId) {
      return res.status(400).json({ message: 'opportunityId wajib diisi' });
    }

    const existing = await prisma.bookmark.findUnique({
      where: {
        userId_opportunityId: {
          userId: req.user.id,
          opportunityId,
        },
      },
    });

    if (existing) {
      await prisma.bookmark.delete({
        where: { id: existing.id },
      });
      return res.status(200).json({ message: 'Bookmark dihapus', isBookmarked: false });
    } else {
      await prisma.bookmark.create({
        data: {
          userId: req.user.id,
          opportunityId,
        },
      });
      return res.status(201).json({ message: 'Peluang berhasil disimpan', isBookmarked: true });
    }
  } catch (error) {
    console.error('Bookmark error:', error);
    return res.status(500).json({ message: 'Gagal memproses bookmark' });
  }
};

export const getMyBookmarks = async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: 'Silakan login terlebih dahulu' });
    }

    const bookmarks = await prisma.bookmark.findMany({
      where: { userId: req.user.id },
      orderBy: { opportunity: { deadline: 'asc' } },
      include: {
        opportunity: {
          include: {
            majors: {
              include: {
                major: { select: { name: true } },
              },
            },
          },
        },
      },
    });

    const now = new Date();
    const formatted = bookmarks.map((b) => {
      const deadline = new Date(b.opportunity.deadline);
      const diffMs = deadline.getTime() - now.getTime();
      const diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24));

      return {
        bookmarkId: b.id,
        savedAt: b.createdAt,
        daysRemaining: diffDays > 0 ? diffDays : 0,
        isExpired: diffDays <= 0,
        opportunity: {
          ...b.opportunity,
          isBookmarked: true,
          majors: b.opportunity.majors.map((m) => m.major.name),
        },
      };
    });

    return res.status(200).json({ data: formatted });
  } catch (error) {
    return res.status(500).json({ message: 'Gagal mengambil daftar bookmark' });
  }
};

