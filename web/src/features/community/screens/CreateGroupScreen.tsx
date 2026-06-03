import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft, Globe, Lock } from 'lucide-react'
import toast from 'react-hot-toast'
import { Button, Input } from '@/components/ui'
import { useCommunityStore } from '@/store/community.store'
import { communityService } from '@/services/community.service'
import { ACCRA_LOCATIONS } from '@/utils/constants'
import { cn } from '@/utils/cn'

const COVER_COLORS = [
  { id: 'green',  cls: 'bg-green-500'  },
  { id: 'blue',   cls: 'bg-blue-500'   },
  { id: 'purple', cls: 'bg-purple-500' },
  { id: 'amber',  cls: 'bg-amber-500'  },
  { id: 'red',    cls: 'bg-red-500'    },
  { id: 'teal',   cls: 'bg-teal-500'   },
]

export default function CreateGroupScreen() {
  const navigate = useNavigate()
  const { prependGroup } = useCommunityStore()

  const [color,       setColor]       = useState('green')
  const [name,        setName]        = useState('')
  const [pickup,      setPickup]      = useState('')
  const [dropoff,     setDropoff]     = useState('')
  const [description, setDescription] = useState('')
  const [privacy,     setPrivacy]     = useState<'public' | 'private'>('public')
  const [saving,      setSaving]      = useState(false)

  const selectedColor = COVER_COLORS.find(c => c.id === color)!
  const initials = name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase() || '?'
  const route = pickup && dropoff ? `${pickup} → ${dropoff}` : undefined

  async function handleCreate() {
    if (!name.trim()) { toast.error('Group name is required'); return }
    setSaving(true)
    try {
      const group = await communityService.createGroup({
        name: name.trim(), primaryRoute: route, description: description.trim() || undefined, privacy,
      })
      prependGroup(group)
      toast.success('Group created!')
      navigate(`/community/${group.id}/chat`, { replace: true })
    } catch {
      toast.error('Failed to create group')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="page-container bg-gray-50">
      <div className="bg-white border-b border-gray-100 sticky top-0 z-10">
        <div className="content-shell pt-10 pb-4 flex items-center gap-3">
          <button onClick={() => navigate(-1)} className="w-9 h-9 bg-gray-100 rounded-xl flex items-center justify-center">
            <ArrowLeft size={18} />
          </button>
          <p className="font-bold text-gray-900 text-lg">Create Group</p>
        </div>
      </div>

      <div className="content-shell pt-6 pb-24 md:pb-8 space-y-5">
        {/* Cover preview + color picker */}
        <div className="flex flex-col items-center gap-4">
          <div className={`w-20 h-20 ${selectedColor.cls} rounded-2xl flex items-center justify-center text-white font-extrabold text-2xl shadow-sm`}>
            {initials}
          </div>
          <div className="flex gap-2">
            {COVER_COLORS.map(c => (
              <button
                key={c.id}
                onClick={() => setColor(c.id)}
                className={cn(
                  `w-7 h-7 ${c.cls} rounded-full transition-all`,
                  color === c.id ? 'ring-2 ring-offset-2 ring-gray-400 scale-110' : '',
                )}
              />
            ))}
          </div>
        </div>

        {/* Form */}
        <div className="bg-white rounded-2xl border border-gray-100 p-5 space-y-4">
          <Input
            label="Group Name"
            placeholder="e.g. East Legon Morning Commuters"
            value={name}
            onChange={e => setName(e.target.value)}
          />

          {/* Primary route */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Primary Route (optional)</label>
            <div className="grid grid-cols-2 gap-2">
              <select
                value={pickup}
                onChange={e => setPickup(e.target.value)}
                className="border border-gray-200 rounded-xl px-3 py-2.5 text-sm bg-white text-gray-700 outline-none focus:ring-2 focus:ring-green-700"
              >
                <option value="">From…</option>
                {ACCRA_LOCATIONS.filter(l => l !== dropoff).map(l => <option key={l} value={l}>{l}</option>)}
              </select>
              <select
                value={dropoff}
                onChange={e => setDropoff(e.target.value)}
                className="border border-gray-200 rounded-xl px-3 py-2.5 text-sm bg-white text-gray-700 outline-none focus:ring-2 focus:ring-green-700"
              >
                <option value="">To…</option>
                {ACCRA_LOCATIONS.filter(l => l !== pickup).map(l => <option key={l} value={l}>{l}</option>)}
              </select>
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Description (optional)</label>
            <textarea
              rows={3}
              placeholder="What's this group about? Who should join?"
              value={description}
              onChange={e => setDescription(e.target.value)}
              className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm text-gray-900 placeholder:text-gray-400 outline-none focus:ring-2 focus:ring-green-700 resize-none"
            />
          </div>

          {/* Privacy */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Privacy</label>
            <div className="grid grid-cols-2 gap-2">
              {(['public', 'private'] as const).map(p => (
                <button
                  key={p}
                  onClick={() => setPrivacy(p)}
                  className={cn(
                    'flex items-center gap-2 px-4 py-3 rounded-xl border-2 text-sm font-medium transition-all',
                    privacy === p ? 'border-green-700 bg-green-50 text-green-700' : 'border-gray-200 text-gray-600',
                  )}
                >
                  {p === 'public' ? <Globe size={15} /> : <Lock size={15} />}
                  <span className="capitalize">{p}</span>
                </button>
              ))}
            </div>
            <p className="text-xs text-gray-400 mt-1.5">
              {privacy === 'public' ? 'Anyone can find and join this group.' : 'Only people with an invite link can join.'}
            </p>
          </div>
        </div>

        <Button fullWidth size="lg" onClick={handleCreate} loading={saving} disabled={!name.trim()}>
          Create Group
        </Button>
      </div>
    </div>
  )
}
