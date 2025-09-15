import React from 'react';
import { Card, CardContent } from '@/components/ui/Card';

interface StatsCardProps {
  title: string;
  value: string | number;
  icon: string;
  change?: string;
}

export const StatsCard: React.FC<StatsCardProps> = ({ title, value, icon, change }) => {
  return (
    <Card>
      <CardContent className="flex items-center">
        <div className="flex-shrink-0">
          <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center text-white text-xl">
            {icon}
          </div>
        </div>
        <div className="ml-5 w-0 flex-1">
          <dl>
            <dt className="text-sm font-medium text-gray-500 truncate">{title}</dt>
            <dd className="text-lg font-medium text-gray-900">{value}</dd>
          </dl>
        </div>
        {change && (
          <div className="ml-2">
            <span className="text-sm text-green-600">{change}</span>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
