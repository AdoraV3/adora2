/* Created new Ant Design Skeleton component for banner loading state */
"use client"

import { Skeleton } from "antd"

export function BannerSkeleton() {
  return (
    <div className="w-full mb-6">
      <div className="rounded-xl overflow-hidden">
        <Skeleton active paragraph={{ rows: 4 }} style={{ minHeight: "240px" }} />
      </div>
    </div>
  )
}
