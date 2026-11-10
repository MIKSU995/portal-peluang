// backend/prisma/seed.ts
import { PrismaClient, OpportunityCategory, OpportunityStatus } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seeding...');

  const opportunities = [
    {
      slug: 'bangkit-academy-2026',
      title: 'Bangkit Academy 2026 by Google, Tokopedia, Gojek & Traveloka',
      organizer: 'Google & Kemendiktisaintek',
      category: OpportunityCategory.MBKM,
      status: OpportunityStatus.ACTIVE,
      isOfficial: true,
      isVerified: true,
      reward: 'Sertifikasi Global & Konversi 20 SKS',
      stipendOrPrize: 'Sertifikasi Global',
      description: 'Program kesiapan karir teknologi tinggi dalam alur Machine Learning, Mobile Development (Android), dan Cloud Computing.',
      location: 'Online (Fully Remote)',
      requirements: JSON.stringify(['Mahasiswa D3/D4/S1 Aktif', 'Komitmen 40 Jam/Minggu', 'Bahasa Inggris Dasar']),
      deadline: new Date('2026-11-30'),
      link: 'https://grow.google/bangkit/',
      sourceUrl: 'https://grow.google/bangkit/',
      sourceDomain: 'grow.google',
      contentHash: 'bangkit-2026-hash',
    },
    {
      slug: 'djarum-beasiswa-plus-2026',
      title: 'Djarum Beasiswa Plus 2026/2027',
      organizer: 'Djarum Beasiswa Plus',
      category: OpportunityCategory.BEASISWA,
      status: OpportunityStatus.ACTIVE,
      isOfficial: true,
      isVerified: true,
      reward: 'Dana Beasiswa & Soft Skills Training',
      stipendOrPrize: 'Dana Beasiswa',
      description: 'Program beasiswa berprestasi untuk mahasiswa S1/D4 semester 4 yang memberikan tunjangan finansial serta pelatihan karakter intensif.',
      location: 'Indonesia',
      requirements: JSON.stringify(['Mahasiswa S1/D4 Semester 4', 'IPK Min 3.00 pada Semester 3', 'Aktif Organisasi']),
      deadline: new Date('2026-11-12'),
      link: 'https://djarumbeasiswaplus.org/',
      sourceUrl: 'https://djarumbeasiswaplus.org/',
      sourceDomain: 'djarumbeasiswaplus.org',
      contentHash: 'djarum-2026-hash',
    },
    {
      slug: 'beasiswa-lpdp-2026',
      title: 'Beasiswa LPDP Target S2/S3 Dalam & Luar Negeri',
      organizer: 'Lembaga Pengelola Dana Pendidikan',
      category: OpportunityCategory.BEASISWA,
      status: OpportunityStatus.ACTIVE,
      isOfficial: true,
      isVerified: true,
      reward: 'Full Tuitions & Living Allowance',
      stipendOrPrize: 'Full Tuitions',
      description: 'Beasiswa penuh pemerintah Indonesia untuk studi lanjut jenjang magister dan doktor di berbagai perguruan tinggi unggulan dunia.',
      location: 'Dalam & Luar Negeri',
      requirements: JSON.stringify(['Lulusan S1/D4', 'Sertifikat TOEFL/IELTS Valid', 'Surat Rekomendasi']),
      deadline: new Date('2026-12-31'),
      link: 'https://lpdp.kemenkeu.go.id/',
      sourceUrl: 'https://lpdp.kemenkeu.go.id/',
      sourceDomain: 'lpdp.kemenkeu.go.id',
      contentHash: 'lpdp-2026-hash',
    },
    {
      slug: 'gemastik-2026',
      title: 'GEMASTIK 2026 — Pagelaran Mahasiswa Nasional TIK',
      organizer: 'Direktorat Pembelajaran dan Kemahasiswaan Kemdiktisaintek',
      category: OpportunityCategory.LOMBA,
      status: OpportunityStatus.ACTIVE,
      isOfficial: true,
      isVerified: true,
      reward: 'Total Hadiah Rp 250.000.000 & Medali Nasional',
      stipendOrPrize: 'Rp 250.000.000',
      description: 'Kompetisi TIK mahasiswa paling bergengsi tingkat nasional bidang UX Design, Data Mining, Cyber Security, dan Pengembangan Perangkat Lunak.',
      location: 'Hybrid / Kampus Penyelenggara',
      requirements: JSON.stringify(['Mahasiswa Aktif S1/D4/D3', 'Tim 3 Orang', 'Surat Rekomendasi Perguruan Tinggi']),
      deadline: new Date('2026-11-20'),
      link: 'https://kemdiktisaintek.go.id/',
      sourceUrl: 'https://kemdiktisaintek.go.id/',
      sourceDomain: 'kemdiktisaintek.go.id',
      contentHash: 'gemastik-2026-hash',
    },
  ];

  for (const item of opportunities) {
    await prisma.opportunity.upsert({
      where: { slug: item.slug },
      update: item,
      create: item,
    });
  }

  console.log('✅ Seeding completed successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Seeding failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });