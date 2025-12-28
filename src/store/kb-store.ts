/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"

import { create } from "zustand"
import { useAuthStore } from "@/store/auth-store"

const BASE_URL = "https://rhys-unerasable-unsedimentally.ngrok-free.dev"

const getHeaders = (token?: string) => {
  const headers: any = {
    "Content-Type": "application/json",
    "ngrok-skip-browser-warning": "true",
  }
  if (token) {
    headers.Authorization = `Bearer ${token}`
  }
  return headers
}

interface KnowledgeBase {
  _id: string
  businessId: string
  title: string
  fileUrl: string
  fileType: string
  fileSize: number
  createdAt: string
  updatedAt: string
}

interface KBStore {
  // State
  kbList: KnowledgeBase[]
  isLoading: boolean
  isUploading: boolean
  error: string | null

  // Actions
  fetchKnowledgeBases: (businessId: string) => Promise<void>
  uploadAndAttachKnowledgeBase: (businessId: string, file: File, title: string) => Promise<void>
  uploadKnowledgeBase: (businessId: string, file: File, title: string) => Promise<void>
  updateKnowledgeBase: (id: string, title: string) => Promise<void>
  deleteKnowledgeBase: (id: string) => Promise<void>
  attachToAssistant: (kbId: string, assistantId: string) => Promise<void>
  clearError: () => void
  resetState: () => void
}

export const useKBStore = create<KBStore>((set, get) => ({
  // Initial State
  kbList: [],
  isLoading: false,
  isUploading: false,
  error: null,

  fetchKnowledgeBases: async (businessId: string) => {
    set({ isLoading: true, error: null })
    try {
      const { user } = useAuthStore.getState()
      if (!user?.token) throw new Error("No authentication token")

      const response = await fetch(`${BASE_URL}/api/knowledge-base/business/${businessId}`, {
        method: "GET",
        headers: getHeaders(user.token),
      })

      const data = await response.json()

      if (!response.ok) throw new Error(data.message || "Failed to fetch knowledge bases")

      set({ kbList: data.knowledgeBase || [] })
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : "Failed to fetch knowledge bases"
      set({ error: errorMsg })
      console.error("[v0] Error fetching KB:", err)
    } finally {
      set({ isLoading: false })
    }
  },

  uploadAndAttachKnowledgeBase: async (businessId: string, file: File, title: string) => {
    set({ isUploading: true, error: null })
    try {
      const { user, business } = useAuthStore.getState()
      if (!user?.token) throw new Error("No authentication token")
      if (!business?.vapiAssistantId) throw new Error("No assistant ID found")

      // Step 1: Upload the knowledge base
      const formData = new FormData()
      formData.append("file", file)
      formData.append("businessId", businessId)
      formData.append("title", title)

      const uploadResponse = await fetch(`${BASE_URL}/api/knowledge-base/upload`, {
        method: "POST",
        headers: {
          "ngrok-skip-browser-warning": "true",
          Authorization: `Bearer ${user.token}`,
        },
        body: formData,
      })

      if (!uploadResponse.ok) throw new Error("Upload failed")

      const uploadData = await uploadResponse.json()
      const kbId = uploadData.knowledgeBase?._id

      if (!kbId) throw new Error("No KB ID returned from upload")

      // Step 2: Immediately attach to assistant using vapiAssistantId
      const attachResponse = await fetch(`${BASE_URL}/api/knowledge-base/${kbId}/attach-to-assistant`, {
        method: "POST",
        headers: getHeaders(user.token),
        body: JSON.stringify({ assistantId: business.vapiAssistantId }),
      })

      if (!attachResponse.ok) throw new Error("Attach to assistant failed")

      // Step 3: Refresh the list
      await get().fetchKnowledgeBases(businessId)
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : "Upload and attach failed"
      set({ error: errorMsg })
      console.error("[v0] Error uploading and attaching KB:", err)
      throw err
    } finally {
      set({ isUploading: false })
    }
  },

  uploadKnowledgeBase: async (businessId: string, file: File, title: string) => {
    set({ isUploading: true, error: null })
    try {
      const { user } = useAuthStore.getState()
      if (!user?.token) throw new Error("No authentication token")

      const formData = new FormData()
      formData.append("file", file)
      formData.append("businessId", businessId)
      formData.append("title", title)

      const response = await fetch(`${BASE_URL}/api/knowledge-base/upload`, {
        method: "POST",
        headers: {
          "ngrok-skip-browser-warning": "true",
          Authorization: `Bearer ${user.token}`,
        },
        body: formData,
      })

      if (!response.ok) throw new Error("Upload failed")

      // Refresh the list after upload
      await get().fetchKnowledgeBases(businessId)
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : "Upload failed"
      set({ error: errorMsg })
      console.error("[v0] Error uploading KB:", err)
    } finally {
      set({ isUploading: false })
    }
  },

  updateKnowledgeBase: async (id: string, title: string) => {
    set({ isLoading: true, error: null })
    try {
      const { user } = useAuthStore.getState()
      if (!user?.token) throw new Error("No authentication token")

      const response = await fetch(`${BASE_URL}/api/knowledge-base/${id}`, {
        method: "PUT",
        headers: getHeaders(user.token),
        body: JSON.stringify({ title }),
      })

      if (!response.ok) throw new Error("Update failed")

      // Update the item in the list
      set((state) => ({
        kbList: state.kbList.map((kb) => (kb._id === id ? { ...kb, title } : kb)),
      }))
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : "Update failed"
      set({ error: errorMsg })
      console.error("[v0] Error updating KB:", err)
    } finally {
      set({ isLoading: false })
    }
  },

  deleteKnowledgeBase: async (id: string) => {
    set({ isLoading: true, error: null })
    try {
      const { user } = useAuthStore.getState()
      if (!user?.token) throw new Error("No authentication token")

      const response = await fetch(`${BASE_URL}/api/knowledge-base/${id}`, {
        method: "DELETE",
        headers: {
          "ngrok-skip-browser-warning": "true",
          Authorization: `Bearer ${user.token}`,
        },
      })

      if (!response.ok) throw new Error("Delete failed")

      set((state) => ({
        kbList: state.kbList.filter((kb) => kb._id !== id),
      }))
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : "Delete failed"
      set({ error: errorMsg })
      console.error("[v0] Error deleting KB:", err)
    } finally {
      set({ isLoading: false })
    }
  },

  attachToAssistant: async (kbId: string, assistantId: string) => {
    set({ isLoading: true, error: null })
    try {
      const { user } = useAuthStore.getState()
      if (!user?.token) throw new Error("No authentication token")

      const response = await fetch(`${BASE_URL}/api/knowledge-base/${kbId}/attach-to-assistant`, {
        method: "POST",
        headers: getHeaders(user.token),
        body: JSON.stringify({ assistantId }),
      })

      if (!response.ok) throw new Error("Attach to assistant failed")
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : "Attach failed"
      set({ error: errorMsg })
      console.error("[v0] Error attaching KB to assistant:", err)
      throw err
    } finally {
      set({ isLoading: false })
    }
  },

  clearError: () => set({ error: null }),

  resetState: () => {
    set({
      kbList: [],
      isLoading: false,
      isUploading: false,
      error: null,
    })
  },
}))
