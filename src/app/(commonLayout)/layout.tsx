import type { ReactNode } from 'react';
import Navbar from '@/components/layout/Navbar';

export default function CommonLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />
      <main>{children}</main>
    </div>
  );
}