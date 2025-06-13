// src/components/charts/LineChart.tsx

'use client';

import React from 'react';
import {
  LineChart as ReLineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { ChartProps } from './types';

const LineChart: React.FC<ChartProps> = ({
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
        <ReLineChart data={data}>
          {showGrid && (
            <CartesianGrid 
              strokeDasharray="2 2" 
              stroke="#e5e7eb"
              strokeOpacity={0.5}
              strokeWidth={1}
            />
          )}
          {showXAxis && <XAxis dataKey="timestamp" tickFormatter={(t) => new Date(t).toLocaleTimeString()} />} 
          {showYAxis && <YAxis width={20} />}
          <Tooltip formatter={(value: number) => `${value}${unit ?? ''}`} labelFormatter={(label) => new Date(label).toLocaleTimeString()} />
          <Line
            type="monotone"
            dataKey="value"
            stroke={color}
            strokeWidth={2}
            dot={isExpanded}
            activeDot={{ r: 4 }}
          />
        </ReLineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default LineChart;