/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
/**
 * VAPI Client for integrating voice AI agent creation and management
 * Handles agent creation, configuration, call management, and phone number provisioning
 */

const VAPI_BASE_URL = process.env.NEXT_PUBLIC_VAPI_URL || "https://api.vapi.ai"
const VAPI_API_KEY = process.env.NEXT_PUBLIC_VAPI_KEY

interface VapiAssistant {
  id?: string
  name: string
  voice: {
    provider: string
    voiceId: string
  }
  systemPrompt?: string
  firstMessageMode?: string
}

interface VapiPhoneNumber {
  id?: string
  number: string
  displayName?: string
}

interface VapiResponse<T> {
  data: T
  success?: boolean
}

interface VapiVoice {
  voiceId: string
  name: string
  provider: string
  language?: string
}

interface VapiAssistantResponse {
  id: string
  name: string
  voice: {
    provider: string
    voiceId: string
  }
  systemPrompt?: string
  firstMessageMode?: string
}

interface VapiVoicesResponse {
  voices: VapiVoice[]
}

class VapiClient {
  private apiKey: string

  constructor(apiKey: string = VAPI_API_KEY || "") {
    this.apiKey = apiKey
  }

  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const headers: HeadersInit = {
      "Content-Type": "application/json",
      Authorization: `Bearer ${this.apiKey}`,
      ...options.headers,
    }

    const url = `${VAPI_BASE_URL}${endpoint}`
    console.log("[v0] VAPI Request:", url)

    const response = await fetch(url, {
      ...options,
      headers,
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.message || `VAPI Error: ${response.statusText}`)
    }

    return response.json()
  }

  // ============ Assistant Management ============
  async createAssistant(data: VapiAssistant): Promise<VapiAssistantResponse> {
    console.log("[v0] Creating VAPI assistant:", data.name)
    return this.request<VapiAssistantResponse>("/assistant", {
      method: "POST",
      body: JSON.stringify(data),
    })
  }

  async getAssistant(id: string): Promise<VapiAssistantResponse> {
    return this.request<VapiAssistantResponse>(`/assistant/${id}`)
  }

  async updateAssistant(id: string, data: Partial<VapiAssistant>): Promise<VapiAssistantResponse> {
    console.log("[v0] Updating VAPI assistant:", id)
    return this.request<VapiAssistantResponse>(`/assistant/${id}`, {
      method: "PATCH",
      body: JSON.stringify(data),
    })
  }

  async listAssistants(): Promise<{ assistants: VapiAssistantResponse[] }> {
    console.log("[v0] Fetching VAPI assistants")
    return this.request<{ assistants: VapiAssistantResponse[] }>("/assistant")
  }

  async deleteAssistant(id: string): Promise<{ success: boolean }> {
    console.log("[v0] Deleting VAPI assistant:", id)
    return this.request<{ success: boolean }>(`/assistant/${id}`, {
      method: "DELETE",
    })
  }

  // ============ Phone Number Management ============
  async createPhoneNumber(data: VapiPhoneNumber): Promise<VapiPhoneNumber & { id: string }> {
    console.log("[v0] Creating VAPI phone number")
    return this.request<VapiPhoneNumber & { id: string }>("/phone-number", {
      method: "POST",
      body: JSON.stringify(data),
    })
  }

  async getPhoneNumber(id: string): Promise<VapiPhoneNumber & { id: string }> {
    return this.request<VapiPhoneNumber & { id: string }>(`/phone-number/${id}`)
  }

  async listPhoneNumbers(): Promise<{ phoneNumbers: (VapiPhoneNumber & { id: string })[] }> {
    console.log("[v0] Fetching VAPI phone numbers")
    return this.request<{ phoneNumbers: (VapiPhoneNumber & { id: string })[] }>("/phone-number")
  }

  async deletePhoneNumber(id: string): Promise<{ success: boolean }> {
    console.log("[v0] Deleting VAPI phone number:", id)
    return this.request<{ success: boolean }>(`/phone-number/${id}`, {
      method: "DELETE",
    })
  }

  // ============ Call Management ============
  async makeCall(data: any): Promise<{ callId: string; status: string }> {
    console.log("[v0] Making VAPI call")
    return this.request<{ callId: string; status: string }>("/call", {
      method: "POST",
      body: JSON.stringify(data),
    })
  }

  async getCall(id: string): Promise<any> {
    return this.request<any>(`/call/${id}`)
  }

  async listCalls(filters?: any): Promise<{ calls: any[] }> {
    console.log("[v0] Fetching VAPI calls")
    const query = new URLSearchParams(filters || {}).toString()
    return this.request<{ calls: any[] }>(`/call${query ? `?${query}` : ""}`)
  }

  async endCall(id: string): Promise<{ success: boolean }> {
    console.log("[v0] Ending VAPI call:", id)
    return this.request<{ success: boolean }>(`/call/${id}`, {
      method: "DELETE",
    })
  }

  // ============ Voice Provider Integration ============
  async listVoices(provider?: string): Promise<VapiVoicesResponse> {
    console.log("[v0] Fetching available voices")
    const query = provider ? `?provider=${provider}` : ""
    return this.request<VapiVoicesResponse>(`/voice${query}`)
  }

  // ============ Message Management ============
  async sendMessage(callId: string, message: string): Promise<{ success: boolean; messageId: string }> {
    console.log("[v0] Sending message to call:", callId)
    return this.request<{ success: boolean; messageId: string }>(`/call/${callId}/message`, {
      method: "POST",
      body: JSON.stringify({ message }),
    })
  }

  /**
   * Get available phone numbers for a specific country
   * Called from backend VAPI routes for location-based provisioning
   */
  async getAvailablePhoneNumbersByCountry(country: "Nigeria" | "Canada" | "NG" | "CA"): Promise<any[]> {
    try {
      const response = await fetch(`/api/vapi/phone-numbers/available?country=${country}`)
      const data = await response.json()

      if (!data.success) {
        throw new Error(data.message || "Failed to fetch phone numbers")
      }

      console.log(`[v0] Fetched available phone numbers for ${country}:`, data.availableNumbers?.length || 0)
      return data.availableNumbers || []
    } catch (error) {
      console.error("[v0] Error fetching available phone numbers:", error)
      throw error
    }
  }

  /**
   * Get assigned phone number for a business
   */
  async getBusinessPhoneNumber(businessId: string): Promise<{
    phoneNumber: string
    phoneNumberId: string
  }> {
    try {
      const token = localStorage.getItem("token")
      const response = await fetch(`/api/vapi/business/${businessId}/phone-number`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      const data = await response.json()

      if (!data.success) {
        throw new Error(data.message || "Failed to fetch phone number")
      }

      console.log("[v0] Retrieved phone number for business:", data.phoneNumber)
      return {
        phoneNumber: data.phoneNumber,
        phoneNumberId: data.phoneNumberId,
      }
    } catch (error) {
      console.error("[v0] Error fetching business phone number:", error)
      throw error
    }
  }

  /**
   * Get VAPI public key configuration from backend
   */
  async getVapiConfig(): Promise<{ publicKey: string }> {
    try {
      const response = await fetch("/api/vapi/config/public-key")
      const data = await response.json()

      if (!data.success) {
        throw new Error("Failed to load VAPI configuration")
      }

      console.log("[v0] VAPI config loaded successfully")
      return {
        publicKey: data.publicKey,
      }
    } catch (error) {
      console.error("[v0] Failed to load VAPI configuration:", error)
      throw error
    }
  }

  /**
   * Make a call using business phone number
   */
  async makeCallFromBusiness(businessId: string, recipientNumber: string): Promise<{ callId: string; status: string }> {
    try {
      const { phoneNumberId } = await this.getBusinessPhoneNumber(businessId)

      return this.makeCall({
        phoneNumberId,
        customerNumber: recipientNumber,
      })
    } catch (error) {
      console.error("[v0] Error making call from business:", error)
      throw error
    }
  }
}

export const vapiClient = new VapiClient()
