// backend/src/middlewares/rateLimiter.ts
import rateLimit from 'express-rate-limit';

export const publicApiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 menit
  max: 150, // Limit 150 request per IP per 15 menit
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    status: 429,
    message: 'Terlalu banyak permintaan dari IP ini. Silakan coba kembali dalam beberapa saat.',
  },
});

export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 15, // Limit 15 upaya login/register per 15 menit untuk mitigasi brute force
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    status: 429,
    message: 'Terlalu banyak percobaan autentikasi. Silakan tunggu 15 menit.',
  },
});

