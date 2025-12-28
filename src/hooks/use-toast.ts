/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"

import { useState, useCallback } from "react"

export interface Toast {
  id: string
  title: string
  message: string
  type: "success" | "error" | "info" | "warning"
  duration?: number
}

export function useToast() {
  const [toasts, setToasts] = useState<Toast[]>([])

  const toast = useCallback(
    (
      options:
        | Omit<Toast, "id">
        | {
            title: string
            message: string
            type?: "success" | "error" | "info" | "warning"
            duration?: number
          },
    ) => {
      const id = Date.now().toString()
      const newToast: Toast = {
        id,
        title: options.title,
        message: options.message,
        type: (options as any).type || "info",
        duration: (options as any).duration || 3000,
      }

      setToasts((prev) => [...prev, newToast])

      // Auto-remove toast after duration
      if (newToast.duration) {
        setTimeout(() => {
          removeToast(id)
        }, newToast.duration)
      }

      return id
    },
    [],
  )

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id))
  }, [])

  return {
    toast,
    removeToast,
    toasts,
  }
}
