import { Suspense } from 'react';
import { AgentsPageContent } from '@/components/agents/agents-page-content';

export default function AgentsPage() {
  return (
    <Suspense
      fallback={
        <div className="flex h-full items-center justify-center p-6 text-sm text-[#64748b]">
          Loading agents…
        </div>
      }
    >
      <AgentsPageContent />
    </Suspense>
  );
}
