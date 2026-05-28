import { NavLink, useLocation } from 'react-router-dom'
import { Home, Car, MessageSquare, User } from 'lucide-react'
import { cn } from '@/utils/cn'

interface NavItem {
  label: string
  icon: React.ElementType
  to: string
  badge?: number
}

interface BottomNavProps {
  role?: 'passenger' | 'driver'
}

const passengerItems: NavItem[] = [
  { label: 'Home',     icon: Home,          to: '/passenger/home' },
  { label: 'Rides',    icon: Car,           to: '/passenger/my-rides' },
  { label: 'Messages', icon: MessageSquare, to: '/community' },
  { label: 'Profile',  icon: User,          to: '/profile' },
]

const driverItems: NavItem[] = [
  { label: 'Home',     icon: Home,          to: '/driver/dashboard' },
  { label: 'Rides',    icon: Car,           to: '/driver/passengers' },
  { label: 'Messages', icon: MessageSquare, to: '/community' },
  { label: 'Profile',  icon: User,          to: '/profile' },
]

export default function BottomNav({ role = 'passenger' }: BottomNavProps) {
  const items = role === 'driver' ? driverItems : passengerItems
  const { pathname } = useLocation()

  return (
    <nav className="fixed bottom-0 inset-x-0 z-40 bg-white border-t border-border max-w-md mx-auto">
      <div className="flex items-center justify-around h-16 px-2">
        {items.map(({ label, icon: Icon, to, badge }) => {
          const active = pathname.startsWith(to)
          return (
            <NavLink
              key={to}
              to={to}
              className={cn(
                'flex flex-col items-center gap-0.5 flex-1 py-2 transition-colors',
                active ? 'text-green-700' : 'text-gray-400 hover:text-gray-600',
              )}
            >
              <div className="relative">
                <Icon size={22} strokeWidth={active ? 2.5 : 2} />
                {badge !== undefined && badge > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                    {badge > 9 ? '9+' : badge}
                  </span>
                )}
              </div>
              <span className={cn('text-[11px] font-medium', active ? 'text-green-700' : 'text-gray-400')}>
                {label}
              </span>
            </NavLink>
          )
        })}
      </div>
    </nav>
  )
}
