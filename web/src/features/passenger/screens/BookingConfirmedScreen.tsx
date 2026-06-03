import { useNavigate } from 'react-router-dom'
import { CheckCircle, MapPin, Clock, Users, Star } from 'lucide-react'
import { Button } from '@/components/ui'
import { useBookingStore } from '@/store/booking.store'
import { formatCurrency, formatDate, formatTime } from '@/utils/format'

export default function BookingConfirmedScreen() {
  const navigate = useNavigate()
  const { currentBooking } = useBookingStore()

  if (!currentBooking) {
    return (
      <div className="page-container items-center justify-center gap-4">
        <p className="text-gray-500">No booking found</p>
        <Button onClick={() => navigate('/passenger/home')}>Go Home</Button>
      </div>
    )
  }

  const { ride, seatsBooked, totalPrice } = currentBooking
  const initials = ride.driver.fullName.split(' ').map(n => n[0]).join('').slice(0, 2)

  return (
    <div className="page-container bg-surface">
      <div className="flex-1 flex flex-col px-5 pt-12 pb-8">
        {/* Success icon */}
        <div className="flex flex-col items-center text-center mb-8">
          <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center mb-4">
            <CheckCircle size={44} className="text-green-600" strokeWidth={1.5} />
          </div>
          <h1 className="text-2xl font-bold text-gray-900">Booking Confirmed!</h1>
          <p className="mt-2 text-sm text-gray-500 max-w-xs">
            Your ride is booked. You'll hear from {ride.driver.fullName.split(' ')[0]} before departure.
          </p>
        </div>

        {/* Driver card */}
        <div className="bg-white rounded-2xl border border-border p-4 mb-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center text-green-700 font-bold">
              {initials}
            </div>
            <div>
              <p className="font-semibold text-gray-900">{ride.driver.fullName}</p>
              <div className="flex items-center gap-1 mt-0.5">
                <Star size={12} className="text-amber-400 fill-amber-400" />
                <span className="text-xs text-gray-500">{ride.driver.avgRating.toFixed(1)}</span>
                <span className="text-xs text-gray-400">· {ride.vehicle.color} {ride.vehicle.make} {ride.vehicle.model}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Trip details */}
        <div className="bg-white rounded-2xl border border-border p-4 space-y-3">
          <DetailRow icon={<MapPin size={16} className="text-green-700" />} label="Pickup" value={ride.pickupLocation} />
          <div className="border-t border-gray-100" />
          <DetailRow icon={<MapPin size={16} className="text-red-500" />} label="Drop-off" value={ride.dropoffLocation} />
          <div className="border-t border-gray-100" />
          <DetailRow icon={<Clock size={16} className="text-gray-400" />} label="Departure" value={`${formatDate(ride.departureTime)}, ${formatTime(ride.departureTime)}`} />
          <div className="border-t border-gray-100" />
          <DetailRow icon={<Users size={16} className="text-gray-400" />} label="Seats" value={`${seatsBooked} seat${seatsBooked !== 1 ? 's' : ''}`} />
        </div>

        {/* Price */}
        <div className="bg-green-50 rounded-2xl border border-green-200 p-4 mt-4 flex justify-between items-center">
          <p className="text-sm font-semibold text-green-900">Total Paid</p>
          <p className="text-xl font-bold text-green-700">{formatCurrency(totalPrice)}</p>
        </div>

        {/* Reference */}
        <p className="text-center text-xs text-gray-400 mt-3">
          Booking ref: <span className="font-mono font-semibold">{currentBooking.id.toUpperCase()}</span>
        </p>

        <div className="flex-1" />

        {/* Actions */}
        <div className="space-y-3 mt-8">
          <Button fullWidth size="lg" onClick={() => navigate('/passenger/my-rides')}>
            View My Rides
          </Button>
          <Button fullWidth size="lg" variant="outline" onClick={() => navigate('/passenger/home')}>
            Find Another Ride
          </Button>
        </div>
      </div>
    </div>
  )
}

function DetailRow({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="flex items-center gap-3">
      <span className="shrink-0">{icon}</span>
      <div className="flex-1 flex justify-between items-center">
        <span className="text-xs text-gray-500">{label}</span>
        <span className="text-sm font-medium text-gray-900 text-right max-w-[55%]">{value}</span>
      </div>
    </div>
  )
}
