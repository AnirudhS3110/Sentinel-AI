'use client';

import { useState } from 'react';
import { Panel } from '@/components/platform/panel';
import { Button } from '@/components/ui/button';

export function RawLogsPanel({ logs }: { logs: string }) {
  const [open, setOpen] = useState(true);
  return (
    <Panel className="overflow-hidden !p-0">
      <div className="flex items-center justify-between border-b border-white/[0.06] px-4 py-3">
        <h3 className="text-sm font-medium text-white">Raw logs</h3>
        <Button
          variant="ghost"
          size="sm"
          className="text-xs text-zinc-400"
          onClick={() => setOpen(!open)}
        >
          {open ? 'Collapse' : 'Expand'}
        </Button>
      </div>
      {open && (
        <pre className="max-h-56 overflow-auto bg-black/40 p-4 text-xs leading-relaxed text-zinc-400">
          {logs}
        </pre>
      )}
    </Panel>
  );
}
