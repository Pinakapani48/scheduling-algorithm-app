'use client';

import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Send, Loader2, MessageCircle } from 'lucide-react';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

interface ChatbotProps {
  onAlgorithmSelected?: (algo: string) => void;
  onInputDataGenerated?: (data: any) => void;
}

export function SchedulingChatbot({ onAlgorithmSelected, onInputDataGenerated }: ChatbotProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content: 'Hello! I\'m your scheduling algorithms assistant. Describe your scheduling problem (e.g., "I need to book railway seats for incoming orders" or "I need to schedule interviews"), and I\'ll recommend the best algorithm for you.',
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [stage, setStage] = useState<'problem' | 'questions' | 'complete'>('problem');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const analyzeWithGroq = async (userProblem: string) => {
    try {
      setLoading(true);
      
      const response = await fetch('/api/analyze-scheduling', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ problem: userProblem }),
      });

      if (!response.ok) throw new Error('Failed to analyze problem');
      
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('[v0] Groq error:', error);
      return null;
    } finally {
      setLoading(false);
    }
  };

  const handleSendMessage = async () => {
    if (!input.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');

    if (stage === 'problem') {
      setLoading(true);
      const analysis = await analyzeWithGroq(input);
      setLoading(false);

      if (analysis) {
        const assistantMessage: Message = {
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          content: `Based on your problem, I recommend: **${analysis.algorithm}**\n\nReason: ${analysis.reasoning}\n\nWould you like to:\n1. Use this algorithm (type "yes")\n2. Choose a different algorithm (type "change")\n3. Manually select (type "manual")`,
          timestamp: new Date(),
        };
        setMessages(prev => [...prev, assistantMessage]);
        setStage('questions');
        onAlgorithmSelected?.(analysis.algorithm);
      }
    } else if (stage === 'questions') {
      const response = input.toLowerCase();
      let assistantMessage: Message;

      if (response === 'yes') {
        assistantMessage = {
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          content: 'Great! Now, please provide the input data for your jobs. You can enter:\n- Job name\n- Arrival time\n- Burst/Duration time\n- Priority (if applicable)\n- Deadline (if applicable)\n\nFormat: name, arrival, burst, [priority], [deadline]',
          timestamp: new Date(),
        };
        setStage('complete');
      } else if (response === 'change') {
        assistantMessage = {
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          content: 'Choose from these scheduling algorithms:\n1. FCFS (First Come First Served)\n2. SJF (Shortest Job First)\n3. Round Robin\n4. Priority Scheduling\n5. EDF (Earliest Deadline First)\n\nType the number or algorithm name.',
          timestamp: new Date(),
        };
      } else if (response === 'manual') {
        assistantMessage = {
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          content: 'Proceed to manual selection. You\'ll see all available algorithms and can choose one.',
          timestamp: new Date(),
        };
        onAlgorithmSelected?.('manual');
      } else {
        assistantMessage = {
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          content: 'Please respond with "yes", "change", or "manual".',
          timestamp: new Date(),
        };
      }

      setMessages(prev => [...prev, assistantMessage]);
    }
  };

  return (
    <Card className="h-full flex flex-col bg-card border-border">
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map(msg => (
          <div
            key={msg.id}
            className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                msg.role === 'user'
                  ? 'bg-primary text-primary-foreground rounded-br-none'
                  : 'bg-secondary text-secondary-foreground rounded-bl-none'
              }`}
            >
              <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
              <span className="text-xs opacity-70 mt-1 block">
                {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </span>
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex justify-start">
            <div className="bg-secondary text-secondary-foreground px-4 py-2 rounded-lg rounded-bl-none">
              <Loader2 className="w-4 h-4 animate-spin" />
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="border-t border-border p-4">
        <div className="flex gap-2">
          <Input
            value={input}
            onChange={e => setInput(e.target.value)}
            placeholder="Type your message..."
            onKeyPress={e => e.key === 'Enter' && !loading && handleSendMessage()}
            disabled={loading}
            className="flex-1 bg-input border-border"
          />
          <Button
            onClick={handleSendMessage}
            disabled={loading || !input.trim()}
            className="bg-primary hover:bg-primary/90 text-primary-foreground"
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
          </Button>
        </div>
      </div>
    </Card>
  );
}
