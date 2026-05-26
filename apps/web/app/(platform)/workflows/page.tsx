import { Suspense } from 'react';
import { WorkflowsPageContent } from '@/components/workflows/workflows-page-content';

export default function WorkflowsPage() {
  return (
    <Suspense
      fallback={
        <div className="flex h-full items-center justify-center p-6 text-sm text-[#64748b]">
          Loading workflows…
        </div>
      }
    >
      <WorkflowsPageContent />
    </Suspense>
  );
}
