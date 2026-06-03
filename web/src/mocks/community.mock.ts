import type { CommunityGroup, GroupMessage, User } from '@/types'

const delay = (ms: number) => new Promise(res => setTimeout(res, ms))

const daysAgo = (d: number) => new Date(Date.now() - d * 86_400_000).toISOString()
const minsAgo = (m: number) => new Date(Date.now() - m * 60_000).toISOString()

const mockUser: User = {
  id: 'usr-001', phoneNumber: '+233541234567', fullName: 'Kwame Mensah',
  role: 'passenger', authProvider: 'phone', isPhoneVerified: true,
  isEmailVerified: false, avgRating: 4.8, totalRatings: 42,
  referralCode: 'KWAME10', isActive: true, createdAt: daysAgo(30),
}
const ama: User = {
  id: 'usr-010', phoneNumber: '+233501234567', fullName: 'Ama Owusu',
  role: 'passenger', authProvider: 'phone', isPhoneVerified: true,
  isEmailVerified: false, avgRating: 4.9, totalRatings: 87,
  referralCode: 'AMA10', isActive: true, createdAt: daysAgo(60),
}
const kofi: User = {
  id: 'usr-011', phoneNumber: '+233209876543', fullName: 'Kofi Asante',
  role: 'driver', authProvider: 'phone', isPhoneVerified: true,
  isEmailVerified: true, avgRating: 4.7, totalRatings: 210,
  referralCode: 'KOFI10', isActive: true, createdAt: daysAgo(90),
}

export const mockGroups: CommunityGroup[] = [
  {
    id: 'grp-001', creator: ama, name: 'East Legon Morning Commuters',
    primaryRoute: 'East Legon → Accra Central', description: 'Daily commuters heading downtown from East Legon. Share rides and save on fares!',
    privacy: 'public', memberCount: 48, createdAt: daysAgo(14), isJoined: true,
  },
  {
    id: 'grp-002', creator: kofi, name: 'Legon–Airport City Riders',
    primaryRoute: 'Legon Campus → Airport City', description: 'Students and professionals sharing rides between the university and the business district.',
    privacy: 'public', memberCount: 31, createdAt: daysAgo(21), isJoined: true,
  },
  {
    id: 'grp-003', creator: mockUser, name: 'Madina–Osu Weekend Crew',
    primaryRoute: 'Madina Station → Osu Oxford Street', description: 'Weekend rides from Madina to Osu. Fridays and Saturdays.',
    privacy: 'private', memberCount: 12, createdAt: daysAgo(7), isJoined: false,
  },
  {
    id: 'grp-004', creator: ama, name: 'Airport Road Commuters',
    primaryRoute: 'Spintex Road → Kotoka International Airport', description: 'Early morning airport runs and commuters along the Airport Road corridor.',
    privacy: 'public', memberCount: 64, createdAt: daysAgo(45), isJoined: false,
  },
  {
    id: 'grp-005', creator: kofi, name: 'Tema–Accra Express',
    primaryRoute: 'Tema Community 1 → Accra Central', description: 'Daily commuters between Tema and Accra. Strict 6:30am and 5:30pm schedules.',
    privacy: 'public', memberCount: 92, createdAt: daysAgo(60), isJoined: false,
  },
]

export const mockMessages: Record<string, GroupMessage[]> = {
  'grp-001': [
    { id: 'msg-001', groupId: 'grp-001', sender: ama,      content: 'Good morning everyone! Anyone heading to town by 7:30?', createdAt: minsAgo(45) },
    { id: 'msg-002', groupId: 'grp-001', sender: kofi,     content: 'I can do 7:15 from East Legon junction. 3 seats available.', createdAt: minsAgo(42) },
    { id: 'msg-003', groupId: 'grp-001', sender: mockUser, content: 'Count me in! I\'ll be at the junction by 7:10.', createdAt: minsAgo(40) },
    { id: 'msg-004', groupId: 'grp-001', sender: ama,      content: 'Perfect. See you all there 👍', createdAt: minsAgo(38) },
    { id: 'msg-005', groupId: 'grp-001', sender: kofi,     content: 'Just a reminder — no AC on the way back today, car is getting serviced.', createdAt: minsAgo(15) },
    { id: 'msg-006', groupId: 'grp-001', sender: mockUser, content: 'No worries, we\'ll survive 😅', createdAt: minsAgo(12) },
  ],
  'grp-002': [
    { id: 'msg-010', groupId: 'grp-002', sender: kofi,     content: 'Leaving Legon at 8am tomorrow. Who needs a ride to Airport City?', createdAt: minsAgo(120) },
    { id: 'msg-011', groupId: 'grp-002', sender: ama,      content: 'Me please! Can you pick up from the main gate?', createdAt: minsAgo(115) },
    { id: 'msg-012', groupId: 'grp-002', sender: kofi,     content: 'Sure, main gate at 8:05.', createdAt: minsAgo(110) },
  ],
}

export const mockCommunityApi = {
  async getGroups(): Promise<CommunityGroup[]> {
    await delay(700)
    return [...mockGroups]
  },

  async getMessages(groupId: string): Promise<GroupMessage[]> {
    await delay(600)
    return [...(mockMessages[groupId] ?? [])]
  },

  async joinGroup(groupId: string): Promise<void> {
    await delay(500)
    const g = mockGroups.find(g => g.id === groupId)
    if (g) { (g as any).isJoined = true; (g as any).memberCount++ }
  },

  async leaveGroup(groupId: string): Promise<void> {
    await delay(500)
    const g = mockGroups.find(g => g.id === groupId)
    if (g) { (g as any).isJoined = false; (g as any).memberCount-- }
  },

  async sendMessage(groupId: string, content: string): Promise<GroupMessage> {
    await delay(300)
    const msg: GroupMessage = {
      id: `msg-${Date.now()}`, groupId, sender: mockUser,
      content, createdAt: new Date().toISOString(),
    }
    if (!mockMessages[groupId]) mockMessages[groupId] = []
    mockMessages[groupId].push(msg)
    return msg
  },

  async createGroup(data: {
    name: string; primaryRoute?: string; description?: string; privacy: 'public' | 'private'
  }): Promise<CommunityGroup> {
    await delay(900)
    const group: CommunityGroup = {
      id: `grp-${Date.now()}`, creator: mockUser, memberCount: 1, isJoined: true,
      createdAt: new Date().toISOString(), ...data,
    }
    mockGroups.unshift(group)
    return group
  },
}
