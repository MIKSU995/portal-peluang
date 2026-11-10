import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// GET /api/teams (List semua post pencarian tim atau filter by opportunityId)
export const getTeamPosts = async (req: Request, res: Response) => {
  try {
    const { opportunityId } = req.query;

    const where: any = {};
    if (opportunityId && typeof opportunityId === 'string' && opportunityId !== 'ALL') {
      where.opportunityId = opportunityId;
    }

    const posts = await prisma.teamPost.findMany({
      where,
      include: {
        opportunity: {
          select: { title: true }
        }
      },
      orderBy: { createdAt: 'desc' },
    });

    const formatted = posts.map(p => ({
      ...p,
      neededRoles: JSON.parse(p.neededRoles || '[]'),
      opportunityTitle: p.opportunity.title
    }));

    return res.status(200).json(formatted);
  } catch (error) {
    console.error('Error fetching team posts:', error);
    return res.status(500).json({ message: 'Gagal mengambil lowongan tim' });
  }
};

// POST /api/teams (Buat post pencarian tim baru)
export const createTeamPost = async (req: Request, res: Response) => {
  try {
    const { opportunityId, leaderName, leaderMajor, neededRoles, description, contactChannel, contactValue } = req.body;

    if (!opportunityId || !leaderName || !neededRoles || !contactValue) {
      return res.status(400).json({ message: 'Data tidak lengkap' });
    }

    const newPost = await prisma.teamPost.create({
      data: {
        opportunityId,
        leaderName,
        leaderMajor: leaderMajor || 'Teknik Informatika',
        neededRoles: JSON.stringify(neededRoles),
        description,
        contactChannel: contactChannel || 'whatsapp',
        contactValue,
      },
      include: {
        opportunity: {
          select: { title: true }
        }
      }
    });

    return res.status(201).json({
      ...newPost,
      neededRoles: JSON.parse(newPost.neededRoles),
      opportunityTitle: newPost.opportunity.title
    });
  } catch (error) {
    console.error('Error creating team post:', error);
    return res.status(500).json({ message: 'Gagal membuat postingan tim' });
  }
};