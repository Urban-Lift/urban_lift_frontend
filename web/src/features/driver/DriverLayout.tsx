import { Outlet } from 'react-router-dom'
import BottomNav from '@/components/layout/BottomNav'
import SideNav from '@/components/layout/SideNav'

export default function DriverLayout() {
  return (
    <div className="min-h-screen bg-gray-50 flex">
      <SideNav role="driver" />
      <div className="flex-1 md:ml-64 flex flex-col min-h-screen">
        <Outlet />
      </div>
      <BottomNav role="driver" />
    </div>
  )
}
