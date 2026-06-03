import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { Star, Shield, Wind, Music, PawPrint, Clock, ChevronLeft, Minus, Plus } from 'lucide-react'
import toast from 'react-hot-toast'
import { Button, PageLoader } from '@/components/ui'
import { useRideStore } from '@/store/ride.store'
import { useBookingStore } from '@/store/booking.store'
import { rideService } from '@/services/ride.service'
import { formatCurrency, formatTime } from '@/utils/format'
import type { Ride } from '@/types'

export default function RideDetailScreen() {
  const { id }   = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { availableRides } = useRideStore()
  const { setCurrentBooking } = useBookingStore()

  const [ride,    setRide]    = useState<Ride | null>(availableRides.find(r => r.id === id) ?? null)
  const [loading, setLoading] = useState(!ride)
  const [seats,   setSeats]   = useState(1)
  const [booking, setBooking] = useState(false)

  useEffect(() => {
    if (ride || !id) return
    rideService.getRideById(id).then(setRide).catch(() => toast.error('Ride not found')).finally(() => setLoading(false))
  }, [id, ride])

  if (loading) return <PageLoader />
  if (!ride)   return (
    <div className="page-container items-center justify-center gap-4">
      <p className="text-gray-500">Ride not found</p>
      <button onClick={() => navigate(-1)} className="text-green-700 text-sm font-medium">Go back</button>
    </div>
  )

  const durationMins = Math.round(
    (new Date(ride.estimatedArrivalTime).getTime() - new Date(ride.departureTime).getTime()) / 60000
  )
  const isSuperDriver = ride.driver.avgRating >= 4.8
  const total = ride.pricePerSeat * seats
  const initials = ride.driver.fullName.split(' ').map(n => n[0]).join('').slice(0, 2)

  async function handleBook() {
    setBooking(true)
    try {
      const b = await rideService.bookRide(ride!.id, seats, 'wallet')
      setCurrentBooking(b)
      navigate(`/passenger/booking/${b.id}`)
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Booking failed')
    } finally {
      setBooking(false)
    }
  }

  return (
    <div className="page-container bg-surface">
      {/* Header */}
      <div className="bg-white px-4 pt-10 pb-4 flex items-center gap-3 border-b border-border">
        <button onClick={() => navigate(-1)} className="w-9 h-9 rounded-full bg-surface flex items-center justify-center">
          <ChevronLeft size={20} className="text-gray-600" />
        </button>
        <h1 className="text-base font-semibold text-gray-900">Ride Details</h1>
      </div>

      <div className="overflow-y-auto flex-1 pb-32">
        {/* Driver card */}
        <div className="bg-white mx-4 mt-4 rounded-2xl p-4 border border-border">
          <div className="flex items-center gap-3">
            <div className="w-14 h-14 rounded-full bg-green-100 flex items-center justify-center text-green-700 font-bold text-lg">
              {initials}
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="font-semibold text-gray-900">{ride.driver.fullName}</span>
                {isSuperDriver && (
                  <span className="text-[10px] font-bold bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full">★ Super Driver</span>
                )}
              </div>
              <div className="flex items-center gap-3 mt-1 text-xs text-gray-500">
                <span className="flex items-center gap-0.5">
                  <Star size={11} className="text-amber-400 fill-amber-400" />
                  {ride.driver.avgRating.toFixed(1)} ({ride.driver.totalRatings})
                </span>
                <span className="flex items-center gap-0.5">
                  <Shield size={11} className="text-green-600" />
                  Verified
                </span>
              </div>
            </div>
          </div>

          {/* Vehicle */}
          <div className="mt-3 pt-3 border-t border-gray-100">
            <p className="text-xs text-gray-500 mb-1">Vehicle</p>
            <p className="text-sm font-medium text-gray-800">
              {ride.vehicle.color} {ride.vehicle.make} {ride.vehicle.model}
              <span className="ml-2 text-gray-400 font-normal">{ride.vehicle.licensePlate}</span>
            </p>
          </div>

          {/* Amenities */}
          <div className="flex gap-2 mt-3 flex-wrap">
            {ride.vehicle.hasAc     && <AmenityChip icon={<Wind   size={13} />} label="A/C" />}
            {ride.vehicle.hasMusic  && <AmenityChip icon={<Music  size={13} />} label="Music" />}
            {ride.vehicle.allowsPets && <AmenityChip icon={<PawPrint size={13} />} label="Pets OK" />}
          </div>
        </div>

        {/* Route */}
        <div className="bg-white mx-4 mt-3 rounded-2xl p-4 border border-border">
          <div className="flex items-start gap-3">
            <div className="flex flex-col items-center mt-1 gap-0.5">
              <div className="w-2.5 h-2.5 rounded-full bg-green-600" />
              <div className="w-px h-10 bg-gray-200" />
              <div className="w-2.5 h-2.5 rounded-full bg-red-500" />
            </div>
            <div className="flex-1 space-y-2">
              <div>
                <p className="text-sm font-semibold text-gray-900">{ride.pickupLocation}</p>
                <p className="text-xs text-gray-500">{formatTime(ride.departureTime)}</p>
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-900">{ride.dropoffLocation}</p>
                <p className="text-xs text-gray-500">{formatTime(ride.estimatedArrivalTime)}</p>
              </div>
            </div>
            <div className="flex items-center gap-1 text-xs text-gray-500 bg-surface px-2 py-1 rounded-lg">
              <Clock size={12} />
              {durationMins} min
            </div>
          </div>

          {ride.routeDescription && (
            <p className="text-xs text-gray-400 mt-3 pt-3 border-t border-gray-100">
              Route: {ride.routeDescription}
            </p>
          )}
        </div>

        {/* Seats + Price */}
        <div className="bg-white mx-4 mt-3 rounded-2xl p-4 border border-border space-y-4">
          <div>
            <p className="text-sm font-semibold text-gray-900 mb-2">Select seats</p>
            <div className="flex items-center gap-4">
              <button
                onClick={() => setSeats(s => Math.max(1, s - 1))}
                className="w-8 h-8 rounded-full border border-gray-200 flex items-center justify-center hover:bg-gray-50 disabled:opacity-40"
                disabled={seats <= 1}
              >
                <Minus size={14} />
              </button>
              <span className="text-xl font-bold text-gray-900 w-6 text-center">{seats}</span>
              <button
                onClick={() => setSeats(s => Math.min(ride.availableSeats, s + 1))}
                className="w-8 h-8 rounded-full border border-green-600 text-green-700 flex items-center justify-center hover:bg-green-50 disabled:opacity-40"
                disabled={seats >= ride.availableSeats}
              >
                <Plus size={14} />
              </button>
              <span className="text-xs text-gray-400 ml-2">{ride.availableSeats} seat{ride.availableSeats !== 1 ? 's' : ''} available</span>
            </div>
          </div>

          <div className="border-t border-gray-100 pt-4 space-y-1.5">
            <div className="flex justify-between text-sm text-gray-600">
              <span>{formatCurrency(ride.pricePerSeat)} × {seats} seat{seats !== 1 ? 's' : ''}</span>
              <span>{formatCurrency(total)}</span>
            </div>
            <div className="flex justify-between text-base font-bold text-gray-900">
              <span>Total</span>
              <span className="text-green-700">{formatCurrency(total)}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Sticky footer */}
      <div className="absolute bottom-0 left-0 right-0 bg-white border-t border-border px-4 py-4">
        <Button fullWidth size="lg" onClick={handleBook} loading={booking}>
          Book Ride · {formatCurrency(total)}
        </Button>
      </div>
    </div>
  )
}

function AmenityChip({ icon, label }: { icon: React.ReactNode; label: string }) {
  return (
    <span className="flex items-center gap-1.5 text-xs bg-green-50 text-green-700 border border-green-200 px-2.5 py-1 rounded-full">
      {icon}
      {label}
    </span>
  )
}
