'use client';

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CheckCircle2, Clock, Zap } from 'lucide-react';

const ALGORITHMS = [
  {
    id: 'fcfs',
    name: 'FCFS',
    fullName: 'First Come First Served',
    description: 'Processes jobs in arrival order. Fair and simple.',
    bestFor: 'Batch processing, ticket systems',
    icon: Clock,
    color: 'from-blue-500 to-blue-600',
  },
  {
    id: 'sjf',
    name: 'SJF',
    fullName: 'Shortest Job First',
    description: 'Prioritizes shorter jobs. Minimizes average wait time.',
    bestFor: 'Task scheduling with varying durations',
    icon: Zap,
    color: 'from-green-500 to-green-600',
  },
  {
    id: 'roundrobin',
    name: 'Round Robin',
    fullName: 'Round Robin (Time Quantum)',
    description: 'Distributes CPU time fairly in fixed intervals.',
    bestFor: 'Interactive systems, multitasking',
    icon: Clock,
    color: 'from-cyan-500 to-cyan-600',
  },
  {
    id: 'priority',
    name: 'Priority',
    fullName: 'Priority Scheduling',
    description: 'Processes jobs based on assigned priority levels.',
    bestFor: 'Resource management, interviews',
    icon: Zap,
    color: 'from-pink-500 to-pink-600',
  },
  {
    id: 'edf',
    name: 'EDF',
    fullName: 'Earliest Deadline First',
    description: 'Prioritizes jobs with earliest deadlines.',
    bestFor: 'Real-time systems, deadline-driven tasks',
    icon: Clock,
    color: 'from-orange-500 to-orange-600',
  },
];

interface AlgorithmSelectorProps {
  selected?: string;
  onSelect: (algo: string) => void;
}

export function AlgorithmSelector({ selected, onSelect }: AlgorithmSelectorProps) {
  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-2xl font-bold text-foreground mb-2">Select Scheduling Algorithm</h3>
        <p className="text-sm text-muted-foreground">Choose how to schedule your jobs</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {ALGORITHMS.map(algo => {
          const Icon = algo.icon;
          const isSelected = selected === algo.fullName;

          return (
            <Card
              key={algo.id}
              onClick={() => onSelect(algo.fullName)}
              className={`p-4 cursor-pointer transition-all border-2 ${
                isSelected
                  ? 'border-primary bg-primary/5'
                  : 'border-border bg-card hover:border-primary/50'
              }`}
            >
              <div className="flex items-start justify-between mb-3">
                <div>
                  <Badge className={`bg-gradient-to-r ${algo.color} text-white`}>
                    {algo.name}
                  </Badge>
                </div>
                {isSelected && <CheckCircle2 className="w-5 h-5 text-primary" />}
              </div>

              <h4 className="font-semibold text-foreground mb-2">{algo.fullName}</h4>
              <p className="text-sm text-muted-foreground mb-3">{algo.description}</p>

              <div className="pt-3 border-t border-border">
                <p className="text-xs text-muted-foreground">
                  <span className="font-medium text-foreground">Best for:</span> {algo.bestFor}
                </p>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
