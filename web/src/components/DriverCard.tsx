import { Shield } from 'lucide-react'
import type { Ride } from '@/types'
import Avatar from './ui/Avatar'
import Badge from './ui/Badge'
import { cn } from '@/utils/cn'

interface DriverCardProps {
  ride: Ride
  compact?: boolean
  className?: string
}

export default function DriverCard({ ride, compact = false, className }: DriverCardProps) {
  const { driver, vehicle } = ride

  return (
    <div className={cn('bg-white rounded-2xl border border-border p-4', className)}>
      {/* Driver info */}
      <div className="flex items-center gap-3">
        <Avatar src={driver.profilePhotoUrl} name={driver.fullName} size={compact ? 'md' : 'lg'} verified />
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <p className="font-semibold text-gray-900 text-base truncate">{driver.fullName}</p>
            {driver.avgRating >= 4.8 && <Badge variant="super_driver">Super Driver</Badge>}
          </div>
          <div className="flex items-center gap-1 mt-0.5">
            <span className="text-yellow-400 text-sm">★</span>
            <span className="text-sm text-gray-600 font-medium">{driver.avgRating.toFixed(1)}</span>
            <span className="text-sm text-gray-400">· {driver.totalRatings} rides</span>
          </div>
        </div>
      </div>

      {/* Vehicle info */}
      {!compact && (
        <div className="mt-3 pt-3 border-t border-border flex justify-between text-sm text-gray-600">
          <div>
            <p className="text-xs text-gray-400 mb-0.5">Vehicle</p>
            <p className="font-medium">{vehicle.make} {vehicle.model}</p>
          </div>
          <div className="text-right">
            <p className="text-xs text-gray-400 mb-0.5">License Plate</p>
            <p className="font-mono font-semibold text-gray-800">{vehicle.licensePlate}</p>
          </div>
        </div>
      )}

      {/* Safety note */}
      {!compact && (
        <div className="mt-3 flex items-start gap-2 bg-blue-50 rounded-xl p-3">
          <Shield size={15} className="text-blue-600 mt-0.5 shrink-0" />
          <p className="text-xs text-blue-700">
            This trip is monitored via GPS. Share your ride details with family and friends for added safety.
          </p>
        </div>
      )}
    </div>
  )
}
