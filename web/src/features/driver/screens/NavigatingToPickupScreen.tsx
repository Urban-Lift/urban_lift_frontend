import { useEffect, useState, useRef } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { X, AlertTriangle, Phone, ChevronUp, ChevronDown } from 'lucide-react'
import MapView from '@/components/maps/MapView'
import { Avatar } from '@/components/ui'
import { useDriverStore } from '@/store/driver.store'
import { driverService } from '@/services/driver.service'

export default function NavigatingToPickupScreen() {
  const { rideId } = useParams<{ rideId: string }>()
  const navigate = useNavigate()
  const { activeTrip, setActiveTrip } = useDriverStore()
  const [loading, setLoading] = useState(!activeTrip)
  const [drawerOpen, setDrawerOpen] = useState(true)
  const [driverLat, setDriverLat] = useState(5.6250)
  const [driverLng, setDriverLng] = useState(5.6250)
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null)

  useEffect(() => {
    if (!activeTrip) {
      driverService.getActiveTrip().then(t => {
        setActiveTrip(t)
        if (t) { setDriverLat(t.pickupLat - 0.012); setDriverLng(t.pickupLng - 0.008) }
        setLoading(false)
      })
    } else {
      setDriverLat(activeTrip.pickupLat - 0.012)
      setDriverLng(activeTrip.pickupLng - 0.008)
      setLoading(false)
    }

    timerRef.current = setInterval(() => {
      setDriverLat(prev => prev + 0.0006)
    }, 4000)

    return () => { if (timerRef.current) clearInterval(timerRef.current) }
  }, [])

  const handleArrived = () => {
    if (!activeTrip) return
    setActiveTrip({ ...activeTrip, status: 'in_trip' })
    navigate(`/driver/trip/${rideId}`)
  }

  const handleSos = () => alert('🚨 SOS alert sent to emergency contact')

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center"><div className="w-8 h-8 border-4 border-green-600 border-t-transparent rounded-full animate-spin" /></div>
  }

  if (!activeTrip) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4">
        <p className="text-gray-500">No active trip found</p>
        <button onClick={() => navigate('/driver/dashboard')} className="text-green-700 font-semibold">Go to Dashboard</button>
      </div>
    )
  }

  const trip = activeTrip
  const etaMins = 8

  return (
    <div className="page-container relative h-screen overflow-hidden">
      {/* Full-screen map */}
      <MapView
        center={{ lat: driverLat, lng: driverLng }}
        zoom={14}
        driverLocation={{ lat: driverLat, lng: driverLng }}
        pickupLocation={{ lat: trip.pickupLat, lng: trip.pickupLng }}
        dropoffLocation={{ lat: trip.dropoffLat, lng: trip.dropoffLng }}
        routePoints={[
          { lat: driverLat, lng: driverLng },
          { lat: trip.pickupLat, lng: trip.pickupLng },
        ]}
        height="h-full"
        className="rounded-none"
      />

      {/* Top overlay */}
      <div className="absolute top-0 inset-x-0 z-10 pt-12 px-4">
        <div className="flex items-start justify-between">
          <button
            onClick={() => navigate('/driver/dashboard')}
            className="w-10 h-10 bg-white rounded-full shadow flex items-center justify-center"
          >
            <X size={18} />
          </button>

          {/* Status pill */}
          <div className="bg-green-700 text-white px-4 py-2 rounded-full flex items-center gap-2 shadow">
            <span className="w-2 h-2 bg-white rounded-full" />
            <span className="text-sm font-semibold">Heading to Pickup</span>
          </div>

          {/* SOS */}
          <button
            onClick={handleSos}
            className="w-10 h-10 bg-red-500 rounded-full shadow flex items-center justify-center"
          >
            <AlertTriangle size={18} className="text-white" />
          </button>
        </div>
      </div>

      {/* Bottom drawer */}
      <div
        className={`absolute inset-x-0 bottom-0 z-10 bg-white rounded-t-3xl shadow-2xl transition-all duration-250 ${drawerOpen ? 'translate-y-0' : 'translate-y-[160px]'}`}
      >
        {/* Handle */}
        <div className="flex flex-col items-center pt-3 pb-1 cursor-pointer" onClick={() => setDrawerOpen(p => !p)}>
          <div className="w-10 h-1 bg-gray-200 rounded-full" />
          {drawerOpen ? <ChevronDown size={14} className="text-gray-300 mt-1" /> : <ChevronUp size={14} className="text-gray-300 mt-1" />}
        </div>

        <div className="px-5 pb-8">
          {/* ETA */}
          <div className="flex items-center justify-between mb-4">
            <div>
              <span className="text-3xl font-extrabold text-gray-900">{etaMins} min</span>
              <span className="text-gray-500 text-sm ml-2">to pickup at {trip.pickupLocation}</span>
            </div>
            <div className="w-10 h-10 bg-green-50 rounded-full flex items-center justify-center">
              <svg className="w-5 h-5 text-green-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
              </svg>
            </div>
          </div>

          {/* Passenger card */}
          <div className="bg-gray-50 rounded-2xl p-3 flex items-center gap-3 mb-4">
            <Avatar name={trip.passenger.fullName} size="sm" />
            <div className="flex-1">
              <p className="font-semibold text-gray-900">{trip.passenger.fullName}</p>
              <p className="text-gray-400 text-xs">★ {trip.passenger.rating} · Going to {trip.dropoffLocation}</p>
            </div>
            <a href={`tel:${trip.passenger.phoneNumber}`}>
              <div className="w-9 h-9 bg-green-50 rounded-full flex items-center justify-center">
                <Phone size={16} className="text-green-700" />
              </div>
            </a>
          </div>

          {/* Arrived button */}
          <button
            onClick={handleArrived}
            className="w-full py-4 bg-green-700 text-white font-bold text-base rounded-2xl"
          >
            Arrived at Pickup
          </button>
        </div>
      </div>
    </div>
  )
}
