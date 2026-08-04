import type { Metadata } from 'next';
import './globals.css';
import './themes.css';

export const metadata: Metadata = {
  title: 'eWedding — Digital Invitation',
  description: 'Beautiful digital wedding invitations for every culture.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ms">
      <body>{children}</body>
    </html>
  );
}
