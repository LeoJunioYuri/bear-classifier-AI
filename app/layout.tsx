import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Bear and Teddy Bear Classifier',
  description: 'An intelligent image classifier for distinguishing between various bear species and teddy bears. Powered by machine learning, this web app uses advanced algorithms to analyze and categorize uploaded images with high accuracy.',
};


export function BodyLayout({ children }: { children: React.ReactNode }) {
  return (
    <body className={inter.className}>
      {children}
    </body>
  );
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <BodyLayout>{children}</BodyLayout>
    </html>
  );
}
