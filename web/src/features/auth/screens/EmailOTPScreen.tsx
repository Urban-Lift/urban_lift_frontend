import { useState, useEffect, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft, Mail } from 'lucide-react'
import toast from 'react-hot-toast'
import { OTPInput } from '@/components/ui'
import { useAuthStore } from '@/store/auth.store'
import { authService } from '@/services/auth.service'
import { OTP_RESEND_SECONDS } from '@/utils/constants'
import { cn } from '@/utils/cn'

export default function EmailOTPScreen() {
  const navigate = useNavigate()
  const { pendingEmail, pendingRole } = useAuthStore()

  const [otp, setOtp]             = useState('')
  const [loading, setLoading]     = useState(false)
  const [resending, setResending] = useState(false)
  const [countdown, setCountdown] = useState(OTP_RESEND_SECONDS)
  const [error, setError]         = useState('')

  useEffect(() => {
    if (!pendingEmail) { navigate('/auth/login', { replace: true }); return }
  }, [pendingEmail, navigate])

  useEffect(() => {
    if (countdown <= 0) return
    const t = setTimeout(() => setCountdown(c => c - 1), 1000)
    return () => clearTimeout(t)
  }, [countdown])

  const handleVerify = useCallback(async (code: string) => {
    if (code.length !== 6) return
    setError('')
    setLoading(true)
    try {
      await authService.verifyEmailCode(pendingEmail, code)
      toast.success('Email verified!')
      navigate(pendingRole === 'driver' ? '/driver/dashboard' : '/passenger/home', { replace: true })
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Verification failed'
      setError(msg)
      toast.error(msg)
    } finally {
      setLoading(false)
    }
  }, [pendingEmail, pendingRole, navigate])

  async function handleResend() {
    setResending(true)
    try {
      await authService.sendEmailCode(pendingEmail)
      setCountdown(OTP_RESEND_SECONDS)
      setOtp('')
      setError('')
      toast.success('Verification email sent!')
    } catch {
      toast.error('Failed to resend email')
    } finally {
      setResending(false)
    }
  }

  const maskedEmail = pendingEmail.replace(/(?<=.{1}).(?=[^@]*@)/g, '*')

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <div className="flex-1 flex flex-col max-w-sm mx-auto w-full px-6 pt-4 pb-8">
        {/* Back + title */}
        <div className="flex items-center gap-3 pt-2 mb-8">
          <button
            onClick={() => navigate(-1)}
            className="w-9 h-9 flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
          >
            <ArrowLeft size={17} className="text-gray-700" />
          </button>
          <span className="text-sm font-semibold text-gray-900 mx-auto pr-9">UrbanLift</span>
        </div>

        {/* Icon */}
        <div className="flex flex-col items-center mb-7">
          <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mb-5">
            <Mail size={28} className="text-green-700" />
          </div>
          <h1 className="text-2xl font-extrabold text-gray-900 text-center">Check your email</h1>
          <p className="mt-2 text-sm text-gray-500 text-center leading-relaxed">
            We sent a 6-digit code to{' '}
            <span className="font-semibold text-gray-800">{maskedEmail}</span>
          </p>
        </div>

        {/* Spam tip */}
        <div className="mb-6 px-4 py-3 bg-green-50 border border-green-100 rounded-2xl flex items-start gap-2">
          <span className="text-base mt-0.5">📬</span>
          <p className="text-xs text-green-800 leading-relaxed">
            <span className="font-semibold">Tip:</span> Check your spam or junk folder if you don't see the email.
          </p>
        </div>

        {/* Dev hint */}
        <div className="mb-6 px-4 py-2.5 bg-amber-50 border border-amber-200 rounded-2xl text-center">
          <p className="text-xs text-amber-700 font-medium">Dev mode — no real email sent. Enter any 6 digits.</p>
        </div>

        {/* OTP Input */}
        <OTPInput
          value={otp}
          onChange={val => { setOtp(val); setError(''); if (val.length === 6) handleVerify(val) }}
          error={error}
          disabled={loading}
        />

        {/* Resend */}
        <div className="flex items-center justify-center mt-6 text-sm">
          {countdown > 0 ? (
            <span className="text-gray-400">
              Resend in <span className="font-semibold text-gray-600">{countdown}s</span>
            </span>
          ) : (
            <button
              onClick={handleResend}
              disabled={resending}
              className="text-green-700 font-semibold hover:underline disabled:opacity-50"
            >
              {resending ? 'Sending…' : 'Resend email'}
            </button>
          )}
        </div>

        <div className="flex-1 min-h-6" />

        {/* Verify button */}
        <button
          onClick={() => handleVerify(otp)}
          disabled={otp.length !== 6 || loading}
          className={cn(
            'w-full h-14 rounded-2xl font-bold text-base flex items-center justify-center gap-2 transition-all mb-4',
            otp.length === 6 && !loading
              ? 'bg-green-500 hover:bg-green-600 text-white shadow-md shadow-green-500/30'
              : 'bg-gray-200 text-gray-400 cursor-not-allowed',
          )}
        >
          {loading ? (
            <div className="w-5 h-5 border-2 border-white/40 border-t-white rounded-full animate-spin" />
          ) : (
            <>Verify Email <span className="text-lg">→</span></>
          )}
        </button>

        <button
          onClick={() => navigate(-1)}
          className="text-center text-sm text-gray-400 hover:text-gray-600 mb-2"
        >
          Skip for now
        </button>
      </div>
    </div>
  )
}
