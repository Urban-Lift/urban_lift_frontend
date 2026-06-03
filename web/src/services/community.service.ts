import { mockCommunityApi } from '@/mocks/community.mock'
import type { CommunityGroup, GroupMessage } from '@/types'

export const communityService = {
  getGroups: (): Promise<CommunityGroup[]> => mockCommunityApi.getGroups(),
  getMessages: (groupId: string): Promise<GroupMessage[]> => mockCommunityApi.getMessages(groupId),
  joinGroup: (groupId: string): Promise<void> => mockCommunityApi.joinGroup(groupId),
  leaveGroup: (groupId: string): Promise<void> => mockCommunityApi.leaveGroup(groupId),
  sendMessage: (groupId: string, content: string): Promise<GroupMessage> => mockCommunityApi.sendMessage(groupId, content),
  createGroup: (data: { name: string; primaryRoute?: string; description?: string; privacy: 'public' | 'private' }): Promise<CommunityGroup> =>
    mockCommunityApi.createGroup(data),
}
