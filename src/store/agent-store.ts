"use client"

import { create } from "zustand"
import { persist } from "zustand/middleware"

interface User {
  userId: string
  email: string
  name?: string
  token: string
}

interface Profile {
  _id: string
  userId: string
  name: string
  avatar?: string
  bio?: string
  phone?: string
  country?: string
  businessName?: string
  businessDescription?: string
  agentName?: string
  agentGender?: string
  createdAt: string
  updatedAt: string
  isProfileComplete?: boolean
}

interface Business {
  _id: string
  userId: string
  name: string
  agentName: string
  description: string
  logo: string
  country: string
  customerBase: string
  createdAt: string
  updatedAt: string
  phone?: string
  voiceId: string
  vapiPhoneNumber?: string
  vapiPhoneNumberId?: string
  isProfileCompleted?: boolean
}

interface Agent {
  _id: string
  businessId: string
  name: string
  language: string
  voiceId: string
  phoneNumberId: string
  categoryId: string
  provider: string
  assistantId: string
  createdAt: string
  updatedAt: string
}

interface CallLog {
  _id: string
  agentId: string
  businessId: string
  duration: number
  transcript: string
  recordingUrl: string
  status: string
  createdAt: string
  updatedAt: string
}

interface Voice {
  _id: string
  voiceId: string
  name: string
  gender: "male" | "female"
  language: string
  provider: string
  createdAt: string
  updatedAt: string
}

interface PhoneNumber {
  id: string
  number: string
  name?: string
  country?: string
  available: boolean
}

interface Notification {
  _id: string
  userId: string
  title: string
  message: string
  type: string
  isRead: boolean
  createdAt: string
  updatedAt: string
}

interface AuthState {
  user: User | null
  profile: Profile | null
  business: Business | null
  businesses: Business[]
  agents: Agent[]
  callLogs: CallLog[]
  loading: boolean
  error: string | null
  isHydrated: boolean
  isFirstTimeUser: boolean
  voices: Voice[]
  availablePhoneNumbers: PhoneNumber[]
  notifications: Notification[]
  unreadCount: number
  signup: (email: string, password: string, name: string) => Promise<void>
  login: (email: string, password: string) => Promise<void>
  verifyEmail: (token: string) => Promise<void>
  resendVerification: (email: string) => Promise<void>
  logout: () => void
  clearError: () => void
  fetchProfile: () => Promise<void>
  updateProfile: (data: Partial<Profile>) => Promise<void>
  createBusiness: (data: Partial<Business>) => Promise<void>
  fetchBusiness: () => Promise<void>
  isProfileComplete: () => boolean
  setHydrated: () => void
  fetchUser: () => Promise<void>
  fetchBusinesses: () => Promise<void>
  updateBusiness: (id: string, data: Partial<Business>) => Promise<void>
  deleteBusiness: (id: string) => Promise<void>
  createAgent: (data: Partial<Agent>) => Promise<void>
  fetchAgents: (businessId: string) => Promise<void>
  updateAgent: (id: string, agentData: Partial<Agent>) => Promise<void>
  createCallLog: (data: Partial<CallLog>) => Promise<void>
  fetchCallLogs: (businessId: string) => Promise<void>
  uploadAvatar: (file: File) => Promise<void> // add uploadAvatar method to interface
  fetchVoicesByGender: (gender: "male" | "female") => Promise<void>
  fetchAvailablePhoneNumbers: () => Promise<void>
  assignPhoneNumberToBusiness: (
    businessId: string,
    payload: {
      vapiPhoneNumberId: string
      vapiPhoneNumber: string
      voiceId: string
      agentName: string
      categoryId: string
    },
  ) => Promise<void>
  fetchNotifications: () => Promise<void>
  markNotificationAsRead: (notificationId: string) => Promise<void>
  markAllNotificationsAsRead: () => Promise<void>
  deleteNotification: (notificationId: string) => Promise<void>
  clearAllNotifications: () => Promise<void>
  fetchVapiCallLogs: (businessId: string, limit?: number) => Promise<void>
  refreshToken: () => Promise<string | null>
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      profile: null,
      business: null,
      businesses: [],
      agents: [],
      callLogs: [],
      loading: false,
      error: null,
      isHydrated: false,
      isFirstTimeUser: false,
      voices: [],
      availablePhoneNumbers: [],
      notifications: [],
      unreadCount: 0,

      signup: async (email: string, password: string, name: string) => {
        set({ loading: true, error: null })
        try {
          if (!email || !password || !name) {
            throw new Error("All fields are required")
          }

          console.log("[v0] Signup request body:", { email, password: "***", name })

          const response = await fetch("http://localhost:5000/api/auth/signup", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ email, password, name }),
          })

          console.log("[v0] Signup response status:", response.status)

          const data = await response.json()

          console.log("[v0] Signup response data:", data)

          if (!response.ok) {
            throw new Error(data.message || "Signup failed")
          }

          set({
            user: {
              userId: data.userId,
              email,
              name,
              token: data.token,
            },
            profile: null,
            isFirstTimeUser: data.isFirstTimeUser !== false,
            loading: false,
          })
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : "Signup failed"
          console.error("[v0] Signup error details:", errorMessage)
          set({
            error: errorMessage,
            loading: false,
          })
          throw error
        }
      },

      login: async (email: string, password: string) => {
        set({ loading: true, error: null })
        try {
          const response = await fetch("http://localhost:5000/api/auth/login", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ email, password }),
          })

          const data = await response.json()

          if (!response.ok) {
            throw new Error(data.message || "Login failed")
          }

          set({
            user: {
              userId: data.userId,
              email,
              token: data.token,
            },
            isFirstTimeUser: data.isFirstTimeUser || false,
            loading: false,
          })
        } catch (error) {
          set({
            error: error instanceof Error ? error.message : "Login failed",
            loading: false,
          })
          throw error
        }
      },

      fetchProfile: async () => {
        set({ loading: true, error: null })
        try {
          const { user } = get()
          if (!user?.token) {
            throw new Error("No authentication token")
          }

          const response = await fetch("http://localhost:5000/api/profile", {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${user.token}`,
            },
          })

          const data = await response.json()

          if (!response.ok) {
            throw new Error(data.message || "Failed to fetch profile")
          }

          set({
            profile: data.profile,
            loading: false,
          })
        } catch (error) {
          set({
            error: error instanceof Error ? error.message : "Failed to fetch profile",
            loading: false,
          })
          throw error
        }
      },

      updateProfile: async (profileData: Partial<Profile>) => {
        set({ loading: true, error: null })
        try {
          const state = get()
          const { user } = state

          if (!user?.token) {
            console.log("[v0] No token found, attempting to refresh from storage")
            throw new Error("Not authenticated. Please log in again.")
          }

          console.log("[v0] Updating profile with token:", user.token.substring(0, 20) + "...")

          const response = await fetch("http://localhost:5000/api/profile", {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${user.token}`,
            },
            body: JSON.stringify(profileData),
          })

          const data = await response.json()

          if (!response.ok) {
            console.error("[v0] Profile update failed:", data)
            throw new Error(data.error || data.message || "Failed to update profile")
          }

          set({
            profile: data.profile,
            isFirstTimeUser: false,
            loading: false,
          })
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : "Failed to update profile"
          console.error("[v0] Profile update error:", errorMessage)
          set({
            error: errorMessage,
            loading: false,
          })
          throw error
        }
      },

      createBusiness: async (businessData: Partial<Business>) => {
        set({ loading: true, error: null })
        try {
          const { user } = get()
          if (!user?.token) {
            throw new Error("No authentication token")
          }

          const response = await fetch("http://localhost:5000/api/business", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${user.token}`,
            },
            body: JSON.stringify(businessData),
          })

          const data = await response.json()

          if (!response.ok) {
            throw new Error(data.message || "Failed to create business")
          }

          set({
            business: data.business,
            loading: false,
          })
        } catch (error) {
          set({
            error: error instanceof Error ? error.message : "Failed to create business",
            loading: false,
          })
          throw error
        }
      },

      fetchBusiness: async () => {
        set({ loading: true, error: null })
        try {
          const { user } = get()
          if (!user?.token) {
            throw new Error("No authentication token")
          }

          const response = await fetch("http://localhost:5000/api/business", {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${user.token}`,
            },
          })

          const data = await response.json()

          if (!response.ok) {
            throw new Error(data.message || "Failed to fetch business")
          }

          set({
            business: data.business,
            loading: false,
          })
        } catch (error) {
          set({
            error: error instanceof Error ? error.message : "Failed to fetch business",
            loading: false,
          })
          throw error
        }
      },

      isProfileComplete: () => {
        const { profile } = get()
        return profile?.isProfileComplete ?? false
      },

      setHydrated: () => {
        set({ isHydrated: true })
      },

      logout: () => {
        set({ user: null, profile: null, business: null, error: null, isFirstTimeUser: false, notifications: [], unreadCount: 0 })
      },

      clearError: () => {
        set({ error: null })
      },

      fetchUser: async () => {
        set({ loading: true, error: null })
        try {
          const { user } = get()
          if (!user?.token) {
            throw new Error("No authentication token")
          }

          const response = await fetch("http://localhost:5000/api/auth/me", {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${user.token}`,
            },
          })

          const data = await response.json()

          if (!response.ok) {
            throw new Error(data.message || "Failed to fetch user")
          }

          set({
            profile: data.user.profile,
            user: {
              ...user,
              email: data.user.email,
              name: data.user.profile?.name,
            },
            isFirstTimeUser: data.isFirstTimeUser || false,
            loading: false,
          })
        } catch (error) {
          set({
            error: error instanceof Error ? error.message : "Failed to fetch user",
            loading: false,
          })
          throw error
        }
      },

      fetchBusinesses: async () => {
        set({ loading: true, error: null })
        try {
          const { user } = get()
          if (!user?.token) {
            throw new Error("No authentication token")
          }

          const response = await fetch("http://localhost:5000/api/business", {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${user.token}`,
            },
          })

          const data = await response.json()

          if (!response.ok) {
            throw new Error(data.message || "Failed to fetch businesses")
          }

          const businessesArray = data.business ? [data.business] : []
          console.log("[v0] fetchBusinesses - converted response:", businessesArray)

          set({
            businesses: businessesArray,
            loading: false,
          })
        } catch (error) {
          set({
            error: error instanceof Error ? error.message : "Failed to fetch businesses",
            loading: false,
          })
          throw error
        }
      },

      updateBusiness: async (id: string, businessData: Partial<Business>) => {
        set({ loading: true, error: null })
        try {
          const { user } = get()
          if (!user?.token) {
            throw new Error("No authentication token")
          }

          const response = await fetch(`http://localhost:5000/api/business/${id}`, {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${user.token}`,
            },
            body: JSON.stringify(businessData),
          })

          const data = await response.json()

          if (!response.ok) {
            throw new Error(data.message || "Failed to update business")
          }

          set((state) => ({
            businesses: state.businesses.map((b) => (b._id === id ? data.business : b)),
            loading: false,
          }))
        } catch (error) {
          set({
            error: error instanceof Error ? error.message : "Failed to update business",
            loading: false,
          })
          throw error
        }
      },

      deleteBusiness: async (id: string) => {
        set({ loading: true, error: null })
        try {
          const { user } = get()
          if (!user?.token) {
            throw new Error("No authentication token")
          }

          const response = await fetch(`http://localhost:5000/api/business/${id}`, {
            method: "DELETE",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${user.token}`,
            },
          })

          if (!response.ok) {
            const data = await response.json()
            throw new Error(data.message || "Failed to delete business")
          }

          set((state) => ({
            businesses: state.businesses.filter((b) => b._id !== id),
            loading: false,
          }))
        } catch (error) {
          set({
            error: error instanceof Error ? error.message : "Failed to delete business",
            loading: false,
          })
          throw error
        }
      },

      createAgent: async (agentData: Partial<Agent>) => {
        set({ loading: true, error: null })
        try {
          const { user } = get()
          if (!user?.token) {
            throw new Error("No authentication token")
          }

          const response = await fetch("http://localhost:5000/api/agent", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${user.token}`,
            },
            body: JSON.stringify(agentData),
          })

          const data = await response.json()

          if (!response.ok) {
            throw new Error(data.message || "Failed to create agent")
          }

          set((state) => ({
            agents: [...state.agents, data.agent],
            loading: false,
          }))
        } catch (error) {
          set({
            error: error instanceof Error ? error.message : "Failed to create agent",
            loading: false,
          })
          throw error
        }
      },

      fetchAgents: async (businessId: string) => {
        set({ loading: true, error: null })
        try {
          const { user } = get()
          if (!user?.token) {
            throw new Error("No authentication token")
          }

          const response = await fetch(`http://localhost:5000/api/agent/business/${businessId}`, {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${user.token}`,
            },
          })

          const data = await response.json()

          if (!response.ok) {
            throw new Error(data.message || "Failed to fetch agents")
          }

          set({
            agents: data.agents || [],
            loading: false,
          })
        } catch (error) {
          set({
            error: error instanceof Error ? error.message : "Failed to fetch agents",
            loading: false,
          })
          throw error
        }
      },

      updateAgent: async (id: string, agentData: Partial<Agent>) => {
        set({ loading: true, error: null })
        try {
          const { user } = get()
          if (!user?.token) {
            throw new Error("No authentication token")
          }

          const response = await fetch(`http://localhost:5000/api/agent/${id}`, {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${user.token}`,
            },
            body: JSON.stringify(agentData),
          })

          const data = await response.json()

          if (!response.ok) {
            throw new Error(data.message || "Failed to update agent")
          }

          set((state) => ({
            agents: state.agents.map((a) => (a._id === id ? data.agent : a)),
            loading: false,
          }))
        } catch (error) {
          set({
            error: error instanceof Error ? error.message : "Failed to update agent",
            loading: false,
          })
          throw error
        }
      },

      createCallLog: async (callLogData: Partial<CallLog>) => {
        set({ loading: true, error: null })
        try {
          const { user } = get()
          if (!user?.token) {
            throw new Error("No authentication token")
          }

          const response = await fetch("http://localhost:5000/api/call-logs", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${user.token}`,
            },
            body: JSON.stringify(callLogData),
          })

          const data = await response.json()

          if (!response.ok) {
            throw new Error(data.message || "Failed to create call log")
          }

          set((state) => ({
            callLogs: [...state.callLogs, data.callLog],
            loading: false,
          }))
        } catch (error) {
          set({
            error: error instanceof Error ? error.message : "Failed to create call log",
            loading: false,
          })
          throw error
        }
      },

      fetchCallLogs: async (businessId: string) => {
        set({ loading: true, error: null })
        try {
          const { user } = get()
          if (!user?.token) {
            throw new Error("No authentication token")
          }

          const response = await fetch(`http://localhost:5000/api/call-logs/vapi/business/${businessId}`, {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${user.token}`,
            },
          })

          const data = await response.json()

          console.log("[v0] Fetch Call Logs Response:", data)

          if (!response.ok) {
            throw new Error(data.message || "Failed to fetch call logs")
          }

          set({
            callLogs: data.callLogs || [],
            loading: false,
          })
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : "Failed to fetch call logs"
          console.error("[v0] Fetch Call Logs Error:", errorMessage)
          set({
            error: errorMessage,
            loading: false,
          })
        }
      },

      uploadAvatar: async (file: File) => {
        set({ loading: true, error: null })
        try {
          const { user } = get()
          if (!user?.token) {
            throw new Error("No authentication token")
          }

          const formData = new FormData()
          formData.append("avatar", file)

          const response = await fetch("http://localhost:5000/api/profile/upload-avatar", {
            method: "POST",
            headers: {
              Authorization: `Bearer ${user.token}`,
            },
            body: formData,
          })

          const data = await response.json()

          if (!response.ok) {
            throw new Error(data.message || "Failed to upload avatar")
          }

          set({
            profile: data.profile,
            loading: false,
          })
        } catch (error) {
          set({
            error: error instanceof Error ? error.message : "Failed to upload avatar",
            loading: false,
          })
          throw error
        }
      },

      fetchVoicesByGender: async (gender: "male" | "female") => {
        set({ loading: true, error: null })
        try {
          const { user } = get()
          if (!user?.token) {
            throw new Error("No authentication token")
          }

          const response = await fetch(`http://localhost:5000/api/voice/available?gender=${gender}`, {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${user.token}`,
            },
          })

          const data = await response.json()

          if (!response.ok) {
            throw new Error(data.message || "Failed to fetch voices")
          }

          set({
            voices: data.voices || [],
            loading: false,
          })
        } catch (error) {
          set({
            error: error instanceof Error ? error.message : "Failed to fetch voices",
            loading: false,
          })
          throw error
        }
      },

      fetchAvailablePhoneNumbers: async () => {
        set({ loading: true, error: null })
        try {
          const { user } = get()
          if (!user?.token) {
            throw new Error("No authentication token")
          }

          const response = await fetch("http://localhost:5000/api/vapi/phone-numbers/available", {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${user.token}`,
            },
          })

          const data = await response.json()

          if (!response.ok) {
            throw new Error(data.message || "Failed to fetch phone numbers")
          }

          set({
            availablePhoneNumbers: data.availableNumbers || [],
            loading: false,
          })
        } catch (error) {
          set({
            error: error instanceof Error ? error.message : "Failed to fetch phone numbers",
            loading: false,
          })
          throw error
        }
      },

      assignPhoneNumberToBusiness: async (
        businessId: string,
        payload: {
          vapiPhoneNumberId: string
          vapiPhoneNumber: string
          voiceId: string
          agentName: string
          categoryId: string
        },
      ) => {
        set({ loading: true, error: null })
        try {
          const { user } = get()
          if (!user?.token) {
            throw new Error("No authentication token")
          }

          const response = await fetch(`http://localhost:5000/api/business/${businessId}/assign-phone-number`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${user.token}`,
            },
            body: JSON.stringify(payload),
          })

          const data = await response.json()

          if (!response.ok) {
            throw new Error(data.message || "Failed to assign phone number")
          }

          set({
            business: data.business,
            loading: false,
          })
        } catch (error) {
          set({
            error: error instanceof Error ? error.message : "Failed to assign phone number",
            loading: false,
          })
          throw error
        }
      },

      verifyEmail: async (token: string) => {
        set({ loading: true, error: null })
        try {
          const response = await fetch("http://localhost:5000/api/auth/verify-email", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ token }),
          })

          const data = await response.json()

          if (!response.ok) {
            throw new Error(data.message || "Failed to verify email")
          }

          set({ loading: false })
        } catch (error) {
          set({
            error: error instanceof Error ? error.message : "Failed to verify email",
            loading: false,
          })
          throw error
        }
      },

      resendVerification: async (email: string) => {
        set({ loading: true, error: null })
        try {
          const response = await fetch("http://localhost:5000/api/auth/resend-verification", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ email }),
          })

          const data = await response.json()

          if (!response.ok) {
            throw new Error(data.message || "Failed to resend verification email")
          }

          set({ loading: false })
        } catch (error) {
          set({
            error: error instanceof Error ? error.message : "Failed to resend verification email",
            loading: false,
          })
          throw error
        }
      },

      fetchNotifications: async () => {
        set({ loading: true, error: null })
        try {
          const { user } = get()
          if (!user?.token) {
            throw new Error("No authentication token")
          }

          const response = await fetch("http://localhost:5000/api/notifications", {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${user.token}`,
            },
          })

          const data = await response.json()

          if (!response.ok) {
            throw new Error(data.message || "Failed to fetch notifications")
          }

          set({
            notifications: data.notifications || [],
            unreadCount: data.unreadCount || 0,
            loading: false,
          })
        } catch (error) {
          set({
            error: error instanceof Error ? error.message : "Failed to fetch notifications",
            loading: false,
          })
          throw error
        }
      },

      markNotificationAsRead: async (notificationId: string) => {
        try {
          const { user } = get()
          if (!user?.token) {
            throw new Error("No authentication token")
          }

          const response = await fetch(`http://localhost:5000/api/notifications/${notificationId}/read`, {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${user.token}`,
            },
          })

          const data = await response.json()

          if (!response.ok) {
            throw new Error(data.message || "Failed to mark notification as read")
          }

          set((state) => ({
            notifications: state.notifications.map((n) =>
              n._id === notificationId ? { ...n, isRead: true } : n,
            ),
            unreadCount: Math.max(0, state.unreadCount - 1),
          }))
        } catch (error) {
          console.error("[v0] Mark notification as read error:", error)
          throw error
        }
      },

      markAllNotificationsAsRead: async () => {
        try {
          const { user } = get()
          if (!user?.token) {
            throw new Error("No authentication token")
          }

          const response = await fetch("http://localhost:5000/api/notifications/all/read", {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${user.token}`,
            },
          })

          if (!response.ok) {
            const data = await response.json()
            throw new Error(data.message || "Failed to mark all notifications as read")
          }

          set((state) => ({
            notifications: state.notifications.map((n) => ({ ...n, isRead: true })),
            unreadCount: 0,
          }))
        } catch (error) {
          console.error("[v0] Mark all notifications as read error:", error)
          throw error
        }
      },

      deleteNotification: async (notificationId: string) => {
        try {
          const { user } = get()
          if (!user?.token) {
            throw new Error("No authentication token")
          }

          const response = await fetch(`http://localhost:5000/api/notifications/${notificationId}`, {
            method: "DELETE",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${user.token}`,
            },
          })

          if (!response.ok) {
            const data = await response.json()
            throw new Error(data.message || "Failed to delete notification")
          }

          set((state) => ({
            notifications: state.notifications.filter((n) => n._id !== notificationId),
          }))
        } catch (error) {
          console.error("[v0] Delete notification error:", error)
          throw error
        }
      },

      clearAllNotifications: async () => {
        try {
          const { user } = get()
          if (!user?.token) {
            throw new Error("No authentication token")
          }

          const response = await fetch("http://localhost:5000/api/notifications", {
            method: "DELETE",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${user.token}`,
            },
          })

          if (!response.ok) {
            const data = await response.json()
            throw new Error(data.message || "Failed to clear notifications")
          }

          set({
            notifications: [],
            unreadCount: 0,
          })
        } catch (error) {
          console.error("[v0] Clear all notifications error:", error)
          throw error
        }
      },

      fetchVapiCallLogs: async (businessId: string, limit?: number) => {
        set({ loading: true, error: null })
        try {
          const { user } = get()
          if (!user?.token) {
            throw new Error("No authentication token")
          }

          const queryParams = limit ? `?limit=${limit}` : ""
          const response = await fetch(
            `http://localhost:5000/api/call-logs/vapi/business/${businessId}${queryParams}`,
            {
              method: "GET",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${user.token}`,
              },
            },
          )

          const data = await response.json()

          console.log("[v0] VAPI Call Logs Response:", data)

          if (!response.ok) {
            throw new Error(data.message || "Failed to fetch VAPI call logs")
          }

          set({
            callLogs: data.callLogs || [],
            loading: false,
          })
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : "Failed to fetch VAPI call logs"
          console.error("[v0] VAPI Call Logs Error:", errorMessage)
          set({
            error: errorMessage,
            loading: false,
          })
          throw error
        }
      },

      refreshToken: async () => {
        try {
          console.log("[v0] Attempting to refresh token...")
          const response = await fetch("http://localhost:5000/api/auth/refresh-token", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
          })

          const data = await response.json()

          if (!response.ok) {
            console.error("[v0] Token refresh failed:", data.message)
            set({ user: null })
            return null
          }

          if (data.token) {
            set((state) => ({
              user: state.user ? { ...state.user, token: data.token } : null,
            }))
            console.log("[v0] Token refreshed successfully")
            return data.token
          }

          return null
        } catch (error) {
          console.error("[v0] Error refreshing token:", error)
          set({ user: null })
          return null
        }
      },
    }),
    {
      name: "auth-store",
      onRehydrateStorage: () => (state) => {
        if (state) {
          state.isHydrated = true
        }
      },
    },
  ),
)
