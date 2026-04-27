import '@/app/globals.css';
import { Providers } from '@/components/Providers';

export const metadata = {
  metadataBase: new URL('https://class-flow-26.vercel.app'),

  title: {
    default: 'ClassFlow – Smart Class Scheduling System',
    template: '%s | ClassFlow',
  },

  description:
    'ClassFlow is a modern class scheduling and dashboard system for managing classes, routines, and productivity efficiently.',

  keywords: [
    'ClassFlow',
    'Class Scheduling App',
    'Routine Manager',
    'Student Dashboard',
    'Class Management System',
    'Schedule Planner',
    'Bangladesh student tools',
    'classflow vercel',
  ],

  authors: [{ name: 'Prodip Hore' }],
  creator: 'Prodip Hore',

  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon.ico',
    apple: '/favicon.ico',
  },

  openGraph: {
    title: 'ClassFlow – Smart Class Scheduling System',
    description:
      'Manage your classes, routines, and productivity with ClassFlow. Simple, fast, and modern dashboard.',
    url: 'https://class-flow-26.vercel.app/',
    siteName: 'ClassFlow',
    images: [
      {
        url: 'https://i.ibb.co.com/FvK7XJJ/2026-04-27-214305-hyprshot.png',
        width: 1200,
        height: 630,
        alt: 'ClassFlow Preview',
      },
      {
        url: 'https://i.ibb.co.com/fdmLJKpw/2026-04-27-214352-hyprshot.png',
      },
      {
        url: 'https://i.ibb.co.com/7x5wZJhP/2026-04-27-214405-hyprshot.png',
      },
      {
        url: 'https://i.ibb.co.com/0TdRycc/2026-04-27-214417-hyprshot.png',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },

  twitter: {
    card: 'summary_large_image',
    title: 'ClassFlow – Smart Class Scheduling System',
    description:
      'A modern dashboard for managing classes, schedules, and productivity.',
    images: ['https://i.ibb.co.com/FvK7XJJ/2026-04-27-214305-hyprshot.png'],
    creator: '@yourusername', // optional
  },

  robots: {
    index: true,
    follow: true,
  },

  alternates: {
    canonical: 'https://class-flow-26.vercel.app/',
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" data-theme="classflow" suppressHydrationWarning>
      <body suppressHydrationWarning>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
