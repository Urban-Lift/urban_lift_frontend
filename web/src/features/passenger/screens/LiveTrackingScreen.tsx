import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { Phone, Share2, AlertTriangle, Star, Navigation, X } from 'lucide-react'
import toast from 'react-hot-toast'
import MapView from '@/components/maps/MapView'
import { rideService } from '@/services/ride.service'
import { cn } from '@/utils/cn'
import type { Trip } from '@/types'

export default function LiveTrackingScreen() {
  const { id }   = useParams<{ id: string }>()
  const navigate = useNavigate()

  const [trip,         setTrip]         = useState<Trip | null>(null)
  const [loading,      setLoading]      = useState(true)
  const [drawerOpen,   setDrawerOpen]   = useState(true)

  useEffect(() => {
    rideService.getActiveTrip().then(setTrip).finally(() => setLoading(false))
  }, [id])

  // Simulate driver moving towards pickup every 5s
  useEffect(() => {
    if (!trip) return
    const interval = setInterval(() => {
      setTrip(prev => {
        if (!prev) return null
        return {
          ...prev,
          currentLat: prev.currentLat ? prev.currentLat + 0.0005 : prev.currentLat,
        }
      })
    }, 5000)
    return () => clearInterval(interval)
  }, [trip?.id])

  if (loading) {
    return (
      <div className="page-container items-center justify-center">
        <div className="w-8 h-8 border-2 border-green-700 border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  if (!trip) {
    return (
      <div className="page-container items-center justify-center gap-4">
        <p className="text-gray-500">No active trip found</p>
        <button onClick={() => navigate('/passenger/my-rides')} className="text-green-700 text-sm font-medium">My Rides</button>
      </div>
    )
  }

  const { ride } = trip
  const isNavigatingToPickup = trip.status === 'navigating_to_pickup'
  const statusLabel  = isNavigatingToPickup ? 'Driver on the way' : 'Heading to destination'
  const etaMins      = isNavigatingToPickup ? 8 : 22
  const initials     = ride.driver.fullName.split(' ').map(n => n[0]).join('').slice(0, 2)

  const driverPos  = { lat: trip.currentLat ?? 5.635,  lng: trip.currentLng ?? -0.162 }
  const pickupPos  = { lat: ride.pickupLat,            lng: ride.pickupLng }
  const dropoffPos = { lat: ride.dropoffLat,           lng: ride.dropoffLng }

  function handleSOS() {
    toast('🚨 SOS alert sent to emergency contact', { icon: '🚨', duration: 4000 })
  }

  function handleShare() {
    if (navigator.share) {
      navigator.share({ title: 'My UrbanLift Trip', text: `I'm on my way! Tracking live.`, url: window.location.href })
    } else {
      navigator.clipboard.writeText(window.location.href)
      toast.success('Tracking link copied!')
    }
  }

  return (
    <div className="page-container relative overflow-hidden">
      {/* Full-screen map */}
      <div className="absolute inset-0">
        <MapView
          center={driverPos}
          zoom={14}
          driverLocation={driverPos}
          pickupLocation={pickupPos}
          dropoffLocation={dropoffPos}
          routePoints={[driverPos, pickupPos, dropoffPos]}
          height="h-full"
          className="rounded-none"
        />
      </div>

      {/* Back button */}
      <div className="absolute top-10 left-4 z-20">
        <button
          onClick={() => navigate(-1)}
          className="w-10 h-10 rounded-full bg-white shadow-md flex items-center justify-center"
        >
          <X size={18} className="text-gray-600" />
        </button>
      </div>

      {/* SOS + Share */}
      <div className="absolute top-10 right-4 z-20 flex flex-col gap-2">
        <button
          onClick={handleSOS}
          className="w-10 h-10 rounded-full bg-red-600 shadow-md flex items-center justify-center"
        >
          <AlertTriangle size={18} className="text-white" />
        </button>
        <button
          onClick={handleShare}
          className="w-10 h-10 rounded-full bg-white shadow-md flex items-center justify-center"
        >
          <Share2 size={18} className="text-gray-600" />
        </button>
      </div>

      {/* Status pill */}
      <div className="absolute top-10 left-1/2 -translate-x-1/2 z-20">
        <div className={cn(
          'flex items-center gap-2 px-4 py-2 rounded-full shadow-md text-sm font-semibold',
          isNavigatingToPickup ? 'bg-green-700 text-white' : 'bg-blue-600 text-white'
        )}>
          <span className="w-2 h-2 rounded-full bg-white animate-pulse" />
          {statusLabel}
        </div>
      </div>

      {/* Bottom drawer */}
      <div
        className={cn(
          'absolute bottom-0 left-0 right-0 z-20 bg-white rounded-t-3xl shadow-modal transition-transform duration-300',
          drawerOpen ? 'translate-y-0' : 'translate-y-[70%]'
        )}
      >
        {/* Handle */}
        <div className="flex justify-center pt-3 pb-2 cursor-pointer" onClick={() => setDrawerOpen(o => !o)}>
          <div className="w-10 h-1 rounded-full bg-gray-300" />
        </div>

        <div className="px-5 pb-8">
          {/* ETA */}
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-2xl font-bold text-gray-900">{etaMins} min</p>
              <p className="text-sm text-gray-500">
                {isNavigatingToPickup ? 'until pickup at' : 'to arrive at'} {isNavigatingToPickup ? ride.pickupLocation : ride.dropoffLocation}
              </p>
            </div>
            <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center">
              <Navigation size={22} className="text-green-700" />
            </div>
          </div>

          {/* Driver card */}
          <div className="flex items-center gap-3 bg-surface rounded-2xl p-3 mb-4">
            <div className="w-11 h-11 rounded-full bg-green-100 flex items-center justify-center text-green-700 font-bold">
              {initials}
            </div>
            <div className="flex-1">
              <p className="font-semibold text-gray-900">{ride.driver.fullName}</p>
              <div className="flex items-center gap-1">
                <Star size={11} className="text-amber-400 fill-amber-400" />
                <span className="text-xs text-gray-500">{ride.driver.avgRating.toFixed(1)} · {ride.vehicle.color} {ride.vehicle.make}</span>
              </div>
            </div>
            <div className="flex gap-2">
              <button className="w-9 h-9 rounded-full bg-green-100 flex items-center justify-center">
                <Phone size={16} className="text-green-700" />
              </button>
            </div>
          </div>

          {/* Plate number */}
          <div className="text-center text-sm text-gray-500">
            License plate: <span className="font-mono font-semibold text-gray-900">{ride.vehicle.licensePlate}</span>
          </div>
        </div>
      </div>
    </div>
  )
}
