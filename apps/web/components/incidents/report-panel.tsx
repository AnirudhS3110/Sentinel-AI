'use client';

import { Panel } from '@/components/platform/panel';
import { SectionLabel } from '@/components/platform/panel';
import type { IncidentReport } from '@/lib/types';

export function ReportPanel({ report }: { report: IncidentReport | null | undefined }) {
  if (!report) {
    return (
      <Panel className="p-5">
        <h3 className="text-sm font-medium text-white">Final report</h3>
        <p className="mt-2 text-sm text-zinc-500">Report will appear when the workflow completes.</p>
      </Panel>
    );
  }
  return (
    <Panel glow className="p-5">
      <h3 className="text-sm font-semibold text-white">Final report</h3>
      <div className="mt-4 space-y-4">
        <Block title="Summary" content={report.summary} />
        <Block title="Root cause" content={report.rootCause} />
        <Block title="Remediation" content={report.remediation} pre />
        {report.timeline != null && (
          <div>
            <SectionLabel>Generated timeline</SectionLabel>
            <pre className="mt-2 max-h-40 overflow-auto rounded-lg border border-white/[0.06] bg-black/30 p-3 text-[11px] text-zinc-400">
              {JSON.stringify(report.timeline, null, 2)}
            </pre>
          </div>
        )}
      </div>
    </Panel>
  );
}

function Block({ title, content, pre }: { title: string; content: string; pre?: boolean }) {
  return (
    <div>
      <SectionLabel>{title}</SectionLabel>
      <p className={pre ? 'mt-2 whitespace-pre-wrap text-sm leading-relaxed text-zinc-300' : 'mt-2 text-sm leading-relaxed text-zinc-300'}>
        {content}
      </p>
    </div>
  );
}
