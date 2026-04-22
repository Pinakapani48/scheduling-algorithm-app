import { generateText } from 'ai';
import { openai } from '@ai-sdk/openai';

const ALGORITHM_KEYWORDS: Record<string, { algorithm: string; reasoning: string }> = {
  railway: {
    algorithm: 'FCFS (First Come First Served)',
    reasoning: 'Railway ticket bookings work on a first-come, first-served basis where tickets are allocated in the order requests arrive, ensuring fairness.',
  },
  interview: {
    algorithm: 'Priority Scheduling',
    reasoning: 'Interview scheduling often needs to prioritize senior candidates or urgent positions, making priority-based scheduling ideal.',
  },
  task: {
    algorithm: 'SJF (Shortest Job First)',
    reasoning: 'For processing tasks, prioritizing shorter jobs reduces average waiting time and improves throughput.',
  },
  deadline: {
    algorithm: 'EDF (Earliest Deadline First)',
    reasoning: 'When tasks have deadlines, processing jobs with the earliest deadline first minimizes missed deadlines.',
  },
  interactive: {
    algorithm: 'Round Robin',
    reasoning: 'Interactive systems benefit from round-robin scheduling as it ensures all users get equal CPU time, preventing starvation.',
  },
  process: {
    algorithm: 'Round Robin',
    reasoning: 'Process scheduling benefits from fair distribution of CPU time across all processes.',
  },
};

export async function POST(request: Request) {
  try {
    const { problem } = await request.json();

    if (!problem || typeof problem !== 'string') {
      return Response.json({ error: 'Invalid problem description' }, { status: 400 });
    }

    const problemLower = problem.toLowerCase();
    
    // Quick keyword-based recommendation for common scenarios
    for (const [keyword, recommendation] of Object.entries(ALGORITHM_KEYWORDS)) {
      if (problemLower.includes(keyword)) {
        return Response.json(recommendation);
      }
    }

    // Use AI SDK for more complex problems
    try {
      const response = await generateText({
        model: openai('gpt-4-mini'),
        prompt: `You are an expert in CPU scheduling algorithms. A user describes their scheduling problem: "${problem}"

Based on this problem, recommend ONE of these algorithms and explain why:
1. FCFS (First Come First Served) - For fair, sequential processing
2. SJF (Shortest Job First) - For minimizing average wait time
3. Round Robin - For interactive systems and fairness
4. Priority Scheduling - For prioritized workloads
5. EDF (Earliest Deadline First) - For deadline-driven tasks

Respond in this exact format:
ALGORITHM: [name]
REASON: [one sentence explanation]`,
        temperature: 0.7,
        maxTokens: 200,
      });

      const responseText = response.text;
      
      // Parse the response
      const algorithmMatch = responseText.match(/ALGORITHM:\s*(.+?)(?:\n|$)/);
      const reasonMatch = responseText.match(/REASON:\s*(.+?)(?:\n|$)/);

      const algorithm = algorithmMatch?.[1]?.trim() || 'FCFS (First Come First Served)';
      const reasoning = reasonMatch?.[1]?.trim() || 'Recommended for your use case';

      return Response.json({
        algorithm,
        reasoning,
      });
    } catch (aiError) {
      console.error('[v0] AI SDK error:', aiError);
      
      // Fallback to FCFS if AI fails
      return Response.json({
        algorithm: 'FCFS (First Come First Served)',
        reasoning: 'Default recommendation based on common scheduling practices.',
      });
    }
  } catch (error) {
    console.error('[v0] API error:', error);
    
    return Response.json({
      algorithm: 'FCFS (First Come First Served)',
      reasoning: 'Default recommendation. Error occurred during analysis.',
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
}
