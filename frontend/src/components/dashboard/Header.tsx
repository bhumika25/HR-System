'use client';

import React from 'react';
import { Button } from '@/components/ui/Button';
import { useRouter } from 'next/navigation';
import { logout } from '@/lib/api';

export const Header: React.FC = () => {
  const router = useRouter();

  const handleLogout = async () => {
    await logout();
    localStorage.removeItem('user');
    router.push('/login');
  };

  const user = typeof window !== 'undefined'
    ? JSON.parse(localStorage.getItem('user') || '{}')
    : {};

  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="px-6 py-4 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">HR Management System</h1>
        </div>
        <div className="flex items-center space-x-4">
          <span className="text-gray-700">Welcome, Admin</span>
          <Button variant="secondary" onClick={handleLogout}>
            Sign out
          </Button>
        </div>
      </div>
    </header>
  );
};
