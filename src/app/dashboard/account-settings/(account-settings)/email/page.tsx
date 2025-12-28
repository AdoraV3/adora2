/* eslint-disable @typescript-eslint/no-unused-vars */
"use client"

import type React from "react"
import { useEffect, useState } from "react"
import { Info } from "lucide-react"
import Image from "next/image"
import googleLogo from "../../../../../../public/google.webp"
import { useAuthStore } from "@/store/auth-store"
import { useToast } from "@/hooks/use-toast"

export default function EmailContent() {
  const { toast } = useToast()
  const { user } = useAuthStore()
  const [loading, setLoading] = useState(false)
  const [newEmail, setNewEmail] = useState("")
  const [errors, setErrors] = useState<Record<string, string>>({})

  useEffect(() => {
    if (user?.email) {
      console.log("[v0] Current email:", user.email)
    }
  }, [user])

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  }

  const handleSaveEmail = async (e: React.FormEvent) => {
    e.preventDefault()

    const newErrors: Record<string, string> = {}
    if (!newEmail) newErrors.newEmail = "New email is required"
    if (newEmail && !validateEmail(newEmail)) newErrors.newEmail = "Invalid email format"
    if (newEmail === user?.email) newErrors.newEmail = "New email must be different"

    setErrors(newErrors)
    if (Object.keys(newErrors).length > 0) return

    setLoading(true)
    try {
      toast({
        title: "Info",
        message: "Email change feature coming soon",
        type: "info",
      })
    } catch (error) {
      toast({
        title: "Error",
        message: error instanceof Error ? error.message : "Failed to update email",
        type: "error",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="p-6 space-y-8">
      <div className="space-y-4">
        <h2 className="font-semibold text-gray-800">Email</h2>
        <div className="flex flex-col space-y-2">
          <span className="font-medium text-gray-800">Current email</span>
          <span className="text-gray-500">
            Your current email address is <span className="font-semibold text-gray-700">{user?.email || "N/A"}</span>
          </span>
        </div>
        <div className="flex items-center space-x-2 text-gray-600">
          <div className="w-5 h-5">
            <Image alt="google" src={googleLogo || "/placeholder.svg"} />
          </div>
          <span>Log In with Google available</span>
        </div>
        <div className="flex items-start space-x-2 p-3 bg-blue-50 rounded-lg">
          <Info size={16} className="text-blue-600 mt-0.5 flex-shrink-0" />
          <div>
            <span className="font-medium text-blue-900">Note</span>
            <p className="text-blue-800 text-sm">Contact support to change your email address</p>
          </div>
        </div>
      </div>

      <div className="space-y-4 max-w-md">
        <span className="font-semibold text-gray-800">Email notifications</span>
        <p className="text-gray-500 text-sm">
          To manage email preferences and notifications, contact our support team.
        </p>
      </div>
    </div>
  )
}
