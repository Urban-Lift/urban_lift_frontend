/** Community groups + chat (live API). */
import type { ChatMessage, CommunityGroup } from '@/types';
import { http } from './api';
import { asList, mapGroup, mapMessage } from './mappers';
import { useAuthStore } from '@/store/authStore';

function myAuthId(): string | undefined {
  const u = useAuthStore.getState().user;
  return u?.authId ?? u?.id;
}

export const communityService = {
  /** Groups the current user is a member of (the API has no public discovery). */
  async listGroups(): Promise<CommunityGroup[]> {
    const res = await http.get('/community/groups');
    return asList(res?.groups ? { data: res.groups } : res).map((g) => mapGroup(g, true));
  },

  async getGroup(id: string): Promise<CommunityGroup | undefined> {
    const res = await http.get(`/community/groups/${id}`);
    if (!res?.group) return undefined;
    const group = mapGroup(res.group, true);
    group.memberCount = asList(res?.members ? { data: res.members } : []).length || group.memberCount;
    return group;
  },

  async join(id: string): Promise<{ joined: true }> {
    await http.postForm(`/community/groups/${id}/join`, {});
    return { joined: true };
  },

  async leave(id: string): Promise<void> {
    await http.postForm(`/community/groups/${id}/leave`, {});
  },

  async create(input: { name: string; route?: string; description?: string }): Promise<CommunityGroup> {
    const description = [input.route, input.description].filter(Boolean).join(' · ');
    const res = await http.postForm('/community/groups', { name: input.name, description });
    return mapGroup(res?.group ?? { name: input.name, description }, true);
  },

  async getMessages(groupId: string): Promise<ChatMessage[]> {
    const res = await http.get(`/community/groups/${groupId}/messages`, { limit: 50, offset: 0 });
    return asList(res?.messages ? { data: res.messages } : res).map((m) => mapMessage(m, myAuthId()));
  },

  /** The send endpoint returns only a status, so we build the optimistic message. */
  async sendMessage(groupId: string, text: string): Promise<ChatMessage> {
    await http.postForm(`/community/groups/${groupId}/messages`, { message: text });
    return {
      id: 'local-' + Date.now(),
      groupId,
      authorId: myAuthId() ?? 'me',
      authorName: 'You',
      text,
      sentAt: new Date().toISOString(),
      isMe: true,
    };
  },
};
