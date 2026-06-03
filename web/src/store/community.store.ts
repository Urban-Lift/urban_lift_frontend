import { create } from 'zustand'
import type { CommunityGroup, GroupMessage } from '@/types'

interface CommunityStore {
  groups: CommunityGroup[]
  messages: Record<string, GroupMessage[]>
  isLoading: boolean
  isSending: boolean

  setGroups: (g: CommunityGroup[]) => void
  setMessages: (groupId: string, msgs: GroupMessage[]) => void
  appendMessage: (groupId: string, msg: GroupMessage) => void
  updateGroup: (id: string, patch: Partial<CommunityGroup>) => void
  prependGroup: (g: CommunityGroup) => void
  setLoading: (v: boolean) => void
  setSending: (v: boolean) => void
}

export const useCommunityStore = create<CommunityStore>(set => ({
  groups: [],
  messages: {},
  isLoading: false,
  isSending: false,

  setGroups:   g => set({ groups: g }),
  setMessages: (groupId, msgs) => set(s => ({ messages: { ...s.messages, [groupId]: msgs } })),
  appendMessage: (groupId, msg) => set(s => ({
    messages: { ...s.messages, [groupId]: [...(s.messages[groupId] ?? []), msg] },
  })),
  updateGroup: (id, patch) => set(s => ({
    groups: s.groups.map(g => g.id === id ? { ...g, ...patch } : g),
  })),
  prependGroup: g => set(s => ({ groups: [g, ...s.groups] })),
  setLoading: v => set({ isLoading: v }),
  setSending: v => set({ isSending: v }),
}))
