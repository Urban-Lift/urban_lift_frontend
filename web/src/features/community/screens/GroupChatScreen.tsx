import { useEffect, useRef, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { ArrowLeft, Bell, Plus, Smile } from 'lucide-react'
import { useCommunityStore } from '@/store/community.store'
import { communityService } from '@/services/community.service'
import { useAuthStore } from '@/store/auth.store'
import { cn } from '@/utils/cn'
import type { GroupMessage } from '@/types'

function dateLabel(date: Date): string {
  const now   = new Date()
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
  const d     = new Date(date.getFullYear(), date.getMonth(), date.getDate())
  const diff  = today.getTime() - d.getTime()
  if (diff === 0) return 'Today'
  if (diff === 86400000) return 'Yesterday'
  return date.toLocaleDateString('en-GH', { day: 'numeric', month: 'long', year: 'numeric' })
}

type Item = { type: 'separator'; label: string } | { type: 'message'; msg: GroupMessage }

function buildItems(msgs: GroupMessage[]): Item[] {
  const items: Item[] = []
  let lastLabel: string | null = null
  for (const msg of msgs) {
    const label = dateLabel(new Date(msg.createdAt))
    if (label !== lastLabel) {
      items.push({ type: 'separator', label })
      lastLabel = label
    }
    items.push({ type: 'message', msg })
  }
  return items
}

export default function GroupChatScreen() {
  const { groupId } = useParams<{ groupId: string }>()
  const navigate    = useNavigate()
  const currentUser = useAuthStore(s => s.user)
  const { groups, messages, isLoading, isSending, setMessages, appendMessage, setLoading, setSending } = useCommunityStore()

  const group = groups.find(g => g.id === groupId)
  const msgs  = messages[groupId!] ?? []
  const items = buildItems(msgs)

  const [text, setText] = useState('')
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!groupId) return
    setLoading(true)
    communityService.getMessages(groupId).then(m => setMessages(groupId, m)).finally(() => setLoading(false))
  }, [groupId])

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [msgs.length])

  async function handleSend() {
    const content = text.trim()
    if (!content || !groupId) return
    setText('')
    setSending(true)
    try {
      const msg = await communityService.sendMessage(groupId, content)
      appendMessage(groupId, msg)
    } finally {
      setSending(false)
    }
  }

  const initials = (name: string) => name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()

  return (
    <div className="page-container bg-[#F0F2F5] flex flex-col">
      {/* Header */}
      <div className="bg-white border-b border-gray-100 sticky top-0 z-10 shrink-0">
        <div className="content-shell pt-10 pb-3 flex items-center gap-3">
          <button onClick={() => navigate(-1)} className="w-9 h-9 bg-gray-100 rounded-full flex items-center justify-center shrink-0 hover:bg-gray-200 transition-colors">
            <ArrowLeft size={17} className="text-gray-700" />
          </button>
          <div className="flex-1 min-w-0">
            <p className="font-bold text-gray-900 text-[15px] truncate">{group?.name ?? 'Group Chat'}</p>
            <p className="text-xs text-gray-400">{group?.memberCount ?? '—'} Members • 3 Online</p>
          </div>
          <button className="w-9 h-9 flex items-center justify-center shrink-0">
            <Bell size={20} className="text-gray-400" />
          </button>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto py-4 space-y-0.5">
        <div className="content-shell space-y-0.5">
          {isLoading ? (
            <div className="space-y-3 pt-4">
              {[1, 2, 3].map(i => (
                <div key={i} className={cn('flex gap-2', i % 2 === 0 ? 'justify-end' : '')}>
                  {i % 2 !== 0 && <div className="w-8 h-8 bg-gray-200 rounded-full animate-pulse shrink-0" />}
                  <div className={cn('h-12 rounded-2xl animate-pulse', i % 2 === 0 ? 'w-40 bg-green-100' : 'w-52 bg-white border border-gray-100')} />
                </div>
              ))}
            </div>
          ) : msgs.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <p className="text-gray-400 text-sm">No messages yet.</p>
              <p className="text-gray-400 text-xs mt-1">Be the first to say something!</p>
            </div>
          ) : (
            items.map((item, i) =>
              item.type === 'separator' ? (
                <DateSeparator key={`sep-${i}`} label={item.label} />
              ) : (
                <MessageBubble
                  key={item.msg.id}
                  msg={item.msg}
                  isMine={item.msg.sender.id === currentUser?.id}
                  showAvatar={
                    i === 0 ||
                    items[i - 1].type === 'separator' ||
                    (items[i - 1].type === 'message' && (items[i - 1] as { type: 'message'; msg: GroupMessage }).msg.sender.id !== item.msg.sender.id)
                  }
                  initials={initials(item.msg.sender.fullName)}
                />
              )
            )
          )}
          <div ref={bottomRef} />
        </div>
      </div>

      {/* Input bar */}
      <div className="shrink-0 bg-white border-t border-gray-100 pb-safe">
        <div className="content-shell py-2 flex items-end gap-2">
          {/* Attachment button */}
          <div className="w-[38px] h-[38px] rounded-full border border-gray-200 bg-gray-50 flex items-center justify-center shrink-0 mb-0.5 cursor-pointer hover:bg-gray-100 transition-colors">
            <Plus size={20} className="text-gray-400" />
          </div>

          {/* Text field with emoji */}
          <div className="flex-1 flex items-end bg-[#F0F2F5] rounded-3xl overflow-hidden px-4 py-2 max-h-28">
            <textarea
              rows={1}
              placeholder="Type a message…"
              value={text}
              onChange={e => setText(e.target.value)}
              onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend() } }}
              className="flex-1 resize-none text-sm text-gray-900 placeholder:text-gray-400 outline-none bg-transparent max-h-24 leading-5 py-0.5"
            />
            <button className="ml-2 mb-0.5 shrink-0">
              <Smile size={20} className="text-gray-400 hover:text-gray-600 transition-colors" />
            </button>
          </div>

          {/* Send button */}
          <button
            onClick={handleSend}
            disabled={!text.trim() || isSending}
            className="w-[42px] h-[42px] bg-green-600 rounded-full flex items-center justify-center disabled:opacity-40 transition-opacity shrink-0 mb-0.5 hover:bg-green-700"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
              <path d="M22 2L11 13" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M22 2L15 22L11 13L2 9L22 2Z" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        </div>
      </div>
    </div>
  )
}

function DateSeparator({ label }: { label: string }) {
  return (
    <div className="flex items-center justify-center py-3">
      <span className="px-3.5 py-1 bg-black/[0.07] rounded-full text-xs text-gray-500 font-medium">{label}</span>
    </div>
  )
}

function MessageBubble({ msg, isMine, showAvatar, initials }: {
  msg: GroupMessage; isMine: boolean; showAvatar: boolean; initials: string
}) {
  const time = new Date(msg.createdAt).toLocaleTimeString('en-GH', { hour: 'numeric', minute: '2-digit', hour12: true })

  return (
    <div className={cn('flex gap-1.5 items-end pb-0.5', isMine ? 'justify-end' : 'justify-start')}>
      {/* Avatar — other user */}
      {!isMine && (
        <div className={cn(
          'w-[30px] h-[30px] rounded-full flex items-center justify-center text-white text-[10px] font-bold shrink-0 bg-green-600 mb-[2px]',
          !showAvatar && 'invisible',
        )}>
          {initials}
        </div>
      )}

      <div className={cn('max-w-[70%] space-y-0.5', isMine ? 'items-end' : 'items-start', 'flex flex-col')}>
        {showAvatar && !isMine && (
          <p className="text-[11px] text-gray-400 pl-1 font-medium">{msg.sender.fullName} • {time}</p>
        )}
        <div className={cn(
          'px-3.5 py-2.5 text-sm leading-[1.4] shadow-sm',
          isMine
            ? 'bg-green-600 text-white rounded-[18px] rounded-br-[4px]'
            : 'bg-white text-gray-900 rounded-[18px] rounded-bl-[4px]',
        )}>
          {msg.content}
        </div>
        {isMine && (
          <div className="flex items-center gap-1 pr-1">
            <span className="text-[10px] text-gray-400">{time}</span>
            <svg width="14" height="10" viewBox="0 0 16 10" fill="none" className="text-green-600">
              <path d="M1 5L5 9L10 1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M6 5L10 9L15 1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
        )}
        {!isMine && !showAvatar && (
          <p className="text-[10px] text-gray-400 pl-1">{time}</p>
        )}
      </div>
    </div>
  )
}
