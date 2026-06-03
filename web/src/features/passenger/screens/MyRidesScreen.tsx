import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { MapPin, Star } from 'lucide-react'
import toast from 'react-hot-toast'
import { Badge, RideCardSkeleton } from '@/components/ui'
import { useBookingStore } from '@/store/booking.store'
import { rideService } from '@/services/ride.service'
import { formatDate, formatTime, formatCurrency } from '@/utils/format'
import { cn } from '@/utils/cn'
import type { Booking, BookingStatus } from '@/types'

const STATUS_BADGE: Record<BookingStatus, { label: string; variant: 'success' | 'warning' | 'error' | 'info' | 'gray' }> = {
  confirmed:   { label: 'Confirmed',   variant: 'success' },
  pending:     { label: 'Pending',     variant: 'warning' },
  in_progress: { label: 'In Progress', variant: 'info' },
  completed:   { label: 'Completed',   variant: 'gray' },
  cancelled:   { label: 'Cancelled',   variant: 'error' },
}

export default function MyRidesScreen() {
  const navigate = useNavigate()
  const { upcoming, past, isLoading, setMyRides, setLoading } = useBookingStore()
  const [tab, setTab] = useState<'upcoming' | 'past'>('upcoming')

  useEffect(() => {
    setLoading(true)
    rideService.getMyBookings()
      .then(setMyRides)
      .catch(() => toast.error('Failed to load rides'))
      .finally(() => setLoading(false))
  }, [])

  const rides = tab === 'upcoming' ? upcoming : past
  const initials = (name: string) => name.split(' ').map(n => n[0]).join('').slice(0, 2)

  return (
    <div className="page-container bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-100 sticky top-0 z-10">
        <div className="content-shell pt-8 pb-0">
          <h1 className="text-xl font-bold text-gray-900 mb-4">My Rides</h1>
          <div className="flex max-w-xs">
            {(['upcoming', 'past'] as const).map(t => (
              <button
                key={t}
                onClick={() => setTab(t)}
                className={cn(
                  'flex-1 py-3 text-sm font-medium border-b-2 transition-colors capitalize',
                  tab === t
                    ? 'border-green-700 text-green-700'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                )}
              >
                {t}
                {t === 'upcoming' && upcoming.length > 0 && (
                  <span className="ml-1.5 text-[10px] bg-green-100 text-green-700 font-semibold px-1.5 py-0.5 rounded-full">
                    {upcoming.length}
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="content-shell py-4 pb-24 md:pb-8">
        {isLoading ? (
          <div className="space-y-3">
            <RideCardSkeleton />
            <RideCardSkeleton />
          </div>
        ) : rides.length === 0 ? (
          <EmptyRides tab={tab} onFind={() => navigate('/passenger/home')} />
        ) : (
          <div className="space-y-3 md:grid md:grid-cols-2 md:gap-4 md:space-y-0">
            {rides.map(booking => (
              <BookingCard
                key={booking.id}
                booking={booking}
                initials={initials(booking.ride.driver.fullName)}
                onTrack={() => navigate(`/passenger/tracking/${booking.id}`)}
                onRate={() => navigate(`/passenger/rate/${booking.id}`)}
                onCancel={async () => {
                  await rideService.cancelBooking(booking.id)
                  const data = await rideService.getMyBookings()
                  setMyRides(data)
                  toast.success('Booking cancelled')
                }}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

function BookingCard({ booking, initials, onTrack, onRate, onCancel }: {
  booking: Booking; initials: string
  onTrack: () => void; onRate: () => void; onCancel: () => void
}) {
  const status = STATUS_BADGE[booking.status] ?? { label: booking.status, variant: 'gray' as const }
  const isPast = booking.status === 'completed' || booking.status === 'cancelled'

  return (
    <div className="bg-white rounded-2xl border border-border p-4">
      {/* Driver + status */}
      <div className="flex items-center gap-3 mb-3">
        <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center text-green-700 font-bold text-sm">
          {initials}
        </div>
        <div className="flex-1">
          <p className="text-sm font-semibold text-gray-900">{booking.ride.driver.fullName}</p>
          <div className="flex items-center gap-1 mt-0.5">
            <Star size={11} className="text-amber-400 fill-amber-400" />
            <span className="text-xs text-gray-500">{booking.ride.driver.avgRating.toFixed(1)}</span>
          </div>
        </div>
        <Badge variant={status.variant as any}>{status.label}</Badge>
      </div>

      {/* Route */}
      <div className="flex items-stretch gap-2 mb-3">
        <div className="flex flex-col items-center gap-0.5 mt-1">
          <div className="w-2 h-2 rounded-full bg-green-600" />
          <div className="w-px flex-1 bg-gray-200" />
          <div className="w-2 h-2 rounded-full bg-red-500" />
        </div>
        <div className="flex-1 space-y-1">
          <p className="text-sm text-gray-800">{booking.ride.pickupLocation}</p>
          <p className="text-xs text-gray-400">{formatDate(booking.ride.departureTime)}, {formatTime(booking.ride.departureTime)}</p>
          <p className="text-sm text-gray-800">{booking.ride.dropoffLocation}</p>
        </div>
        <div className="text-right">
          <p className="text-sm font-bold text-green-700">{formatCurrency(booking.totalPrice)}</p>
          <p className="text-[10px] text-gray-400">{booking.seatsBooked} seat{booking.seatsBooked !== 1 ? 's' : ''}</p>
        </div>
      </div>

      {/* Actions */}
      {!isPast && (
        <div className="flex gap-2 pt-2 border-t border-gray-100">
          <button
            onClick={onTrack}
            className="flex-1 py-2 text-xs font-semibold text-green-700 bg-green-50 rounded-lg hover:bg-green-100 transition-colors"
          >
            Track Ride
          </button>
          <button
            onClick={onCancel}
            className="flex-1 py-2 text-xs font-semibold text-red-600 bg-red-50 rounded-lg hover:bg-red-100 transition-colors"
          >
            Cancel
          </button>
        </div>
      )}

      {booking.status === 'completed' && (
        <div className="pt-2 border-t border-gray-100">
          <button
            onClick={onRate}
            className="w-full py-2 text-xs font-semibold text-amber-700 bg-amber-50 rounded-lg hover:bg-amber-100 transition-colors"
          >
            ★ Rate this ride
          </button>
        </div>
      )}
    </div>
  )
}

function EmptyRides({ tab, onFind }: { tab: string; onFind: () => void }) {
  return (
    <div className="flex flex-col items-center py-16 text-center px-4">
      <div className="w-16 h-16 rounded-2xl bg-gray-100 flex items-center justify-center mb-4">
        <MapPin size={28} className="text-gray-400" />
      </div>
      <h3 className="text-base font-semibold text-gray-800 mb-2">
        {tab === 'upcoming' ? 'No upcoming rides' : 'No past rides'}
      </h3>
      <p className="text-sm text-gray-500 mb-6">
        {tab === 'upcoming' ? 'Book a ride to get started' : 'Your completed rides will appear here'}
      </p>
      {tab === 'upcoming' && (
        <button onClick={onFind} className="text-sm font-medium text-green-700 hover:underline">
          Find a ride
        </button>
      )}
    </div>
  )
}
