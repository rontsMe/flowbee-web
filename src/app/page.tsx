// app/page.tsx

'use client';

import React, { useState, useEffect } from 'react';

// ✅ NEW - Import from updated metrics system
import { 
  SystemMetricCard,  // Layout container
  MetricCard,        // Individual metric cards
  ChartDataPoint,
  generateMockData,
  getDataPointsCount,
  CHART_UPDATE_INTERVAL
} from '@features/metrics';
import TabNavigation from '@compound/tabNavigation/TabNavigation';
// Import UI components
import { Badge } from '@ui/badge';
import { cn } from '@lib/utils';
import PageContainer from '@layout/PageContainer';

/**
 * Refactored Dashboard Page - New Architecture
 * 
 * Purpose: Dashboard using new generic architecture
 * Features: SystemMetricCard as layout + MetricCard as individual cards
 * Parent controls: All domain logic, colors, chart types, data
 * 
 * Architecture:
 * - SystemMetricCard = responsive layout container with title
 * - MetricCard = individual card with chart factory
 * - Parent = domain knowledge, color mapping, data management
 */
export default function DashboardPage() {
  const [expandedCards, setExpandedCards] = useState<Record<string, boolean>>({});
  const [timeRanges, setTimeRanges] = useState<Record<string, string>>({
    'cpu': '30m',
    'memory': '30m', 
    'gpu': '30m',
    'disk': '30m',
    'executions': '30m',
    'duration': '30m',
    'queue': '30m',
    'concurrency': '30m'
  });

  // System metrics data state
  const [systemData, setSystemData] = useState({
    'cpu': [] as ChartDataPoint[],
    'memory': [] as ChartDataPoint[],
    'gpu': [] as ChartDataPoint[],
    'disk': [] as ChartDataPoint[]
  });

  // Processing metrics data state  
  const [processingData, setProcessingData] = useState({
    'executions': [] as ChartDataPoint[],
    'duration': [] as ChartDataPoint[],
    'queue': [] as ChartDataPoint[],
    'concurrency': [] as ChartDataPoint[]
  });

  // Processing stats
  const [processingStats, setProcessingStats] = useState({
    successRate: 96.4,
    successCount: 30,
    failureCount: 10
  });

  // ✅ PARENT CONTROLS - Domain-specific color mapping
  const chartColors = {
    // System metrics - using CSS custom properties from globals.css
    'cpu': 'var(--chart-5)',       // Coral for CPU
    'memory': 'var(--chart-4)',    // Blue for Memory
    'gpu': 'var(--chart-2)',       // Teal for GPU
    'disk': 'var(--chart-3)',      // Gold for Disk
    
    // Processing metrics
    'executions': 'var(--chart-4)', // Blue for throughput
    'duration': 'var(--chart-1)',   // Purple for timing
    'queue': 'var(--chart-3)',      // Gold for queue
    'concurrency': 'var(--chart-2)' // Teal for concurrency
  };

  // ✅ PARENT CONTROLS - Domain-specific opacity mapping
  const chartOpacity = {
    'cpu': 70,
    'memory': 50,
    'gpu': 65,
    'disk': 45,
    'executions': 85,
    'duration': 70,
    'queue': 50,
    'concurrency': 75
  };

  // CSS-in-JS styles using semantic Tailwind classes
  const styles = {
    container: "space-y-8 p-6",
    
    successBadge: cn(
      "flex items-center gap-2 px-3 py-1.5",
      "bg-secondary/50 text-foreground",        // Semantic classes
      "border border-border/20",                // Themed by globals.css
      "rounded-full backdrop-blur-sm shadow-sm"
    ),
    
    successDot: "w-2 h-2 bg-green-500 rounded-full animate-pulse",
    successText: "text-sm font-medium"
  };

  /**
   * updateSystemData - Update system metrics with realistic fluctuations
   */
  const updateSystemData = () => {
    const timestamp = Date.now();
    
    setSystemData(prev => ({
      'cpu': [
        ...prev['cpu'].slice(-(getDataPointsCount(timeRanges['cpu']) - 1)),
        { timestamp, value: Math.max(0, Math.min(100, 59 + (Math.random() - 0.5) * 20)) }
      ],
      'memory': [
        ...prev['memory'].slice(-(getDataPointsCount(timeRanges['memory']) - 1)),
        { timestamp, value: Math.max(0, Math.min(100, 41 + (Math.random() - 0.5) * 15)) }
      ],
      'gpu': [
        ...prev['gpu'].slice(-(getDataPointsCount(timeRanges['gpu']) - 1)),
        { timestamp, value: Math.max(0, Math.min(100, 14 + (Math.random() - 0.5) * 12)) }
      ],
      'disk': [
        ...prev['disk'].slice(-(getDataPointsCount(timeRanges['disk']) - 1)),
        { timestamp, value: Math.max(0, Math.min(100, 73 + (Math.random() - 0.5) * 8)) }
      ]
    }));
  };

  /**
   * updateProcessingData - Update processing metrics
   */
  const updateProcessingData = () => {
    const timestamp = Date.now();
    
    setProcessingData(prev => ({
      'executions': [
        ...prev['executions'].slice(-(getDataPointsCount(timeRanges['executions']) - 1)),
        { timestamp, value: Math.max(0, 796 + (Math.random() - 0.5) * 100) }
      ],
      'duration': [
        ...prev['duration'].slice(-(getDataPointsCount(timeRanges['duration']) - 1)),
        { timestamp, value: Math.max(0, 263 + (Math.random() - 0.5) * 50) }
      ],
      'queue': [
        ...prev['queue'].slice(-(getDataPointsCount(timeRanges['queue']) - 1)),
        { timestamp, value: Math.max(0, 21 + (Math.random() - 0.5) * 10) }
      ],
      'concurrency': [
        ...prev['concurrency'].slice(-(getDataPointsCount(timeRanges['concurrency']) - 1)),
        { timestamp, value: Math.max(0, 6 + (Math.random() - 0.5) * 3) }
      ]
    }));

    // Update processing stats occasionally
    if (Math.random() < 0.1) {
      setProcessingStats(prev => ({
        successRate: Math.max(90, Math.min(100, prev.successRate + (Math.random() - 0.5) * 2)),
        successCount: prev.successCount + Math.floor(Math.random() * 3),
        failureCount: prev.failureCount + (Math.random() < 0.3 ? 1 : 0)
      }));
    }
  };

  // Initialize data
  useEffect(() => {
    // Generate initial data
    setSystemData({
      'cpu': generateMockData(59, 20, getDataPointsCount(timeRanges['cpu'])),
      'memory': generateMockData(41, 15, getDataPointsCount(timeRanges['memory'])),
      'gpu': generateMockData(14, 12, getDataPointsCount(timeRanges['gpu'])),
      'disk': generateMockData(73, 8, getDataPointsCount(timeRanges['disk']))
    });

    setProcessingData({
      'executions': generateMockData(796, 100, getDataPointsCount(timeRanges['executions'])),
      'duration': generateMockData(263, 50, getDataPointsCount(timeRanges['duration'])),
      'queue': generateMockData(21, 10, getDataPointsCount(timeRanges['queue'])),
      'concurrency': generateMockData(6, 3, getDataPointsCount(timeRanges['concurrency']))
    });

    const systemInterval = setInterval(updateSystemData, CHART_UPDATE_INTERVAL);
    const processingInterval = setInterval(updateProcessingData, CHART_UPDATE_INTERVAL + 500);
    
    return () => {
      clearInterval(systemInterval);
      clearInterval(processingInterval);
    };
  }, [timeRanges]);

  const handleCardToggle = (cardId: string) => {
    setExpandedCards(prev => ({ ...prev, [cardId]: !prev[cardId] }));
  };

  const handleTimeRangeChange = (cardId: string, range: string) => {
    setTimeRanges(prev => ({ ...prev, [cardId]: range }));
  };

  // Get latest values for display
  const getLatestValue = (data: ChartDataPoint[], defaultValue: string) => {
    return data.length > 0 ? data[data.length - 1].value.toFixed(0) : defaultValue;
  };
  const tabs = [
    { 
      id: 'overview', 
      label: 'Overview',
      content: <h1>Overview</h1>
    },
    { 
      id: 'analytics', 
      label: 'Analytics', 
      content: <h1>Analytics</h1>
    },
    { 
      id: 'reports', 
      label: 'Reports',
      content: <h1>Reports</h1>
    }
  ];
  
  
  return (
    <PageContainer>
      <TabNavigation tabs={tabs} defaultActiveTab="overview" />
    </PageContainer>
  );
}



// const metricCardsComponent = () => (
//   <div className={styles.container}>
        
//         {/* ✅ NEW ARCHITECTURE - System Overview Section */}
//         <SystemMetricCard 
//           title="System Overview"
//           columns={{ default: 4, md: 2, lg: 4, xl: 4 }}
//         >
//           {/* CPU Metric Card */}
//           <MetricCard
//             title="CPU Usage"
//             value={getLatestValue(systemData.cpu, '59')}
//             unit="%"
//             spec="AMD 4-core processor"
//             timeRange={timeRanges.cpu}
//             onTimeRangeChange={(range) => handleTimeRangeChange('cpu', range)}
            
//             // ✅ Parent controls chart configuration
//             chartType="line"
//             data={systemData.cpu}
//             color={chartColors.cpu}
//             opacity={chartOpacity.cpu}
//             showGrid={true}
//             showYAxis={true}
//             showXAxis={true}
//           />

//           {/* Memory Metric Card */}
//           <MetricCard
//             title="Memory Usage"
//             value={getLatestValue(systemData.memory, '41')}
//             unit="%"
//             spec="32 GB RAM"
//             timeRange={timeRanges.memory}
//             onTimeRangeChange={(range) => handleTimeRangeChange('memory', range)}
            
//             chartType="area"
//             data={systemData.memory}
//             color={chartColors.memory}
//             opacity={chartOpacity.memory}
//             showGrid={true}                    // No grid for area chart
//             showYAxis={true}
//             showXAxis={false}                   // No X-axis for memory
//           />

//           {/* GPU Metric Card */}
//           <MetricCard
//             title="GPU Usage"
//             value={getLatestValue(systemData.gpu, '14')}
//             unit="%"
//             spec="NVIDIA GPU"
//             timeRange={timeRanges.gpu}
//             onTimeRangeChange={(range) => handleTimeRangeChange('gpu', range)}
            
//             chartType="line"
//             data={systemData.gpu}
//             color={chartColors.gpu}
//             opacity={chartOpacity.gpu}
//             showGrid={true}
//             showYAxis={true}
//             showXAxis={true}
//           />

//           {/* Disk Metric Card */}
//           <MetricCard
//             title="Disk Usage"
//             value={getLatestValue(systemData.disk, '73')}
//             unit="%"
//             spec="1TB NVMe SSD"
//             timeRange={timeRanges.disk}
//             onTimeRangeChange={(range) => handleTimeRangeChange('disk', range)}
            
//             chartType="area"
//             data={systemData.disk}
//             color={chartColors.disk}
//             opacity={chartOpacity.disk}
//             showGrid={true}
//             showYAxis={true}
//             showXAxis={true}
//           />
//         </SystemMetricCard>

//         {/* ✅ NEW ARCHITECTURE - Processing Overview Section */}
//         {/* TODO: Success badge can be added to SystemMetricCard header or as separate element */}
//         {/* 
//         <Badge variant="secondary" className={styles.successBadge}>
//           <div className={styles.successDot}></div>
//           <span className={styles.successText}>
//             Success/failure {processingStats.successRate.toFixed(1)}% {processingStats.successCount}/{processingStats.failureCount}
//           </span>
//         </Badge>
//         */}
        
//         <SystemMetricCard 
//           title="Processing Overview"
//           columns={{ default: 4, md: 2, lg: 4, xl: 4 }}
//         >

//           {/* Executions per Minute */}
//           <MetricCard
//             title="Executions per Minute"
//             value={getLatestValue(processingData.executions, '796')}
//             unit="/min"
//             timeRange={timeRanges.executions}
//             onTimeRangeChange={(range) => handleTimeRangeChange('executions', range)}
            
//             chartType="bar"
//             data={processingData.executions}
//             color={chartColors.executions}
//             opacity={chartOpacity.executions}
//             showGrid={true}
//             showYAxis={true}
//             showXAxis={true}
//           />

//           {/* Average Method Duration */}
//           <MetricCard
//             title="Average Method Duration"
//             value={getLatestValue(processingData.duration, '263')}
//             unit="ms"
//             timeRange={timeRanges.duration}
//             onTimeRangeChange={(range) => handleTimeRangeChange('duration', range)}
            
//             chartType="area"
//             data={processingData.duration}
//             color={chartColors.duration}
//             opacity={chartOpacity.duration}
//             showGrid={true}
//             showYAxis={true}
//             showXAxis={true}
//           />

//           {/* Queue Size */}
//           <MetricCard
//             title="Queue Size"
//             value={getLatestValue(processingData.queue, '21')}
//             unit=" items"
//             timeRange={timeRanges.queue}
//             onTimeRangeChange={(range) => handleTimeRangeChange('queue', range)}
            
//             chartType="area"
//             data={processingData.queue}
//             color={chartColors.queue}
//             opacity={chartOpacity.queue}
//             showGrid={true}
//             showYAxis={true}
//             showXAxis={true}
//           />

//           {/* Concurrency Level */}
//           <MetricCard
//             title="Concurrency Level"
//             value={getLatestValue(processingData.concurrency, '6')}
//             unit=""
//             timeRange={timeRanges.concurrency}
//             onTimeRangeChange={(range) => handleTimeRangeChange('concurrency', range)}
            
//             chartType="line"
//             data={processingData.concurrency}
//             color={chartColors.concurrency}
//             opacity={chartOpacity.concurrency}
//             showGrid={true}
//             showYAxis={true}
//             showXAxis={true}
//           />
//         </SystemMetricCard>

//       </div>
// )