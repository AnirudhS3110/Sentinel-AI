import { Suspense } from 'react';
import { ReportsPageContent } from '@/components/reports/reports-page-content';

export default function ReportsPage() {
  return (
    <Suspense
      fallback={
        <div className="flex h-full items-center justify-center p-6 text-sm text-[#64748b]">
          Loading reports…
        </div>
      }
    >
      <ReportsPageContent />
    </Suspense>
  );
}
