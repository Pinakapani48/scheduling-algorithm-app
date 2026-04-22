'use client';

import { Card } from '@/components/ui/card';

interface GanttChartProps {
  data: Array<{
    jobId: string;
    jobName: string;
    start: number;
    end: number;
  }>;
  maxTime: number;
}

const COLORS = ['#8b5cf6', '#10b981', '#06b6d4', '#f43f5e', '#f59e0b', '#a78bfa', '#34d399', '#22d3ee', '#fb7185', '#fbbf24'];

export function GanttChart({ data, maxTime }: GanttChartProps) {
  const scale = 100 / maxTime;
  const uniqueJobs = Array.from(new Set(data.map(d => d.jobId)));

  return (
    <Card className="p-6 bg-card border-border">
      <h3 className="text-lg font-semibold text-foreground mb-4">Gantt Chart</h3>
      <div className="space-y-4 overflow-x-auto">
        {uniqueJobs.map((jobId, jobIndex) => {
          const jobData = data.filter(d => d.jobId === jobId);
          const jobName = jobData[0]?.jobName || jobId;
          const color = COLORS[jobIndex % COLORS.length];

          return (
            <div key={jobId} className="flex items-center gap-4">
              <div className="w-24 font-medium text-sm text-foreground truncate">{jobName}</div>
              <div className="flex-1 relative h-10 bg-muted rounded-lg overflow-hidden">
                {jobData.map((segment, idx) => (
                  <div
                    key={`${jobId}-${idx}`}
                    title={`${segment.start} - ${segment.end}`}
                    className="absolute h-full flex items-center justify-center text-xs font-semibold text-white transition-all hover:opacity-80"
                    style={{
                      left: `${segment.start * scale}%`,
                      width: `${(segment.end - segment.start) * scale}%`,
                      backgroundColor: color,
                    }}
                  >
                    {segment.end - segment.start}
                  </div>
                ))}
              </div>
            </div>
          );
        })}

        {/* Timeline */}
        <div className="flex items-center gap-4 mt-6 pt-4 border-t border-border">
          <div className="w-24"></div>
          <div className="flex-1 relative h-6">
            <div className="absolute inset-0 flex justify-between px-1 text-xs text-muted-foreground">
              {Array.from({ length: Math.ceil(maxTime / 5) + 1 }).map((_, i) => (
                <span key={i}>{i * 5}</span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}
