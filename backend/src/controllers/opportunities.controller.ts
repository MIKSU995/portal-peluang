import { Request, Response } from 'express';
import { PrismaClient, OpportunityCategory, OpportunityStatus } from '@prisma/client';

const prisma = new PrismaClient();

// GET /api/v1/opportunities (Pencarian, Filter, & Pagination)
export const getOpportunities = async (req: Request, res: Response) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const skip = (page - 1) * limit;

    const { search, category, status, majorId } = req.query;

    const where: any = {};

    // Filter Kategori & Status
    if (category) where.category = category as OpportunityCategory;
    if (status) where.status = status as OpportunityStatus;

    // Full-Text Search (Judul, Penyelenggara, Deskripsi)
    if (search) {
      where.OR = [
        { title: { contains: String(search), mode: 'insensitive' } },
        { organizer: { contains: String(search), mode: 'insensitive' } },
        { description: { contains: String(search), mode: 'insensitive' } },
      ];
    }

    // Filter Berdasarkan Jurusan
    if (majorId) {
      where.majors = {
        some: { majorId: String(majorId) },
      };
    }

    const [opportunities, total] = await Promise.all([
      prisma.opportunity.findMany({
        where,
        skip,
        take: limit,
        orderBy: { deadline: 'asc' },
        include: {
          majors: {
            include: { major: true },
          },
        },
      }),
      prisma.opportunity.count({ where }),
    ]);

    return res.status(200).json({
      status: 'success',
      data: opportunities,
      meta: {
        page,
        limit,
        totalItems: total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    return res.status(500).json({ status: 'error', message: 'Gagal mengambil data peluang', error });
  }
};

// GET /api/v1/opportunities/recommended (Rekomendasi Berbasis Jurusan User)
export const getRecommended = async (req: Request, res: Response) => {
  try {
    const majorId = req.query.majorId as string;

    if (!majorId) {
      return res.status(400).json({ status: 'error', message: 'Parameter majorId wajib diisi' });
    }

    const recommended = await prisma.opportunity.findMany({
      where: {
        status: OpportunityStatus.ACTIVE,
        majors: {
          some: { majorId },
        },
      },
      take: 6,
      orderBy: { viewsCount: 'desc' },
      include: {
        majors: { include: { major: true } },
      },
    });

    return res.status(200).json({ status: 'success', data: recommended });
  } catch (error) {
    return res.status(500).json({ status: 'error', message: 'Gagal mengambil rekomendasi', error });
  }
};