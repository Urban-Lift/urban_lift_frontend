import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft, SlidersHorizontal, MapPin, Star } from 'lucide-react'
import { RideCardSkeleton } from '@/components/ui'
import { useRideStore } from '@/store/ride.store'
import { formatCurrency, formatTime } from '@/utils/format'
import { cn } from '@/utils/cn'
import type { Ride } from '@/types'

type SortKey = 'price' | 'time' | 'rating' | 'seats'

const SORT_OPTIONS: { key: SortKey; label: string }[] = [
  { key: 'price',  label: 'Cheapest' },
  { key: 'time',   label: 'Earliest' },
  { key: 'rating', label: 'Top rated' },
  { key: 'seats',  label: 'Most seats' },
]

function sortRides(rides: Ride[], key: SortKey): Ride[] {
  return [...rides].sort((a, b) => {
    if (key === 'price')  return a.pricePerSeat - b.pricePerSeat
    if (key === 'time')   return new Date(a.departureTime).getTime() - new Date(b.departureTime).getTime()
    if (key === 'rating') return b.driver.avgRating - a.driver.avgRating
    if (key === 'seats')  return b.availableSeats - a.availableSeats
    return 0
  })
}

export default function AvailableRidesScreen() {
  const navigate = useNavigate()
  const { availableRides, searchParams, isLoading } = useRideStore()
  const [sort, setSort] = useState<SortKey>('time')

  const sorted = sortRides(availableRides, sort)

  return (
    <div className="page-container bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-100 sticky top-0 z-10">
      <div className="content-shell pt-10 pb-3">
        <div className="flex items-center gap-3 mb-3">
          <button onClick={() => navigate(-1)} className="w-9 h-9 rounded-full bg-surface flex items-center justify-center">
            <ArrowLeft size={18} className="text-gray-600" />
          </button>
          <div className="flex-1">
            <div className="flex items-center gap-1.5 text-sm font-semibold text-gray-900">
              <MapPin size={14} className="text-green-700" />
              {searchParams?.pickupLocation ?? '—'}
              <span className="text-gray-400 font-normal mx-0.5">→</span>
              <MapPin size={14} className="text-red-500" />
              {searchParams?.dropoffLocation ?? '—'}
            </div>
            <p className="text-xs text-gray-500 mt-0.5">
              {searchParams
                ? new Date(searchParams.date).toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'short' })
                : ''} · {searchParams?.seats ?? 1} seat{(searchParams?.seats ?? 1) !== 1 ? 's' : ''}
            </p>
          </div>
          <button className="w-9 h-9 rounded-full bg-surface flex items-center justify-center">
            <SlidersHorizontal size={16} className="text-gray-600" />
          </button>
        </div>

        {/* Sort chips */}
        <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
          {SORT_OPTIONS.map(o => (
            <button
              key={o.key}
              onClick={() => setSort(o.key)}
              className={cn(
                'shrink-0 px-3 py-1 rounded-full text-xs font-medium border transition-all',
                sort === o.key
                  ? 'bg-green-700 text-white border-green-700'
                  : 'bg-white text-gray-600 border-gray-200'
              )}
            >
              {o.label}
            </button>
          ))}
        </div>
      </div>
      </div>

      <div className="content-shell py-4 pb-24 md:pb-8">
        {isLoading ? (
          <div className="grid gap-3 md:grid-cols-2">
            <RideCardSkeleton />
            <RideCardSkeleton />
            <RideCardSkeleton />
          </div>
        ) : sorted.length === 0 ? (
          <EmptyState onBack={() => navigate(-1)} />
        ) : (
          <>
            <p className="text-xs text-gray-500 mb-3">{sorted.length} ride{sorted.length !== 1 ? 's' : ''} found</p>
            <div className="grid gap-3 md:grid-cols-2">
              {sorted.map(ride => (
                <RideRow
                  key={ride.id}
                  ride={ride}
                  onClick={() => navigate(`/passenger/rides/${ride.id}`)}
                />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  )
}

// ── Ride Row Card ─────────────────────────────────────────────────────────────

function RideRow({ ride, onClick }: { ride: Ride; onClick: () => void }) {
  const amenities: string[] = []
  if (ride.vehicle.hasAc)     amenities.push('A/C')
  if (ride.vehicle.hasMusic)  amenities.push('Music')
  if (ride.vehicle.allowsPets) amenities.push('Pets OK')

  const isSuperDriver = ride.driver.avgRating >= 4.8

  return (
    <button
      onClick={onClick}
      className="w-full bg-white rounded-2xl border border-border p-4 text-left hover:border-green-400 hover:shadow-card transition-all active:scale-[0.99]"
    >
      {/* Driver row */}
      <div className="flex items-center gap-3 mb-3">
        <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center text-green-700 font-bold text-sm shrink-0">
          {ride.driver.fullName.split(' ').map(n => n[0]).join('').slice(0, 2)}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5">
            <span className="text-sm font-semibold text-gray-900 truncate">{ride.driver.fullName}</span>
            {isSuperDriver && (
              <span className="shrink-0 text-[10px] font-bold bg-amber-100 text-amber-700 px-1.5 py-0.5 rounded-full">★ Super</span>
            )}
          </div>
          <div className="flex items-center gap-1 mt-0.5">
            <Star size={11} className="text-amber-400 fill-amber-400" />
            <span className="text-xs text-gray-500">{ride.driver.avgRating.toFixed(1)} · {ride.vehicle.make} {ride.vehicle.model}</span>
          </div>
        </div>
        <div className="text-right shrink-0">
          <p className="text-base font-bold text-green-700">{formatCurrency(ride.pricePerSeat)}</p>
          <p className="text-[10px] text-gray-400">per seat</p>
        </div>
      </div>

      {/* Route */}
      <div className="flex items-stretch gap-2 mb-3">
        <div className="flex flex-col items-center gap-0.5 mt-1">
          <div className="w-2 h-2 rounded-full bg-green-600 shrink-0" />
          <div className="w-px flex-1 bg-gray-200" />
          <div className="w-2 h-2 rounded-full bg-red-500 shrink-0" />
        </div>
        <div className="flex-1 space-y-1">
          <p className="text-sm text-gray-800 font-medium">{ride.pickupLocation}</p>
          <p className="text-xs text-gray-400">{formatTime(ride.departureTime)} · {ride.availableSeats} seat{ride.availableSeats !== 1 ? 's' : ''} left</p>
          <p className="text-sm text-gray-800 font-medium">{ride.dropoffLocation}</p>
          <p className="text-xs text-gray-400">{formatTime(ride.estimatedArrivalTime)}</p>
        </div>
      </div>

      {/* Amenities */}
      {amenities.length > 0 && (
        <div className="flex gap-1.5 flex-wrap">
          {amenities.map(a => (
            <span key={a} className="text-[10px] bg-surface text-gray-500 border border-border px-2 py-0.5 rounded-full">
              {a}
            </span>
          ))}
        </div>
      )}
    </button>
  )
}

// ── Empty State ───────────────────────────────────────────────────────────────

function EmptyState({ onBack }: { onBack: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center px-4">
      <div className="w-16 h-16 rounded-2xl bg-gray-100 flex items-center justify-center mb-4">
        <MapPin size={28} className="text-gray-400" />
      </div>
      <h3 className="text-base font-semibold text-gray-800 mb-2">No rides found</h3>
      <p className="text-sm text-gray-500 mb-6 max-w-xs">
        No drivers are heading that way on that date. Try a different date or nearby location.
      </p>
      <button onClick={onBack} className="text-sm font-medium text-green-700 hover:underline">
        Change search
      </button>
    </div>
  )
}
