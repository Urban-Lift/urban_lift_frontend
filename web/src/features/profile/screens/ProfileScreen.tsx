import { useNavigate } from 'react-router-dom'
import { Star, ChevronRight, LogOut, Bell, MapPin, Edit3, Gift, HelpCircle, Wallet, Settings } from 'lucide-react'
import { useAuthStore } from '@/store/auth.store'
import { useWalletStore } from '@/store/wallet.store'
import { formatCurrency } from '@/utils/format'

const MENU_GROUP_1 = [
  { icon: Edit3,      label: 'Edit Profile',          sub: '',                      to: '/profile/edit',          color: 'text-blue-600',   bg: 'bg-blue-50'   },
  { icon: MapPin,     label: 'Saved Routes',           sub: '',                      to: '/profile/saved-routes',  color: 'text-green-700',  bg: 'bg-green-50'  },
  { icon: Bell,       label: 'Notifications',          sub: '',                      to: '/profile/notifications', color: 'text-amber-600',  bg: 'bg-amber-50'  },
]

const MENU_GROUP_2 = [
  { icon: HelpCircle, label: 'Help & Support',         sub: '',                      to: '',                       color: 'text-gray-500',   bg: 'bg-gray-50'   },
  { icon: Gift,       label: 'Refer a Friend',         sub: 'Earn GHS 10.00 credit', to: '/profile/refer',         color: 'text-purple-600', bg: 'bg-purple-50' },
]

export default function ProfileScreen() {
  const navigate = useNavigate()
  const user    = useAuthStore(s => s.user)
  const logout  = useAuthStore(s => s.logout)
  const wallet  = useWalletStore(s => s.wallet)

  const initials = (user?.fullName ?? 'U').split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()

  return (
    <div className="page-container bg-gray-50">
      {/* White header bar */}
      <div className="bg-white border-b border-gray-100 sticky top-0 z-10">
        <div className="content-shell pt-10 pb-4">
          <p className="font-bold text-gray-900 text-base text-center">Profile & Settings</p>
        </div>
      </div>

      <div className="content-shell pt-6 pb-24 md:pb-8 space-y-4">
        {/* Avatar block */}
        <div className="flex flex-col items-center pt-2 pb-2">
          <div className="relative mb-3">
            <div className="w-[90px] h-[90px] rounded-full border-[3px] border-green-200 bg-green-600 flex items-center justify-center text-white text-3xl font-bold shadow-md">
              {initials}
            </div>
            <button
              onClick={() => navigate('/profile/edit')}
              className="absolute -bottom-1 -right-1 w-7 h-7 bg-white border border-gray-200 rounded-full flex items-center justify-center shadow-sm hover:bg-gray-50 transition-colors"
            >
              <Settings size={13} className="text-gray-500" />
            </button>
          </div>
          <p className="font-extrabold text-gray-900 text-xl">{user?.fullName ?? 'User'}</p>
          <p className="text-gray-400 text-sm mt-0.5">{user?.phoneNumber}</p>
          <div className="mt-2">
            <span className="text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-100 px-3 py-1 rounded-full inline-flex items-center gap-1">
              <Star size={10} className="fill-amber-500 text-amber-500" />
              {(user?.avgRating ?? 4.8).toFixed(1)} Rating
            </span>
          </div>
        </div>

        {/* Wallet balance button */}
        <button
          onClick={() => navigate('/wallet')}
          className="w-full bg-green-700 hover:bg-green-800 text-white rounded-2xl px-5 py-3.5 flex items-center justify-between transition-colors"
        >
          <div className="flex items-center gap-2.5">
            <Wallet size={18} className="text-green-300" />
            <p className="text-sm font-semibold">Wallet Balance</p>
          </div>
          <div className="flex items-center gap-2">
            <p className="font-bold text-base">{wallet ? formatCurrency(wallet.balance) : 'GHS —'}</p>
            <ChevronRight size={16} className="text-green-300" />
          </div>
        </button>

        {/* Menu group 1 */}
        <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
          {MENU_GROUP_1.map(({ icon: Icon, label, sub, to, color, bg }, idx) => (
            <button
              key={label}
              onClick={() => to && navigate(to)}
              className={`w-full flex items-center gap-3 px-4 py-3.5 hover:bg-gray-50 transition-colors text-left ${idx !== 0 ? 'border-t border-gray-50' : ''}`}
            >
              <div className={`w-9 h-9 ${bg} rounded-xl flex items-center justify-center shrink-0`}>
                <Icon size={17} className={color} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-800">{label}</p>
                {sub && <p className="text-xs text-gray-400 mt-0.5">{sub}</p>}
              </div>
              <ChevronRight size={16} className="text-gray-300 shrink-0" />
            </button>
          ))}
        </div>

        {/* Menu group 2 */}
        <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
          {MENU_GROUP_2.map(({ icon: Icon, label, sub, to, color, bg }, idx) => (
            <button
              key={label}
              onClick={() => to && navigate(to)}
              className={`w-full flex items-center gap-3 px-4 py-3.5 hover:bg-gray-50 transition-colors text-left ${idx !== 0 ? 'border-t border-gray-50' : ''}`}
            >
              <div className={`w-9 h-9 ${bg} rounded-xl flex items-center justify-center shrink-0`}>
                <Icon size={17} className={color} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-800">{label}</p>
                {sub && <p className="text-xs text-gray-400 mt-0.5">{sub}</p>}
              </div>
              <ChevronRight size={16} className="text-gray-300 shrink-0" />
            </button>
          ))}
        </div>

        {/* Log out */}
        <button
          onClick={() => { logout(); navigate('/') }}
          className="w-full bg-white rounded-2xl border border-gray-100 flex items-center gap-3 px-4 py-3.5 hover:bg-red-50 hover:border-red-100 transition-colors"
        >
          <div className="w-9 h-9 bg-red-50 rounded-xl flex items-center justify-center shrink-0">
            <LogOut size={17} className="text-red-500" />
          </div>
          <p className="flex-1 text-sm font-semibold text-red-500 text-left">Log Out</p>
        </button>

        <p className="text-center text-xs text-gray-300 pb-2">Version 2.4.1 (Accra Beta)</p>
      </div>
    </div>
  )
}
