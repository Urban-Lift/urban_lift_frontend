import { Clock, Users, ArrowRight } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import type { Ride } from '@/types'
import { formatTime, formatCurrency } from '@/utils/format'
import Avatar from './ui/Avatar'
import Badge from './ui/Badge'
import { cn } from '@/utils/cn'

interface RideCardProps {
  ride: Ride
  className?: string
}

export default function RideCard({ ride, className }: RideCardProps) {
  const navigate = useNavigate()
  const isFull = ride.availableSeats === 0

  return (
    <div
      onClick={() => !isFull && navigate(`/passenger/rides/${ride.id}`)}
      className={cn(
        'bg-white rounded-2xl border border-border p-4 space-y-3 transition-shadow',
        isFull ? 'opacity-60 cursor-not-allowed' : 'cursor-pointer hover:shadow-card active:scale-[0.99]',
        className,
      )}
    >
      {/* Driver row */}
      <div className="flex items-center gap-3">
        <Avatar
          src={ride.driver.profilePhotoUrl}
          name={ride.driver.fullName}
          size="md"
          verified
        />
        <div className="flex-1 min-w-0">
          <p className="font-semibold text-gray-900 text-sm truncate">
            {ride.driver.fullName.split(' ')[0]} {ride.driver.fullName.split(' ')[1]?.[0]}.
          </p>
          <div className="flex items-center gap-1 mt-0.5">
            <span className="text-yellow-400 text-xs">★</span>
            <span className="text-xs text-gray-500">
              {ride.driver.avgRating.toFixed(1)} · {ride.driver.totalRatings} rides
            </span>
          </div>
        </div>
        <div className="text-right shrink-0">
          <p className="text-green-700 font-bold text-base">{formatCurrency(ride.pricePerSeat)}</p>
          <p className="text-xs text-gray-400">per seat</p>
        </div>
      </div>

      {/* Route row */}
      <div className="flex items-center gap-2 text-xs text-gray-500">
        <Clock size={13} className="shrink-0" />
        <span className="font-medium text-gray-700">{formatTime(ride.departureTime)}</span>
        <span className="truncate">{ride.pickupLocation}</span>
        <ArrowRight size={13} className="shrink-0 text-gray-300" />
        <span className="truncate">{ride.dropoffLocation}</span>
      </div>

      {/* Tags row */}
      <div className="flex items-center gap-2">
        {ride.routeDescription && (
          <Badge variant="gray" className="text-[11px]">
            {ride.routeDescription}
          </Badge>
        )}
        <div className="flex items-center gap-1 ml-auto">
          <Users size={13} className={isFull ? 'text-red-400' : 'text-green-600'} />
          <span className={cn('text-xs font-medium', isFull ? 'text-red-500' : 'text-gray-500')}>
            {isFull ? 'FULL' : `${ride.availableSeats} left`}
          </span>
        </div>
      </div>
    </div>
  )
}
