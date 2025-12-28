"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Spinner } from "@/components/ui/spinner"
import { useToast } from "@/hooks/use-toast"
import { usePasswordStore } from "@/store/password-store"
import { Lock, Shield, AlertCircle, CheckCircle2, Eye, EyeOff } from "lucide-react"

export default function SecurityContent() {
  const { toast } = useToast()
  const { loading, error, success, changePassword, resetSuccess } = usePasswordStore()
  const [showPasswords, setShowPasswords] = useState({
    oldPassword: false,
    password: false,
    confirmPassword: false,
  })
  const [formData, setFormData] = useState({
    oldPassword: "",
    password: "",
    confirmPassword: "",
  })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [showSuccessMessage, setShowSuccessMessage] = useState(false)

  useEffect(() => {
    if (success && showSuccessMessage) {
      const timer = setTimeout(() => {
        setShowSuccessMessage(false)
      }, 5000)
      return () => clearTimeout(timer)
    }
  }, [success, showSuccessMessage])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }))
    }
  }

  const togglePasswordVisibility = (field: keyof typeof showPasswords) => {
    setShowPasswords((prev) => ({ ...prev, [field]: !prev[field] }))
  }

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.oldPassword) newErrors.oldPassword = "Old password is required"
    if (!formData.password) newErrors.password = "New password is required"
    if (formData.password.length < 8) newErrors.password = "Password must be at least 8 characters"
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) return

    try {
      await changePassword(formData.oldPassword, formData.password, formData.confirmPassword)

      setShowSuccessMessage(true)

      toast({
        title: "Success",
        message: "Password changed successfully",
        type: "success",
      })

      setFormData({ oldPassword: "", password: "", confirmPassword: "" })
      resetSuccess()
    } catch (err) {
      toast({
        title: "Error",
        message: error || "Failed to change password",
        type: "error",
      })
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-6 md:p-8">
      <div className="max-w-full mx-auto">
        <div className="space-y-2 mb-8">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Lock className="w-6 h-6 text-blue-600" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900">Security Settings</h1>
          </div>
          <p className="text-gray-600 ml-11">
            Keep your account secure by managing your password and security preferences
          </p>
        </div>

        {showSuccessMessage && (
          <div className="mb-6 bg-green-50 border border-green-200 rounded-xl p-4 flex gap-3 items-start animate-in fade-in slide-in-from-top-2 duration-300">
            <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="font-semibold text-green-900">Password Changed Successfully!</p>
              <p className="text-green-800 text-sm mt-1">
                Your password has been updated. Please use your new password for future logins.
              </p>
            </div>
            <button
              onClick={() => setShowSuccessMessage(false)}
              className="text-green-600 hover:text-green-700 font-semibold text-sm"
            >
              ✕
            </button>
          </div>
        )}

        <div className="mb-8 bg-blue-50 border-l-4 border-blue-500 rounded-lg p-4 flex gap-4">
          <Shield className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
          <div>
            <p className="font-semibold text-blue-900 text-sm">Strong Password Required</p>
            <p className="text-blue-800 text-sm mt-1">
              Use a password with at least 8 characters including uppercase, lowercase, numbers, and special characters
            </p>
          </div>
        </div>

        <form
          onSubmit={handleChangePassword}
          className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 md:p-8 space-y-6"
        >
          <div className="space-y-2">
            <Label htmlFor="oldPassword" className="font-semibold text-gray-900">
              Current Password
            </Label>
            <div className="relative">
              <Input
                id="oldPassword"
                name="oldPassword"
                type={showPasswords.oldPassword ? "text" : "password"}
                placeholder="Enter your current password"
                value={formData.oldPassword}
                onChange={handleInputChange}
                disabled={loading}
                className={`pr-10 h-11 rounded-lg border-2 transition-colors ${
                  errors.oldPassword ? "border-red-300 focus:border-red-500" : "border-gray-200 focus:border-blue-500"
                }`}
              />
              <button
                type="button"
                onClick={() => togglePasswordVisibility("oldPassword")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
              >
                {showPasswords.oldPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            {errors.oldPassword && (
              <div className="flex gap-2 items-center text-red-600 text-sm mt-2">
                <AlertCircle className="w-4 h-4" />
                {errors.oldPassword}
              </div>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="password" className="font-semibold text-gray-900">
              New Password
            </Label>
            <div className="relative">
              <Input
                id="password"
                name="password"
                type={showPasswords.password ? "text" : "password"}
                placeholder="Enter a strong new password"
                value={formData.password}
                onChange={handleInputChange}
                disabled={loading}
                className={`pr-10 h-11 rounded-lg border-2 transition-colors ${
                  errors.password ? "border-red-300 focus:border-red-500" : "border-gray-200 focus:border-blue-500"
                }`}
              />
              <button
                type="button"
                onClick={() => togglePasswordVisibility("password")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
              >
                {showPasswords.password ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            {errors.password && (
              <div className="flex gap-2 items-center text-red-600 text-sm mt-2">
                <AlertCircle className="w-4 h-4" />
                {errors.password}
              </div>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="confirmPassword" className="font-semibold text-gray-900">
              Confirm Password
            </Label>
            <div className="relative">
              <Input
                id="confirmPassword"
                name="confirmPassword"
                type={showPasswords.confirmPassword ? "text" : "password"}
                placeholder="Re-enter your new password"
                value={formData.confirmPassword}
                onChange={handleInputChange}
                disabled={loading}
                className={`pr-10 h-11 rounded-lg border-2 transition-colors ${
                  errors.confirmPassword
                    ? "border-red-300 focus:border-red-500"
                    : "border-gray-200 focus:border-blue-500"
                }`}
              />
              <button
                type="button"
                onClick={() => togglePasswordVisibility("confirmPassword")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
              >
                {showPasswords.confirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            {errors.confirmPassword && (
              <div className="flex gap-2 items-center text-red-600 text-sm mt-2">
                <AlertCircle className="w-4 h-4" />
                {errors.confirmPassword}
              </div>
            )}
          </div>

          <Button
            type="submit"
            disabled={loading}
            className="w-full h-11 rounded-lg font-semibold mt-8 bg-blue-600 hover:bg-blue-700 text-white shadow-md hover:shadow-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <>
                <Spinner className="mr-2 h-4 w-4" />
                Updating Security...
              </>
            ) : (
              <>
                <CheckCircle2 className="mr-2 h-4 w-4" />
                Change Password
              </>
            )}
          </Button>
        </form>

        <div className="mt-8 bg-gradient-to-br from-green-50 to-emerald-50 border border-green-200 rounded-xl p-6 space-y-4">
          <div className="flex items-center gap-2">
            <Shield className="w-5 h-5 text-green-600" />
            <h3 className="font-bold text-gray-900 text-lg">Password Security Tips</h3>
          </div>
          <ul className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <li className="flex gap-3">
              <span className="text-green-600 font-bold flex-shrink-0">✓</span>
              <span className="text-gray-700 text-sm">Use at least 8 characters</span>
            </li>
            <li className="flex gap-3">
              <span className="text-green-600 font-bold flex-shrink-0">✓</span>
              <span className="text-gray-700 text-sm">Mix uppercase and lowercase</span>
            </li>
            <li className="flex gap-3">
              <span className="text-green-600 font-bold flex-shrink-0">✓</span>
              <span className="text-gray-700 text-sm">Include numbers and symbols</span>
            </li>
            <li className="flex gap-3">
              <span className="text-green-600 font-bold flex-shrink-0">✓</span>
              <span className="text-gray-700 text-sm">Avoid personal information</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  )
}
