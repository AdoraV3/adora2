/* eslint-disable @typescript-eslint/no-unused-vars */
"use client"

import { useEffect, useState } from "react"
import { useAuthStore } from "@/store/auth-store"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Spinner } from "@/components/ui/spinner"

interface Agent {
  _id: string
  name: string
  language: string
  provider: string
  assistantId: string
  voiceId: string
  createdAt: string
}

export function AgentListComponent({ businessId }: { businessId: string }) {
  const { agents, loading, fetchAgents, updateAgent } = useAuthStore()
  const [isFetching, setIsFetching] = useState(true)

  useEffect(() => {
    const loadAgents = async () => {
      try {
        await fetchAgents(businessId)
      } catch (error) {
        console.error("[v0] Failed to load agents:", error)
      } finally {
        setIsFetching(false)
      }
    }

    loadAgents()
  }, [businessId, fetchAgents])

  if (isFetching) {
    return (
      <div className="flex items-center justify-center min-h-[300px]">
        <div className="text-center">
          <Spinner className="mx-auto mb-4" />
          <p className="text-gray-600">Loading agents...</p>
        </div>
      </div>
    )
  }

  if (!agents || agents.length === 0) {
    return (
      <Card className="p-6 text-center">
        <p className="text-gray-600">No agents created yet. Create one to get started.</p>
      </Card>
    )
  }

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-gray-900">Your Agents</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {agents.map((agent: Agent) => (
          <Card key={agent._id} className="p-4">
            <div className="space-y-3">
              <div className="flex justify-between items-start">
                <div>
                  <h4 className="font-semibold text-gray-900">{agent.name}</h4>
                  <p className="text-sm text-gray-600">{agent.provider === "vapi" ? "VAPI Powered" : agent.provider}</p>
                </div>
                <span className="px-3 py-1 bg-orange-100 text-orange-700 text-xs font-medium rounded-full">
                  {agent.language}
                </span>
              </div>

              <div className="text-sm text-gray-600 space-y-1">
                <p>
                  <strong>Voice ID:</strong> {agent.voiceId}
                </p>
                <p>
                  <strong>Assistant ID:</strong> {agent.assistantId}
                </p>
                <p>
                  <strong>Created:</strong> {new Date(agent.createdAt).toLocaleDateString()}
                </p>
              </div>

              <div className="flex gap-2">
                <Button variant="outline" className="flex-1 text-xs bg-transparent" disabled={loading}>
                  {loading ? "Loading..." : "Configure"}
                </Button>
                <Button variant="destructive" className="flex-1 text-xs" disabled={loading}>
                  {loading ? "Deleting..." : "Delete"}
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  )
}
