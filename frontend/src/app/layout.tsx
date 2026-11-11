import type { Metadata } from 'next';
import Navbar from '@/components/Navbar';
import './globals.css';

export const metadata: Metadata = {
  title: 'KesempatanKita — Agregator Peluang Karir Mahasiswa',
  description: 'Pusat informasi magang, beasiswa, kompetisi, dan program MBKM terverifikasi untuk mahasiswa Indonesia.',
  icons: {
    icon: '/kesempatankita-icon.png',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id" suppressHydrationWarning>
      <head>
        {/* Mencegah flash (flicker) warna saat halaman pertama kali di-load */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  var saved = localStorage.getItem('kesempatankita_theme');
                  var prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
                  if (saved === 'dark' || (!saved && prefersDark)) {
                    document.documentElement.classList.add('dark');
                  } else {
                    document.documentElement.classList.remove('dark');
                  }
                } catch(e) {}
              })();
            `,
          }}
        />
      </head>
      <body className="bg-slate-50 text-slate-900 dark:bg-[#0B0F19] dark:text-slate-100 antialiased min-h-screen flex flex-col transition-colors duration-200">
        <Navbar />
        <main className="flex-1">{children}</main>
      </body>
    </html>
  );
}