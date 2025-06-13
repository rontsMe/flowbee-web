// src/components/charts/BarChart.tsx

'use client';

import React from 'react';
import {
  BarChart as ReBarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { ChartProps } from './types';

const BarChart: React.FC<ChartProps> = ({
  data,
  color,
  isExpanded = false,
  unit,
  showGrid = true,
  showYAxis = true,
  showXAxis = true,
}) => {
  if (!data || data.length === 0) {
    return (
      <div className="h-full w-full flex items-center justify-center text-muted-foreground">
        <span className="text-sm">No data available</span>
      </div>
    );
  }

  return (
    <div className="h-full w-full">
      <ResponsiveContainer width="100%" height="100%">
        <ReBarChart data={data.slice(-12)}>
          {showGrid && (
            <CartesianGrid 
              strokeDasharray="2 2" 
              stroke="#e5e7eb"
              strokeOpacity={0.5}
              strokeWidth={1}
            />
          )}
          {showXAxis && (
            <XAxis 
              dataKey="timestamp" 
              tickFormatter={(t) => new Date(t).toLocaleTimeString()}
              stroke="#6b7280"
              fontSize={12}
              tickLine={true}
              axisLine={true}
            />
          )} 
          {showYAxis && <YAxis width={20} />}
          <Tooltip formatter={(value: number) => `${value}${unit ?? ''}`} labelFormatter={(label) => new Date(label).toLocaleTimeString()} />
          <Bar
            dataKey="value"
            fill={color}
            fillOpacity={0.7}
            radius={[4, 4, 0, 0]}
          />
        </ReBarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default BarChart;