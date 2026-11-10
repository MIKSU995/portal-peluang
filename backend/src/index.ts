import express, { Request, Response } from 'express';
import cors from 'cors';

// Import Rute API
import authRoutes from './routes/auth.routes';
import opportunitiesRoutes from './routes/opportunities.routes';
import bookmarksRoutes from './routes/bookmarks.routes';
import teamsRoutes from './routes/teams.routes';
import applicationsRoutes from './routes/applications.routes';
import notificationsRoutes from './routes/notifications.routes';

// Import Jobs / Cron Tasks
import { initReminderCron } from './jobs/reminder.job';
import { initCleanupJob } from './jobs/cleanup.job';

const app = express();
const PORT = process.env.PORT || 5000;
const CLIENT_ORIGIN = process.env.CLIENT_ORIGIN || 'http://localhost:3000';

// Configuration Middleware
app.use(
  cors({
    origin: CLIENT_ORIGIN,
    credentials: true,
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health Check Endpoint
app.get('/health', (req: Request, res: Response) => {
  res.status(200).json({
    status: 'success',
    message: 'KesempatanKita Backend API is healthy 🚀',
    timestamp: new Date().toISOString(),
  });
});

// Registrasi Seluruh Endpoint API v1
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/opportunities', opportunitiesRoutes);
app.use('/api/v1/bookmarks', bookmarksRoutes);
app.use('/api/v1/teams', teamsRoutes);
app.use('/api/v1/applications', applicationsRoutes);
app.use('/api/v1/notifications', notificationsRoutes);

// Fallback Route Handler (404)
app.use((req: Request, res: Response) => {
  res.status(404).json({
    status: 'error',
    message: `Rute '${req.originalUrl}' tidak ditemukan pada server API.`,
  });
});

// Inisialisasi Job Otomatis (Cron)
try {
  initReminderCron();
  initCleanupJob();
} catch (cronError) {
  console.error('⚠️ Warning: Gagal menginisialisasi salah satu cron job:', cronError);
}

// Jalankan Express Server
app.listen(PORT, () => {
  console.log('===============================================');
  console.log(`🚀 KesempatanKita API Server Running on port ${PORT}`);
  console.log(`🌍 Client Origin allowed: ${CLIENT_ORIGIN}`);
  console.log('===============================================');
});