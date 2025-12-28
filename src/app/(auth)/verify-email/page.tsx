'use client'

import { useState, useEffect, useRef } from 'react'
import Image from 'next/image'
import { useRouter, useSearchParams } from 'next/navigation'
import adoraLogo from '../../../../public/adora3-logo.png'
import { Button } from '@/components/ui/button'
import { useAuthStore } from '@/store/auth-store'

const VerifyEmailPage = () => {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [email, setEmail] = useState('')
  const [otp, setOtp] = useState(['', '', '', '', '', ''])
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const [resendLoading, setResendLoading] = useState(false)
  const [resendTimer, setResendTimer] = useState(0)
  const otpInputs = useRef<(HTMLInputElement | null)[]>([])
  const { verifyEmail, resendVerification, loading } = useAuthStore()

  useEffect(() => {
    const emailParam = searchParams.get('email')
    if (emailParam) {
      setEmail(decodeURIComponent(emailParam))
    }
  }, [searchParams])

  useEffect(() => {
    if (resendTimer > 0) {
      const timer = setTimeout(() => setResendTimer(resendTimer - 1), 1000)
      return () => clearTimeout(timer)
    }
  }, [resendTimer])

  const handleOtpChange = (index: number, value: string) => {
    if (value.length > 1) return

    const newOtp = [...otp]
    newOtp[index] = value

    setOtp(newOtp)
    setError('')

    // Auto-focus next input
    if (value && index < 5) {
      otpInputs.current[index + 1]?.focus()
    }
  }

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      otpInputs.current[index - 1]?.focus()
    }
  }

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault()
    const otpCode = otp.join('')

    if (otpCode.length !== 6) {
      setError('Please enter a valid 6-digit code')
      return
    }

    try {
      await verifyEmail(otpCode)
      setSuccess(true)
      setTimeout(() => {
        router.push('/login')
      }, 1500)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Verification failed')
    }
  }

  const handleResend = async () => {
    setResendLoading(true)
    setError('')
    setOtp(['', '', '', '', '', ''])
    otpInputs.current[0]?.focus()

    try {
      await resendVerification(email)
      setResendTimer(60)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to resend code')
    } finally {
      setResendLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-white p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="flex justify-center mb-12">
          <Image 
            src={adoraLogo || "/placeholder.svg"} 
            alt="Adora Logo" 
            width={120} 
            height={120}
            className="object-contain"
          />
        </div>

        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Verify Your Email</h1>
          <p className="text-gray-600">
            Enter the 6-digit code we sent to{' '}
            <span className="text-gray-900 font-medium">{email}</span>
          </p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm flex items-start gap-3">
            <span className="text-lg mt-0.5">⚠️</span>
            <span>{error}</span>
          </div>
        )}

        {/* Success Message */}
        {success && (
          <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg text-green-700 text-sm flex items-start gap-3">
            <span className="text-lg mt-0.5">✓</span>
            <span>Email verified successfully! Redirecting...</span>
          </div>
        )}

        {/* OTP Form */}
        <form onSubmit={handleVerify} className="space-y-8">
          {/* OTP Input Fields */}
          <div className="flex justify-center gap-3">
            {otp.map((digit, index) => (
              <input
                key={index}
                ref={(el) => {
                  otpInputs.current[index] = el
                }}
                type="text"
                inputMode="numeric"
                maxLength={1}
                value={digit}
                onChange={(e) => handleOtpChange(index, e.target.value)}
                onKeyDown={(e) => handleKeyDown(index, e)}
                disabled={loading || success}
                className="w-12 h-12 text-center text-xl font-semibold text-gray-900 bg-white border border-gray-300 rounded-lg focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 transition-all placeholder-gray-400 disabled:opacity-50"
              />
            ))}
          </div>

          {/* Submit Button */}
          <Button
            type="submit"
            disabled={loading || success || otp.join('').length !== 6}
            className="w-full h-12 bg-orange-600 hover:bg-orange-700 text-white font-semibold rounded-lg transition-colors disabled:opacity-50"
          >
            {loading ? (
              <span className="flex items-center gap-2">
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Verifying...
              </span>
            ) : (
              'Verify Email'
            )}
          </Button>
        </form>

        {/* Resend Section */}
        <div className="mt-8 text-center">
          <p className="text-gray-600 text-sm mb-4">Didn't receive the code?</p>
          <Button
            type="button"
            onClick={handleResend}
            disabled={resendLoading || resendTimer > 0 || loading}
            variant="outline"
            className="w-full h-12 border border-gray-300 hover:border-gray-400 text-gray-900 hover:bg-gray-50 rounded-lg transition-colors disabled:opacity-50"
          >
            {resendLoading ? (
              <span className="flex items-center gap-2">
                <span className="w-4 h-4 border-2 border-gray-900/30 border-t-gray-900 rounded-full animate-spin" />
                Sending...
              </span>
            ) : resendTimer > 0 ? (
              `Resend in ${resendTimer}s`
            ) : (
              'Resend Code'
            )}
          </Button>
        </div>

        {/* Sign In Link */}
        <div className="mt-8 text-center">
          <p className="text-gray-600 text-sm">
            Already verified?{" "}
            <a href="/login" className="text-orange-600 hover:text-orange-700 font-medium transition-colors">
              Sign In
            </a>
          </p>
        </div>
      </div>
    </div>
  )
}

export default VerifyEmailPage
