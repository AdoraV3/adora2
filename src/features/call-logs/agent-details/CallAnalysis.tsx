interface CallAnalysisProps {
  summary?: string
  successEvaluation?: boolean | string
  cost?: number
  duration?: number
  startedAt?: string
  endedAt?: string
  endedReason?: string
  status?: string
}

export default function CallAnalysis({
  summary,
  successEvaluation,
  cost,
  duration,
  startedAt,
  endedAt,
  endedReason,
  status,
}: CallAnalysisProps) {
  const formatDate = (date: string) => {
    return new Date(date).toLocaleString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    })
  }

  const calculateDuration = (start: string, end: string) => {
    if (!start || !end) return "N/A"
    const startMs = new Date(start).getTime()
    const endMs = new Date(end).getTime()
    const diffSeconds = Math.floor((endMs - startMs) / 1000)
    const minutes = Math.floor(diffSeconds / 60)
    const seconds = diffSeconds % 60
    return `${minutes}m ${seconds}s`
  }

  return (
    <div className="mb-6">
      <h2 className="text-sm font-semibold mb-4" style={{ color: "#E05E00" }}>
        Call Analysis
      </h2>
      <div className="grid grid-cols-2 gap-4">
        {summary && (
          <div className="col-span-2 p-3 rounded-lg" style={{ backgroundColor: "#E05E0015" }}>
            <p className="text-xs font-semibold mb-1" style={{ color: "#E05E00" }}>
              Summary
            </p>
            <p className="text-xs text-gray-700">{summary}</p>
          </div>
        )}

        <div className="p-3 bg-gray-50 rounded-lg">
          <p className="text-xs font-semibold text-gray-600 mb-1">Status</p>
          <p className="text-xs font-medium">
            <span
              className={`px-2 py-1 rounded text-white text-xs ${status === "ended" ? "bg-gray-500" : "bg-green-500"}`}
            >
              {status || "N/A"}
            </span>
          </p>
        </div>

        <div className="p-3 bg-gray-50 rounded-lg">
          <p className="text-xs font-semibold text-gray-600 mb-1">Success Evaluation</p>
          <p className="text-xs font-medium">
            {successEvaluation === "true" || successEvaluation === true ? (
              <span className="text-green-600">✓ Successful</span>
            ) : (
              <span className="text-red-600">✗ Unsuccessful</span>
            )}
          </p>
        </div>

        {cost !== undefined && (
          <div className="p-3 bg-gray-50 rounded-lg">
            <p className="text-xs font-semibold text-gray-600 mb-1">Cost</p>
            <p className="text-xs font-medium">${cost.toFixed(4)}</p>
          </div>
        )}

        {(startedAt || endedAt) && (
          <div className="p-3 bg-gray-50 rounded-lg">
            <p className="text-xs font-semibold text-gray-600 mb-1">Duration</p>
            <p className="text-xs font-medium">{calculateDuration(startedAt || "", endedAt || "")}</p>
          </div>
        )}

        {startedAt && (
          <div className="p-3 bg-gray-50 rounded-lg">
            <p className="text-xs font-semibold text-gray-600 mb-1">Started</p>
            <p className="text-xs font-medium">{formatDate(startedAt)}</p>
          </div>
        )}

        {endedAt && (
          <div className="p-3 bg-gray-50 rounded-lg">
            <p className="text-xs font-semibold text-gray-600 mb-1">Ended</p>
            <p className="text-xs font-medium">{formatDate(endedAt)}</p>
          </div>
        )}

        {endedReason && (
          <div className="p-3 bg-gray-50 rounded-lg col-span-2">
            <p className="text-xs font-semibold text-gray-600 mb-1">Ended Reason</p>
            <p className="text-xs font-medium">{endedReason}</p>
          </div>
        )}
      </div>
    </div>
  )
}
