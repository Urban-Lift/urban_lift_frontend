import { useEffect, useRef, useState } from 'react';
import {
  FlatList,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  StyleSheet,
  TextInput,
  View,
} from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { useQuery } from '@tanstack/react-query';
import { Send } from 'lucide-react-native';
import { Avatar, Header, RideCard, Screen, Txt } from '@/components';
import { communityService } from '@/services/communityService';
import { rides } from '@/mocks/data';
import type { ChatMessage } from '@/types';
import { clockTime } from '@/utils/format';
import { colors, radii, spacing } from '@/theme';

export default function GroupChat() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { data: group } = useQuery({ queryKey: ['group', id], queryFn: () => communityService.getGroup(id!) });
  const { data } = useQuery({ queryKey: ['messages', id], queryFn: () => communityService.getMessages(id!) });

  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [text, setText] = useState('');
  const listRef = useRef<FlatList>(null);

  useEffect(() => {
    if (data) setMessages(data);
  }, [data]);

  async function send() {
    const body = text.trim();
    if (!body) return;
    setText('');
    const msg = await communityService.sendMessage(id!, body);
    setMessages((prev) => [...prev, msg]);
    requestAnimationFrame(() => listRef.current?.scrollToEnd({ animated: true }));
  }

  return (
    <Screen padded={false} edges={['top', 'bottom']}>
      <Header
        title={group?.name ?? 'Group chat'}
        subtitle={group ? `${group.memberCount.toLocaleString()} members · ${group.route}` : undefined}
      />
      <KeyboardAvoidingView style={styles.flex} behavior={Platform.OS === 'ios' ? 'padding' : undefined} keyboardVerticalOffset={8}>
        <FlatList
          ref={listRef}
          data={messages}
          keyExtractor={(m) => m.id}
          contentContainerStyle={styles.messages}
          renderItem={({ item }) => <MessageBubble message={item} />}
          onContentSizeChange={() => listRef.current?.scrollToEnd({ animated: false })}
        />
        <View style={styles.inputBar}>
          <TextInput
            value={text}
            onChangeText={setText}
            placeholder="Message the group…"
            placeholderTextColor={colors.textMuted}
            style={styles.input}
            multiline
            onSubmitEditing={send}
          />
          <Pressable onPress={send} style={[styles.sendBtn, !text.trim() && styles.sendDisabled]} disabled={!text.trim()}>
            <Send size={18} color={colors.white} />
          </Pressable>
        </View>
      </KeyboardAvoidingView>
    </Screen>
  );
}

function MessageBubble({ message }: { message: ChatMessage }) {
  const ride = message.rideCardId ? rides.find((r) => r.id === message.rideCardId) : undefined;

  if (ride) {
    return (
      <View style={[styles.row, message.isMe ? styles.rowMe : styles.rowOther]}>
        <View style={styles.rideWrap}>
          {!message.isMe ? <Txt variant="caption" style={styles.author}>{message.authorName}</Txt> : null}
          <RideCard ride={ride} compact />
          <Txt variant="caption" style={styles.time}>{clockTime(message.sentAt)}</Txt>
        </View>
      </View>
    );
  }

  return (
    <View style={[styles.row, message.isMe ? styles.rowMe : styles.rowOther]}>
      {!message.isMe ? <Avatar name={message.authorName} size={30} /> : null}
      <View style={[styles.bubble, message.isMe ? styles.bubbleMe : styles.bubbleOther]}>
        {!message.isMe ? <Txt variant="caption" color={colors.primary}>{message.authorName}</Txt> : null}
        <Txt variant="body" color={message.isMe ? colors.white : colors.text}>
          {message.text}
        </Txt>
        <Txt variant="caption" color={message.isMe ? 'rgba(255,255,255,0.7)' : colors.textMuted} style={styles.bubbleTime}>
          {clockTime(message.sentAt)}
        </Txt>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  messages: { padding: spacing.lg, gap: spacing.md },
  row: { flexDirection: 'row', alignItems: 'flex-end', gap: spacing.sm, maxWidth: '85%' },
  rowMe: { alignSelf: 'flex-end', justifyContent: 'flex-end' },
  rowOther: { alignSelf: 'flex-start' },
  bubble: { padding: spacing.md, borderRadius: radii.lg, gap: 2 },
  bubbleMe: { backgroundColor: colors.primary, borderBottomRightRadius: 4 },
  bubbleOther: { backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.borderLight },
  bubbleTime: { alignSelf: 'flex-end', marginTop: 2 },
  rideWrap: { gap: spacing.xs, width: 300, maxWidth: '100%' },
  author: { marginLeft: spacing.xs },
  time: { marginLeft: spacing.xs },
  inputBar: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: spacing.sm,
    padding: spacing.md,
    borderTopWidth: 1,
    borderTopColor: colors.borderLight,
    backgroundColor: colors.surface,
  },
  input: {
    flex: 1,
    maxHeight: 100,
    backgroundColor: colors.background,
    borderRadius: radii.lg,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    fontSize: 16,
    color: colors.text,
  },
  sendBtn: {
    width: 44,
    height: 44,
    borderRadius: radii.full,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sendDisabled: { opacity: 0.4 },
});
