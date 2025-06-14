// src/app/page.tsx

"use client";

import React, { useState, useEffect } from 'react';
import { 
  SystemMetricCard,
  MetricCard,
  ChartDataPoint,
  generateMockData,
  getDataPointsCount,
  CHART_UPDATE_INTERVAL
} from '@features/metrics';
import TabNavigation from '@compound/tabNavigation/TabNavigation';
import { Badge } from '@ui/badge';
import { cn } from '@lib/utils';
import PageContainer from '@layout/PageContainer';

export default function DashboardPage() {
  const [expandedCards, setExpandedCards] = useState<Record<string, boolean>>({});
  const [timeRanges, setTimeRanges] = useState<Record<string, string>>({
    cpu: '30m', memory: '30m', gpu: '30m', disk: '30m',
    executions: '30m', duration: '30m', queue: '30m', concurrency: '30m'
  });

  const [systemData, setSystemData] = useState<Record<string, ChartDataPoint[]>>({
    cpu: [], memory: [], gpu: [], disk: []
  });

  const [processingData, setProcessingData] = useState<Record<string, ChartDataPoint[]>>({
    executions: [], duration: [], queue: [], concurrency: []
  });

  const [processingStats, setProcessingStats] = useState({
    successRate: 96.4, successCount: 30, failureCount: 10
  });

  const colors = {
    red: 'hsl(0, 80%, 60%)',
    blue: 'hsl(210, 100%, 55%)',
    teal: 'hsl(180, 70%, 50%)',
    gold: 'hsl(45, 85%, 55%)',
    coral: 'hsl(12, 85%, 60%)',
  };

  const chartConfig = {
    cpu: { color: colors.coral, opacity: 70, type: 'line', spec: 'AMD 4-core processor' },
    memory: { color: colors.blue, opacity: 50, type: 'area', spec: '32 GB RAM' },
    gpu: { color: colors.teal, opacity: 65, type: 'line', spec: 'NVIDIA GPU' },
    disk: { color: colors.gold, opacity: 45, type: 'area', spec: '1TB NVMe SSD' },
    executions: { color: colors.blue, opacity: 85, type: 'bar' },
    duration: { color: colors.red, opacity: 70, type: 'area' },
    queue: { color: colors.gold, opacity: 50, type: 'area' },
    concurrency: { color: colors.teal, opacity: 75, type: 'line' }
  };

  const styles = {
    container: "space-y-8 p-6",
    successRow: "flex justify-between items-center",
    successBadge: cn("flex items-center gap-2 px-3 py-1.5", "bg-secondary/50 text-foreground", "border border-border/20", "rounded-full backdrop-blur-sm shadow-sm"),
    successDot: "w-2 h-2 bg-green-500 rounded-full animate-pulse",
    successText: "text-sm font-medium",
    titleRow: "flex items-baseline gap-2"
  };

  const updateSystemData = () => {
    const timestamp = Date.now();
    setSystemData(prev => ({
      cpu: [...prev.cpu.slice(-(getDataPointsCount(timeRanges.cpu) - 1)), { timestamp, value: Math.random() * 100 }],
      memory: [...prev.memory.slice(-(getDataPointsCount(timeRanges.memory) - 1)), { timestamp, value: Math.random() * 100 }],
      gpu: [...prev.gpu.slice(-(getDataPointsCount(timeRanges.gpu) - 1)), { timestamp, value: Math.random() * 100 }],
      disk: [...prev.disk.slice(-(getDataPointsCount(timeRanges.disk) - 1)), { timestamp, value: Math.random() * 100 }]
    }));
  };

  const updateProcessingData = () => {
    const timestamp = Date.now();
    setProcessingData(prev => ({
      executions: [...prev.executions.slice(-(getDataPointsCount(timeRanges.executions) - 1)), { timestamp, value: 700 + Math.random() * 100 }],
      duration: [...prev.duration.slice(-(getDataPointsCount(timeRanges.duration) - 1)), { timestamp, value: 250 + Math.random() * 50 }],
      queue: [...prev.queue.slice(-(getDataPointsCount(timeRanges.queue) - 1)), { timestamp, value: 15 + Math.random() * 10 }],
      concurrency: [...prev.concurrency.slice(-(getDataPointsCount(timeRanges.concurrency) - 1)), { timestamp, value: 5 + Math.random() * 3 }]
    }));

    if (Math.random() < 0.1) {
      setProcessingStats(prev => ({
        successRate: Math.max(90, Math.min(100, prev.successRate + (Math.random() - 0.5) * 2)),
        successCount: prev.successCount + Math.floor(Math.random() * 3),
        failureCount: prev.failureCount + (Math.random() < 0.3 ? 1 : 0)
      }));
    }
  };

  useEffect(() => {
    setSystemData({
      cpu: generateMockData(59, 20, getDataPointsCount(timeRanges.cpu)),
      memory: generateMockData(41, 15, getDataPointsCount(timeRanges.memory)),
      gpu: generateMockData(14, 12, getDataPointsCount(timeRanges.gpu)),
      disk: generateMockData(73, 8, getDataPointsCount(timeRanges.disk))
    });

    setProcessingData({
      executions: generateMockData(796, 100, getDataPointsCount(timeRanges.executions)),
      duration: generateMockData(263, 50, getDataPointsCount(timeRanges.duration)),
      queue: generateMockData(21, 10, getDataPointsCount(timeRanges.queue)),
      concurrency: generateMockData(6, 3, getDataPointsCount(timeRanges.concurrency))
    });

    const sysInterval = setInterval(updateSystemData, CHART_UPDATE_INTERVAL);
    const procInterval = setInterval(updateProcessingData, CHART_UPDATE_INTERVAL + 500);

    return () => { clearInterval(sysInterval); clearInterval(procInterval); };
  }, [timeRanges]);

  const getLatestValue = (data: ChartDataPoint[], fallback: string) => data.length ? data.at(-1)!.value.toFixed(0) : fallback;

  const makeMetricCard = (id: string, title: string, unit: string) => {
    const config = chartConfig[id];
    return (
      <MetricCard
        key={id}
        title={<div className={styles.titleRow}><span>{title}</span>{config.spec && <span className="text-sm text-muted-foreground">– {config.spec}</span>}</div>}
        value={getLatestValue(systemData[id] ?? processingData[id], '0')}
        unit={unit}
        timeRange={timeRanges[id]}
        onTimeRangeChange={(range) => setTimeRanges(prev => ({ ...prev, [id]: range }))}
        chartType={config.type}
        data={(systemData[id] ?? processingData[id])}
        color={config.color}
        opacity={config.opacity}
        showGrid
        showYAxis
        showXAxis
        isExpanded={!!expandedCards[id]}
        onToggleExpand={() => setExpandedCards(prev => ({ ...prev, [id]: !prev[id] }))}
      />
    );
  };

  const tabs = [
    {
      id: 'overview',
      label: 'Overview',
      content: (
        <div className="flex flex-col gap-24">
          <SystemMetricCard title="System Overview" columns={{ default: 4, md: 2, lg: 4, xl: 4 }}>
            {makeMetricCard('cpu', 'CPU Usage', '%')}
            {makeMetricCard('memory', 'Memory Usage', '%')}
            {makeMetricCard('gpu', 'GPU Usage', '%')}
            {makeMetricCard('disk', 'Disk Usage', '%')}
          </SystemMetricCard>

          <SystemMetricCard
            title="Processing Overview"
            titleRight={
              <Badge variant="secondary" className={styles.successBadge}>
                <div className={styles.successDot}></div>
                <span className={styles.successText}>
                  Success Rate: {processingStats.successRate.toFixed(1)}% ({processingStats.successCount}/{processingStats.successCount + processingStats.failureCount})
                </span>
              </Badge>
            }
            columns={{ default: 4, md: 2, lg: 4, xl: 4 }}
          >
            {makeMetricCard('executions', 'Executions per Minute', '/min')}
            {makeMetricCard('duration', 'Average Method Duration', 'ms')}
            {makeMetricCard('queue', 'Queue Size', ' items')}
            {makeMetricCard('concurrency', 'Concurrency Level', '')}
          </SystemMetricCard>
        </div>
      )
    },
    {
      id: 'analytics',
      label: 'Analytics',
      content: <div className="p-6"><h1 className="text-2xl font-bold">Analytics</h1></div>
    },
    {
      id: 'reports',
      label: 'Reports',
      content: <div className="p-6"><h1 className="text-2xl font-bold">Reports</h1></div>
    }
  ];

  return (
    <PageContainer>
      <TabNavigation tabs={tabs} defaultActiveTab="overview" />
    </PageContainer>
  );
}
