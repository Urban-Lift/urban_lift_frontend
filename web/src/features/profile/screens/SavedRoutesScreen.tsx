import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft, Trash2, Plus, MapPin } from 'lucide-react'
import toast from 'react-hot-toast'
import { Button } from '@/components/ui'
import { profileService } from '@/services/profile.service'
import { ACCRA_LOCATIONS } from '@/utils/constants'
import { cn } from '@/utils/cn'
import type { SavedRoute } from '@/types'

export default function SavedRoutesScreen() {
  const navigate = useNavigate()
  const [routes,   setRoutes]   = useState<SavedRoute[]>([])
  const [loading,  setLoading]  = useState(true)
  const [adding,   setAdding]   = useState(false)
  const [pickup,   setPickup]   = useState('')
  const [dropoff,  setDropoff]  = useState('')
  const [label,    setLabel]    = useState('')
  const [saving,   setSaving]   = useState(false)
  const [deleting, setDeleting] = useState<string | null>(null)

  useEffect(() => {
    profileService.getSavedRoutes().then(setRoutes).finally(() => setLoading(false))
  }, [])

  async function handleAdd() {
    if (!pickup || !dropoff) { toast.error('Select both pickup and destination'); return }
    if (pickup === dropoff)  { toast.error('Pickup and destination must differ'); return }
    setSaving(true)
    try {
      const r = await profileService.addSavedRoute({ pickupLocation: pickup, dropoffLocation: dropoff, label: label || undefined })
      setRoutes(prev => [...prev, r])
      setAdding(false); setPickup(''); setDropoff(''); setLabel('')
      toast.success('Route saved!')
    } catch {
      toast.error('Failed to save route')
    } finally {
      setSaving(false)
    }
  }

  async function handleDelete(id: string) {
    setDeleting(id)
    try {
      await profileService.deleteSavedRoute(id)
      setRoutes(prev => prev.filter(r => r.id !== id))
    } catch {
      toast.error('Failed to delete route')
    } finally {
      setDeleting(null)
    }
  }

  return (
    <div className="page-container bg-gray-50">
      <div className="bg-white border-b border-gray-100 sticky top-0 z-10">
        <div className="content-shell pt-10 pb-4 flex items-center gap-3">
          <button onClick={() => navigate(-1)} className="w-9 h-9 bg-gray-100 rounded-xl flex items-center justify-center">
            <ArrowLeft size={18} />
          </button>
          <p className="font-bold text-gray-900 text-lg flex-1">Saved Routes</p>
          <button
            onClick={() => setAdding(a => !a)}
            className="flex items-center gap-1.5 text-sm font-semibold text-green-700"
          >
            <Plus size={16} /> Add
          </button>
        </div>
      </div>

      <div className="content-shell pt-5 pb-24 md:pb-8 space-y-4">
        {/* Add form */}
        {adding && (
          <div className="bg-white rounded-2xl border border-green-200 p-4 space-y-3">
            <p className="font-semibold text-gray-900 text-sm">New Route</p>
            <LocationSelect label="From" value={pickup} onChange={setPickup} exclude={dropoff} />
            <LocationSelect label="To"   value={dropoff} onChange={setDropoff} exclude={pickup} />
            <input
              placeholder="Label (optional, e.g. Morning commute)"
              value={label}
              onChange={e => setLabel(e.target.value)}
              className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-green-700"
            />
            <div className="flex gap-2 pt-1">
              <button onClick={() => setAdding(false)} className="flex-1 py-2 rounded-xl border border-gray-200 text-sm text-gray-500 font-semibold">Cancel</button>
              <Button className="flex-1" onClick={handleAdd} loading={saving}>Save Route</Button>
            </div>
          </div>
        )}

        {/* List */}
        {loading ? (
          <div className="space-y-2">
            {[1, 2].map(i => <div key={i} className="h-20 bg-white rounded-2xl animate-pulse border border-gray-100" />)}
          </div>
        ) : routes.length === 0 ? (
          <div className="bg-white rounded-2xl border border-gray-100 p-10 text-center">
            <MapPin size={28} className="text-gray-300 mx-auto mb-3" />
            <p className="font-semibold text-gray-600 text-sm">No saved routes yet</p>
            <p className="text-gray-400 text-xs mt-1">Save your frequent routes for quick booking</p>
            <button onClick={() => setAdding(true)} className="mt-4 text-sm font-semibold text-green-700">
              + Add your first route
            </button>
          </div>
        ) : (
          <div className="space-y-2">
            {routes.map(r => (
              <div key={r.id} className="bg-white rounded-2xl border border-gray-100 p-4 flex items-center gap-3">
                {/* Route visual */}
                <div className="flex flex-col items-center gap-0.5 shrink-0">
                  <div className="w-2 h-2 rounded-full bg-green-600" />
                  <div className="w-px h-4 bg-gray-200" />
                  <div className="w-2 h-2 rounded-full bg-red-500" />
                </div>
                <div className="flex-1 min-w-0">
                  {r.label && <p className="text-xs text-gray-400 mb-0.5">{r.label}</p>}
                  <p className="text-sm font-semibold text-gray-900 truncate">{r.pickupLocation}</p>
                  <p className="text-sm text-gray-500 truncate">{r.dropoffLocation}</p>
                </div>
                <button
                  onClick={() => handleDelete(r.id)}
                  disabled={deleting === r.id}
                  className="w-8 h-8 flex items-center justify-center text-gray-300 hover:text-red-400 transition-colors"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

function LocationSelect({ label, value, onChange, exclude }: {
  label: string; value: string; onChange: (v: string) => void; exclude?: string
}) {
  const options = ACCRA_LOCATIONS.filter(l => l !== exclude)
  return (
    <div>
      <label className="text-xs font-medium text-gray-500 block mb-1">{label}</label>
      <select
        value={value}
        onChange={e => onChange(e.target.value)}
        className={cn(
          'w-full border rounded-xl px-3 py-2.5 text-sm bg-white outline-none focus:ring-2 focus:ring-green-700',
          value ? 'text-gray-900 border-gray-200' : 'text-gray-400 border-gray-200',
        )}
      >
        <option value="">Select location</option>
        {options.map(l => <option key={l} value={l}>{l}</option>)}
      </select>
    </div>
  )
}
