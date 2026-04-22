'use client';

import { Card } from '@/components/ui/card';
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ScatterChart,
  Scatter,
} from 'recharts';

interface JobData {
  id: string;
  name: string;
  arrivalTime: number;
  burstTime: number;
  completionTime: number;
  turnaroundTime: number;
  waitingTime: number;
}

interface ResultsChartsProps {
  jobs: JobData[];
}

export function ResultsCharts({ jobs }: ResultsChartsProps) {
  const chartData = jobs.map(job => ({
    name: job.name,
    waitTime: job.waitingTime,
    turnaroundTime: job.turnaroundTime,
    burstTime: job.burstTime,
    completionTime: job.completionTime,
  }));

  const sortedByCompletion = jobs.sort((a, b) => a.completionTime - b.completionTime);
  const timelineData = sortedByCompletion.map((job, idx) => ({
    job: job.name,
    arrivalTime: job.arrivalTime,
    burstTime: job.burstTime,
    completionTime: job.completionTime,
    waitingTime: job.waitingTime,
  }));

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Wait Time vs Turnaround Time */}
      <Card className="p-6 bg-card border-border">
        <h3 className="text-lg font-semibold text-foreground mb-4">Wait Time Comparison</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
            <XAxis dataKey="name" stroke="var(--muted-foreground)" style={{ fontSize: '12px' }} />
            <YAxis stroke="var(--muted-foreground)" style={{ fontSize: '12px' }} />
            <Tooltip
              contentStyle={{
                backgroundColor: 'var(--card)',
                border: '1px solid var(--border)',
                borderRadius: '0.5rem',
              }}
              labelStyle={{ color: 'var(--foreground)' }}
            />
            <Legend wrapperStyle={{ paddingTop: '20px' }} />
            <Bar dataKey="waitTime" fill="var(--chart-1)" name="Wait Time" radius={[8, 8, 0, 0]} />
            <Bar dataKey="turnaroundTime" fill="var(--chart-2)" name="Turnaround Time" radius={[8, 8, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </Card>

      {/* Timeline View */}
      <Card className="p-6 bg-card border-border">
        <h3 className="text-lg font-semibold text-foreground mb-4">Job Completion Timeline</h3>
        <ResponsiveContainer width="100%" height={300}>
          <ScatterChart data={timelineData} margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
            <XAxis dataKey="arrivalTime" name="Arrival Time" stroke="var(--muted-foreground)" />
            <YAxis dataKey="completionTime" name="Completion Time" stroke="var(--muted-foreground)" />
            <Tooltip
              contentStyle={{
                backgroundColor: 'var(--card)',
                border: '1px solid var(--border)',
                borderRadius: '0.5rem',
              }}
              labelStyle={{ color: 'var(--foreground)' }}
              cursor={{ strokeDasharray: '3 3' }}
            />
            <Scatter name="Jobs" dataKey="completionTime" fill="var(--chart-1)" />
          </ScatterChart>
        </ResponsiveContainer>
      </Card>

      {/* Burst Time Efficiency */}
      <Card className="p-6 bg-card border-border">
        <h3 className="text-lg font-semibold text-foreground mb-4">Burst Time vs Completion</h3>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
            <XAxis dataKey="name" stroke="var(--muted-foreground)" style={{ fontSize: '12px' }} />
            <YAxis stroke="var(--muted-foreground)" style={{ fontSize: '12px' }} />
            <Tooltip
              contentStyle={{
                backgroundColor: 'var(--card)',
                border: '1px solid var(--border)',
                borderRadius: '0.5rem',
              }}
              labelStyle={{ color: 'var(--foreground)' }}
            />
            <Legend wrapperStyle={{ paddingTop: '20px' }} />
            <Line
              type="monotone"
              dataKey="burstTime"
              stroke="var(--chart-3)"
              name="Burst Time"
              strokeWidth={2}
              dot={{ fill: 'var(--chart-3)', r: 4 }}
            />
            <Line
              type="monotone"
              dataKey="completionTime"
              stroke="var(--chart-4)"
              name="Completion Time"
              strokeWidth={2}
              dot={{ fill: 'var(--chart-4)', r: 4 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </Card>

      {/* Waiting Time Distribution */}
      <Card className="p-6 bg-card border-border">
        <h3 className="text-lg font-semibold text-foreground mb-4">Waiting Time Distribution</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
            <XAxis dataKey="name" stroke="var(--muted-foreground)" style={{ fontSize: '12px' }} />
            <YAxis stroke="var(--muted-foreground)" style={{ fontSize: '12px' }} />
            <Tooltip
              contentStyle={{
                backgroundColor: 'var(--card)',
                border: '1px solid var(--border)',
                borderRadius: '0.5rem',
              }}
              labelStyle={{ color: 'var(--foreground)' }}
            />
            <Bar dataKey="waitTime" fill="var(--chart-5)" name="Waiting Time" radius={[8, 8, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </Card>
    </div>
  );
}
