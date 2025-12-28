/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-non-null-asserted-optional-chain */
/* eslint-disable @next/next/no-img-element */
"use client"

import { useState, useRef, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button, Input, Select, Card, Upload, Spin, message, Steps } from "antd"
import { UploadOutlined } from "@ant-design/icons"
import { countries } from "@/data/countries"
import { validateProfileForm, validateBusinessForm } from "@/utils/validation"
import { useAuthStore } from "@/store/auth-store"

export function ProfileFormComponent() {
  const router = useRouter()
  const hasRedirectedRef = useRef(false)

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [currentStep, setCurrentStep] = useState<"profile" | "business" | "voice-and-phone">("profile")
  const [isLoading, setIsLoading] = useState(true)

  const {
    profile,
    loading,
    fetchProfile,
    updateProfile,
    uploadAvatar,
    business,
    createBusiness,
    fetchBusiness,
    voices,
    availablePhoneNumbers,
    fetchVoicesByGender,
    fetchAvailablePhoneNumbers,
    assignPhoneNumberToBusiness,
  } = useAuthStore()

  // State from original component
  const [formData, setFormData] = useState({ name: "", phone: "", country: "", bio: "" })
  const [businessData, setBusinessData] = useState({ name: "", description: "", country: "", agentName: "" })
  const [voicePhoneData, setVoicePhoneData] = useState({
    selectedGender: "male" as "male" | "female",
    selectedVoice: "",
    selectedPhoneNumber: "",
    categoryId: "ecommerce",
  })

  const [avatarFile, setAvatarFile] = useState<File | null>(null)
  const [avatarPreview, setAvatarPreview] = useState<string>("")
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({})
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false)

  useEffect(() => {
    const loadProfile = async () => {
      try {
        setIsLoading(true)
        await fetchProfile()
      } catch (error) {
        console.error("[v0] Failed to fetch profile:", error)
      } finally {
        setIsLoading(false)
      }
    }

    loadProfile()
  }, [fetchProfile])

  useEffect(() => {
    if (profile) {
      console.log("[v0] Profile loaded:", profile)
      setFormData({
        name: profile.name || "",
        phone: profile.phone || "",
        country: profile.country || "",
        bio: profile.bio || "",
      })

      // Set avatar preview if available
      if (profile.avatar) {
        setAvatarPreview(profile.avatar)
      }
    }
  }, [profile])

  // Handlers
  const handleAvatarChange = async (file: File) => {
    if (file) {
      setAvatarFile(file)
      const reader = new FileReader()
      reader.onloadend = () => {
        setAvatarPreview(reader.result as string)
      }
      reader.readAsDataURL(file)

      // Upload avatar to API
      setIsUploadingAvatar(true)
      try {
        await uploadAvatar(file)
        console.log("[v0] Avatar uploaded successfully")
        message.success("Avatar uploaded successfully!")
      } catch (error) {
        console.error("[v0] Avatar upload failed:", error)
        setValidationErrors({ avatar: "Failed to upload avatar. Please try again." })
        message.error("Failed to upload avatar")
      } finally {
        setIsUploadingAvatar(false)
      }
    }
    return false
  }

  const handleFormInputChange = (field: keyof typeof formData, value: string) => {
    setFormData((prevData) => ({ ...prevData, [field]: value }))
    if (validationErrors[field]) {
      setValidationErrors((prevErrors) => {
        const newErrors = { ...prevErrors }
        delete newErrors[field as keyof typeof newErrors]
        return newErrors
      })
    }
  }

  const handleBusinessInputChange = (field: keyof typeof businessData, value: string) => {
    setBusinessData((prevData) => ({ ...prevData, [field]: value }))
    if (validationErrors[field]) {
      setValidationErrors((prevErrors) => {
        const newErrors = { ...prevErrors }
        delete newErrors[field as keyof typeof newErrors]
        return newErrors
      })
    }
  }

  const handleNextStep = async (step: "profile" | "business" | "voice-and-phone") => {
    setValidationErrors({}) // Clear previous errors

    if (step === "profile") {
      const errors = validateProfileForm({ ...formData, avatar: avatarFile || undefined })
      if (Object.keys(errors).length > 0) {
        setValidationErrors(errors)
        message.error("Please fix the errors in the form")
        return
      }

      setIsSubmitting(true)
      try {
        await updateProfile({
          name: formData.name,
          phone: formData.phone,
          country: formData.country,
          bio: formData.bio,
        })
        console.log("[v0] Profile updated successfully")
        message.success("Profile updated successfully!")
        setCurrentStep("business")
      } catch (error) {
        console.error("[v0] Profile update error:", error)
        setValidationErrors({ general: "Failed to update profile. Please try again." })
        message.error("Failed to update profile")
      } finally {
        setIsSubmitting(false)
      }
    } else if (step === "business") {
      const errors = validateBusinessForm(businessData)
      if (Object.keys(errors).length > 0) {
        setValidationErrors(errors)
        message.error("Please fix the errors in the form")
        return
      }

      setIsSubmitting(true)
      try {
        await createBusiness({
          name: businessData.name,
          agentName: businessData.agentName,
          description: businessData.description,
          country: businessData.country,
        })
        console.log("[v0] Business created successfully")
        message.success("Business created successfully!")

        // Fetch available voices and phone numbers
        await Promise.all([fetchVoicesByGender("male"), fetchAvailablePhoneNumbers()])
        console.log("[v0] Voices and phone numbers fetched")

        setCurrentStep("voice-and-phone")
      } catch (error) {
        console.error("[v0] Business creation error:", error)
        setValidationErrors({ general: "Failed to create business. Please try again." })
        message.error("Failed to create business")
      } finally {
        setIsSubmitting(false)
      }
    } else if (step === "voice-and-phone") {
      if (!voicePhoneData.selectedVoice) {
        setValidationErrors({ selectedVoice: "Please select a voice." })
        message.error("Please select a voice")
        return
      }
      if (!voicePhoneData.selectedPhoneNumber) {
        setValidationErrors({ selectedPhoneNumber: "Please select a phone number." })
        message.error("Please select a phone number")
        return
      }

      setIsSubmitting(true)
      try {
        const selectedPhone = availablePhoneNumbers.find((p) => p.number === voicePhoneData.selectedPhoneNumber)
        if (!selectedPhone) {
          throw new Error("Selected phone number not found")
        }

        await assignPhoneNumberToBusiness(business?._id!, {
          vapiPhoneNumberId: selectedPhone.id,
          vapiPhoneNumber: selectedPhone.number,
          voiceId: voicePhoneData.selectedVoice,
          agentName: businessData.agentName,
          categoryId: voicePhoneData.categoryId,
        })

        console.log("[v0] Phone number assigned successfully")
        message.success("Setup completed successfully!")
        router.push("/dashboard")
      } catch (error) {
        console.error("[v0] Phone number assignment error:", error)
        setValidationErrors({ general: "Failed to complete setup. Please try again." })
        message.error("Failed to complete setup")
      } finally {
        setIsSubmitting(false)
      }
    }
  }

  if (isLoading || loading) {
    return (
      <div className="w-full mt-5 mx-auto p-4 md:p-8">
        <Card className="shadow-lg">
          <div className="flex items-center justify-center min-h-96">
            <div className="text-center space-y-4">
              <Spin size="large" />
              <p className="text-gray-600">Loading your profile...</p>
            </div>
          </div>
        </Card>
      </div>
    )
  }

  // Helper for step progression look
  const stepConfig = [
    { key: "profile", title: "Personal Profile", emoji: "👤" },
    { key: "business", title: "Business Information", emoji: "🏢" },
    { key: "voice-and-phone", title: "Agent Configuration", emoji: "🎙️" },
  ]

  const currentStepIndex = stepConfig.findIndex((s) => s.key === currentStep)

  const ProfileContent = (
    <>
      <h2 className="text-2xl font-semibold text-gray-800 mb-6">👤 Personal Profile</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-1 flex flex-col items-center p-4 bg-gray-50 rounded-lg border border-gray-200">
          <div className="mb-4 relative w-32 h-32">
            {avatarPreview ? (
              <img
                src={avatarPreview || "/placeholder.svg"}
                alt="Profile avatar"
                className="w-full h-full rounded-full object-cover border-4 border-orange-500 shadow-md"
              />
            ) : (
              <div className="w-full h-full rounded-full bg-gray-300 border-4 border-gray-400 flex items-center justify-center text-gray-600 text-sm font-medium">
                <svg
                  className="w-8 h-8"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                  ></path>
                </svg>
              </div>
            )}
          </div>
          <Upload accept="image/*" maxCount={1} beforeUpload={handleAvatarChange} showUploadList={false}>
            <Button icon={<UploadOutlined />} loading={isUploadingAvatar} className="w-full" type="primary" danger>
              {isUploadingAvatar ? "Uploading..." : "Upload Image"}
            </Button>
          </Upload>
          {validationErrors.avatar && <p className="text-xs text-red-500 mt-2">{validationErrors.avatar}</p>}
        </div>

        <div className="md:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="flex flex-col space-y-2">
            <label className="text-gray-700 font-medium">
              Full Name <span className="text-red-500">*</span>
            </label>
            <Input
              type="text"
              value={formData.name}
              onChange={(e: any) => handleFormInputChange("name", e.target.value)}
              placeholder="Enter your full name"
              status={validationErrors.name ? "error" : ""}
            />
            {validationErrors.name && <p className="text-xs text-red-500">{validationErrors.name}</p>}
          </div>

          <div className="flex flex-col space-y-2">
            <label className="text-gray-700 font-medium">
              Phone Number <span className="text-red-500">*</span>
            </label>
            <Input
              type="tel"
              value={formData.phone}
              onChange={(e: any) => handleFormInputChange("phone", e.target.value)}
              placeholder="+1 555-123-4567"
              status={validationErrors.phone ? "error" : ""}
            />
            {validationErrors.phone && <p className="text-xs text-red-500">{validationErrors.phone}</p>}
          </div>

          <div className="flex flex-col space-y-2 sm:col-span-2">
            <label className="text-gray-700 font-medium">
              Country / Region <span className="text-red-500">*</span>
            </label>
            <Select
              value={formData.country || undefined}
              onChange={(value: any) => handleFormInputChange("country", value)}
              placeholder="Select your country"
              status={validationErrors.country ? "error" : ""}
              filterOption={(input: any, option: any) => (option?.label ?? "").toLowerCase().includes(input.toLowerCase())}
              options={countries.map((country) => ({
                label: `${country.flag} ${country.name}`,
                value: country.name,
              }))}
            />
            {validationErrors.country && <p className="text-xs text-red-500">{validationErrors.country}</p>}
          </div>

          <div className="flex flex-col space-y-2 sm:col-span-2">
            <label className="text-gray-700 font-medium">
              Brief Bio <span className="text-red-500">*</span>
            </label>
            <Input.TextArea
              value={formData.bio}
              onChange={(e: any) => handleFormInputChange("bio", e.target.value)}
              placeholder="A short summary about your role or what you do (max 150 words)"
              rows={4}
              status={validationErrors.bio ? "error" : ""}
            />
            {validationErrors.bio && <p className="text-xs text-red-500">{validationErrors.bio}</p>}
          </div>
        </div>
      </div>
    </>
  )

  const BusinessContent = (
    <>
      <h2 className="text-2xl font-semibold text-gray-800 mb-6">🏢 Business Information</h2>
      <p className="text-gray-600 mb-6">Define the core identity of your AI-powered service.</p>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="flex flex-col space-y-2 md:col-span-2">
          <label className="text-gray-700 font-medium">
            Business Name <span className="text-red-500">*</span>
          </label>
          <Input
            type="text"
            value={businessData.name}
            onChange={(e: any) => handleBusinessInputChange("name", e.target.value)}
            placeholder="e.g., Nexus AI Solutions"
            status={validationErrors.name ? "error" : ""}
          />
          {validationErrors.name && <p className="text-xs text-red-500">{validationErrors.name}</p>}
        </div>

        <div className="flex flex-col space-y-2">
          <label className="text-gray-700 font-medium">
            Agent Display Name <span className="text-red-500">*</span>
          </label>
          <Input
            type="text"
            value={businessData.agentName}
            onChange={(e: any) => handleBusinessInputChange("agentName", e.target.value)}
            placeholder="The name customers will hear (e.g., Alex)"
            status={validationErrors.agentName ? "error" : ""}
          />
          {validationErrors.agentName && <p className="text-xs text-red-500">{validationErrors.agentName}</p>}
        </div>

        <div className="flex flex-col space-y-2">
          <label className="text-gray-700 font-medium">
            Primary Market / Country <span className="text-red-500">*</span>
          </label>
          <Select
            value={businessData.country || undefined}
            onChange={(value: any) => handleBusinessInputChange("country", value)}
            placeholder="Select primary market country"
            status={validationErrors.country ? "error" : ""}
            filterOption={(input: any, option: any) => (option?.label ?? "").toLowerCase().includes(input.toLowerCase())}
            options={countries.map((country) => ({
              label: `${country.flag} ${country.name}`,
              value: country.name,
            }))}
          />
          {validationErrors.country && <p className="text-xs text-red-500">{validationErrors.country}</p>}
        </div>

        <div className="flex flex-col space-y-2 md:col-span-2">
          <label className="text-gray-700 font-medium">
            Business Description / Context <span className="text-red-500">*</span>
          </label>
          <Input.TextArea
            value={businessData.description}
            onChange={(e: any) => handleBusinessInputChange("description", e.target.value)}
            placeholder="Provide a detailed description of your business, services, and core policies. This will train your AI agent."
            rows={6}
            status={validationErrors.description ? "error" : ""}
          />
          {validationErrors.description && <p className="text-xs text-red-500">{validationErrors.description}</p>}
        </div>
      </div>
    </>
  )

  const VoicePhoneContent = (
    <>
      <h2 className="text-2xl font-semibold text-gray-800 mb-6">🎙️ Agent Configuration</h2>
      <p className="text-gray-600 mb-6">Select the voice and official phone number for your AI agent.</p>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="flex flex-col space-y-2">
          <label className="text-gray-700 font-medium">
            Agent Gender <span className="text-red-500">*</span>
          </label>
          <Select
            value={voicePhoneData.selectedGender}
            onChange={(value: any) => {
              setVoicePhoneData((prev) => ({ ...prev, selectedGender: value as "male" | "female", selectedVoice: "" }))
              fetchVoicesByGender(value as "male" | "female")
            }}
            options={[
              { label: "Male Voice", value: "male" },
              { label: "Female Voice", value: "female" },
            ]}
          />
        </div>

        <div className="flex flex-col space-y-2">
          <label className="text-gray-700 font-medium">
            Voice Style <span className="text-red-500">*</span>
          </label>
          <Select
            value={voicePhoneData.selectedVoice || undefined}
            onChange={(value: any) => setVoicePhoneData((prev) => ({ ...prev, selectedVoice: value }))}
            disabled={voices.length === 0}
            placeholder={
              voices.length === 0
                ? `Loading ${voicePhoneData.selectedGender} voices...`
                : `Select a ${voicePhoneData.selectedGender} voice`
            }
            status={validationErrors.selectedVoice ? "error" : ""}
            options={
              voices.length > 0
                ? voices.map((voice) => ({
                    label: voice.name,
                    value: voice._id,
                  }))
                : []
            }
          />
          {validationErrors.selectedVoice && <p className="text-xs text-red-500">{validationErrors.selectedVoice}</p>}
        </div>

        <div className="flex flex-col space-y-2">
          <label className="text-gray-700 font-medium">
            Business Category <span className="text-red-500">*</span>
          </label>
          <Select
            value={voicePhoneData.categoryId}
            onChange={(value: any) => setVoicePhoneData((prev) => ({ ...prev, categoryId: value }))}
            options={[
              { label: "E-commerce", value: "ecommerce" },
              { label: "Fashion", value: "fashion" },
              { label: "Electronics", value: "electronics" },
              { label: "Restaurants", value: "restaurants" },
              { label: "Hospitals/Healthcare", value: "hospitals" },
              { label: "Banks/Finance", value: "banks" },
            ]}
          />
        </div>

        <div className="flex flex-col space-y-2">
          <label className="text-gray-700 font-medium">
            Dedicated Phone Number <span className="text-red-500">*</span>
          </label>
          <Select
            value={voicePhoneData.selectedPhoneNumber || undefined}
            onChange={(value: any) => setVoicePhoneData((prev) => ({ ...prev, selectedPhoneNumber: value }))}
            placeholder="Select a dedicated number"
            status={validationErrors.selectedPhoneNumber ? "error" : ""}
            options={
              availablePhoneNumbers.length > 0
                ? availablePhoneNumbers.map((phone) => ({
                    label: `${phone.number} ${phone.country ? `(${phone.country})` : ""}`,
                    value: phone.number,
                  }))
                : []
            }
          />
          {validationErrors.selectedPhoneNumber && (
            <p className="text-xs text-red-500">{validationErrors.selectedPhoneNumber}</p>
          )}
        </div>
      </div>
    </>
  )

  const getNextButtonConfig = () => {
    if (currentStep === "profile") {
      return { text: isSubmitting ? "Validating..." : "Next: Business Setup" }
    }
    if (currentStep === "business") {
      return { text: isSubmitting ? "Saving..." : "Next: Agent Configuration" }
    }
    return { text: isSubmitting ? "Finalizing..." : "Complete Setup" }
  }

  const { text: nextButtonText } = getNextButtonConfig()

  return (
    <div className="w-full mt-5 mx-auto p-4 md:p-8">
      <Card className="shadow-lg">
        <header className="space-y-2 mb-6 pb-4 border-b">
          <h1 className="text-2xl font-bold text-gray-900">AI Agent Onboarding</h1>
          <p className="text-sm text-gray-500">
            Set up your profile, define your business, and configure your intelligent agent in three easy steps.
          </p>
        </header>

        <div className="mb-8">
          <Steps
            current={currentStepIndex}
            items={stepConfig.map((step, index) => ({
              title: step.title,
              icon: <span className="text-lg">{step.emoji}</span>,
              status: index < currentStepIndex ? "finish" : index === currentStepIndex ? "process" : "wait",
            }))}
          />
        </div>

        <div className="py-8">
          {currentStep === "profile" && ProfileContent}
          {currentStep === "business" && BusinessContent}
          {currentStep === "voice-and-phone" && VoicePhoneContent}
        </div>

        <div className="flex justify-between items-center pt-4 border-t">
          {currentStep !== "profile" && (
            <Button
              onClick={() => setCurrentStep(currentStep === "business" ? "profile" : "business")}
              disabled={isSubmitting}
            >
              ← Back
            </Button>
          )}
          <div className={currentStep === "profile" ? "ml-auto" : ""}>
            {validationErrors.general && <p className="text-sm text-red-500 mb-2">{validationErrors.general}</p>}
            <Button
              type="primary"
              danger
              onClick={() => handleNextStep(currentStep)}
              disabled={isSubmitting || isUploadingAvatar}
              loading={isSubmitting}
            >
              {nextButtonText}
            </Button>
          </div>
        </div>
      </Card>
    </div>
  )
}
