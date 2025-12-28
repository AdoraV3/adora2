"use client"

import { useEffect, useState } from "react"
import { useAuthStore } from "@/store/auth-store"
import { vapiClient } from "@/lib/vapi-client"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Spinner } from "@/components/ui/spinner"

interface Voice {
  voiceId: string
  name: string
  provider: string
  language?: string
}

const voiceProviders = ["elevenlabs", "google", "openai"]

export function AgentFormComponent({ businessId, onSuccess }: { businessId: string; onSuccess?: () => void }) {
  const { createAgent, loading } = useAuthStore()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isFetching, setIsFetching] = useState(true)
  const [voices, setVoices] = useState<Voice[]>([])
  const [selectedProvider, setSelectedProvider] = useState("elevenlabs")

  const [formData, setFormData] = useState({
    name: "",
    language: "english",
    voiceId: "",
    provider: "elevenlabs",
    systemPrompt: "",
    firstMessageMode: "say_latest",
  })

  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({})

  useEffect(() => {
    const fetchVoices = async () => {
      try {
        console.log("[v0] Fetching voices for provider:", selectedProvider)
        const response = await vapiClient.listVoices(selectedProvider)
        setVoices(response.voices || [])
        setIsFetching(false)
      } catch (error) {
        console.error("[v0] Failed to fetch voices:", error)
        setIsFetching(false)
      }
    }

    fetchVoices()
  }, [selectedProvider])

  const validateForm = (): boolean => {
    const errors: Record<string, string> = {}

    if (!formData.name.trim()) errors.name = "Agent name is required"
    if (!formData.voiceId) errors.voiceId = "Voice selection is required"

    setValidationErrors(errors)
    return Object.keys(errors).length === 0
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }))
    if (validationErrors[field]) {
      setValidationErrors((prev) => ({
        ...prev,
        [field]: "",
      }))
    }
  }

  const handleCreateAgent = async () => {
    if (!validateForm()) return

    setIsSubmitting(true)
    try {
      console.log("[v0] Creating VAPI agent:", formData.name)

      const vapiAssistant = await vapiClient.createAssistant({
        name: formData.name,
        voice: {
          provider: formData.provider,
          voiceId: formData.voiceId,
        },
        systemPrompt: formData.systemPrompt || "You are a helpful customer support assistant.",
        firstMessageMode: formData.firstMessageMode,
      })

      console.log("[v0] VAPI assistant created:", vapiAssistant.id)

      // Create agent record in backend
      await createAgent({
        businessId,
        name: formData.name,
        language: formData.language,
        voiceId: formData.voiceId,
        phoneNumberId: "", // Will be set when assigning phone number
        categoryId: "customer_support",
        provider: "vapi",
        assistantId: vapiAssistant.id,
      })

      console.log("[v0] Agent created successfully")
      alert("AI Agent created successfully!")

      // Reset form
      setFormData({
        name: "",
        language: "english",
        voiceId: "",
        provider: "elevenlabs",
        systemPrompt: "",
        firstMessageMode: "say_latest",
      })

      if (onSuccess) onSuccess()
    } catch (error) {
      console.error("[v0] Failed to create agent:", error)
      alert(error instanceof Error ? error.message : "Failed to create agent. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isFetching) {
    return (
      <div className="flex items-center justify-center min-h-[300px]">
        <div className="text-center">
          <Spinner className="mx-auto mb-4" />
          <p className="text-gray-600">Loading voice options...</p>
        </div>
      </div>
    )
  }

  return (
    <Card className="p-6 space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-gray-900 mb-2">Create AI Agent</h2>
        <p className="text-sm text-gray-600">Configure your VAPI-powered customer support agent</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Agent Name */}
        <div className="flex flex-col space-y-2">
          <Label htmlFor="name" className="text-gray-700 font-medium">
            Agent Name *
          </Label>
          <Input
            id="name"
            type="text"
            value={formData.name}
            onChange={(e) => handleInputChange("name", e.target.value)}
            placeholder="e.g., Customer Support Agent"
            className={`bg-gray-50 ${validationErrors.name ? "border-red-500" : ""}`}
          />
          {validationErrors.name && <p className="text-sm text-red-500">{validationErrors.name}</p>}
        </div>

        {/* Language */}
        <div className="flex flex-col space-y-2">
          <Label htmlFor="language" className="text-gray-700 font-medium">
            Language
          </Label>
          <Select value={formData.language} onValueChange={(value) => handleInputChange("language", value)}>
            <SelectTrigger className="bg-gray-50">
              <SelectValue placeholder="Select language" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="english">English</SelectItem>
              <SelectItem value="spanish">Spanish</SelectItem>
              <SelectItem value="french">French</SelectItem>
              <SelectItem value="german">German</SelectItem>
              <SelectItem value="portuguese">Portuguese</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Voice Provider */}
        <div className="flex flex-col space-y-2">
          <Label htmlFor="provider" className="text-gray-700 font-medium">
            Voice Provider
          </Label>
          <Select value={selectedProvider} onValueChange={setSelectedProvider}>
            <SelectTrigger className="bg-gray-50">
              <SelectValue placeholder="Select provider" />
            </SelectTrigger>
            <SelectContent>
              {voiceProviders.map((provider) => (
                <SelectItem key={provider} value={provider}>
                  {provider.charAt(0).toUpperCase() + provider.slice(1)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Voice Selection */}
        <div className="flex flex-col space-y-2">
          <Label htmlFor="voiceId" className="text-gray-700 font-medium">
            Voice *
          </Label>
          <Select value={formData.voiceId} onValueChange={(value) => handleInputChange("voiceId", value)}>
            <SelectTrigger className={`bg-gray-50 ${validationErrors.voiceId ? "border-red-500" : ""}`}>
              <SelectValue placeholder="Select a voice" />
            </SelectTrigger>
            <SelectContent>
              {voices.map((voice) => (
                <SelectItem key={voice.voiceId} value={voice.voiceId}>
                  {voice.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {validationErrors.voiceId && <p className="text-sm text-red-500">{validationErrors.voiceId}</p>}
        </div>

        {/* System Prompt */}
        <div className="flex flex-col space-y-2 md:col-span-2">
          <Label htmlFor="systemPrompt" className="text-gray-700 font-medium">
            System Prompt (Optional)
          </Label>
          <textarea
            id="systemPrompt"
            value={formData.systemPrompt}
            onChange={(e) => handleInputChange("systemPrompt", e.target.value)}
            placeholder="Define how your AI agent should behave..."
            className="bg-gray-50 border border-gray-300 rounded-md p-3 min-h-[100px] focus:outline-none focus:ring-2 focus:ring-orange-500"
          />
        </div>
      </div>

      <div className="flex justify-end gap-3">
        <Button
          onClick={handleCreateAgent}
          disabled={isSubmitting || loading}
          className="px-6 py-2 bg-orange-600 hover:bg-orange-700 text-white font-medium rounded-lg"
        >
          {isSubmitting ? "Creating..." : "Create Agent"}
        </Button>
      </div>
    </Card>
  )
}
