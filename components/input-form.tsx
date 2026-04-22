'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Plus, Trash2, Play } from 'lucide-react';

interface Job {
  id: string;
  name: string;
  arrivalTime: number;
  burstTime: number;
  priority?: number;
  deadline?: number;
}

interface InputFormProps {
  algorithm: string;
  onSubmit: (jobs: Job[]) => void;
  loading?: boolean;
}

export function InputForm({ algorithm, onSubmit, loading }: InputFormProps) {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [name, setName] = useState('');
  const [arrivalTime, setArrivalTime] = useState('');
  const [burstTime, setBurstTime] = useState('');
  const [priority, setPriority] = useState('');
  const [deadline, setDeadline] = useState('');
  const [bulkInput, setBulkInput] = useState('');
  const [useBulk, setUseBulk] = useState(false);

  const showPriority = algorithm.includes('Priority');
  const showDeadline = algorithm.includes('EDF') || algorithm.includes('Deadline');

  const addJob = () => {
    if (!name || !arrivalTime || !burstTime) return;

    const newJob: Job = {
      id: `job-${Date.now()}`,
      name,
      arrivalTime: parseInt(arrivalTime),
      burstTime: parseInt(burstTime),
      ...(showPriority && priority && { priority: parseInt(priority) }),
      ...(showDeadline && deadline && { deadline: parseInt(deadline) }),
    };

    setJobs([...jobs, newJob]);
    setName('');
    setArrivalTime('');
    setBurstTime('');
    setPriority('');
    setDeadline('');
  };

  const removeJob = (id: string) => {
    setJobs(jobs.filter(job => job.id !== id));
  };

  const parseBulkInput = () => {
    const lines = bulkInput.split('\n').filter(line => line.trim());
    const newJobs: Job[] = [];

    lines.forEach(line => {
      const parts = line.split(',').map(p => p.trim());
      if (parts.length >= 3) {
        newJobs.push({
          id: `job-${Date.now()}-${Math.random()}`,
          name: parts[0],
          arrivalTime: parseInt(parts[1]),
          burstTime: parseInt(parts[2]),
          ...(parts.length > 3 && showPriority && { priority: parseInt(parts[3]) }),
          ...(parts.length > 4 && showDeadline && { deadline: parseInt(parts[4]) }),
        });
      }
    });

    setJobs(newJobs);
    setBulkInput('');
    setUseBulk(false);
  };

  const preloadExample = () => {
    const examples: Record<string, Job[]> = {
      'Railway Ticket Booking': [
        { id: 'j1', name: 'Customer 1', arrivalTime: 0, burstTime: 5 },
        { id: 'j2', name: 'Customer 2', arrivalTime: 2, burstTime: 8 },
        { id: 'j3', name: 'Customer 3', arrivalTime: 3, burstTime: 6 },
        { id: 'j4', name: 'Customer 4', arrivalTime: 5, burstTime: 4 },
      ],
      'Interview Scheduling': [
        { id: 'j1', name: 'Interview 1', arrivalTime: 0, burstTime: 30, priority: 1 },
        { id: 'j2', name: 'Interview 2', arrivalTime: 10, burstTime: 30, priority: 2 },
        { id: 'j3', name: 'Interview 3', arrivalTime: 20, burstTime: 30, priority: 1 },
        { id: 'j4', name: 'Interview 4', arrivalTime: 30, burstTime: 30, priority: 3 },
      ],
    };

    for (const [key, value] of Object.entries(examples)) {
      if (algorithm.includes(key.split(' ')[0])) {
        setJobs(value);
        return;
      }
    }

    // Default example
    setJobs([
      { id: 'j1', name: 'Task A', arrivalTime: 0, burstTime: 5 },
      { id: 'j2', name: 'Task B', arrivalTime: 1, burstTime: 3 },
      { id: 'j3', name: 'Task C', arrivalTime: 2, burstTime: 8 },
    ]);
  };

  const handleSubmit = () => {
    if (jobs.length === 0) return;
    onSubmit(jobs);
  };

  return (
    <Card className="p-6 bg-card border-border">
      <h3 className="text-2xl font-bold text-foreground mb-2">Input Jobs</h3>
      <p className="text-sm text-muted-foreground mb-6">Algorithm: <span className="font-semibold text-primary">{algorithm}</span></p>

      {!useBulk ? (
        <div className="space-y-4 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              placeholder="Job Name (e.g., Task A, Customer 1)"
              value={name}
              onChange={e => setName(e.target.value)}
              className="bg-input border-border"
            />
            <Input
              placeholder="Arrival Time"
              type="number"
              value={arrivalTime}
              onChange={e => setArrivalTime(e.target.value)}
              className="bg-input border-border"
            />
            <Input
              placeholder="Burst Time / Duration"
              type="number"
              value={burstTime}
              onChange={e => setBurstTime(e.target.value)}
              className="bg-input border-border"
            />
            {showPriority && (
              <Input
                placeholder="Priority (lower is higher priority)"
                type="number"
                value={priority}
                onChange={e => setPriority(e.target.value)}
                className="bg-input border-border"
              />
            )}
            {showDeadline && (
              <Input
                placeholder="Deadline"
                type="number"
                value={deadline}
                onChange={e => setDeadline(e.target.value)}
                className="bg-input border-border"
              />
            )}
          </div>

          <div className="flex gap-2">
            <Button
              onClick={addJob}
              disabled={!name || !arrivalTime || !burstTime}
              className="flex gap-2 bg-primary hover:bg-primary/90 text-primary-foreground"
            >
              <Plus className="w-4 h-4" />
              Add Job
            </Button>
            <Button
              onClick={preloadExample}
              variant="outline"
              className="border-border text-foreground hover:bg-muted"
            >
              Load Example
            </Button>
            <Button
              onClick={() => setUseBulk(true)}
              variant="outline"
              className="border-border text-foreground hover:bg-muted"
            >
              Bulk Input
            </Button>
          </div>
        </div>
      ) : (
        <div className="space-y-4 mb-6">
          <Textarea
            placeholder={`Enter jobs (one per line):\nJob Name, Arrival Time, Burst Time${showPriority ? ', Priority' : ''}${showDeadline ? ', Deadline' : ''}\n\nExample:\nTask A, 0, 5${showPriority ? ', 1' : ''}${showDeadline ? ', 10' : ''}\nTask B, 1, 3${showPriority ? ', 2' : ''}${showDeadline ? ', 8' : ''}`}
            value={bulkInput}
            onChange={e => setBulkInput(e.target.value)}
            rows={6}
            className="bg-input border-border font-mono text-sm"
          />
          <div className="flex gap-2">
            <Button
              onClick={parseBulkInput}
              disabled={!bulkInput.trim()}
              className="flex gap-2 bg-primary hover:bg-primary/90 text-primary-foreground"
            >
              Parse & Load
            </Button>
            <Button
              onClick={() => setUseBulk(false)}
              variant="outline"
              className="border-border text-foreground hover:bg-muted"
            >
              Back to Form
            </Button>
          </div>
        </div>
      )}

      {/* Jobs List */}
      {jobs.length > 0 && (
        <div className="mb-6">
          <h4 className="font-semibold text-foreground mb-3">Added Jobs ({jobs.length})</h4>
          <div className="space-y-2 max-h-48 overflow-y-auto">
            {jobs.map(job => (
              <div
                key={job.id}
                className="flex items-center justify-between p-3 bg-muted/50 rounded-lg border border-border/50"
              >
                <div className="flex-1">
                  <p className="font-medium text-foreground">{job.name}</p>
                  <p className="text-xs text-muted-foreground">
                    Arrival: {job.arrivalTime} | Burst: {job.burstTime}
                    {job.priority !== undefined && ` | Priority: ${job.priority}`}
                    {job.deadline !== undefined && ` | Deadline: ${job.deadline}`}
                  </p>
                </div>
                <Button
                  onClick={() => removeJob(job.id)}
                  size="sm"
                  variant="ghost"
                  className="text-accent hover:bg-accent/10"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            ))}
          </div>
        </div>
      )}

      <Button
        onClick={handleSubmit}
        disabled={jobs.length === 0 || loading}
        className="w-full bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 text-white font-semibold h-10 flex gap-2"
      >
        <Play className="w-4 h-4" />
        {loading ? 'Processing...' : 'Run Algorithm'}
      </Button>
    </Card>
  );
}
