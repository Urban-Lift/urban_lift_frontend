import { useState, useEffect, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft, Smartphone } from 'lucide-react'
import toast from 'react-hot-toast'
import { OTPInput } from '@/components/ui'
import { useAuthStore } from '@/store/auth.store'
import { authService } from '@/services/auth.service'
import { OTP_RESEND_SECONDS } from '@/utils/constants'
import { maskPhone } from '@/utils/format'
import { cn } from '@/utils/cn'

export default function PhoneOTPScreen() {
  const navigate  = useNavigate()
  const { pendingPhone, pendingRole } = useAuthStore()

  const [otp, setOtp]             = useState('')
  const [loading, setLoading]     = useState(false)
  const [resending, setResending] = useState(false)
  const [countdown, setCountdown] = useState(OTP_RESEND_SECONDS)
  const [error, setError]         = useState('')

  useEffect(() => {
    if (!pendingPhone) { navigate('/auth/login', { replace: true }); return }
  }, [pendingPhone, navigate])

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
      const { token } = await authService.verifyPhoneOTP(pendingPhone, code)
      if (pendingRole === 'passenger') {
        navigate('/auth/setup/passenger', { state: { token } })
      } else {
        navigate('/auth/setup/driver', { state: { token } })
      }
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Verification failed'
      setError(msg)
      toast.error(msg)
    } finally {
      setLoading(false)
    }
  }, [pendingPhone, pendingRole, navigate])

  async function handleResend() {
    setResending(true)
    try {
      await authService.sendOTP(pendingPhone, pendingRole)
      setCountdown(OTP_RESEND_SECONDS)
      setOtp('')
      setError('')
      toast.success('OTP sent again!')
    } catch {
      toast.error('Failed to resend OTP')
    } finally {
      setResending(false)
    }
  }

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
            <Smartphone size={28} className="text-green-700" />
          </div>
          <h1 className="text-2xl font-extrabold text-gray-900 text-center">Verify your number</h1>
          <p className="mt-2 text-sm text-gray-500 text-center leading-relaxed">
            Enter the 6-digit code sent to{' '}
            <span className="font-semibold text-gray-800">{maskPhone(pendingPhone)}</span>
          </p>
        </div>

        {/* Dev hint */}
        <div className="mb-6 px-4 py-2.5 bg-amber-50 border border-amber-200 rounded-2xl text-center">
          <p className="text-xs text-amber-700 font-medium">Dev mode — no real SMS sent. Enter any 6 digits.</p>
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
              Resend code in <span className="font-semibold text-gray-600">{countdown}s</span>
            </span>
          ) : (
            <button
              onClick={handleResend}
              disabled={resending}
              className="text-green-700 font-semibold hover:underline disabled:opacity-50"
            >
              {resending ? 'Sending…' : 'Resend OTP'}
            </button>
          )}
        </div>

        <div className="flex-1 min-h-6" />

        {/* Verify button */}
        <button
          onClick={() => handleVerify(otp)}
          disabled={otp.length !== 6 || loading}
          className={cn(
            'w-full h-14 rounded-2xl font-bold text-base flex items-center justify-center gap-2 transition-all mb-5',
            otp.length === 6 && !loading
              ? 'bg-green-500 hover:bg-green-600 text-white shadow-md shadow-green-500/30'
              : 'bg-gray-200 text-gray-400 cursor-not-allowed',
          )}
        >
          {loading ? (
            <div className="w-5 h-5 border-2 border-white/40 border-t-white rounded-full animate-spin" />
          ) : (
            <>Verify & Continue <span className="text-lg">→</span></>
          )}
        </button>

        <p className="text-center text-xs text-gray-400 leading-relaxed">
          Didn't get the code?{' '}
          <span className="text-green-700 font-medium">Check your messages app.</span>
        </p>
      </div>
    </div>
  )
}
