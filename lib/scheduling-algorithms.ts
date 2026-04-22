export type JobType = {
  id: string;
  name: string;
  arrivalTime: number;
  burstTime: number;
  priority?: number;
  deadline?: number;
};

export type AlgorithmResult = {
  algorithm: string;
  jobs: Array<JobType & { completionTime: number; turnaroundTime: number; waitingTime: number }>;
  metrics: {
    averageWaitingTime: number;
    averageTurnaroundTime: number;
    throughput: number;
  };
  ganttChart: Array<{ jobId: string; start: number; end: number; jobName: string }>;
};

// First Come First Served (FCFS)
export function fcfs(jobs: JobType[]): AlgorithmResult {
  const sortedJobs = [...jobs].sort((a, b) => a.arrivalTime - b.arrivalTime);
  const result: AlgorithmResult['jobs'] = [];
  const ganttChart: AlgorithmResult['ganttChart'] = [];
  
  let currentTime = 0;
  let totalWaitingTime = 0;
  let totalTurnaroundTime = 0;

  sortedJobs.forEach(job => {
    const startTime = Math.max(currentTime, job.arrivalTime);
    const completionTime = startTime + job.burstTime;
    const turnaroundTime = completionTime - job.arrivalTime;
    const waitingTime = turnaroundTime - job.burstTime;

    result.push({
      ...job,
      completionTime,
      turnaroundTime,
      waitingTime,
    });

    ganttChart.push({
      jobId: job.id,
      jobName: job.name,
      start: startTime,
      end: completionTime,
    });

    totalWaitingTime += waitingTime;
    totalTurnaroundTime += turnaroundTime;
    currentTime = completionTime;
  });

  return {
    algorithm: 'FCFS (First Come First Served)',
    jobs: result,
    metrics: {
      averageWaitingTime: totalWaitingTime / result.length,
      averageTurnaroundTime: totalTurnaroundTime / result.length,
      throughput: result.length / currentTime,
    },
    ganttChart,
  };
}

// Shortest Job First (SJF) - Non-preemptive
export function sjf(jobs: JobType[]): AlgorithmResult {
  const sortedJobs = [...jobs].sort((a, b) => a.arrivalTime - b.arrivalTime);
  const result: AlgorithmResult['jobs'] = [];
  const ganttChart: AlgorithmResult['ganttChart'] = [];
  const processed = new Set<string>();
  
  let currentTime = 0;
  let totalWaitingTime = 0;
  let totalTurnaroundTime = 0;

  while (processed.size < sortedJobs.length) {
    const available = sortedJobs.filter(
      job => !processed.has(job.id) && job.arrivalTime <= currentTime
    );

    let nextJob = available.length > 0 
      ? available.reduce((prev, curr) => 
          prev.burstTime < curr.burstTime ? prev : curr
        )
      : sortedJobs.find(job => !processed.has(job.id));

    if (!nextJob) break;

    const startTime = Math.max(currentTime, nextJob.arrivalTime);
    const completionTime = startTime + nextJob.burstTime;
    const turnaroundTime = completionTime - nextJob.arrivalTime;
    const waitingTime = turnaroundTime - nextJob.burstTime;

    result.push({
      ...nextJob,
      completionTime,
      turnaroundTime,
      waitingTime,
    });

    ganttChart.push({
      jobId: nextJob.id,
      jobName: nextJob.name,
      start: startTime,
      end: completionTime,
    });

    totalWaitingTime += waitingTime;
    totalTurnaroundTime += turnaroundTime;
    currentTime = completionTime;
    processed.add(nextJob.id);
  }

  return {
    algorithm: 'SJF (Shortest Job First)',
    jobs: result,
    metrics: {
      averageWaitingTime: totalWaitingTime / result.length,
      averageTurnaroundTime: totalTurnaroundTime / result.length,
      throughput: result.length / currentTime,
    },
    ganttChart,
  };
}

// Round Robin
export function roundRobin(jobs: JobType[], timeQuantum: number = 4): AlgorithmResult {
  const queue = [...jobs].sort((a, b) => a.arrivalTime - b.arrivalTime);
  const result: AlgorithmResult['jobs'] = [];
  const ganttChart: AlgorithmResult['ganttChart'] = [];
  const jobMap = new Map(queue.map(j => [j.id, { ...j, remainingTime: j.burstTime }]));
  
  let currentTime = 0;
  let totalWaitingTime = 0;
  let totalTurnaroundTime = 0;
  const completed = new Set<string>();

  while (completed.size < queue.length) {
    for (const job of queue) {
      if (completed.has(job.id)) continue;

      const jobData = jobMap.get(job.id)!;
      if (jobData.arrivalTime > currentTime) {
        currentTime = jobData.arrivalTime;
      }

      const executionTime = Math.min(jobData.remainingTime, timeQuantum);
      const startTime = currentTime;
      const endTime = currentTime + executionTime;

      ganttChart.push({
        jobId: job.id,
        jobName: job.name,
        start: startTime,
        end: endTime,
      });

      jobData.remainingTime -= executionTime;
      currentTime = endTime;

      if (jobData.remainingTime === 0) {
        const turnaroundTime = endTime - job.arrivalTime;
        const waitingTime = turnaroundTime - job.burstTime;

        result.push({
          ...job,
          completionTime: endTime,
          turnaroundTime,
          waitingTime,
        });

        totalWaitingTime += waitingTime;
        totalTurnaroundTime += turnaroundTime;
        completed.add(job.id);
      }
    }
  }

  return {
    algorithm: `Round Robin (Time Quantum: ${timeQuantum})`,
    jobs: result.sort((a, b) => a.arrivalTime - b.arrivalTime),
    metrics: {
      averageWaitingTime: totalWaitingTime / result.length,
      averageTurnaroundTime: totalTurnaroundTime / result.length,
      throughput: result.length / currentTime,
    },
    ganttChart,
  };
}

// Priority Scheduling (Non-preemptive)
export function priorityScheduling(jobs: JobType[]): AlgorithmResult {
  const sortedJobs = [...jobs].sort((a, b) => a.arrivalTime - b.arrivalTime);
  const result: AlgorithmResult['jobs'] = [];
  const ganttChart: AlgorithmResult['ganttChart'] = [];
  const processed = new Set<string>();
  
  let currentTime = 0;
  let totalWaitingTime = 0;
  let totalTurnaroundTime = 0;

  while (processed.size < sortedJobs.length) {
    const available = sortedJobs.filter(
      job => !processed.has(job.id) && job.arrivalTime <= currentTime
    );

    let nextJob = available.length > 0 
      ? available.reduce((prev, curr) => 
          (prev.priority ?? 0) < (curr.priority ?? 0) ? prev : curr
        )
      : sortedJobs.find(job => !processed.has(job.id));

    if (!nextJob) break;

    const startTime = Math.max(currentTime, nextJob.arrivalTime);
    const completionTime = startTime + nextJob.burstTime;
    const turnaroundTime = completionTime - nextJob.arrivalTime;
    const waitingTime = turnaroundTime - nextJob.burstTime;

    result.push({
      ...nextJob,
      completionTime,
      turnaroundTime,
      waitingTime,
    });

    ganttChart.push({
      jobId: nextJob.id,
      jobName: nextJob.name,
      start: startTime,
      end: completionTime,
    });

    totalWaitingTime += waitingTime;
    totalTurnaroundTime += turnaroundTime;
    currentTime = completionTime;
    processed.add(nextJob.id);
  }

  return {
    algorithm: 'Priority Scheduling (Non-preemptive)',
    jobs: result,
    metrics: {
      averageWaitingTime: totalWaitingTime / result.length,
      averageTurnaroundTime: totalTurnaroundTime / result.length,
      throughput: result.length / currentTime,
    },
    ganttChart,
  };
}

// Earliest Deadline First (EDF)
export function edf(jobs: JobType[]): AlgorithmResult {
  const sortedJobs = [...jobs].sort((a, b) => a.arrivalTime - b.arrivalTime);
  const result: AlgorithmResult['jobs'] = [];
  const ganttChart: AlgorithmResult['ganttChart'] = [];
  const processed = new Set<string>();
  
  let currentTime = 0;
  let totalWaitingTime = 0;
  let totalTurnaroundTime = 0;

  while (processed.size < sortedJobs.length) {
    const available = sortedJobs.filter(
      job => !processed.has(job.id) && job.arrivalTime <= currentTime
    );

    let nextJob = available.length > 0 
      ? available.reduce((prev, curr) => 
          (prev.deadline ?? Infinity) < (curr.deadline ?? Infinity) ? prev : curr
        )
      : sortedJobs.find(job => !processed.has(job.id));

    if (!nextJob) break;

    const startTime = Math.max(currentTime, nextJob.arrivalTime);
    const completionTime = startTime + nextJob.burstTime;
    const turnaroundTime = completionTime - nextJob.arrivalTime;
    const waitingTime = turnaroundTime - nextJob.burstTime;

    result.push({
      ...nextJob,
      completionTime,
      turnaroundTime,
      waitingTime,
    });

    ganttChart.push({
      jobId: nextJob.id,
      jobName: nextJob.name,
      start: startTime,
      end: completionTime,
    });

    totalWaitingTime += waitingTime;
    totalTurnaroundTime += turnaroundTime;
    currentTime = completionTime;
    processed.add(nextJob.id);
  }

  return {
    algorithm: 'EDF (Earliest Deadline First)',
    jobs: result,
    metrics: {
      averageWaitingTime: totalWaitingTime / result.length,
      averageTurnaroundTime: totalTurnaroundTime / result.length,
      throughput: result.length / currentTime,
    },
    ganttChart,
  };
}
