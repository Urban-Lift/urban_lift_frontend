import { useState, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowUpDown, Users, ChevronRight, TrendingUp } from 'lucide-react'
import { useAuthStore } from '@/store/auth.store'
import { useRideStore } from '@/store/ride.store'
import { rideService } from '@/services/ride.service'
import { ACCRA_LOCATIONS } from '@/utils/constants'
import { cn } from '@/utils/cn'
import type { TripType } from '@/types'

const TRIP_TYPES: { value: TripType; label: string }[] = [
  { value: 'one_way',    label: 'One Way'    },
  { value: 'round_trip', label: 'Round Trip' },
]

function nextDays(n: number) {
  return Array.from({ length: n }, (_, i) => {
    const d = new Date()
    d.setDate(d.getDate() + i)
    return {
      value: d.toISOString().slice(0, 10),
      short: i === 0 ? 'Today' : i === 1 ? 'Tmrw'
        : d.toLocaleDateString('en-GB', { weekday: 'short' }),
      day: i === 0 ? '' : String(d.getDate()),
    }
  })
}

function greeting() {
  const h = new Date().getHours()
  if (h < 12) return 'Good morning'
  if (h < 17) return 'Good afternoon'
  return 'Good evening'
}

const POPULAR_ROUTES = [
  { from: 'East Legon',     to: 'Accra Central'     },
  { from: 'Legon Campus',   to: 'Airport City'      },
  { from: 'Madina Station', to: 'Osu Oxford Street' },
]

export default function PassengerHomeScreen() {
  const navigate  = useNavigate()
  const user      = useAuthStore(s => s.user)
  const { setSearchParams, setAvailableRides, setLoading, isLoading } = useRideStore()

  const [pickup,   setPickup]   = useState('')
  const [dropoff,  setDropoff]  = useState('')
  const [date,     setDate]     = useState(nextDays(1)[0].value)
  const [seats,    setSeats]    = useState(1)
  const [tripType, setTripType] = useState<TripType>('one_way')
  const [error,    setError]    = useState('')

  const days      = nextDays(8)
  const firstName = user?.fullName.split(' ')[0] ?? 'there'
  const initials  = (user?.fullName ?? 'U').split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()

  async function handleSearch() {
    if (!pickup)            { setError('Select a pickup location'); return }
    if (!dropoff)           { setError('Select a destination');     return }
    if (pickup === dropoff) { setError('Pickup and destination cannot be the same'); return }
    setError('')
    setLoading(true)
    setSearchParams({ pickupLocation: pickup, dropoffLocation: dropoff, date, time: '', seats, tripType })
    try {
      const rides = await rideService.searchRides({ pickupLocation: pickup, dropoffLocation: dropoff, date, seats })
      setAvailableRides(rides)
      navigate('/passenger/rides')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="page-container overflow-x-hidden w-full" style={{ background: '#EFF4EF' }}>

      {/* ── Hero ──────────────────────────────────────────────────── */}
      <div
        className="relative overflow-hidden"
        style={{ background: 'linear-gradient(160deg, #0F4024 0%, #1A7A3C 100%)' }}
      >
        {/* Subtle road grid */}
        <svg className="absolute inset-0 w-full h-full opacity-[0.07]" xmlns="http://www.w3.org/2000/svg">
          <line x1="0" y1="40%" x2="100%" y2="45%" stroke="white" strokeWidth="2"/>
          <line x1="0" y1="75%" x2="100%" y2="70%" stroke="white" strokeWidth="1.2"/>
          <line x1="30%" y1="0" x2="28%" y2="100%" stroke="white" strokeWidth="2"/>
          <line x1="70%" y1="0" x2="72%" y2="100%" stroke="white" strokeWidth="1.2"/>
          <circle cx="72%" cy="44%" r="7" fill="white" opacity="0.5"/>
          <circle cx="72%" cy="44%" r="3" fill="white" opacity="0.9"/>
        </svg>

        <div className="content-shell pt-12 pb-20 relative z-10">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-300 text-base font-medium">{greeting()},</p>
              <h1 className="text-white text-3xl font-extrabold mt-1 tracking-tight">
                {firstName} 👋
              </h1>
            </div>
            <button
              onClick={() => navigate('/profile')}
              className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-sm border border-white/30 flex items-center justify-center text-white font-bold text-base hover:bg-white/30 transition-colors"
            >
              {initials}
            </button>
          </div>
        </div>
      </div>

      <div className="content-shell pb-28 md:pb-10">

        {/* ── Search card ───────────────────────────────────────── */}
        <div className="bg-white rounded-3xl shadow-xl shadow-black/10 -mt-10 relative z-10 overflow-hidden border border-gray-100/80">

          {/* Route inputs */}
          <div className="px-5 pt-6 pb-4">
            <div className="flex gap-3 min-w-0">
              {/* Vertical route line */}
              <div className="flex flex-col items-center pt-[18px] shrink-0">
                <div className="w-3 h-3 rounded-full bg-green-500 ring-[3px] ring-green-100" />
                <div className="w-px flex-1 bg-gray-200 my-2 min-h-[32px]" />
                <div className="w-3 h-3 rounded-full bg-red-500 ring-[3px] ring-red-100" />
              </div>

              {/* Fields */}
              <div className="flex-1 min-w-0 space-y-0">
                <LocationField
                  placeholder="Pickup location"
                  value={pickup}
                  onChange={setPickup}
                  exclude={dropoff}
                />
                <div className="h-px bg-gray-100 ml-1" />
                <LocationField
                  placeholder="Drop-off location"
                  value={dropoff}
                  onChange={setDropoff}
                  exclude={pickup}
                />
              </div>

              {/* Swap */}
              <button
                onClick={() => { const t = pickup; setPickup(dropoff); setDropoff(t) }}
                className="self-center w-9 h-9 rounded-full bg-gray-100 hover:bg-green-100 flex items-center justify-center transition-colors shrink-0"
              >
                <ArrowUpDown size={16} className="text-gray-500" />
              </button>
            </div>
          </div>

          <div className="h-px bg-gray-100 mx-5" />

          {/* Date strip */}
          <div className="px-5 py-4">
            <div className="flex gap-2 overflow-x-auto scrollbar-hide">
              {days.map(d => (
                <button
                  key={d.value}
                  onClick={() => setDate(d.value)}
                  className={cn(
                    'shrink-0 flex flex-col items-center px-4 py-2.5 rounded-2xl text-sm font-semibold transition-all',
                    date === d.value
                      ? 'bg-green-600 text-white shadow-md shadow-green-600/25'
                      : 'bg-gray-50 text-gray-500 hover:bg-gray-100',
                  )}
                >
                  <span className="leading-tight">{d.short}</span>
                  {d.day && (
                    <span className="text-[11px] font-normal opacity-70 leading-tight mt-0.5">{d.day}</span>
                  )}
                </button>
              ))}
            </div>
          </div>

          <div className="h-px bg-gray-100 mx-5" />

          {/* Seats + Trip type */}
          <div className="px-5 py-4 flex items-center gap-3 min-w-0">
            {/* Seats counter */}
            <div className="flex items-center gap-2.5 bg-gray-50 rounded-2xl px-3.5 py-2.5 shrink-0">
              <Users size={15} className="text-gray-400" />
              <button
                onClick={() => setSeats(s => Math.max(1, s - 1))}
                className="w-7 h-7 rounded-full bg-white border border-gray-200 flex items-center justify-center text-gray-700 font-bold text-base leading-none shadow-sm hover:border-gray-300 transition-colors"
              >
                −
              </button>
              <span className="text-base font-bold text-gray-900 w-5 text-center tabular-nums">{seats}</span>
              <button
                onClick={() => setSeats(s => Math.min(6, s + 1))}
                className="w-7 h-7 rounded-full bg-green-500 flex items-center justify-center text-white font-bold text-base leading-none shadow-sm hover:bg-green-600 transition-colors"
              >
                +
              </button>
            </div>

            {/* Trip type toggle */}
            <div className="flex bg-gray-100 rounded-2xl p-1 flex-1 min-w-0">
              {TRIP_TYPES.map(t => (
                <button
                  key={t.value}
                  onClick={() => setTripType(t.value)}
                  className={cn(
                    'flex-1 py-2 rounded-xl text-sm font-semibold transition-all truncate',
                    tripType === t.value
                      ? 'bg-white text-gray-900 shadow-sm'
                      : 'text-gray-500',
                  )}
                >
                  {t.label}
                </button>
              ))}
            </div>
          </div>

          {error && (
            <p className="px-5 -mt-1 pb-2 text-sm text-red-500 font-medium">{error}</p>
          )}

          {/* Find Rides CTA */}
          <div className="px-5 pb-6">
            <button
              onClick={handleSearch}
              disabled={isLoading}
              className="w-full h-14 bg-green-500 hover:bg-green-600 text-white font-bold text-lg rounded-2xl flex items-center justify-center gap-2 transition-all shadow-lg shadow-green-500/30 disabled:opacity-60"
            >
              {isLoading ? (
                <div className="w-6 h-6 border-2 border-white/40 border-t-white rounded-full animate-spin" />
              ) : (
                <>Find Rides <span className="text-xl">→</span></>
              )}
            </button>
          </div>
        </div>

        {/* ── Popular routes ──────────────────────────────────── */}
        <div className="mt-8">
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp size={16} className="text-green-600" />
            <h3 className="text-base font-bold text-gray-800">Popular routes</h3>
          </div>
          <div className="space-y-3">
            {POPULAR_ROUTES.map(({ from, to }) => (
              <button
                key={`${from}-${to}`}
                onClick={() => { setPickup(from); setDropoff(to) }}
                className="w-full flex items-center gap-4 px-5 py-4 rounded-2xl bg-white border border-gray-100 hover:border-green-300 hover:shadow-sm transition-all text-left group"
              >
                <div className="flex flex-col items-center gap-1 shrink-0">
                  <div className="w-2 h-2 rounded-full bg-green-500" />
                  <div className="w-px h-3 bg-gray-300" />
                  <div className="w-2 h-2 rounded-full bg-red-400" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold text-gray-900 truncate">{from}</p>
                  <p className="text-sm text-gray-400 truncate mt-0.5">{to}</p>
                </div>
                <ChevronRight size={16} className="text-gray-300 group-hover:text-green-500 transition-colors shrink-0" />
              </button>
            ))}
          </div>
        </div>

      </div>
    </div>
  )
}

// ── Location Field ────────────────────────────────────────────────────────────

function LocationField({ placeholder, value, onChange, exclude }: {
  placeholder: string; value: string
  onChange: (v: string) => void; exclude?: string
}) {
  const [open, setOpen] = useState(false)
  const ref  = useRef<HTMLDivElement>(null)
  const opts = ACCRA_LOCATIONS.filter(l => l !== exclude)

  useEffect(() => {
    function handler(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen(o => !o)}
        className="w-full text-left py-3.5 text-base focus:outline-none"
      >
        {value
          ? <span className="font-semibold text-gray-900">{value}</span>
          : <span className="text-gray-400">{placeholder}</span>
        }
      </button>

      {open && (
        <div className="absolute top-full left-0 right-0 z-50 mt-1 bg-white border border-gray-200 rounded-2xl shadow-xl overflow-hidden max-h-56 overflow-y-auto">
          {opts.map(loc => (
            <button
              key={loc}
              onClick={() => { onChange(loc); setOpen(false) }}
              className={cn(
                'w-full px-4 py-3.5 text-sm text-left hover:bg-green-50 transition-colors flex items-center gap-3',
                value === loc ? 'bg-green-50 text-green-700 font-semibold' : 'text-gray-700',
              )}
            >
              <div className={cn('w-2 h-2 rounded-full shrink-0', value === loc ? 'bg-green-500' : 'bg-gray-300')} />
              {loc}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
