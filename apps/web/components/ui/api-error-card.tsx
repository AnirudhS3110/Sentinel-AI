import { apiSetupHint } from '@/lib/api-error';
import { API_URL, isRemoteApi } from '@/lib/config';
import { Panel } from '@/components/platform/panel';

export function ApiErrorCard({ message }: { message: string }) {
  return (
    <Panel className="border-red-500/20 bg-red-500/5 p-6">
      <h3 className="text-sm font-semibold text-red-300">Could not load data</h3>
      <p className="mt-2 text-sm leading-relaxed text-zinc-400">{message}</p>
      <p className="mt-3 text-xs text-zinc-500">
        API endpoint: <span className="text-violet-400">{API_URL}</span>
      </p>
      <p className="mt-1 text-xs text-zinc-600">{apiSetupHint()}</p>
      {isRemoteApi ? (
        <p className="mt-3 text-xs text-zinc-500">
          The API at <span className="text-violet-400">{API_URL}</span> is not reachable. Check Railway deploy logs,
          ensure <code className="rounded-md bg-white/[0.06] px-1 py-0.5">DATABASE_URL</code> and{' '}
          <code className="rounded-md bg-white/[0.06] px-1 py-0.5">REDIS_URL</code> are set, then confirm{' '}
          <code className="rounded-md bg-white/[0.06] px-1 py-0.5">/health</code> returns OK. See{' '}
          <code className="rounded-md bg-white/[0.06] px-1 py-0.5">DEPLOYMENT.md</code> in the repo.
        </p>
      ) : (
        <p className="mt-3 text-xs text-zinc-500">
          Run{' '}
          <code className="rounded-md bg-white/[0.06] px-1.5 py-0.5 text-violet-300">npm run dev:api</code> (port 3001)
          and <code className="rounded-md bg-white/[0.06] px-1.5 py-0.5 text-violet-300">npm run dev:web</code> (port
          3000), then refresh.
        </p>
      )}
    </Panel>
  );
}
