/** Community groups: list, join, create, messages (mock polling). */
import type { ChatMessage, CommunityGroup } from '@/types';
import { chatMessages, communityGroups } from '@/mocks/data';
import { refId } from '@/utils/format';
import { delay } from './api';

export const communityService = {
  async listGroups(): Promise<CommunityGroup[]> {
    return delay(communityGroups, 500);
  },

  async getGroup(id: string): Promise<CommunityGroup | undefined> {
    return delay(communityGroups.find((g) => g.id === id), 300);
  },

  async join(id: string): Promise<{ joined: true }> {
    return delay({ joined: true }, 400);
  },

  async create(input: {
    name: string;
    route: string;
    isPrivate: boolean;
    description: string;
    coverColor: string;
  }): Promise<CommunityGroup> {
    return delay(
      {
        id: refId('G'),
        memberCount: 1,
        joined: true,
        ...input,
      },
      800,
    );
  },

  async getMessages(groupId: string): Promise<ChatMessage[]> {
    return delay(chatMessages[groupId] ?? [], 400);
  },

  async sendMessage(groupId: string, text: string): Promise<ChatMessage> {
    return delay(
      {
        id: refId('M'),
        groupId,
        authorId: 'me',
        authorName: 'You',
        text,
        sentAt: new Date().toISOString(),
        isMe: true,
      },
      250,
    );
  },
};
