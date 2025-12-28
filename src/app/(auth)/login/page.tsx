"use client"

import type React from "react"
import { useState } from "react"
import Image from "next/image"
import { Eye, EyeOff } from 'lucide-react'
import adoraLogo from "../../../../public/adora3-logo.png"
import google from "../../../../public/google.webp"
import Link from "next/link"
import { useRouter } from 'next/navigation'
import { useAuthStore } from "@/store/auth-store"

interface InputFieldProps {
  label: string
  type?: string
  placeholder?: string
  showPasswordToggle?: boolean
  isPasswordVisible?: boolean
  onTogglePassword?: () => void
  value?: string
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void
  name?: string
}

const InputField: React.FC<InputFieldProps> = ({
  label,
  type = "text",
  placeholder = "",
  showPasswordToggle = false,
  isPasswordVisible = false,
  onTogglePassword,
  value,
  onChange,
  name,
}) => (
  <div className="mb-6">
    <label className="block text-gray-600 mb-2 text-sm">{label}</label>
    <div className="relative">
      <input
        type={showPasswordToggle ? (isPasswordVisible ? "text" : "password") : type}
        className="w-full p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        name={name}
      />
      {showPasswordToggle && (
        <button
          type="button"
          onClick={onTogglePassword}
          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
        >
          {isPasswordVisible ? <EyeOff size={20} /> : <Eye size={20} />}
        </button>
      )}
    </div>
  </div>
)

interface ButtonProps {
  children: React.ReactNode
  variant?: "primary" | "secondary"
  onClick?: () => void
  className?: string
  disabled?: boolean
  type?: "button" | "submit"
}

const Button: React.FC<ButtonProps> = ({
  children,
  variant = "primary",
  onClick,
  className = "",
  disabled = false,
  type = "button",
}) => {
  const baseClasses =
    "w-full py-4 rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
  const variants = {
    primary: "bg-orange-600 hover:bg-orange-700 text-white",
    secondary: "border border-gray-300 hover:bg-gray-50 text-gray-700 flex items-center justify-center gap-2",
  }

  return (
    <button
      onClick={onClick}
      className={`${baseClasses} ${variants[variant]} ${className}`}
      disabled={disabled}
      type={type}
    >
      {children}
    </button>
  )
}

const Logo: React.FC = () => (
  <div className="flex items-center justify-center gap-2 mb-8">
    <Image src={adoraLogo || "/placeholder.svg"} alt="Adora3 Logo" width={100} height={100} />
  </div>
)

const SignInForm: React.FC = () => {
  const [showPassword, setShowPassword] = useState(false)
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  })
  const [error, setError] = useState("")
  const router = useRouter()
  const { login, loading } = useAuthStore()

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    try {
      if (!formData.email || !formData.password) {
        throw new Error("Please fill in all fields")
      }

      await login(formData.email, formData.password)
      router.push("/dashboard")
    } catch (err) {
      setError(err instanceof Error ? err.message : "Login failed")
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 py-8">
      <div className="bg-white rounded-lg shadow-sm p-8 w-full max-w-md">
        <Logo />

        <h1 className="text-3xl font-bold text-gray-900 text-center mb-8">Log Into Your Account</h1>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">{error}</div>
        )}

        <form className="space-y-6" onSubmit={handleSubmit}>
          <InputField
            label="Email Address"
            type="email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
          />

          <div>
            <InputField
              label="Password"
              showPasswordToggle={true}
              isPasswordVisible={showPassword}
              onTogglePassword={() => setShowPassword(!showPassword)}
              name="password"
              value={formData.password}
              onChange={handleInputChange}
            />
            <div className="text-right mt-2">
              <span className="text-orange-500 hover:underline cursor-pointer text-sm">Forgot Password?</span>
            </div>
          </div>

          <Button type="submit" disabled={loading}>
            {loading ? "Signing In..." : "Sign In"}
          </Button>

          <div className="text-center mt-4 text-gray-600 text-sm">
            If you don&lsquo;t have an Account{" "}
            <span className="text-orange-500 hover:underline cursor-pointer font-medium">
              <Link href={"/signup"}>Sign Up</Link>
            </span>
          </div>

          <div className="flex items-center my-6">
            <hr className="flex-1 border-gray-300" />
            <span className="px-4 text-gray-500 text-sm">OR</span>
            <hr className="flex-1 border-gray-300" />
          </div>

          <Button variant="secondary" disabled={loading}>
            <Image src={google || "/placeholder.svg"} alt="Google" width={20} height={20} />
            Sign in with Google
          </Button>
        </form>
      </div>
    </div>
  )
}

export default SignInForm
