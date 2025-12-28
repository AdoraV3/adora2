/* eslint-disable @typescript-eslint/no-unused-vars */
"use client"

import type React from "react"
import { useEffect, useState } from "react"
import { ChevronDown, Edit2, Trash2, AlertCircle, Save, User, Building2, Zap } from "lucide-react"
import { useAuthStore } from "@/store/auth-store"
import { useBusinessStore } from "@/store/business-store"
import { useSubscriptionStore } from "@/store/subscription-store"
import { ProfileEditModal } from "@/components/account-settings/profile-edit-modal"

interface InfoItemProps {
  label: string
  value: string
}

function InfoItem({ label, value }: InfoItemProps) {
  return (
    <div className="flex flex-col space-y-1.5">
      <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">{label}</span>
      <span className="text-base text-gray-900 font-medium">{value}</span>
    </div>
  )
}

interface FormFieldProps {
  label: string
  type: "text" | "select" | "textarea"
  value?: string
  onChange?: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => void
  icon?: React.ReactNode
  options?: { label: string; value: string }[]
  required?: boolean
}

function FormField({ label, type, value, onChange, icon, options, required }: FormFieldProps) {
  return (
    <div className="flex flex-col space-y-2">
      <label className="text-sm font-semibold text-gray-900">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
      <div className="relative">
        {type === "select" ? (
          <select
            value={value || ""}
            onChange={onChange}
            className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none bg-white transition-all hover:border-gray-400"
          >
            <option value="">Select {label}</option>
            {options?.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        ) : type === "textarea" ? (
          <textarea
            value={value || ""}
            onChange={onChange}
            className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none transition-all hover:border-gray-400"
            placeholder={label}
            rows={3}
          />
        ) : (
          <input
            type="text"
            value={value || ""}
            onChange={onChange}
            className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all hover:border-gray-400"
            placeholder={label}
          />
        )}
        {type === "select" && (
          <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-gray-400">
            <ChevronDown size={18} />
          </div>
        )}
      </div>
    </div>
  )
}

export default function AccountInfoContent() {
  const { user, profile, business, agents, fetchUser } = useAuthStore()
  const {
    updateBusiness,
    deleteBusiness,
    loading: businessLoading,
    error: businessError,
    clearError,
  } = useBusinessStore()
  const { currentSubscription } = useSubscriptionStore()

  const [isProfileEditOpen, setIsProfileEditOpen] = useState(false)
  const [isEditingBusiness, setIsEditingBusiness] = useState(false)
  const [businessFormData, setBusinessFormData] = useState({
    name: "",
    description: "",
    country: "",
    agentName: "",
  })

  const [agentFormData, setAgentFormData] = useState({
    province: "",
    phoneNumber: "",
    aiVoice: "",
    aiPhoneNumber: "",
    aiName: "",
  })

  const [savingAgent, setSavingAgent] = useState(false)
  const [saveMessage, setSaveMessage] = useState<{ type: "success" | "error"; text: string } | null>(null)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)

  useEffect(() => {
    if (business) {
      setBusinessFormData({
        name: business.name || "",
        description: business.description || "",
        country: business.country || "",
        agentName: business.agentName || "",
      })
    }
    if (agents && agents.length > 0) {
      const agent = agents[0]
      setAgentFormData({
        province: business?.country || "",
        phoneNumber: business?.vapiPhoneNumber || "",
        aiVoice: agent.voiceId || "",
        aiPhoneNumber: agent.vapiPhoneNumber || "",
        aiName: agent.agentName || "",
      })
    }
  }, [agents, business])

  const handleSaveBusiness = async () => {
    if (!business?._id) return
    setSaveMessage(null)
    clearError()

    try {
      await updateBusiness(business._id, {
        name: businessFormData.name,
        description: businessFormData.description,
        country: businessFormData.country,
        agentName: businessFormData.agentName,
      })

      await fetchUser()

      setSaveMessage({ type: "success", text: "Business information updated successfully!" })
      setIsEditingBusiness(false)
      setTimeout(() => setSaveMessage(null), 3000)
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Failed to update business information"
      setSaveMessage({ type: "error", text: errorMessage })
    }
  }

  const handleDeleteBusiness = async () => {
    if (!business?._id) return
    setSaveMessage(null)
    clearError()

    try {
      await deleteBusiness(business._id)

      setSaveMessage({ type: "success", text: "Business deleted successfully!" })
      setShowDeleteConfirm(false)
      setTimeout(() => {
        window.location.href = "/dashboard"
      }, 1500)
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Failed to delete business"
      setSaveMessage({ type: "error", text: errorMessage })
    }
  }

  const handleSaveAgent = async () => {
    setSavingAgent(true)
    setSaveMessage(null)

    try {
      setSaveMessage({ type: "success", text: "Agent information saved successfully!" })
      setTimeout(() => setSaveMessage(null), 3000)
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Failed to save agent information"
      setSaveMessage({ type: "error", text: errorMessage })
    } finally {
      setSavingAgent(false)
    }
  }

  const formatDate = (dateString: string | undefined) => {
    if (!dateString) return "N/A"
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  const getDaysLeft = () => {
    const endDate = currentSubscription?.subscriptionEndDate || currentSubscription?.freeTrialEndDate
    if (!endDate) return "N/A"

    const now = new Date()
    const end = new Date(endDate)
    const daysLeft = Math.ceil((end.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))

    return daysLeft > 0 ? `${daysLeft} days left` : "Expired"
  }

  const getSubscriptionStatus = () => {
    if (!currentSubscription) {
      return "No Active Subscription"
    }

    if (currentSubscription.isFreeTrial) {
      return "Free Trial"
    }

    if (currentSubscription.subscription?.plan) {
      const planName = currentSubscription.subscription.plan
      return planName.charAt(0).toUpperCase() + planName.slice(1)
    }

    return "No Active Subscription"
  }

  return (
    <div className="p-8 space-y-8">
      {/* Account Info Section */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-blue-100 rounded-xl">
              <User className="text-blue-600" size={24} />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Account Information</h2>
              <p className="text-sm text-gray-600 mt-1">Manage your profile and account details</p>
            </div>
          </div>
          <button
            onClick={() => setIsProfileEditOpen(true)}
            className="flex items-center gap-2 px-4 py-2.5 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 border border-blue-600 rounded-lg transition-colors shadow-md hover:shadow-lg"
          >
            <Edit2 size={16} />
            Edit Profile
          </button>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* User Info */}
            <div className="flex flex-col space-y-6">
              <div className="flex items-center gap-3 pb-6 border-b border-gray-200">
                <div>
                  <span className="text-lg font-bold text-gray-900">{profile?.name || "User"}</span>
                  <div className="mt-2 inline-flex items-center gap-2 px-3 py-1 bg-blue-100 text-blue-800 rounded-full">
                    <span className="text-xs font-semibold">{getDaysLeft()}</span>
                  </div>
                </div>
              </div>
              <InfoItem label="Subscription" value={getSubscriptionStatus()} />
              <InfoItem label="Email" value={user?.email || "N/A"} />
              <InfoItem label="Phone" value={profile?.phone || "N/A"} />
              <InfoItem label="Country" value={profile?.country || "N/A"} />
            </div>

            {/* Dates Info */}
            <div className="flex flex-col space-y-6">
              <div className="pb-6 border-b border-gray-200" />
              <InfoItem label="Joined account on" value={formatDate(business?.createdAt)} />
              <InfoItem
                label="Subscription Start Date"
                value={formatDate(business?.subscriptionStartDate || business?.freeTrialStartDate)}
              />
              <InfoItem label="Free Trial End Date" value={formatDate(business?.freeTrialEndDate)} />
              <InfoItem label="Subscription End Date" value={formatDate(business?.subscriptionEndDate)} />
            </div>
          </div>

          {profile?.bio && (
            <div className="mt-6 pt-6 border-t border-gray-200">
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Bio</p>
              <p className="text-gray-700 text-base leading-relaxed">{profile.bio}</p>
            </div>
          )}
        </div>
      </div>

      {/* Profile Edit Modal */}
      <ProfileEditModal
        isOpen={isProfileEditOpen}
        onClose={() => setIsProfileEditOpen(false)}
        onSuccess={() => fetchUser()}
      />

      {/* Business Information Section */}
      {business && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 space-y-6">
          <div className="flex items-center justify-between border-b border-gray-200 pb-6">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-green-100 rounded-xl">
                <Building2 className="text-green-600" size={24} />
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900">Business Information</h3>
                <p className="text-sm text-gray-600 mt-1">Update your business details</p>
              </div>
            </div>
            <button
              onClick={() => setIsEditingBusiness(!isEditingBusiness)}
              className="flex items-center gap-2 px-4 py-2.5 text-sm font-semibold text-blue-600 hover:text-blue-700 border border-blue-300 hover:bg-blue-50 rounded-lg transition-colors"
            >
              <Edit2 size={16} />
              {isEditingBusiness ? "Cancel" : "Edit"}
            </button>
          </div>

          {isEditingBusiness ? (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  label="Business Name"
                  type="text"
                  value={businessFormData.name}
                  onChange={(e) => setBusinessFormData({ ...businessFormData, name: e.target.value })}
                  required
                />
                <FormField
                  label="Country"
                  type="text"
                  value={businessFormData.country}
                  onChange={(e) => setBusinessFormData({ ...businessFormData, country: e.target.value })}
                />
                <FormField
                  label="Agent Name"
                  type="text"
                  value={businessFormData.agentName}
                  onChange={(e) => setBusinessFormData({ ...businessFormData, agentName: e.target.value })}
                />
              </div>
              <FormField
                label="Business Description"
                type="textarea"
                value={businessFormData.description}
                onChange={(e) => setBusinessFormData({ ...businessFormData, description: e.target.value })}
              />

              {(saveMessage || businessError) && (
                <div
                  className={`p-4 rounded-lg border ${
                    saveMessage?.type === "success" || !businessError
                      ? "bg-green-50 text-green-800 border-green-200"
                      : "bg-red-50 text-red-800 border-red-200"
                  }`}
                >
                  {saveMessage?.text || businessError}
                </div>
              )}

              <div className="flex gap-3 pt-4">
                <button
                  onClick={handleSaveBusiness}
                  disabled={businessLoading}
                  className="flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-md hover:shadow-lg"
                >
                  <Save size={18} />
                  {businessLoading ? "Saving..." : "Save Changes"}
                </button>
                <button
                  onClick={() => setShowDeleteConfirm(true)}
                  className="flex items-center gap-2 px-6 py-3 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-lg transition-colors shadow-md hover:shadow-lg"
                >
                  <Trash2 size={18} />
                  Delete Business
                </button>
              </div>
            </>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <InfoItem label="Business Name" value={business?.name || "N/A"} />
              <InfoItem label="Country" value={business?.country || "N/A"} />
              <InfoItem label="Agent Name" value={business?.agentName || "N/A"} />
              <InfoItem label="Voice ID" value={business?.voiceId || "N/A"} />
              <InfoItem label="Phone Number" value={business?.vapiPhoneNumber || "N/A"} />
              <InfoItem label="Vapi Assistant ID" value={business?.vapiAssistantId || "N/A"} />
            </div>
          )}
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl p-8 max-w-md w-full">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                <AlertCircle className="text-red-600" size={24} />
              </div>
              <h3 className="text-lg font-bold text-gray-900">Delete Business</h3>
            </div>
            <p className="text-gray-700 mb-6 leading-relaxed">
              Are you sure you want to delete this business? This action cannot be undone and will permanently remove
              all associated data.
            </p>
            {(saveMessage || businessError) && (
              <div
                className={`p-4 rounded-lg mb-6 border ${
                  saveMessage?.type === "success" || !businessError
                    ? "bg-green-50 text-green-800 border-green-200"
                    : "bg-red-50 text-red-800 border-red-200"
                }`}
              >
                {saveMessage?.text || businessError}
              </div>
            )}
            <div className="flex gap-3">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                disabled={businessLoading}
                className="flex-1 px-4 py-2.5 border border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteBusiness}
                disabled={businessLoading}
                className="flex-1 px-4 py-2.5 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {businessLoading ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Agent Information Section */}
      {business && agents && agents.length > 0 && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 space-y-6">
          <div className="flex items-center gap-3 border-b border-gray-200 pb-6">
            <div className="p-3 bg-purple-100 rounded-xl">
              <Zap className="text-purple-600" size={24} />
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-900">AI Agent Information</h3>
              <p className="text-sm text-gray-600 mt-1">Configure your AI agent settings</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField
              label="Business Province"
              type="text"
              value={agentFormData.province}
              onChange={(e) => setAgentFormData({ ...agentFormData, province: e.target.value })}
            />
            <FormField
              label="Business Phone Number"
              type="text"
              value={agentFormData.phoneNumber}
              onChange={(e) => setAgentFormData({ ...agentFormData, phoneNumber: e.target.value })}
            />
            <FormField
              label="AI Voice"
              type="text"
              value={agentFormData.aiVoice}
              onChange={(e) => setAgentFormData({ ...agentFormData, aiVoice: e.target.value })}
            />
            <FormField
              label="AI Phone Number"
              type="text"
              value={agentFormData.aiPhoneNumber}
              onChange={(e) => setAgentFormData({ ...agentFormData, aiPhoneNumber: e.target.value })}
            />
            <FormField
              label="AI Name"
              type="text"
              value={agentFormData.aiName}
              onChange={(e) => setAgentFormData({ ...agentFormData, aiName: e.target.value })}
            />
          </div>

          {saveMessage && (
            <div
              className={`p-4 rounded-lg border ${
                saveMessage.type === "success"
                  ? "bg-green-50 text-green-800 border-green-200"
                  : "bg-red-50 text-red-800 border-red-200"
              }`}
            >
              {saveMessage.text}
            </div>
          )}

          <button
            onClick={handleSaveAgent}
            disabled={savingAgent}
            className="flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-md hover:shadow-lg mt-4"
          >
            <Save size={18} />
            {savingAgent ? "Saving..." : "Save Agent Information"}
          </button>
        </div>
      )}
    </div>
  )
}
