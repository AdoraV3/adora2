import { Skeleton } from "@/components/ui/skeleton"

export default function PaymentSkeleton() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-slate-50 to-slate-100">
      <div className="w-full max-w-4xl space-y-6">
        <div className="rounded-lg border bg-white p-8 shadow-lg space-y-4">
          <div className="flex flex-col items-center text-center space-y-4">
            <Skeleton className="h-12 w-12 rounded-full" />
            <Skeleton className="h-6 w-40" />
            <Skeleton className="h-4 w-60" />
          </div>
        </div>

        <div className="space-y-6">
          <Skeleton className="h-8 w-48" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Skeleton className="h-32 rounded-lg" />
            <Skeleton className="h-32 rounded-lg" />
          </div>

          <div className="rounded-lg border bg-white overflow-hidden">
            <div className="space-y-2">
              {[...Array(5)].map((_, i) => (
                <Skeleton key={i} className="h-12 w-full" />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
