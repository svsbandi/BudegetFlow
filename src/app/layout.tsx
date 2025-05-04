import type { Metadata } from 'next';
import { Inter } from 'next/font/google'; // Changed font for better readability
import './globals.css';
import { cn } from '@/lib/utils';
import { Toaster } from '@/components/ui/toaster'; // Import Toaster

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-sans', // Use inter as the base sans font
});

export const metadata: Metadata = {
  title: 'BudgetFlow',
  description: 'Track your spending, set goals, and flow towards financial freedom.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={cn(
          'min-h-screen bg-background font-sans antialiased',
          inter.variable
        )}
      >
        {children}
        <Toaster /> {/* Add Toaster for notifications */}
      </body>
    </html>
  );
}
