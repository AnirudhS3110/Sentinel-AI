import { Badge } from '@/components/ui/badge';
import { severityTone, statusLabel, statusTone } from '@/lib/status';

export function StatusBadge({ status }: { status: string }) {
  const tone = statusTone(status);
  const variant = tone === 'idle' ? 'default' : tone;
  return <Badge variant={variant}>{statusLabel(status)}</Badge>;
}

export function SeverityBadge({ severity }: { severity?: string | null }) {
  if (!severity) return <Badge variant="default">—</Badge>;
  const tone = severityTone(severity);
  const variant = tone === 'muted' ? 'default' : tone;
  return <Badge variant={variant}>{severity}</Badge>;
}
