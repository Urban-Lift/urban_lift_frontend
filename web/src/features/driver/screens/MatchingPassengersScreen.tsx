import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft, SlidersHorizontal } from 'lucide-react'
import { useDriverStore } from '@/store/driver.store'
import { driverService } from '@/services/driver.service'
import { Avatar } from '@/components/ui'
import type { PassengerRequest } from '@/types'
import { cn } from '@/utils/cn'

type Filter = 'all' | 'nearby' | 'high_earning'

export default function MatchingPassengersScreen() {
  const navigate = useNavigate()
  const { requests, isLoading, setRequests, removeRequest, setActiveTrip, setLoading } = useDriverStore()
  const [filter, setFilter] = useState<Filter>('all')
  const [accepting, setAccepting] = useState<string | null>(null)

  useEffect(() => {
    setLoading(true)
    driverService.getRequests().then(setRequests).finally(() => setLoading(false))
  }, [])

  const filtered = requests.filter(r => {
    if (filter === 'nearby')       return r.distanceKm <= 5
    if (filter === 'high_earning') return r.priceOffered >= 30
    return true
  })

  const handleAccept = async (req: PassengerRequest) => {
    setAccepting(req.id)
    try {
      const trip = await driverService.acceptRequest(req.id)
      setActiveTrip(trip)
      navigate(`/driver/navigate/${trip.id}`)
    } catch {
      setAccepting(null)
    }
  }

  const handleDecline = async (id: string) => {
    await driverService.declineRequest(id)
    removeRequest(id)
  }

  const filterChips: { key: Filter; label: string }[] = [
    { key: 'all',          label: 'All' },
    { key: 'nearby',       label: 'Nearby (≤5 km)' },
    { key: 'high_earning', label: 'High Earning (≥GHS 30)' },
  ]

  return (
    <div className="page-container bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-100 sticky top-0 z-10">
      <div className="content-shell pt-10 pb-3">
        <div className="flex items-center gap-3 mb-3">
          <button
            onClick={() => navigate(-1)}
            className="w-9 h-9 flex items-center justify-center bg-gray-100 rounded-xl"
          >
            <ArrowLeft size={18} />
          </button>
          <p className="font-bold text-gray-900 text-lg flex-1">Ride Requests</p>
          <div className="flex items-center gap-1 text-gray-400">
            <SlidersHorizontal size={16} />
          </div>
        </div>

        {/* Filter chips */}
        <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
          {filterChips.map(({ key, label }) => (
            <button
              key={key}
              onClick={() => setFilter(key)}
              className={cn(
                'shrink-0 px-3 py-1.5 rounded-full text-xs font-semibold transition-colors',
                filter === key
                  ? 'bg-green-700 text-white'
                  : 'bg-gray-100 text-gray-600',
              )}
            >
              {label}
            </button>
          ))}
        </div>
      </div>
      </div>

      <div className="content-shell pt-4 pb-24 md:pb-8">
        {isLoading ? (
          <div className="grid gap-3 md:grid-cols-2">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-40 bg-white rounded-2xl animate-pulse border border-gray-100" />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center pt-20">
            <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <SlidersHorizontal size={28} className="text-gray-300" />
            </div>
            <p className="font-semibold text-gray-700">No matching requests</p>
            <p className="text-gray-400 text-sm mt-1">Try adjusting the filter above</p>
          </div>
        ) : (
          <>
            <p className="text-gray-400 text-xs font-medium mb-3">{filtered.length} request{filtered.length !== 1 ? 's' : ''} available</p>
            <div className="grid gap-3 md:grid-cols-2">
              {filtered.map(req => (
                <RequestDetailCard
                  key={req.id}
                  req={req}
                  accepting={accepting === req.id}
                  onAccept={() => handleAccept(req)}
                  onDecline={() => handleDecline(req.id)}
                />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  )
}

function RequestDetailCard({ req, accepting, onAccept, onDecline }: {
  req: PassengerRequest
  accepting: boolean
  onAccept: () => void
  onDecline: () => void
}) {
  const minsAgo = Math.round((Date.now() - new Date(req.requestedAt).getTime()) / 60_000)

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
      {/* Top: passenger info + price */}
      <div className="px-4 pt-4 pb-3 flex items-start justify-between">
        <div className="flex items-center gap-3">
          <Avatar name={req.passenger.fullName} size="sm" />
          <div>
            <p className="font-semibold text-gray-900">{req.passenger.fullName}</p>
            <p className="text-gray-400 text-xs">★ {req.passenger.rating} · {req.passenger.totalTrips} trips</p>
          </div>
        </div>
        <div className="text-right">
          <p className="font-bold text-green-700 text-xl">GHS {req.priceOffered}</p>
          <p className="text-gray-400 text-xs">{minsAgo}m ago</p>
        </div>
      </div>

      {/* Route */}
      <div className="px-4 pb-3">
        <div className="bg-gray-50 rounded-xl p-3 space-y-2">
          <div className="flex items-start gap-2">
            <div className="w-2 h-2 rounded-full bg-green-600 mt-1.5 shrink-0" />
            <div>
              <p className="text-gray-400 text-xs">Pickup</p>
              <p className="text-gray-900 text-sm font-medium">{req.pickupLocation}</p>
            </div>
          </div>
          <div className="w-px h-3 bg-gray-200 ml-[3px]" />
          <div className="flex items-start gap-2">
            <div className="w-2 h-2 rounded-full bg-red-500 mt-1.5 shrink-0" />
            <div>
              <p className="text-gray-400 text-xs">Drop-off</p>
              <p className="text-gray-900 text-sm font-medium">{req.dropoffLocation}</p>
            </div>
          </div>
        </div>

        <div className="flex gap-3 mt-2 text-xs text-gray-500">
          <span>📍 {req.distanceKm} km away</span>
          <span>⏱ ~{req.estimatedMinutes} min trip</span>
          <span>👤 {req.seatsRequested} seat{req.seatsRequested !== 1 ? 's' : ''}</span>
        </div>
      </div>

      {/* Actions */}
      <div className="flex border-t border-gray-100">
        <button
          onClick={onDecline}
          disabled={accepting}
          className="flex-1 py-3.5 text-gray-500 text-sm font-semibold border-r border-gray-100"
        >
          Decline
        </button>
        <button
          onClick={onAccept}
          disabled={accepting}
          className="flex-1 py-3.5 text-green-700 text-sm font-bold"
        >
          {accepting ? 'Accepting…' : 'Accept Ride'}
        </button>
      </div>
    </div>
  )
}
