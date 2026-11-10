// backend/src/middlewares/auth.middleware.ts
import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

export interface AuthenticatedUser {
  id: string;
  email: string;
  role: string;
}

declare global {
  namespace Express {
    interface Request {
      user?: AuthenticatedUser;
    }
  }
}

export const authenticateUser = (req: Request, res: Response, next: NextFunction) => {
  // Ambil token dari HttpOnly Cookie atau Authorization Header
  const cookieToken = req.cookies?.token;
  const headerToken = req.headers.authorization?.startsWith('Bearer ')
    ? req.headers.authorization.split(' ')[1]
    : null;

  const token = cookieToken || headerToken;

  if (!token) {
    return res.status(401).json({ message: 'Akses ditolak. Token autentikasi tidak ditemukan.' });
  }

  try {
    const secret = process.env.JWT_SECRET || 'super-secure-jwt-secret-kesempatankita-2026';
    const decoded = jwt.verify(token, secret) as AuthenticatedUser;
    req.user = decoded;
    return next();
  } catch (err) {
    return res.status(401).json({ message: 'Token tidak valid atau telah kedaluwarsa.' });
  }
};

export const optionalAuthenticateUser = (req: Request, res: Response, next: NextFunction) => {
  const token = req.cookies?.token || (req.headers.authorization?.startsWith('Bearer ') ? req.headers.authorization.split(' ')[1] : null);
  if (!token) {
    return next();
  }

  try {
    const secret = process.env.JWT_SECRET || 'super-secure-jwt-secret-kesempatankita-2026';
    const decoded = jwt.verify(token, secret) as AuthenticatedUser;
    req.user = decoded;
  } catch {
    // Abaikan jika token tidak valid pada route publik
  }
  return next();
};

