// components/WorkflowTable.tsx

'use client'

import React from 'react';
import { Button } from '@ui/button';
import { Badge } from '@ui/badge';
import classnames from 'classnames';

interface WorkflowRow {
  id: string;
  name: string;
  status: 'running' | 'paused' | 'failed' | 'idle';
  lastRun: string;
  avgDuration: string;
  cpu: string;
  memory: string;
  gpu?: string;
  inputSize?: string;
  outputSize?: string;
  execRate: string;
  execCount24h: number;
  apiTags: string[];
}

const workflows: WorkflowRow[] = [
  {
    id: '1',
    name: 'data-cleaner',
    status: 'running',
    lastRun: '2m ago',
    avgDuration: '38s',
    cpu: '45%',
    memory: '1.2 GB',
    gpu: '-',
    inputSize: '2.4 MB',
    outputSize: '700 KB',
    execRate: '15/min',
    execCount24h: 780,
    apiTags: ['YouTube', 'Supabase']
  },
  {
    id: '2',
    name: 'ai-summarizer',
    status: 'paused',
    lastRun: '1h ago',
    avgDuration: '6.1s',
    cpu: '82%',
    memory: '3.5 GB',
    gpu: '17%',
    inputSize: '500 KB',
    outputSize: '2.2 MB',
    execRate: '3/min',
    execCount24h: 98,
    apiTags: ['OpenAI', 'Slack']
  }
];

const WorkflowTable: React.FC = () => {
  return (
    <div className="w-full overflow-x-auto">
      <table className="min-w-full border-collapse text-sm">
        <thead>
          <tr className="bg-muted text-muted-foreground">
            <th className="px-3 py-2 text-left font-semibold">Name</th>
            <th className="px-3 py-2 text-left">Status</th>
            <th className="px-3 py-2 text-left">Last Run</th>
            <th className="px-3 py-2 text-left">Avg Time</th>
            <th className="px-3 py-2"></th>
            <th className="px-3 py-2 text-left">CPU</th>
            <th className="px-3 py-2 text-left">Memory</th>
            <th className="px-3 py-2 text-left">GPU</th>
            <th className="px-3 py-2 text-left">Input</th>
            <th className="px-3 py-2 text-left">Output</th>
            <th className="px-3 py-2 text-left">Rate</th>
            <th className="px-3 py-2 text-left">24h Count</th>
            <th className="px-3 py-2 text-left">APIs</th>
            <th className="px-3 py-2 text-left">Actions</th>
          </tr>
        </thead>
        <tbody>
          {workflows.map((wf) => (
            <tr key={wf.id} className="border-b hover:bg-muted/50 transition-colors">
              <td className="px-3 py-2 font-medium text-foreground cursor-pointer hover:underline">{wf.name}</td>
              <td className="px-3 py-2">
                <span className={classnames('text-xs font-medium', {
                  'text-green-600': wf.status === 'running',
                  'text-yellow-500': wf.status === 'paused',
                  'text-red-500': wf.status === 'failed',
                  'text-muted-foreground': wf.status === 'idle'
                })}>
                  {wf.status}
                </span>
              </td>
              <td className="px-3 py-2">{wf.lastRun}</td>
              <td className="px-3 py-2">{wf.avgDuration}</td>
              <td className="px-3 py-2"></td>
              <td className="px-3 py-2">{wf.cpu}</td>
              <td className="px-3 py-2">{wf.memory}</td>
              <td className="px-3 py-2">{wf.gpu || '-'}</td>
              <td className="px-3 py-2">{wf.inputSize || '-'}</td>
              <td className="px-3 py-2">{wf.outputSize || '-'}</td>
              <td className="px-3 py-2">{wf.execRate}</td>
              <td className="px-3 py-2">{wf.execCount24h}</td>
              <td className="px-3 py-2 space-x-1">
                {wf.apiTags.map((tag) => (
                  <Badge key={tag} variant="secondary">{tag}</Badge>
                ))}
              </td>
              <td className="px-3 py-2 space-x-2">
                {wf.status === 'paused' && <Button size="xs" variant="ghost">Resume</Button>}
                {wf.status === 'running' && <><Button size="xs" variant="ghost">Pause</Button><Button size="xs" variant="destructive">Stop</Button></>}
                {(wf.status === 'idle' || wf.status === 'failed') && <Button size="xs" variant="default">Run</Button>}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default WorkflowTable;
