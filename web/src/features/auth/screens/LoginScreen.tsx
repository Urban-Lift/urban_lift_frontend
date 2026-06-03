import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft, User, Car } from 'lucide-react'
import toast from 'react-hot-toast'
import { useAuthStore } from '@/store/auth.store'
import { authService } from '@/services/auth.service'
import type { UserRole } from '@/types'
import { cn } from '@/utils/cn'

const ROLES: { value: UserRole; label: string; icon: typeof User }[] = [
  { value: 'passenger', label: 'Passenger', icon: User },
  { value: 'driver',    label: 'Driver',    icon: Car  },
]

export default function LoginScreen() {
  const navigate = useNavigate()
  const { setPendingPhone, setPendingRole } = useAuthStore()

  const [role, setRole]       = useState<UserRole>('passenger')
  const [phone, setPhone]     = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError]     = useState('')

  const rawPhone  = phone.replace(/\D/g, '')
  const fullPhone = rawPhone.startsWith('0')
    ? `+233${rawPhone.slice(1)}`
    : rawPhone.startsWith('233')
    ? `+${rawPhone}`
    : `+233${rawPhone}`

  const isValid = rawPhone.length >= 9 && rawPhone.length <= 10

  async function handleContinue() {
    if (!isValid) {
      setError('Enter a valid Ghana phone number (e.g. 054 123 4567)')
      return
    }
    setError('')
    setLoading(true)
    try {
      await authService.sendOTP(fullPhone, role)
      setPendingPhone(fullPhone)
      setPendingRole(role)
      navigate('/auth/otp/phone')
    } catch {
      toast.error('Failed to send OTP. Please try again.')
    } finally {
      setLoading(false)
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

        {/* Heading */}
        <div className="mb-7">
          <h1 className="text-2xl font-extrabold text-gray-900">Let's get started</h1>
          <p className="mt-1.5 text-sm text-gray-500 leading-relaxed">
            Choose your role and enter your number to begin.
          </p>
        </div>

        {/* I am a — role tabs */}
        <div className="mb-7">
          <p className="text-sm font-medium text-gray-700 mb-2.5">I am a</p>
          <div className="flex gap-3 bg-gray-100 p-1 rounded-2xl">
            {ROLES.map(({ value, label, icon: Icon }) => (
              <button
                key={value}
                onClick={() => setRole(value)}
                className={cn(
                  'flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-semibold transition-all',
                  role === value
                    ? 'bg-white text-gray-900 shadow-sm'
                    : 'text-gray-500 hover:text-gray-700'
                )}
              >
                <Icon size={15} strokeWidth={2} />
                {label}
              </button>
            ))}
          </div>
        </div>

        {/* Phone Number */}
        <div className="mb-2">
          <label className="block text-sm font-semibold text-gray-800 mb-2">
            Phone Number
          </label>
          <div className={cn(
            'flex items-stretch border-2 rounded-2xl bg-white overflow-hidden transition-all',
            error
              ? 'border-red-400'
              : 'border-gray-200 focus-within:border-green-600',
          )}>
            {/* Ghana flag + prefix */}
            <div className="flex items-center gap-2 px-3.5 bg-gray-50 border-r border-gray-200 shrink-0">
              <span className="text-base leading-none">🇬🇭</span>
              <span className="text-sm font-bold text-gray-800">+233</span>
              <svg className="w-3 h-3 text-gray-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="m6 9 6 6 6-6"/>
              </svg>
            </div>
            <input
              type="tel"
              inputMode="tel"
              placeholder="020 123 4567"
              value={phone}
              onChange={e => { setPhone(e.target.value); setError('') }}
              onKeyDown={e => e.key === 'Enter' && handleContinue()}
              className="flex-1 py-3.5 px-3 text-sm text-gray-900 placeholder:text-gray-400 bg-transparent outline-none min-w-0"
            />
          </div>
          {error
            ? <p className="text-xs text-red-500 mt-1.5 font-medium">{error}</p>
            : <p className="text-xs text-gray-400 mt-1.5">Standard message and data rates may apply.</p>
          }
        </div>

        <div className="flex-1 min-h-6" />

        {/* Continue button */}
        <button
          onClick={handleContinue}
          disabled={!isValid || loading}
          className={cn(
            'w-full h-14 rounded-2xl font-bold text-base flex items-center justify-center gap-2 transition-all mb-5',
            isValid && !loading
              ? 'bg-green-500 hover:bg-green-600 text-white shadow-md shadow-green-500/30'
              : 'bg-gray-200 text-gray-400 cursor-not-allowed'
          )}
        >
          {loading ? (
            <div className="w-5 h-5 border-2 border-white/40 border-t-white rounded-full animate-spin" />
          ) : (
            <>Continue <span className="text-lg">→</span></>
          )}
        </button>

        {/* Or continue with */}
        <div className="flex items-center gap-3 mb-5">
          <div className="flex-1 h-px bg-gray-200" />
          <span className="text-xs text-gray-400 font-medium">Or continue with</span>
          <div className="flex-1 h-px bg-gray-200" />
        </div>

        {/* Google login */}
        <button
          onClick={() => toast('Google login coming soon!')}
          className="w-full h-13 border-2 border-gray-200 rounded-2xl flex items-center justify-center gap-3 hover:bg-gray-50 transition-colors mb-8"
        >
          <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none">
            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
          </svg>
          <span className="text-sm font-semibold text-gray-700">Login with Google</span>
        </button>

        {/* Terms */}
        <p className="text-center text-xs text-gray-400 leading-relaxed">
          By continuing, you agree to our{' '}
          <span className="text-green-700 font-medium cursor-pointer hover:underline">Terms of Service</span>
          {' '}and{' '}
          <span className="text-green-700 font-medium cursor-pointer hover:underline">Privacy Policy</span>.
        </p>
      </div>
    </div>
  )
}
