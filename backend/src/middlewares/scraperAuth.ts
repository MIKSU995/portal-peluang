// backend/src/middlewares/scraperAuth.ts
import { Request, Response, NextFunction } from 'express';

export const verifyScraperSecret = (req: Request, res: Response, next: NextFunction) => {
  const incomingSecret = req.headers['x-internal-secret'];
  const expectedSecret = process.env.API_INTERNAL_SECRET || 'super-secret-internal-ingest-key-2026';

  if (!incomingSecret || incomingSecret !== expectedSecret) {
    return res.status(403).json({
      error: 'Forbidden',
      message: 'Akses pipeline internal tidak sah.',
    });
  }

  next();
};

