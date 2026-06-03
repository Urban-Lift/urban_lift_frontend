import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft, Car, CreditCard, Tag, MessageSquare, Shield } from 'lucide-react'
import toast from 'react-hot-toast'
import { profileService } from '@/services/profile.service'
import { cn } from '@/utils/cn'

interface Category {
  key: string
  label: string
  desc: string
  icon: React.ElementType
  color: string
  bg: string
}

const CATEGORIES: Category[] = [
  { key: 'ride_updates', label: 'Ride Updates',    desc: 'Booking confirmed, driver arrived, trip complete', icon: Car,          color: 'text-green-700',  bg: 'bg-green-50'  },
  { key: 'payments',     label: 'Payments',         desc: 'Top-ups, ride charges, wallet activity',          icon: CreditCard,   color: 'text-blue-600',   bg: 'bg-blue-50'   },
  { key: 'promotions',   label: 'Promotions',       desc: 'Offers, referral rewards, seasonal deals',        icon: Tag,          color: 'text-amber-600',  bg: 'bg-amber-50'  },
  { key: 'community',    label: 'Community',         desc: 'Group messages, new members, shared rides',       icon: MessageSquare,color: 'text-purple-600', bg: 'bg-purple-50' },
  { key: 'safety',       label: 'Safety Alerts',    desc: 'SOS alerts and emergency notifications',          icon: Shield,       color: 'text-red-600',    bg: 'bg-red-50'    },
]

export default function NotificationsScreen() {
  const navigate = useNavigate()
  const [prefs,   setPrefs]   = useState<Record<string, boolean>>({})
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    profileService.getNotificationPrefs().then(setPrefs).finally(() => setLoading(false))
  }, [])

  async function handleToggle(key: string) {
    const next = !prefs[key]
    setPrefs(p => ({ ...p, [key]: next }))
    try {
      await profileService.updateNotificationPref(key, next)
    } catch {
      setPrefs(p => ({ ...p, [key]: !next }))
      toast.error('Failed to update preference')
    }
  }

  return (
    <div className="page-container bg-gray-50">
      <div className="bg-white border-b border-gray-100 sticky top-0 z-10">
        <div className="content-shell pt-10 pb-4 flex items-center gap-3">
          <button onClick={() => navigate(-1)} className="w-9 h-9 bg-gray-100 rounded-xl flex items-center justify-center">
            <ArrowLeft size={18} />
          </button>
          <p className="font-bold text-gray-900 text-lg">Notifications</p>
        </div>
      </div>

      <div className="content-shell pt-5 pb-24 md:pb-8">
        <p className="text-sm text-gray-500 mb-4">Choose which notifications you'd like to receive.</p>

        <div className="bg-white rounded-2xl border border-gray-100 divide-y divide-gray-50 overflow-hidden">
          {CATEGORIES.map(({ key, label, desc, icon: Icon, color, bg }) => (
            <div key={key} className="flex items-center gap-4 px-4 py-4">
              <div className={`w-10 h-10 ${bg} rounded-xl flex items-center justify-center shrink-0`}>
                <Icon size={18} className={color} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-gray-900">{label}</p>
                <p className="text-xs text-gray-400 mt-0.5 leading-snug">{desc}</p>
              </div>
              {/* Toggle */}
              <button
                disabled={loading}
                onClick={() => handleToggle(key)}
                className={cn(
                  'relative w-11 h-6 rounded-full transition-colors duration-200 shrink-0 focus:outline-none',
                  prefs[key] ? 'bg-green-600' : 'bg-gray-300',
                  loading && 'opacity-50 cursor-not-allowed',
                )}
              >
                <span className={cn(
                  'absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform duration-200',
                  prefs[key] ? 'translate-x-5' : 'translate-x-0.5',
                )} />
              </button>
            </div>
          ))}
        </div>

        <p className="text-xs text-gray-400 text-center mt-5 px-4">
          Safety alerts cannot be disabled for your protection.
        </p>
      </div>
    </div>
  )
}
