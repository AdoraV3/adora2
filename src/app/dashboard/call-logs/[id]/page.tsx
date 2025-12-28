/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"

import { useEffect, useState } from "react"
import { useParams } from 'next/navigation'
import AudioButton from "@/features/call-logs/agent-details/AudioButton"
// import CallHeader from "@/features/call-logs/agent-details/CallHeader"
import Transcript from "@/features/call-logs/agent-details/Transcript"
import CallAnalysis from "@/features/call-logs/agent-details/CallAnalysis"
import { useAuthStore } from "@/store/auth-store"
import { Download, Printer } from 'lucide-react'

interface CallLogDetail {
  _id: string
  agentId: string
  assistantName?: string
  businessId: string
  duration: number
  transcript: string
  recordingUrl: string
  stereoRecordingUrl?: string
  status: string
  createdAt: string
  updatedAt: string
  startedAt?: string
  endedAt?: string
  endedReason?: string
  summary?: string
  cost?: number
  analysis?: {
    summary?: string
    successEvaluation?: boolean | string
  }
}

export default function AgentDetailsPage() {
  const params = useParams()
  const callLogId = params.id as string
  const { callLogs, user } = useAuthStore()
  const [callLog, setCallLog] = useState<CallLogDetail | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchCallLogDetail = async () => {
      try {
        setIsLoading(true)
        
        // First try to find in the already fetched callLogs
        const foundLog = callLogs.find((log) => log._id === callLogId)
        
        if (foundLog) {
          console.log("[v0] Call log found in cache:", foundLog)
          const assistantName = (foundLog as any).artifact?.assistantOverrides?.name || "Agent"
          const mappedLog = {
            ...(foundLog as CallLogDetail),
            assistantName
          }
          setCallLog(mappedLog)
          setIsLoading(false)
          return
        }

        // If not found in cache, fetch directly from API
        console.log("[v0] Call log not in cache, fetching from API:", callLogId)
        
        if (!user?.token) {
          throw new Error("No authentication token")
        }

        const response = await fetch(`http://localhost:5000/api/call-logs/vapi/${callLogId}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${user.token}`,
          },
        })

        const data = await response.json()

        if (!response.ok) {
          throw new Error(data.message || "Failed to fetch call log")
        }

        console.log("[v0] Call log fetched from API:", data)
        
        const callLogData = data.call || data.callLog || data
        
        if (!callLogData._id && !callLogData.id) {
          throw new Error("Invalid call log data received")
        }

        const assistantName = callLogData.artifact?.assistantOverrides?.name || callLogData.assistantOverrides?.name || "Agent"

        // Map VAPI response to our interface
        const mappedCallLog: CallLogDetail = {
          _id: callLogData._id || callLogData.id,
          agentId: callLogData.assistantId || "",
          assistantName: assistantName,
          businessId: callLogData.orgId || "",
          duration: callLogData.duration || 0,
          transcript: callLogData.transcript || "",
          recordingUrl: callLogData.recordingUrl || "",
          stereoRecordingUrl: callLogData.stereoRecordingUrl,
          status: callLogData.status || "ended",
          createdAt: callLogData.createdAt || new Date().toISOString(),
          updatedAt: callLogData.updatedAt || new Date().toISOString(),
          startedAt: callLogData.startedAt,
          endedAt: callLogData.endedAt,
          endedReason: callLogData.endedReason,
          summary: callLogData.summary,
          cost: callLogData.cost,
          analysis: callLogData.analysis,
        }

        setCallLog(mappedCallLog)
      } catch (error) {
        console.error("[v0] Error fetching call log:", error)
        setCallLog(null)
      } finally {
        setIsLoading(false)
      }
    }

    fetchCallLogDetail()
  }, [callLogId, callLogs, user])

  const handleDownload = () => {
    const element = document.getElementById("call-log-content")
    if (!element) return
    
    const content = element.innerText
    const blob = new Blob([content], { type: "text/plain" })
    const url = URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.href = url
    link.download = `call-log-${callLog?._id}.txt`
    link.click()
    URL.revokeObjectURL(url)
  }

  const handlePrint = () => {
    window.print()
  }

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2" style={{ borderColor: "var(--color-primary)" }}></div>
      </div>
    )
  }

  if (!callLog) {
    return (
      <div className="m-6">
        <div className="w-full max-w-4xl">
          <p className="text-gray-500">Call log not found</p>
        </div>
      </div>
    )
  }

  const date = new Date(callLog.createdAt).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  })

  const time = new Date(callLog.createdAt).toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  })

  return (
    <div className="min-h-screen" style={{ backgroundColor: "var(--color-neutral-bg)" }}>
      <div className="max-w-full mx-auto p-6">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold" style={{ color: "var(--color-primary)" }}>
              {callLog.assistantName}
            </h1>
            <p className="text-sm text-gray-500 mt-1">{date} at {time}</p>
          </div>
          <div className="flex gap-3 print:hidden">
            <button
              onClick={handleDownload}
              className="flex items-center gap-2 px-4 py-2 rounded-lg border-2 transition-all bg-[#E05E00]"
              style={{ color: "#fff" }}
            >
              <Download size={18} />
              <span className="text-sm font-medium">Download</span>
            </button>
            <button
              onClick={handlePrint}
              className="flex items-center gap-2 px-4 py-2 rounded-lg text-[#E05E00] transition-all hover:opacity-90"
              style={{ backgroundColor: "var(--color-primary)" }}
            >
              <Printer size={18} />
              <span className="text-sm font-medium">Print</span>
            </button>
          </div>
        </div>

        <div id="call-log-content" className="space-y-6">
          <AudioButton audioUrl={callLog.recordingUrl} stereoUrl={callLog.stereoRecordingUrl} />
          <CallAnalysis
            summary={callLog.summary || callLog.analysis?.summary}
            successEvaluation={callLog.analysis?.successEvaluation}
            cost={callLog.cost}
            duration={callLog.duration}
            startedAt={callLog.startedAt}
            endedAt={callLog.endedAt}
            endedReason={callLog.endedReason}
            status={callLog.status}
          />
          <Transcript transcript={callLog.transcript} />
        </div>
      </div>
    </div>
  )
}
