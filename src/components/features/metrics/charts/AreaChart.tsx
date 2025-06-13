// src/components/charts/AreaChart.tsx

'use client';

import React from 'react';
import {
  AreaChart as ReAreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { ChartProps } from './types';

const AreaChart: React.FC<ChartProps> = ({
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
        <ReAreaChart data={data}>
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
          <Area
            type="monotone"
            dataKey="value"
            stroke={color}
            fill={color}
            fillOpacity={0.3}
            strokeWidth={2}
            dot={isExpanded}
          />
        </ReAreaChart>
      </ResponsiveContainer>
    </div>
  );
};

export default AreaChart;