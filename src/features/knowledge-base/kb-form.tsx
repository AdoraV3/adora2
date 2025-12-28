"use client"

import { useState } from "react"
import { useAuthStore } from "@/store/auth-store"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export function KnowledgeBaseFormComponent({ businessId, onSuccess }: { businessId: string; onSuccess?: () => void }) {
  const { loading } = useAuthStore()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    fileUrl: "",
    fileType: "text",
  })

  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({})

  const validateForm = (): boolean => {
    const errors: Record<string, string> = {}

    if (!formData.title.trim()) errors.title = "Title is required"
    if (!formData.content.trim()) errors.content = "Content is required"

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

  const handleSubmit = async () => {
    if (!validateForm()) return

    setIsSubmitting(true)
    try {
      console.log("[v0] Creating knowledge base entry:", formData.title)

      const response = await fetch("http://localhost:5000/api/knowledge-base", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("auth-store") || ""}`,
        },
        body: JSON.stringify({
          businessId,
          ...formData,
        }),
      })

      if (!response.ok) throw new Error("Failed to create knowledge base entry")

      console.log("[v0] Knowledge base entry created")
      alert("Knowledge base entry created successfully!")

      setFormData({ title: "", content: "", fileUrl: "", fileType: "text" })
      if (onSuccess) onSuccess()
    } catch (error) {
      console.error("[v0] Failed to create KB entry:", error)
      alert(error instanceof Error ? error.message : "Failed to create entry")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Card className="p-6 space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-gray-900 mb-2">Add Knowledge Base</h2>
        <p className="text-sm text-gray-600">Train your AI agent with business knowledge and FAQs</p>
      </div>

      <div className="space-y-6">
        {/* Title */}
        <div className="flex flex-col space-y-2">
          <Label htmlFor="title" className="text-gray-700 font-medium">
            Title *
          </Label>
          <Input
            id="title"
            type="text"
            value={formData.title}
            onChange={(e) => handleInputChange("title", e.target.value)}
            placeholder="e.g., Return Policy, Shipping Information"
            className={`bg-gray-50 ${validationErrors.title ? "border-red-500" : ""}`}
          />
          {validationErrors.title && <p className="text-sm text-red-500">{validationErrors.title}</p>}
        </div>

        {/* Content */}
        <div className="flex flex-col space-y-2">
          <Label htmlFor="content" className="text-gray-700 font-medium">
            Content *
          </Label>
          <textarea
            id="content"
            value={formData.content}
            onChange={(e) => handleInputChange("content", e.target.value)}
            placeholder="Enter knowledge base content..."
            className={`bg-gray-50 border border-gray-300 rounded-md p-3 min-h-[150px] focus:outline-none focus:ring-2 focus:ring-orange-500 ${
              validationErrors.content ? "border-red-500" : ""
            }`}
          />
          {validationErrors.content && <p className="text-sm text-red-500">{validationErrors.content}</p>}
        </div>

        {/* File URL (Optional) */}
        <div className="flex flex-col space-y-2">
          <Label htmlFor="fileUrl" className="text-gray-700 font-medium">
            File URL (Optional)
          </Label>
          <Input
            id="fileUrl"
            type="url"
            value={formData.fileUrl}
            onChange={(e) => handleInputChange("fileUrl", e.target.value)}
            placeholder="https://example.com/document.pdf"
            className="bg-gray-50"
          />
        </div>

        {/* File Type */}
        <div className="flex flex-col space-y-2">
          <Label htmlFor="fileType" className="text-gray-700 font-medium">
            File Type
          </Label>
          <select
            id="fileType"
            value={formData.fileType}
            onChange={(e) => handleInputChange("fileType", e.target.value)}
            className="bg-gray-50 border border-gray-300 rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-orange-500"
          >
            <option value="text">Text</option>
            <option value="pdf">PDF</option>
            <option value="document">Document</option>
            <option value="image">Image</option>
          </select>
        </div>
      </div>

      <div className="flex justify-end gap-3">
        <Button
          onClick={handleSubmit}
          disabled={isSubmitting || loading}
          className="px-6 py-2 bg-orange-600 hover:bg-orange-700 text-white font-medium rounded-lg"
        >
          {isSubmitting ? "Creating..." : "Add to Knowledge Base"}
        </Button>
      </div>
    </Card>
  )
}
