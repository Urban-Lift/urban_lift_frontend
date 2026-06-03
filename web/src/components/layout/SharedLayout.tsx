import { Outlet } from 'react-router-dom'
import { useAuthStore } from '@/store/auth.store'
import SideNav from './SideNav'
import BottomNav from './BottomNav'

export default function SharedLayout() {
  const role = useAuthStore(s => s.user?.role) === 'driver' ? 'driver' : 'passenger'

  return (
    <div className="min-h-screen bg-gray-50 flex overflow-x-hidden w-full">
      <SideNav role={role} />
      <div className="flex-1 md:ml-64 flex flex-col min-h-screen min-w-0">
        <Outlet />
      </div>
      <BottomNav role={role} />
    </div>
  )
}
