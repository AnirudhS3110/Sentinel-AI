'use client';

import { useEffect, useMemo, useState, useRef } from 'react';
import { Surface, SectionTitle, Eyebrow } from '@/components/platform/surface';
import { StatusIndicator } from '@/components/ui/status-indicator';
import { Terminal, Copy, Check } from 'lucide-react';
import { toast } from 'sonner';

export function LiveLogsStream({ logs }: { logs: string }) {
  const lines = useMemo(() => logs.split('\n').filter(Boolean), [logs]);
  const [visible, setVisible] = useState<string[]>([]);
  const [copied, setCopied] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setVisible(lines.slice(-15));
  }, [lines]);

  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
  }, [visible]);

  const handleCopy = () => {
    navigator.clipboard.writeText(logs);
    setCopied(true);
    toast.success('Logs copied to clipboard');
    setTimeout(() => setCopied(false), 2000);
  };

  const formatLogLine = (line: string) => {
    // Detect typical log levels and formats
    const hasError = /error|fail|exception|err|critical/i.test(line);
    const hasWarn = /warn|warning|retry/i.test(line);
    const hasSuccess = /success|done|complete|resolved/i.test(line);
    const hasInfo = /info|start|run|exec/i.test(line);

    let contentStyle = 'text-zinc-300';
    if (hasError) contentStyle = 'text-red-400 font-medium';
    else if (hasWarn) contentStyle = 'text-amber-400';
    else if (hasSuccess) contentStyle = 'text-emerald-400';
    else if (hasInfo) contentStyle = 'text-sky-400';

    // Parse timestamp if it exists at the start (e.g. ISO date or similar)
    const timeMatch = line.match(/^(\[?\d{4}-\d{2}-\d{2}[T\s]\d{2}:\d{2}:\d{2}\.?\d*Z?\]?)/);
    if (timeMatch) {
      const timePart = timeMatch[1];
      const rest = line.substring(timePart.length);
      return (
        <>
          <span className="text-zinc-500 font-mono select-none">{timePart}</span>
          <span className={contentStyle}>{rest}</span>
        </>
      );
    }

    return <span className={contentStyle}>{line}</span>;
  };

  return (
    <Surface variant="raised" className="flex flex-col overflow-hidden bg-[#070913] border-white/[0.06] shadow-[0_8px_32px_rgba(0,0,0,0.35)] h-full min-h-[300px]">
      <div className="flex items-center justify-between border-b border-white/[0.04] px-5 py-4 bg-black/20">
        <div className="flex items-center gap-2">
          <Terminal className="h-4 w-4 text-violet-400" />
          <div>
            <Eyebrow className="text-zinc-500 font-semibold tracking-widest text-[9px]">TELEMETRY CONSOLE</Eyebrow>
            <SectionTitle className="mt-0.5 text-xs font-bold text-white">Live stdout & logs</SectionTitle>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={handleCopy}
            className="flex h-7 w-7 items-center justify-center rounded-md border border-white/[0.06] bg-white/[0.02] text-zinc-400 hover:text-white hover:bg-white/[0.06] transition-all"
            title="Copy all logs"
          >
            {copied ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />}
          </button>
          <StatusIndicator label="Streaming" tone="live" pulse />
        </div>
      </div>
      
      {/* Tab bar header */}
      <div className="flex items-center gap-2 px-4 py-1.5 bg-black/30 border-b border-white/[0.02] text-[10px] text-zinc-500 font-mono">
        <span className="h-1.5 w-1.5 rounded-full bg-violet-500" />
        <span>sentinel_sre_orchestrator.log</span>
      </div>

      <div 
        ref={containerRef}
        className="flex-1 overflow-y-auto px-5 py-4 font-mono text-[10.5px] leading-relaxed bg-black/45 max-h-[220px] scrollbar-thin select-text"
      >
        {visible.length === 0 ? (
          <p className="text-zinc-600 italic">No telemetry data received yet.</p>
        ) : (
          visible.map((line, i) => (
            <div key={`${i}-${line.slice(0, 16)}`} className="flex items-start gap-3 hover:bg-white/[0.01] py-0.5 px-1 rounded transition-colors">
              <span className="text-zinc-700 select-none text-[9.5px] text-right min-w-[16px]">
                {String(i + 1).padStart(2, '0')}
              </span>
              <p className="break-all whitespace-pre-wrap flex-1">
                {formatLogLine(line)}
              </p>
            </div>
          ))
        )}
      </div>
    </Surface>
  );
}
