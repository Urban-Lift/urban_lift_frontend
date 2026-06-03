import { NavLink, useNavigate } from 'react-router-dom'
import { Home, Car, MessageSquare, User, Zap, LogOut, Wallet } from 'lucide-react'
import { useAuthStore } from '@/store/auth.store'
import { cn } from '@/utils/cn'

interface SideNavProps {
  role: 'passenger' | 'driver'
}

const passengerItems = [
  { label: 'Find a Ride', icon: Home,          to: '/passenger/home' },
  { label: 'My Rides',    icon: Car,           to: '/passenger/my-rides' },
  { label: 'Wallet',      icon: Wallet,        to: '/wallet' },
  { label: 'Community',   icon: MessageSquare, to: '/community' },
  { label: 'Profile',     icon: User,          to: '/profile' },
]

const driverItems = [
  { label: 'Dashboard',   icon: Home,          to: '/driver/dashboard' },
  { label: 'Requests',    icon: Car,           to: '/driver/passengers' },
  { label: 'Wallet',      icon: Wallet,        to: '/wallet' },
  { label: 'Community',   icon: MessageSquare, to: '/community' },
  { label: 'Profile',     icon: User,          to: '/profile' },
]

export default function SideNav({ role }: SideNavProps) {
  const user    = useAuthStore(s => s.user)
  const logout  = useAuthStore(s => s.logout)
  const navigate = useNavigate()
  const items = role === 'driver' ? driverItems : passengerItems

  const initials = user?.fullName
    ?.split(' ')
    .map(n => n[0])
    .join('')
    .slice(0, 2)
    .toUpperCase() ?? '?'

  return (
    <aside className="hidden md:flex flex-col w-64 fixed left-0 top-0 bottom-0 bg-white border-r border-gray-100 z-30">
      {/* Logo */}
      <div className="px-5 py-5">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-green-700 rounded-xl flex items-center justify-center">
            <Zap size={17} className="text-white fill-white" />
          </div>
          <div>
            <p className="font-extrabold text-gray-900 text-[15px] leading-tight tracking-tight">UrbanLift</p>
            <p className="text-green-700 text-[11px] font-semibold capitalize">{role} mode</p>
          </div>
        </div>
      </div>

      <div className="mx-4 h-px bg-gray-100" />

      {/* Nav */}
      <nav className="flex-1 px-2.5 py-4 space-y-0.5 overflow-y-auto">
        {items.map(({ label, icon: Icon, to }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) => cn(
              'flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all text-sm font-medium',
              isActive
                ? 'bg-green-50 text-green-700 font-semibold'
                : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900',
            )}
          >
            {({ isActive }) => (
              <>
                <Icon size={17} strokeWidth={isActive ? 2.5 : 2} />
                <span>{label}</span>
              </>
            )}
          </NavLink>
        ))}
      </nav>

      <div className="mx-4 h-px bg-gray-100" />

      {/* User + sign out */}
      <div className="p-3 space-y-0.5">
        <button
          onClick={() => navigate('/profile')}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-gray-50 transition-colors text-left"
        >
          <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center text-green-700 font-bold text-xs shrink-0">
            {initials}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-gray-900 truncate leading-tight">
              {user?.fullName ?? 'User'}
            </p>
            <p className="text-[11px] text-gray-400 truncate">{user?.phoneNumber}</p>
          </div>
        </button>

        <button
          onClick={() => { logout(); navigate('/') }}
          className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors text-sm"
        >
          <LogOut size={15} />
          Sign out
        </button>
      </div>
    </aside>
  )
}
