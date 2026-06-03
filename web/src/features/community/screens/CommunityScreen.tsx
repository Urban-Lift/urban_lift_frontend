import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Search, Plus, Users, Lock } from 'lucide-react'
import { useCommunityStore } from '@/store/community.store'
import { communityService } from '@/services/community.service'
import { cn } from '@/utils/cn'
import type { CommunityGroup } from '@/types'

const GROUP_COLORS = ['bg-green-400', 'bg-blue-400', 'bg-purple-400', 'bg-amber-400', 'bg-red-400', 'bg-teal-400']
const groupColor = (id: string) => GROUP_COLORS[id.charCodeAt(4) % GROUP_COLORS.length]

export default function CommunityScreen() {
  const navigate = useNavigate()
  const { groups, isLoading, setGroups, updateGroup, setLoading } = useCommunityStore()
  const [tab,    setTab]    = useState<'mine' | 'discover'>('mine')
  const [query,  setQuery]  = useState('')
  const [joining, setJoining] = useState<string | null>(null)

  useEffect(() => {
    setLoading(true)
    communityService.getGroups().then(setGroups).finally(() => setLoading(false))
  }, [])

  const mine     = groups.filter(g => g.isJoined)
  const discover = groups.filter(g => !g.isJoined)
  const list     = (tab === 'mine' ? mine : discover).filter(g =>
    !query || g.name.toLowerCase().includes(query.toLowerCase()) ||
    g.primaryRoute?.toLowerCase().includes(query.toLowerCase()),
  )

  async function handleJoin(g: CommunityGroup) {
    setJoining(g.id)
    await communityService.joinGroup(g.id)
    updateGroup(g.id, { isJoined: true, memberCount: g.memberCount + 1 })
    setJoining(null)
  }

  return (
    <div className="page-container bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-100 sticky top-0 z-10">
        <div className="content-shell pt-10 pb-3">
          <div className="flex items-center justify-between mb-3">
            <p className="font-bold text-gray-900 text-lg">Community</p>
            <button
              onClick={() => navigate('/community/create')}
              className="flex items-center gap-1.5 text-sm font-semibold text-green-700 bg-green-50 px-3 py-1.5 rounded-xl"
            >
              <Plus size={15} /> New Group
            </button>
          </div>

          {/* Search */}
          <div className="flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 mb-3">
            <Search size={15} className="text-gray-400 shrink-0" />
            <input
              placeholder="Search groups or routes…"
              value={query}
              onChange={e => setQuery(e.target.value)}
              className="flex-1 bg-transparent text-sm outline-none text-gray-700 placeholder:text-gray-400"
            />
          </div>

          {/* Tabs */}
          <div className="flex max-w-xs">
            {(['mine', 'discover'] as const).map(t => (
              <button
                key={t}
                onClick={() => setTab(t)}
                className={cn(
                  'flex-1 py-2.5 text-sm font-medium border-b-2 transition-colors',
                  tab === t ? 'border-green-700 text-green-700' : 'border-transparent text-gray-500',
                )}
              >
                {t === 'mine' ? `My Groups${mine.length ? ` (${mine.length})` : ''}` : 'Discover'}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="content-shell pt-4 pb-24 md:pb-8">
        {isLoading ? (
          <div className="space-y-3">
            {[1, 2, 3].map(i => <div key={i} className="h-24 bg-white rounded-2xl animate-pulse border border-gray-100" />)}
          </div>
        ) : list.length === 0 ? (
          <div className="flex flex-col items-center py-16 text-center">
            <div className="w-14 h-14 bg-gray-100 rounded-2xl flex items-center justify-center mb-3">
              <Users size={26} className="text-gray-300" />
            </div>
            <p className="font-semibold text-gray-700 text-sm">
              {tab === 'mine' ? 'You haven\'t joined any groups yet' : 'No groups found'}
            </p>
            <p className="text-gray-400 text-xs mt-1">
              {tab === 'mine' ? 'Switch to Discover to find groups on your route' : 'Try a different search term'}
            </p>
            {tab === 'mine' && (
              <button onClick={() => setTab('discover')} className="mt-4 text-sm font-semibold text-green-700">
                Browse groups →
              </button>
            )}
          </div>
        ) : (
          <div className="space-y-3 md:grid md:grid-cols-2 md:gap-4 md:space-y-0">
            {list.map(g => (
              <GroupCard
                key={g.id}
                group={g}
                color={groupColor(g.id)}
                joining={joining === g.id}
                onOpen={() => navigate(`/community/${g.id}/chat`)}
                onJoin={() => handleJoin(g)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

function GroupCard({ group, color, joining, onOpen, onJoin }: {
  group: CommunityGroup; color: string; joining: boolean
  onOpen: () => void; onJoin: () => void
}) {
  const initials = group.name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase()

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
      <div className="p-4">
        <div className="flex items-start gap-3">
          <div className={`w-11 h-11 ${color} rounded-xl flex items-center justify-center text-white font-bold text-sm shrink-0`}>
            {initials}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2">
              <p className="font-bold text-gray-900 text-sm leading-tight">{group.name}</p>
              {group.privacy === 'private' && (
                <Lock size={12} className="text-gray-400 shrink-0 mt-0.5" />
              )}
            </div>
            {group.primaryRoute && (
              <p className="text-xs text-green-700 font-medium mt-0.5 truncate">{group.primaryRoute}</p>
            )}
            {group.description && (
              <p className="text-xs text-gray-500 mt-1 line-clamp-2">{group.description}</p>
            )}
          </div>
        </div>

        <div className="flex items-center justify-between mt-3">
          <div className="flex items-center gap-1 text-gray-400 text-xs">
            <Users size={12} />
            <span>{group.memberCount} member{group.memberCount !== 1 ? 's' : ''}</span>
          </div>
          {group.isJoined ? (
            <button
              onClick={onOpen}
              className="px-4 py-1.5 bg-green-700 text-white text-xs font-semibold rounded-xl"
            >
              Open Chat
            </button>
          ) : (
            <button
              onClick={onJoin}
              disabled={joining}
              className="px-4 py-1.5 border border-green-700 text-green-700 text-xs font-semibold rounded-xl hover:bg-green-50 transition-colors disabled:opacity-50"
            >
              {joining ? 'Joining…' : '+ Join'}
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
