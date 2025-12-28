import { Skeleton } from "@/components/ui/skeleton"

export default function SubscriptionSkeleton() {
  return (
    <div className="p-6 space-y-8 max-w-6xl">
      <div className="flex items-center space-x-3">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-6 w-20" />
      </div>

      <div className="rounded-lg border bg-white p-6 space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <div key={i}>
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-7 w-32 mt-2" />
            </div>
          ))}
        </div>
        <div className="border-t pt-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <div key={i}>
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-7 w-32 mt-2" />
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="space-y-3">
        <Skeleton className="h-4 w-32" />
        <Skeleton className="h-10 w-48" />
      </div>

      <div className="space-y-6">
        <div>
          <Skeleton className="h-6 w-40" />
          <Skeleton className="h-4 w-64 mt-1" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="rounded-lg border bg-white overflow-hidden">
              <Skeleton className="h-24 w-full" />
              <div className="p-6 space-y-4">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-8 w-32" />
                <div className="space-y-2 py-4 border-t">
                  {[...Array(3)].map((_, idx) => (
                    <Skeleton key={idx} className="h-4 w-full" />
                  ))}
                </div>
                <Skeleton className="h-10 w-full" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
