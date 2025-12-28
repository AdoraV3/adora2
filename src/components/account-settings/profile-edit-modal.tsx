/* eslint-disable @next/next/no-img-element */
"use client"

import type React from "react"
import { useState, useRef } from "react"
import { X, Upload, CheckCircle, AlertCircle, Loader } from "lucide-react"
import { useAccountInfoStore } from "@/store/account-info-store"
import { useAuthStore } from "@/store/auth-store"

interface ProfileEditModalProps {
  isOpen: boolean
  onClose: () => void
  onSuccess: () => void
}

export function ProfileEditModal({ isOpen, onClose, onSuccess }: ProfileEditModalProps) {
  const { profile } = useAuthStore()
  const { loading, error, updateProfileInfo } = useAccountInfoStore()
  const fileInputRef = useRef<HTMLInputElement>(null)

  const [formData, setFormData] = useState({
    name: profile?.name || "",
    bio: profile?.bio || "",
    phone: profile?.phone || "",
    country: profile?.country || "",
  })

  const [avatarFile, setAvatarFile] = useState<File | null>(null)
  const [avatarPreview, setAvatarPreview] = useState<string>(profile?.avatar || "")
  const [saveMessage, setSaveMessage] = useState<{ type: "success" | "error"; text: string } | null>(null)
  const [touched, setTouched] = useState<Set<string>>(new Set())

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
    setTouched((prev) => new Set([...prev, name]))
  }

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      // Validate file type
      if (!file.type.startsWith("image/")) {
        setSaveMessage({ type: "error", text: "Please select a valid image file" })
        return
      }
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setSaveMessage({ type: "error", text: "Image size must be less than 5MB" })
        return
      }
      setAvatarFile(file)
      const reader = new FileReader()
      reader.onloadend = () => {
        setAvatarPreview(reader.result as string)
      }
      reader.readAsDataURL(file)
      setSaveMessage(null)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaveMessage(null)

    // Validate required fields
    if (!formData.name.trim()) {
      setSaveMessage({ type: "error", text: "Name is required" })
      return
    }

    try {
      const formDataToSend = new FormData()
      formDataToSend.append("name", formData.name)
      formDataToSend.append("bio", formData.bio)
      formDataToSend.append("phone", formData.phone)
      formDataToSend.append("country", formData.country)

      if (avatarFile) {
        formDataToSend.append("avatar", avatarFile)
      }

      await updateProfileInfo(formDataToSend)
      setSaveMessage({ type: "success", text: "Profile updated successfully!" })
      setTimeout(() => {
        onSuccess()
        onClose()
      }, 1500)
    } catch (error) {
      setSaveMessage({
        type: "error",
        text: error instanceof Error ? error.message : "Failed to update profile",
      })
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm bottom-0 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 z-10 bg-white border-b border-gray-200 px-8 py-6 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-semibold text-gray-900">Edit Profile</h2>
            <p className="text-sm text-gray-500 mt-1">Update your personal information</p>
          </div>
          <button
            onClick={onClose}
            disabled={loading}
            className="text-gray-400 hover:text-gray-600 transition-colors disabled:opacity-50 p-2 hover:bg-gray-100 rounded-lg"
          >
            <X size={24} />
          </button>
        </div>

        {/* Content */}
        <form onSubmit={handleSubmit} className="p-8 space-y-8">
          {/* Avatar Section */}
          <div className="flex flex-col items-center space-y-6">
            <div className="relative">
              <div className="w-32 h-32 rounded-full overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center border-4 border-white shadow-md">
                {avatarPreview ? (
                  <img
                    src={avatarPreview || "/placeholder.svg"}
                    alt="Avatar preview"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="flex items-center justify-center w-full h-full bg-gray-100">
                    <span className="text-gray-400 text-center">
                      <Upload size={32} className="mx-auto mb-2 opacity-50" />
                      <span className="text-xs">Photo</span>
                    </span>
                  </div>
                )}
              </div>
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="absolute bottom-0 right-0 bg-blue-600 hover:bg-blue-700 text-white rounded-full p-2.5 shadow-lg transition-colors"
              >
                <Upload size={16} />
              </button>
            </div>
            <div className="text-center">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="text-sm font-medium text-blue-600 hover:text-blue-700 transition-colors"
              >
                Upload Photo
              </button>
              <p className="text-xs text-gray-500 mt-1">JPG, PNG up to 5MB</p>
            </div>
            <input ref={fileInputRef} type="file" accept="image/*" onChange={handleAvatarChange} className="hidden" />
          </div>

          {/* Divider */}
          <div className="border-t border-gray-200" />

          {/* Form Fields */}
          <div className="space-y-6">
            {/* Name Field */}
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">
                Full Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                placeholder="Enter your full name"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              />
              {touched.has("name") && !formData.name && <p className="text-xs text-red-500 mt-1">Name is required</p>}
            </div>

            {/* Phone Field */}
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">Phone Number</label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                placeholder="+1 (555) 000-0000"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              />
            </div>

            {/* Country Field */}
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">Country</label>
              <input
                type="text"
                name="country"
                value={formData.country}
                onChange={handleInputChange}
                placeholder="United States"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              />
            </div>

            {/* Bio Field */}
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">Bio</label>
              <textarea
                name="bio"
                value={formData.bio}
                onChange={handleInputChange}
                placeholder="Tell us about yourself... (max 500 characters)"
                rows={4}
                maxLength={500}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none"
              />
              <p className="text-xs text-gray-500 mt-1">{formData.bio.length}/500 characters</p>
            </div>
          </div>

          {/* Messages */}
          {error && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3">
              <AlertCircle size={20} className="text-red-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-red-900">{error}</p>
              </div>
            </div>
          )}
          {saveMessage && (
            <div
              className={`p-4 rounded-lg flex items-start gap-3 border ${
                saveMessage.type === "success" ? "bg-green-50 border-green-200" : "bg-red-50 border-red-200"
              }`}
            >
              {saveMessage.type === "success" ? (
                <CheckCircle size={20} className="text-green-600 flex-shrink-0 mt-0.5" />
              ) : (
                <AlertCircle size={20} className="text-red-600 flex-shrink-0 mt-0.5" />
              )}
              <p
                className={`text-sm font-medium ${saveMessage.type === "success" ? "text-green-900" : "text-red-900"}`}
              >
                {saveMessage.text}
              </p>
            </div>
          )}

          {/* Buttons */}
          <div className="border-t border-gray-200 pt-6 flex gap-3 justify-end">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="px-6 py-3 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {loading && <Loader size={18} className="animate-spin" />}
              {loading ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
