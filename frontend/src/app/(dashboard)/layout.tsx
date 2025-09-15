'use client';

import { Header } from '@/components/dashboard/Header';
import { Sidebar } from '@/components/dashboard/Sidebar';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    const user = localStorage.getItem('user');
    if (!user) {
      router.push('/login');
    }
  }, [router]);

  return (
    <div className="min-h-screen bg-gray-100">
      <Header />

      {/* Mobile toggle button */}
      <button
        className="md:hidden p-2 m-2 bg-gray-200 rounded fixed z-50"
        onClick={() => setSidebarOpen(!sidebarOpen)}
      >
        ☰
      </button>

      <div className="flex">
        <Sidebar sidebarOpen={sidebarOpen} />

        {/* Main content */}
        <main className="flex-1 p-8 overflow-x-hidden">
          {children}
        </main>
      </div>
    </div>
  );
}
