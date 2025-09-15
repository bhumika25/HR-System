'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: '📊' },
  { name: 'Employees', href: '/employees', icon: '👥' },
];

export const Sidebar: React.FC<{ sidebarOpen: boolean }> = ({ sidebarOpen }) => {
  const pathname = usePathname();

  return (
    <div
      className={cn(
        'fixed top-0 left-0 w-64 h-100vh bg-gray-50 border-r border-gray-200 flex-col transform transition-transform duration-300 ease-in-out z-40',
        'w-64 min-w-[16rem] max-w-[16rem]',
        sidebarOpen ? 'translate-x-0' : '-translate-x-full',
        'md:translate-x-0 md:flex md:static'
      )}
    >
      <nav className="mt-8 px-2">
        <ul className="space-y-2">
          {navigation.map((item) => (
            <li key={item.name}>
              <Link
                href={item.href}
                className={cn(
                  'flex items-center w-full px-4 py-2 text-sm font-medium rounded-lg transition-colors',
                  pathname === item.href
                    ? 'bg-blue-100 text-blue-700'
                    : 'text-gray-700 hover:bg-gray-100'
                )}
              >
                <span className="flex-shrink-0 mr-3">{item.icon}</span>
                <span className="truncate">{item.name}</span>
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
};
