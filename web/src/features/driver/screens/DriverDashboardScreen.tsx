import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { TrendingUp, Star, CheckCircle, Car } from 'lucide-react'
import { useDriverStore } from '@/store/driver.store'
import { useAuthStore } from '@/store/auth.store'
import { driverService } from '@/services/driver.service'
import { Avatar } from '@/components/ui'
import type { PassengerRequest } from '@/types'

export default function DriverDashboardScreen() {
  const navigate = useNavigate()
  const user = useAuthStore(s => s.user)
  const { isOnline, stats, requests, isLoading, setOnline, setStats, setRequests, setLoading } = useDriverStore()
  const [toggling, setToggling] = useState(false)

  useEffect(() => {
    setLoading(true)
    Promise.all([driverService.getStats(), driverService.getRequests()])
      .then(([s, r]) => { setStats(s); setRequests(r) })
      .finally(() => setLoading(false))
  }, [])

  const handleToggle = async () => {
    setToggling(true)
    try {
      await driverService.toggleOnline(!isOnline)
      setOnline(!isOnline)
    } finally {
      setToggling(false)
    }
  }

  const handleAccept = async (req: PassengerRequest) => {
    try {
      const trip = await driverService.acceptRequest(req.id)
      useDriverStore.getState().setActiveTrip(trip)
      navigate(`/driver/navigate/${trip.id}`)
    } catch {
      /* ignore */
    }
  }

  const handleDecline = async (id: string) => {
    await driverService.declineRequest(id)
    useDriverStore.getState().removeRequest(id)
  }

  const statCards = stats ? [
    { label: "Today's Earnings", value: `GHS ${stats.todayEarnings}`, icon: TrendingUp, color: 'text-green-700', bg: 'bg-green-50' },
    { label: 'Today\'s Trips',   value: stats.todayTrips,             icon: Car,         color: 'text-blue-600',  bg: 'bg-blue-50'  },
    { label: 'Rating',           value: stats.rating.toFixed(1),      icon: Star,        color: 'text-amber-500', bg: 'bg-amber-50' },
    { label: 'Acceptance',       value: `${stats.acceptanceRate}%`,   icon: CheckCircle, color: 'text-purple-600',bg: 'bg-purple-50'},
  ] : []

  return (
    <div className="page-container bg-gray-50">
      {/* Header */}
      <div style={{ background: 'linear-gradient(135deg, #14532D 0%, #166534 100%)' }}>
        <div className="content-shell pt-10 pb-6 md:pt-12 md:pb-8">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-200 text-sm">Welcome back,</p>
              <p className="text-white text-2xl md:text-3xl font-extrabold">{user?.fullName?.split(' ')[0] ?? 'Driver'}</p>
            </div>
            <button onClick={() => navigate('/profile')} className="md:hidden">
              <Avatar name={user?.fullName ?? ''} size="sm" className="ring-2 ring-white" />
            </button>
          </div>

          {stats && (
            <div className="mt-4 bg-white/10 rounded-2xl p-4 md:max-w-sm">
              <p className="text-green-200 text-xs font-medium">Week Earnings</p>
              <p className="text-white text-3xl font-extrabold mt-0.5">GHS {stats.weekEarnings}</p>
              <p className="text-green-300 text-xs mt-1">{stats.totalTrips} total trips · GHS {stats.totalEarnings.toLocaleString()} lifetime</p>
            </div>
          )}
        </div>
      </div>

      <div className="content-shell pt-5 pb-24 md:pb-8 space-y-5">
        {/* Online / Offline toggle */}
        <div className="bg-white rounded-2xl p-4 flex items-center justify-between shadow-sm border border-gray-100">
          <div>
            <p className="font-bold text-gray-900 text-base">{isOnline ? 'You\'re Online' : 'You\'re Offline'}</p>
            <p className="text-gray-500 text-xs mt-0.5">{isOnline ? 'Accepting ride requests' : 'Go online to receive requests'}</p>
          </div>
          <button
            onClick={handleToggle}
            disabled={toggling}
            className={`relative w-16 h-8 rounded-full transition-colors duration-200 focus:outline-none ${isOnline ? 'bg-green-600' : 'bg-gray-300'}`}
          >
            <span className={`absolute top-1 w-6 h-6 bg-white rounded-full shadow transition-transform duration-200 ${isOnline ? 'translate-x-9' : 'translate-x-1'}`} />
          </button>
        </div>

        {/* Stats grid */}
        {isLoading ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {[1,2,3,4].map(i => <div key={i} className="h-20 bg-gray-100 rounded-2xl animate-pulse" />)}
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {statCards.map(({ label, value, icon: Icon, color, bg }) => (
              <div key={label} className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
                <div className={`w-8 h-8 ${bg} rounded-xl flex items-center justify-center mb-2`}>
                  <Icon size={16} className={color} />
                </div>
                <p className="text-gray-900 text-lg font-bold">{value}</p>
                <p className="text-gray-500 text-xs">{label}</p>
              </div>
            ))}
          </div>
        )}

        {/* Incoming requests */}
        {isOnline && (
          <div>
            <div className="flex items-center justify-between mb-3">
              <p className="font-bold text-gray-900">Incoming Requests</p>
              {requests.length > 0 && (
                <span className="bg-green-100 text-green-700 text-xs font-semibold px-2 py-0.5 rounded-full">{requests.length}</span>
              )}
            </div>

            {requests.length === 0 ? (
              <div className="bg-white rounded-2xl p-8 text-center border border-gray-100">
                <Car size={32} className="text-gray-300 mx-auto mb-2" />
                <p className="text-gray-500 text-sm">No requests right now</p>
                <p className="text-gray-400 text-xs mt-1">Stay online to receive ride requests</p>
              </div>
            ) : (
              <div className="space-y-3 md:grid md:grid-cols-2 md:gap-4 md:space-y-0">
                {requests.slice(0, 4).map(req => (
                  <RequestCard
                    key={req.id}
                    req={req}
                    onAccept={() => handleAccept(req)}
                    onDecline={() => handleDecline(req.id)}
                  />
                ))}
                {requests.length > 2 && (
                  <button
                    onClick={() => navigate('/driver/passengers')}
                    className="w-full text-center text-green-700 text-sm font-semibold py-3 bg-white rounded-2xl border border-green-200"
                  >
                    View all {requests.length} requests →
                  </button>
                )}
              </div>
            )}
          </div>
        )}

        {!isOnline && (
          <div className="bg-white rounded-2xl p-6 text-center border border-gray-100">
            <div className="w-14 h-14 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <Car size={28} className="text-gray-400" />
            </div>
            <p className="font-semibold text-gray-700">Go online to start earning</p>
            <p className="text-gray-400 text-xs mt-1">Toggle the switch above to receive ride requests</p>
          </div>
        )}
      </div>
    </div>
  )
}

function RequestCard({ req, onAccept, onDecline }: {
  req: PassengerRequest
  onAccept: () => void
  onDecline: () => void
}) {
  const minsAgo = Math.round((Date.now() - new Date(req.requestedAt).getTime()) / 60_000)

  return (
    <div className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm">
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-2">
          <Avatar name={req.passenger.fullName} size="sm" />
          <div>
            <p className="font-semibold text-gray-900 text-sm">{req.passenger.fullName}</p>
            <p className="text-gray-400 text-xs">★ {req.passenger.rating} · {req.passenger.totalTrips} trips · {minsAgo}m ago</p>
          </div>
        </div>
        <div className="text-right">
          <p className="font-bold text-green-700 text-base">GHS {req.priceOffered}</p>
          <p className="text-gray-400 text-xs">{req.distanceKm} km · {req.estimatedMinutes} min</p>
        </div>
      </div>

      <div className="flex gap-2 mb-3">
        <div className="flex-1 text-xs">
          <div className="flex items-start gap-1.5">
            <div className="w-2 h-2 rounded-full bg-green-600 mt-0.5 shrink-0" />
            <span className="text-gray-700 leading-tight">{req.pickupLocation}</span>
          </div>
          <div className="w-px h-3 bg-gray-200 ml-[3px] my-0.5" />
          <div className="flex items-start gap-1.5">
            <div className="w-2 h-2 rounded-full bg-red-500 mt-0.5 shrink-0" />
            <span className="text-gray-700 leading-tight">{req.dropoffLocation}</span>
          </div>
        </div>
        <div className="text-xs text-gray-400 text-right shrink-0">
          {req.seatsRequested} seat{req.seatsRequested !== 1 ? 's' : ''}
        </div>
      </div>

      <div className="flex gap-2">
        <button
          onClick={onDecline}
          className="flex-1 py-2 rounded-xl border border-gray-200 text-gray-500 text-sm font-semibold"
        >
          Decline
        </button>
        <button
          onClick={onAccept}
          className="flex-1 py-2 rounded-xl bg-green-700 text-white text-sm font-semibold"
        >
          Accept
        </button>
      </div>
    </div>
  )
}
