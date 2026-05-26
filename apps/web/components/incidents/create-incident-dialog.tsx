'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { createIncident } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { PlusCircle, Terminal, FileText, Layout } from 'lucide-react';

export function CreateIncidentDialog() {
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState('Redis Connection Pool Exhaustion');
  const [description, setDescription] = useState(
    'Production API latency increased drastically and multiple requests started timing out.'
  );
  const [rawLogs, setRawLogs] = useState(
    `[ioredis] Unhandled error event: Error: connect ETIMEDOUT 10.0.0.12:6379\nBullMQ failed to initialize queues\nRetrying in 5000ms\nRedis connection pool exhausted\nAPI response time exceeded 12s`
  );
  const router = useRouter();
  const qc = useQueryClient();

  const mutation = useMutation({
    mutationFn: () => createIncident({ title, description: description || undefined, rawLogs }),
    onSuccess: (data) => {
      toast.success('Incident logged. Redirecting to investigation...');
      qc.invalidateQueries({ queryKey: ['incidents'] });
      setOpen(false);
      // Redirect to the newly created incident page
      router.push(`/incidents/${data.incident.id}`);
    },
    onError: (e: Error) => toast.error(e.message),
  });

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          className="h-8.5 rounded-full border-0 bg-gradient-to-r from-violet-600 to-indigo-600 px-4.5 text-xs font-semibold text-white shadow-md shadow-violet-600/20 hover:opacity-95 transition-all flex items-center gap-1.5"
        >
          <PlusCircle className="h-4 w-4" />
          <span>Log Case</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="border-white/[0.08] bg-[#070913]/98 text-white backdrop-blur-2xl sm:max-w-lg shadow-[0_24px_64px_rgba(0,0,0,0.6)]">
        <DialogHeader className="border-b border-white/[0.04] pb-4">
          <DialogTitle className="text-base font-bold text-white flex items-center gap-2">
            <Terminal className="h-5 w-5 text-violet-400" />
            Log New SRE Case
          </DialogTitle>
          <p className="text-xs text-zinc-500">Inject telemetry logs to launch a multi-agent orchestration workflow</p>
        </DialogHeader>
        <div className="space-y-4.5 mt-4">
          <Field label="Case Title">
            <Input
              placeholder="e.g. API latency spike"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="border-white/10 bg-white/[0.02] text-xs text-white placeholder:text-zinc-600 h-9.5 focus-visible:ring-violet-500/50"
            />
          </Field>
          
          <Field label="Description / Impact context">
            <Input
              placeholder="Provide a short impact summary"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="border-white/10 bg-white/[0.02] text-xs text-white placeholder:text-zinc-600 h-9.5 focus-visible:ring-violet-500/50"
            />
          </Field>
          
          <Field label="Raw Telemetry logs & stack traces">
            <Textarea
              placeholder="Paste error logs, console logs, or metrics..."
              value={rawLogs}
              onChange={(e) => setRawLogs(e.target.value)}
              className="min-h-[140px] border-white/10 bg-[#04060d] font-mono text-[10.5px] leading-relaxed text-zinc-300 placeholder:text-zinc-600 focus-visible:ring-violet-500/50 scrollbar-thin"
            />
          </Field>

          <div className="flex items-center justify-end gap-3 pt-3 border-t border-white/[0.04]">
            <Button
              variant="ghost"
              className="text-xs text-zinc-400 hover:text-white hover:bg-white/[0.04] h-9.5 rounded-full"
              onClick={() => setOpen(false)}
            >
              Cancel
            </Button>
            <Button
              className="border-0 bg-gradient-to-r from-violet-600 to-indigo-600 text-xs font-semibold text-white hover:opacity-95 h-9.5 rounded-full px-6 shadow-md shadow-violet-600/10"
              disabled={!title.trim() || !rawLogs.trim() || mutation.isPending}
              onClick={() => mutation.mutate()}
            >
              {mutation.isPending ? 'Logging case...' : 'Submit Case'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1.5">
      <label className="text-[10px] font-bold uppercase tracking-wider text-zinc-500">{label}</label>
      {children}
    </div>
  );
}
