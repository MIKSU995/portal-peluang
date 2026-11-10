import cron from 'node-cron';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const initReminderCron = () => {
  // Berjalan setiap hari jam 08:00 WIB
  cron.schedule('0 8 * * *', async () => {
    console.log('⏰ Running daily deadline reminder cron job...');
    const now = new Date();

    // Rentang target H-3 dan H-1
    const threeDaysLater = new Date(now.getTime() + 3 * 24 * 60 * 60 * 1000);
    const oneDayLater = new Date(now.getTime() + 1 * 24 * 60 * 60 * 1000);

    try {
      const activeBookmarks = await prisma.bookmark.findMany({
        include: { opportunity: true },
      });

      for (const bookmark of activeBookmarks) {
        const deadline = new Date(bookmark.opportunity.deadline);
        const diffTime = deadline.getTime() - now.getTime();
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        if (diffDays === 3 || diffDays === 1) {
          // Buat notifikasi jika belum dikirim
          await prisma.notification.create({
            data: {
              userId: bookmark.userId,
              type: 'DEADLINE',
              title: `Mendekati Deadline: ${bookmark.opportunity.title}`,
              message: `Peluang yang Anda simpan akan ditutup dalam ${diffDays} hari! Segera selesaikan pendaftaran Anda.`,
              opportunityId: bookmark.opportunityId,
              linkUrl: `/opportunities/${bookmark.opportunity.slug}`,
            },
          });
        }
      }
      console.log('✅ Daily deadline reminders created.');
    } catch (error) {
      console.error('❌ Error executing reminder cron job:', error);
    }
  });
};