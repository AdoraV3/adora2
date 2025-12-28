/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
/**
 * Centralized API client for all backend and VAPI integrations
 * Handles authentication, error handling, and request/response formatting
 */

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api"

interface ApiResponse<T = any> {
  success: boolean
  message?: string
  data?: T
  error?: string
}

interface SubscriptionPlanResponse {
  _id: string
  plan: string
  amount: number
  period: "monthly" | "yearly"
  description: string
  features: string[]
}

interface SubscriptionPlansData {
  success: boolean
  plans: SubscriptionPlanResponse[]
}

interface SubscriptionDataResponse {
  subscription: {
    plan: string
    amount: number
  } | null
  isFreeTrial: boolean
  subscriptionStartDate?: string
  subscriptionEndDate?: string
}

class ApiClient {
  private getToken(): string | null {
    if (typeof window !== "undefined") {
      const auth = localStorage.getItem("auth-store")
      if (auth) {
        try {
          const parsed = JSON.parse(auth)
          return parsed.state?.user?.token || null
        } catch {
          return null
        }
      }
    }
    return null
  }

  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const token = this.getToken()
    const headers = new Headers()
    headers.set("Content-Type", "application/json")

    if (options.headers instanceof Headers) {
      options.headers.forEach((value, key) => {
        headers.set(key, value)
      })
    } else if (options.headers) {
      Object.entries(options.headers as Record<string, string>).forEach(([key, value]) => {
        headers.set(key, value)
      })
    }

    if (token) {
      headers.set("Authorization", `Bearer ${token}`)
    }

    const url = `${API_BASE_URL}${endpoint}`
    console.log("[v0] API Request:", url)

    const response = await fetch(url, {
      ...options,
      headers,
    })

    const data = await response.json()

    if (!response.ok) {
      throw new Error(data.message || `API Error: ${response.statusText}`)
    }

    return data
  }

  // ============ Auth APIs ============
  async signup(email: string, password: string, name: string) {
    return this.request("/auth/signup", {
      method: "POST",
      body: JSON.stringify({ email, password, name }),
    })
  }

  async login(email: string, password: string) {
    return this.request("/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    })
  }

  async verifyEmail(token: string) {
    return this.request("/auth/verify-email", {
      method: "POST",
      body: JSON.stringify({ token }),
    })
  }

  async resendVerification(email: string) {
    return this.request("/auth/resend-verification", {
      method: "POST",
      body: JSON.stringify({ email }),
    })
  }

  async getCurrentUser() {
    return this.request("/auth/me")
  }

  async logout() {
    return this.request("/auth/logout", {
      method: "POST",
    })
  }

  // ============ Profile APIs ============
  async getProfile() {
    return this.request("/profile")
  }

  async updateProfile(data: any) {
    return this.request("/profile", {
      method: "PUT",
      body: JSON.stringify(data),
    })
  }

  // ============ Password APIs ============
  async forgotPassword(email: string) {
    return this.request("/password/forgot-password", {
      method: "POST",
      body: JSON.stringify({ email }),
    })
  }

  async resetPassword(token: string, password: string, confirmPassword: string) {
    return this.request("/password/reset-password", {
      method: "POST",
      body: JSON.stringify({ token, password, confirmPassword }),
    })
  }

  async changePassword(oldPassword: string, password: string, confirmPassword: string) {
    return this.request("/password/change-password", {
      method: "POST",
      body: JSON.stringify({ oldPassword, password, confirmPassword }),
    })
  }

  // ============ Business APIs ============
  async getBusinesses() {
    return this.request("/business")
  }

  async createBusiness(data: any) {
    return this.request("/business", {
      method: "POST",
      body: JSON.stringify(data),
    })
  }

  async updateBusiness(id: string, data: any) {
    return this.request(`/business/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    })
  }

  async deleteBusiness(id: string) {
    return this.request(`/business/${id}`, {
      method: "DELETE",
    })
  }

  // ============ Agent APIs ============
  async createAgent(data: any) {
    return this.request("/agent", {
      method: "POST",
      body: JSON.stringify(data),
    })
  }

  async getAgents(businessId: string) {
    return this.request(`/agent/business/${businessId}`)
  }

  async updateAgent(id: string, data: any) {
    return this.request(`/agent/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    })
  }

  // ============ Call Logs APIs ============
  async getCallLogs(businessId: string) {
    return this.request(`/call-logs/business/${businessId}`)
  }

  async createCallLog(data: any) {
    return this.request("/call-logs", {
      method: "POST",
      body: JSON.stringify(data),
    })
  }

  // ============ Knowledge Base APIs ============
  async getKnowledgeBase(businessId: string) {
    return this.request(`/knowledge-base/business/${businessId}`)
  }

  async createKnowledgeBase(data: any) {
    return this.request("/knowledge-base", {
      method: "POST",
      body: JSON.stringify(data),
    })
  }

  async updateKnowledgeBase(id: string, data: any) {
    return this.request(`/knowledge-base/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    })
  }

  async deleteKnowledgeBase(id: string) {
    return this.request(`/knowledge-base/${id}`, {
      method: "DELETE",
    })
  }

  // ============ Subscription APIs ============
  async getSubscriptionPlans(): Promise<SubscriptionPlansData> {
    return this.request<SubscriptionPlansData>("/subscription/plans")
  }

  async getBusinessSubscription(businessId: string): Promise<SubscriptionDataResponse> {
    return this.request<SubscriptionDataResponse>(`/subscription/business/${businessId}`)
  }

  async createCheckoutSession(businessId: string, subscriptionId: string, email?: string) {
    return this.request<{ url: string }>("/subscription/checkout", {
      method: "POST",
      body: JSON.stringify({ businessId, subscriptionId, email }),
    })
  }

  async cancelSubscription(businessId: string) {
    return this.request("/subscription/cancel", {
      method: "POST",
      body: JSON.stringify({ businessId }),
    })
  }
}

export const apiClient = new ApiClient()
