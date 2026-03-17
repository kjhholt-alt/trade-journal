import { Suspense } from "react";
import { DashboardContent } from "@/components/DashboardContent";

export default function DashboardPage() {
  return (
    <Suspense fallback={<DashboardSkeleton />}>
      <DashboardContent />
    </Suspense>
  );
}

function DashboardSkeleton() {
  return (
    <div className="flex min-h-screen">
      <div className="flex-1 p-6 space-y-6">
        <div className="animate-pulse space-y-6">
          <div className="h-8 w-48 bg-gray-800 rounded" />
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-24 bg-gray-800 rounded-lg" />
            ))}
          </div>
          <div className="h-96 bg-gray-800 rounded-lg" />
        </div>
      </div>
    </div>
  );
}
