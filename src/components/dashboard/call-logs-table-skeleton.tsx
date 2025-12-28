import { Skeleton } from "@/components/ui/skeleton"

export default function CallLogsTableSkeleton() {
  return (
    <div className="m-6 text-xs space-y-4">
      <div className="w-full max-w-4xl flex flex-col gap-4">
        <Skeleton className="h-10 w-40" />
        <Skeleton className="h-10 w-full" />
      </div>
      <div className="space-y-2">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="flex gap-4">
            <Skeleton className="h-12 w-24 flex-shrink-0" />
            <Skeleton className="h-12 flex-1" />
            <Skeleton className="h-12 w-32 flex-shrink-0" />
            <Skeleton className="h-12 w-20 flex-shrink-0" />
          </div>
        ))}
      </div>
    </div>
  )
}
