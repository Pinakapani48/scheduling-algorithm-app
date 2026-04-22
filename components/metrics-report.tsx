'use client';

import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Clock, Activity, Zap } from 'lucide-react';

interface MetricsReportProps {
  algorithm: string;
  metrics: {
    averageWaitingTime: number;
    averageTurnaroundTime: number;
    throughput: number;
  };
  jobsCount: number;
  totalTime: number;
}

export function MetricsReport({ algorithm, metrics, jobsCount, totalTime }: MetricsReportProps) {
  return (
    <Card className="p-6 bg-gradient-to-br from-card via-card to-card/80 border-border">
      <div className="space-y-6">
        <div>
          <h3 className="text-2xl font-bold text-foreground mb-2">Scheduling Results</h3>
          <Badge className="bg-primary text-primary-foreground">{algorithm}</Badge>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 rounded-lg bg-gradient-to-br from-primary/10 to-primary/5 border border-primary/20">
            <div className="flex items-center gap-2 mb-2">
              <Clock className="w-5 h-5 text-primary" />
              <span className="text-sm font-medium text-muted-foreground">Avg. Waiting Time</span>
            </div>
            <div className="text-3xl font-bold text-primary">
              {metrics.averageWaitingTime.toFixed(2)}
            </div>
            <span className="text-xs text-muted-foreground">time units</span>
          </div>

          <div className="p-4 rounded-lg bg-gradient-to-br from-secondary/10 to-secondary/5 border border-secondary/20">
            <div className="flex items-center gap-2 mb-2">
              <Activity className="w-5 h-5 text-secondary" />
              <span className="text-sm font-medium text-muted-foreground">Avg. Turnaround Time</span>
            </div>
            <div className="text-3xl font-bold text-secondary">
              {metrics.averageTurnaroundTime.toFixed(2)}
            </div>
            <span className="text-xs text-muted-foreground">time units</span>
          </div>

          <div className="p-4 rounded-lg bg-gradient-to-br from-accent/10 to-accent/5 border border-accent/20">
            <div className="flex items-center gap-2 mb-2">
              <Zap className="w-5 h-5 text-accent" />
              <span className="text-sm font-medium text-muted-foreground">Throughput</span>
            </div>
            <div className="text-3xl font-bold text-accent">
              {metrics.throughput.toFixed(3)}
            </div>
            <span className="text-xs text-muted-foreground">jobs/unit time</span>
          </div>
        </div>

        <div className="p-4 rounded-lg bg-muted/20 border border-border">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <p className="text-xs text-muted-foreground uppercase tracking-wide">Total Jobs</p>
              <p className="text-2xl font-bold text-foreground">{jobsCount}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground uppercase tracking-wide">Total Time</p>
              <p className="text-2xl font-bold text-foreground">{totalTime}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground uppercase tracking-wide">Avg Wait</p>
              <p className="text-2xl font-bold text-primary">{metrics.averageWaitingTime.toFixed(1)}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground uppercase tracking-wide">Efficiency</p>
              <p className="text-2xl font-bold text-secondary">{((1 - metrics.averageWaitingTime / metrics.averageTurnaroundTime) * 100).toFixed(1)}%</p>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}
