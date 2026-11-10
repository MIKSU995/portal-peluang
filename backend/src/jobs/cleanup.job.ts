import cron from 'node-cron';
import { PrismaClient, OpportunityStatus } from '@prisma/client';

const prisma = new PrismaClient();

/**
 * Inisialisasi Job Otomatis Pembersihan & Pembaruan Status Peluang (Cron Job)
 * Berjalan setiap hari pada jam 00:00 (Tengah Malam)
 */
export const initCleanupJob = () => {
  cron.schedule('0 0 * * *', async () => {
    console.log('🧹 Running automated maintenance & cleanup cron job...');
    const now = new Date();

    try {
      // 1. Update status peluang menjadi EXPIRED jika deadline sudah lewat
      const updatedOpportunities = await prisma.opportunity.updateMany({
        where: {
          deadline: { lt: now },
          status: OpportunityStatus.ACTIVE,
        },
        data: {
          status: OpportunityStatus.EXPIRED,
        },
      });

      console.log(
        `✅ Cleanup job completed: ${updatedOpportunities.count} opportunities marked as EXPIRED.`
      );
    } catch (error) {
      console.error('❌ Error running cleanup job:', error);
    }
  });
};