/* Created new Ant Design Skeleton component for call logs loading state */
"use client"

import { Skeleton } from "antd"

export function CallLogsSkeleton() {
  return (
    <div className="w-full bg-white rounded-2xl p-6 shadow-lg border border-slate-100">
      <div className="space-y-4">
        {[...Array(6)].map((_, i) => (
          <div key={i}>
            <Skeleton active paragraph={{ rows: 1 }} />
          </div>
        ))}
      </div>
    </div>
  )
}
