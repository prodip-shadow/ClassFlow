import '@/app/globals.css';
import { Providers } from '@/components/Providers';

export const metadata = {
  title: 'ClassFlow',
  description: 'Mini Class Scheduling and Dashboard System',
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon.ico',
    apple: '/favicon.ico',
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
