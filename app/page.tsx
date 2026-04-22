'use client';

import { useState } from 'react';
import { SchedulingChatbot } from '@/components/scheduling-chatbot';
import { AlgorithmSelector } from '@/components/algorithm-selector';
import { InputForm } from '@/components/input-form';
import { GanttChart } from '@/components/gantt-chart';
import { MetricsReport } from '@/components/metrics-report';
import { ResultsCharts } from '@/components/results-charts';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowRight, Zap, BookOpen } from 'lucide-react';
import {
  fcfs,
  sjf,
  roundRobin,
  priorityScheduling,
  edf,
  type JobType,
  type AlgorithmResult,
} from '@/lib/scheduling-algorithms';

type PageState = 'home' | 'chatbot' | 'selector' | 'input' | 'results';

export default function Home() {
  const [state, setState] = useState<PageState>('home');
  const [selectedAlgorithm, setSelectedAlgorithm] = useState<string>('');
  const [results, setResults] = useState<AlgorithmResult | null>(null);
  const [loading, setLoading] = useState(false);

  const handleAlgorithmSelected = (algo: string) => {
    if (algo === 'manual') {
      setSelectedAlgorithm('');
      setState('selector');
    } else {
      setSelectedAlgorithm(algo);
      setState('input');
    }
  };

  const handleRunAlgorithm = async (jobs: JobType[]) => {
    setLoading(true);
    try {
      // Simulate processing delay
      await new Promise(resolve => setTimeout(resolve, 500));

      let result: AlgorithmResult;
      switch (selectedAlgorithm) {
        case 'FCFS (First Come First Served)':
          result = fcfs(jobs);
          break;
        case 'SJF (Shortest Job First)':
          result = sjf(jobs);
          break;
        case 'Round Robin (Time Quantum: 4)':
          result = roundRobin(jobs, 4);
          break;
        case 'Priority Scheduling (Non-preemptive)':
          result = priorityScheduling(jobs);
          break;
        case 'EDF (Earliest Deadline First)':
          result = edf(jobs);
          break;
        default:
          result = fcfs(jobs);
      }

      setResults(result);
      setState('results');
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setState('home');
    setSelectedAlgorithm('');
    setResults(null);
  };

  // Home Page
  if (state === 'home') {
    return (
      <div className="min-h-screen bg-background">
        {/* Navigation */}
        <nav className="sticky top-0 z-40 border-b border-border bg-background/95 backdrop-blur">
          <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Zap className="w-6 h-6 text-primary" />
              <h1 className="text-2xl font-bold text-foreground">Scheduling Algorithms</h1>
            </div>
            <div className="text-sm text-muted-foreground">Optimize data processing with AI</div>
          </div>
        </nav>

        {/* Hero Section */}
        <section className="max-w-7xl mx-auto px-4 py-20">
          <div className="space-y-6 text-center mb-12">
            <Badge className="inline-block bg-primary/20 text-primary border-primary/30">
              AI-Powered Scheduling
            </Badge>
            <h2 className="text-5xl md:text-6xl font-bold text-foreground leading-tight">
              Handle Large Data Intakes
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-secondary to-accent">
                {' '}Efficiently
              </span>
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              When you need to deliver products to customers as fast as possible, use these scheduling algorithms. 
              Let AI recommend the perfect algorithm for your problem, or manually explore all options.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-12">
            {/* AI Chatbot Card */}
            <Card className="p-8 bg-gradient-to-br from-card via-card to-card/50 border-border hover:border-primary/50 transition-colors cursor-pointer group">
              <Button
                onClick={() => setState('chatbot')}
                className="w-full h-auto flex flex-col items-center gap-4 p-0 bg-transparent hover:bg-transparent text-foreground"
              >
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Zap className="w-8 h-8 text-white" />
                </div>
                <div className="text-center">
                  <h3 className="text-2xl font-bold text-foreground mb-2">AI Assistant</h3>
                  <p className="text-muted-foreground">
                    Describe your problem and let AI recommend the best algorithm
                  </p>
                </div>
                <ArrowRight className="w-5 h-5 text-primary group-hover:translate-x-2 transition-transform" />
              </Button>
            </Card>

            {/* Manual Selection Card */}
            <Card className="p-8 bg-gradient-to-br from-card via-card to-card/50 border-border hover:border-secondary/50 transition-colors cursor-pointer group">
              <Button
                onClick={() => setState('selector')}
                className="w-full h-auto flex flex-col items-center gap-4 p-0 bg-transparent hover:bg-transparent text-foreground"
              >
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-secondary to-accent flex items-center justify-center group-hover:scale-110 transition-transform">
                  <BookOpen className="w-8 h-8 text-white" />
                </div>
                <div className="text-center">
                  <h3 className="text-2xl font-bold text-foreground mb-2">Manual Selection</h3>
                  <p className="text-muted-foreground">
                    Explore and choose from 5 different scheduling algorithms
                  </p>
                </div>
                <ArrowRight className="w-5 h-5 text-secondary group-hover:translate-x-2 transition-transform" />
              </Button>
            </Card>
          </div>

          {/* Features */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-20">
            <Card className="p-6 bg-card border-border">
              <h4 className="font-semibold text-primary text-lg mb-2">5 Algorithms</h4>
              <p className="text-muted-foreground text-sm">
                FCFS, SJF, Round Robin, Priority, and EDF - each optimized for different scenarios
              </p>
            </Card>
            <Card className="p-6 bg-card border-border">
              <h4 className="font-semibold text-secondary text-lg mb-2">Real Insights</h4>
              <p className="text-muted-foreground text-sm">
                Get detailed metrics including wait time, turnaround time, and throughput
              </p>
            </Card>
            <Card className="p-6 bg-card border-border">
              <h4 className="font-semibold text-accent text-lg mb-2">Visualizations</h4>
              <p className="text-muted-foreground text-sm">
                Gantt charts, performance graphs, and comprehensive analytics
              </p>
            </Card>
          </div>
        </section>

        {/* Footer */}
        <footer className="border-t border-border mt-20 py-8 text-center text-muted-foreground text-sm">
          <p>Optimize your scheduling workflow with AI-powered recommendations</p>
        </footer>
      </div>
    );
  }

  // Chatbot Page
  if (state === 'chatbot') {
    return (
      <div className="min-h-screen bg-background">
        <nav className="sticky top-0 z-40 border-b border-border bg-background/95 backdrop-blur">
          <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
            <Button
              onClick={handleReset}
              variant="ghost"
              className="text-foreground hover:bg-muted"
            >
              ← Back to Home
            </Button>
            <h1 className="text-xl font-bold text-foreground">AI Scheduling Assistant</h1>
            <div className="w-24" />
          </div>
        </nav>

        <div className="max-w-4xl mx-auto px-4 py-12">
          <div className="h-screen max-h-[600px]">
            <SchedulingChatbot onAlgorithmSelected={handleAlgorithmSelected} />
          </div>
        </div>
      </div>
    );
  }

  // Algorithm Selector Page
  if (state === 'selector') {
    return (
      <div className="min-h-screen bg-background">
        <nav className="sticky top-0 z-40 border-b border-border bg-background/95 backdrop-blur">
          <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
            <Button
              onClick={handleReset}
              variant="ghost"
              className="text-foreground hover:bg-muted"
            >
              ← Back to Home
            </Button>
            <h1 className="text-xl font-bold text-foreground">Algorithm Selection</h1>
            <div className="w-24" />
          </div>
        </nav>

        <div className="max-w-6xl mx-auto px-4 py-12">
          <AlgorithmSelector
            selected={selectedAlgorithm}
            onSelect={(algo) => {
              setSelectedAlgorithm(algo);
              setState('input');
            }}
          />
        </div>
      </div>
    );
  }

  // Input Form Page
  if (state === 'input') {
    return (
      <div className="min-h-screen bg-background">
        <nav className="sticky top-0 z-40 border-b border-border bg-background/95 backdrop-blur">
          <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
            <Button
              onClick={() => setState('selector')}
              variant="ghost"
              className="text-foreground hover:bg-muted"
            >
              ← Back
            </Button>
            <h1 className="text-xl font-bold text-foreground">Input Data</h1>
            <Button
              onClick={handleReset}
              variant="outline"
              className="border-border text-foreground hover:bg-muted"
            >
              Start Over
            </Button>
          </div>
        </nav>

        <div className="max-w-4xl mx-auto px-4 py-12">
          <InputForm algorithm={selectedAlgorithm} onSubmit={handleRunAlgorithm} loading={loading} />
        </div>
      </div>
    );
  }

  // Results Page
  if (state === 'results' && results) {
    const maxTime = Math.max(...results.ganttChart.map(g => g.end));

    return (
      <div className="min-h-screen bg-background">
        <nav className="sticky top-0 z-40 border-b border-border bg-background/95 backdrop-blur">
          <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
            <Button
              onClick={() => setState('input')}
              variant="ghost"
              className="text-foreground hover:bg-muted"
            >
              ← Back to Input
            </Button>
            <h1 className="text-xl font-bold text-foreground">Results</h1>
            <Button
              onClick={handleReset}
              variant="outline"
              className="border-border text-foreground hover:bg-muted"
            >
              Start Over
            </Button>
          </div>
        </nav>

        <div className="max-w-7xl mx-auto px-4 py-12 space-y-8">
          {/* Metrics Report */}
          <MetricsReport
            algorithm={results.algorithm}
            metrics={results.metrics}
            jobsCount={results.jobs.length}
            totalTime={maxTime}
          />

          {/* Gantt Chart */}
          <GanttChart data={results.ganttChart} maxTime={maxTime} />

          {/* Charts */}
          <ResultsCharts jobs={results.jobs} />

          {/* Jobs Table */}
          <Card className="p-6 bg-card border-border">
            <h3 className="text-lg font-semibold text-foreground mb-4">Job Details</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left py-2 px-3 font-semibold text-foreground">Job</th>
                    <th className="text-left py-2 px-3 font-semibold text-foreground">Arrival</th>
                    <th className="text-left py-2 px-3 font-semibold text-foreground">Burst</th>
                    <th className="text-left py-2 px-3 font-semibold text-foreground">Completion</th>
                    <th className="text-left py-2 px-3 font-semibold text-foreground">Wait Time</th>
                    <th className="text-left py-2 px-3 font-semibold text-foreground">Turnaround</th>
                  </tr>
                </thead>
                <tbody>
                  {results.jobs.map((job, idx) => (
                    <tr key={job.id} className="border-b border-border/50 hover:bg-muted/30 transition-colors">
                      <td className="py-2 px-3 font-medium text-foreground">{job.name}</td>
                      <td className="py-2 px-3 text-muted-foreground">{job.arrivalTime}</td>
                      <td className="py-2 px-3 text-muted-foreground">{job.burstTime}</td>
                      <td className="py-2 px-3 text-muted-foreground">{job.completionTime}</td>
                      <td className="py-2 px-3">
                        <Badge className="bg-primary/20 text-primary">
                          {job.waitingTime.toFixed(2)}
                        </Badge>
                      </td>
                      <td className="py-2 px-3">
                        <Badge className="bg-secondary/20 text-secondary">
                          {job.turnaroundTime.toFixed(2)}
                        </Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>

          {/* Action Buttons */}
          <div className="flex gap-4 justify-center pb-12">
            <Button
              onClick={() => setState('input')}
              variant="outline"
              className="border-border text-foreground hover:bg-muted"
            >
              Modify Input
            </Button>
            <Button
              onClick={() => setState('selector')}
              className="bg-primary hover:bg-primary/90 text-primary-foreground"
            >
              Try Another Algorithm
            </Button>
            <Button
              onClick={handleReset}
              className="bg-secondary hover:bg-secondary/90 text-secondary-foreground"
            >
              New Problem
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return null;
}
