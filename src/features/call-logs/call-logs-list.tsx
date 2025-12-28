/* eslint-disable @typescript-eslint/no-unused-vars */
"use client"

import { useEffect, useState } from "react"
import { useAuthStore } from "@/store/auth-store"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Spinner } from "@/components/ui/spinner"

interface CallLog {
  _id: string
  agentId: string
  duration: number
  transcript: string
  recordingUrl: string
  status: string
  createdAt: string
}

export function CallLogsListComponent({ businessId }: { businessId: string }) {
  const { callLogs, loading, fetchCallLogs } = useAuthStore()
  const [isFetching, setIsFetching] = useState(true)
  const [selectedCall, setSelectedCall] = useState<CallLog | null>(null)

  useEffect(() => {
    const loadCallLogs = async () => {
      try {
        await fetchCallLogs(businessId)
      } catch (error) {
        console.error("[v0] Failed to load call logs:", error)
      } finally {
        setIsFetching(false)
      }
    }

    loadCallLogs()
  }, [businessId, fetchCallLogs])

  const formatDuration = (seconds: number): string => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, "0")}`
  }

  if (isFetching) {
    return (
      <div className="flex items-center justify-center min-h-[300px]">
        <div className="text-center">
          <Spinner className="mx-auto mb-4" />
          <p className="text-gray-600">Loading call logs...</p>
        </div>
      </div>
    )
  }

  if (!callLogs || callLogs.length === 0) {
    return (
      <Card className="p-6 text-center">
        <p className="text-gray-600">No call logs yet. Your AI agent calls will appear here.</p>
      </Card>
    )
  }

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-gray-900">Call History</h3>

      {selectedCall ? (
        <Card className="p-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="text-lg font-semibold text-gray-900">Call Details</h4>
              <Button variant="outline" size="sm" onClick={() => setSelectedCall(null)}>
                Back to List
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-600">Duration</p>
                <p className="text-lg font-semibold text-gray-900">{formatDuration(selectedCall.duration)}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Status</p>
                <p className="text-lg font-semibold text-gray-900">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-medium ${
                      selectedCall.status === "completed"
                        ? "bg-green-100 text-green-700"
                        : "bg-yellow-100 text-yellow-700"
                    }`}
                  >
                    {selectedCall.status}
                  </span>
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Date</p>
                <p className="text-lg font-semibold text-gray-900">
                  {new Date(selectedCall.createdAt).toLocaleString()}
                </p>
              </div>
              {selectedCall.recordingUrl && (
                <div>
                  <p className="text-sm text-gray-600">Recording</p>
                  <a
                    href={selectedCall.recordingUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-orange-600 hover:text-orange-700 font-medium"
                  >
                    Play Recording
                  </a>
                </div>
              )}
            </div>

            {selectedCall.transcript && (
              <div className="border-t pt-4">
                <h5 className="font-semibold text-gray-900 mb-2">Transcript</h5>
                <div className="bg-gray-50 p-4 rounded-lg max-h-[300px] overflow-y-auto">
                  <p className="text-sm text-gray-700 whitespace-pre-wrap">{selectedCall.transcript}</p>
                </div>
              </div>
            )}
          </div>
        </Card>
      ) : (
        <div className="space-y-2">
          {callLogs.map((call: CallLog) => (
            <Card key={call._id} className="p-4 cursor-pointer hover:bg-gray-50 transition">
              <div className="flex items-center justify-between" onClick={() => setSelectedCall(call)}>
                <div className="flex-1">
                  <div className="flex items-center gap-3">
                    <div>
                      <p className="font-medium text-gray-900">Agent Call - {formatDuration(call.duration)}</p>
                      <p className="text-sm text-gray-600">{new Date(call.createdAt).toLocaleString()}</p>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-medium ${
                      call.status === "completed" ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"
                    }`}
                  >
                    {call.status}
                  </span>
                  <Button variant="ghost" size="sm">
                    View Details
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
