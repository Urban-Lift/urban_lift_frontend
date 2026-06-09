import { useEffect, useRef, useState } from 'react';
import { FlatList, KeyboardAvoidingView, Platform, Pressable, StyleSheet, TextInput, View } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { useQuery } from '@tanstack/react-query';
import { ArrowRight, BellOff, Car, CheckCheck, ChevronLeft, Plus, Send, Smile } from 'lucide-react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Avatar, Txt } from '@/components';
import { communityService } from '@/services/communityService';
import { rides } from '@/mocks/data';
import type { ChatMessage } from '@/types';
import { clockTime, ghsCompact } from '@/utils/format';
import { colors, fonts, fontSize, radii, shadow, spacing } from '@/theme';

export default function GroupChat() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { data: group } = useQuery({ queryKey: ['group', id], queryFn: () => communityService.getGroup(id!) });
  const { data } = useQuery({ queryKey: ['messages', id], queryFn: () => communityService.getMessages(id!) });

  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [text, setText] = useState('');
  const listRef = useRef<FlatList>(null);

  useEffect(() => { if (data) setMessages(data); }, [data]);

  async function send() {
    const body = text.trim();
    if (!body) return;
    setText('');
    const msg = await communityService.sendMessage(id!, body);
    setMessages((prev) => [...prev, msg]);
    requestAnimationFrame(() => listRef.current?.scrollToEnd({ animated: true }));
  }

  return (
    <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} hitSlop={8}><ChevronLeft size={24} color={colors.text} /></Pressable>
        <View style={styles.headerCenter}>
          <Txt variant="h3" numberOfLines={1}>{group?.name ?? 'Group chat'}</Txt>
          <Txt variant="caption">{group ? `${group.memberCount} Members · 3 Online` : ''}</Txt>
        </View>
        <BellOff size={20} color={colors.textMuted} />
      </View>

      <KeyboardAvoidingView style={styles.flex} behavior={Platform.OS === 'ios' ? 'padding' : undefined} keyboardVerticalOffset={8}>
        <FlatList
          ref={listRef}
          data={messages}
          keyExtractor={(m) => m.id}
          contentContainerStyle={styles.messages}
          ListHeaderComponent={<View style={styles.dayWrap}><View style={styles.dayPill}><Txt variant="caption">Today</Txt></View></View>}
          renderItem={({ item }) => <MessageBubble message={item} />}
          onContentSizeChange={() => listRef.current?.scrollToEnd({ animated: false })}
        />

        <View style={styles.inputBar}>
          <Pressable style={styles.plus}><Plus size={20} color={colors.textMuted} /></Pressable>
          <View style={styles.inputWrap}>
            <TextInput value={text} onChangeText={setText} placeholder="Type a message…" placeholderTextColor={colors.textLight} style={styles.input} multiline onSubmitEditing={send} />
            <Smile size={20} color={colors.textMuted} />
          </View>
          <Pressable onPress={send} style={[styles.send, !text.trim() && styles.sendDisabled]} disabled={!text.trim()}>
            <Send size={18} color={colors.onPrimary} />
          </Pressable>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

function MessageBubble({ message }: { message: ChatMessage }) {
  const ride = message.rideCardId ? rides.find((r) => r.id === message.rideCardId) : undefined;

  if (message.isMe) {
    return (
      <View style={styles.meRow}>
        <View style={styles.meBubble}>
          <Txt variant="body" color={colors.white}>{message.text}</Txt>
        </View>
        <View style={styles.meMeta}>
          <Txt variant="caption">{clockTime(message.sentAt)}</Txt>
          <CheckCheck size={14} color={colors.primary} />
        </View>
      </View>
    );
  }

  return (
    <View style={styles.otherRow}>
      <Avatar name={message.authorName} size={32} />
      <View style={styles.otherCol}>
        <View style={styles.otherHead}>
          <Txt variant="captionStrong">{message.authorName}</Txt>
          <Txt variant="caption">· {clockTime(message.sentAt)}</Txt>
        </View>
        {message.text ? (
          <View style={styles.otherBubble}><Txt variant="body">{message.text}</Txt></View>
        ) : null}
        {ride ? (
          <View style={styles.rideCard}>
            <View style={styles.rideIcon}><Car size={18} color={colors.forest} /></View>
            <View style={styles.flex}>
              <Txt variant="captionStrong">{ride.origin} → {ride.destination}</Txt>
              <Txt variant="caption">{clockTime(ride.departAt)} · {ghsCompact(ride.pricePerSeat)}</Txt>
            </View>
            <ArrowRight size={18} color={colors.textMuted} />
          </View>
        ) : null}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  flex: { flex: 1 },
  header: { flexDirection: 'row', alignItems: 'center', gap: spacing.md, paddingHorizontal: spacing.lg, paddingVertical: spacing.md, borderBottomWidth: 1, borderBottomColor: colors.borderLight, backgroundColor: colors.surface },
  headerCenter: { flex: 1 },
  messages: { padding: spacing.lg, gap: spacing.md },
  dayWrap: { alignItems: 'center', marginBottom: spacing.sm },
  dayPill: { backgroundColor: colors.surfaceAlt, paddingHorizontal: spacing.md, paddingVertical: 4, borderRadius: radii.full },
  otherRow: { flexDirection: 'row', gap: spacing.sm, maxWidth: '85%', alignSelf: 'flex-start' },
  otherCol: { flex: 1, gap: 4 },
  otherHead: { flexDirection: 'row', alignItems: 'center', gap: spacing.xs, marginLeft: spacing.xs },
  otherBubble: { backgroundColor: colors.surface, padding: spacing.md, borderRadius: radii.md, borderTopLeftRadius: 4, ...shadow.card },
  rideCard: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm, backgroundColor: colors.surface, padding: spacing.md, borderRadius: radii.md, borderWidth: 1, borderColor: colors.borderLight },
  rideIcon: { width: 36, height: 36, borderRadius: radii.sm, backgroundColor: colors.lightGreen, alignItems: 'center', justifyContent: 'center' },
  meRow: { alignSelf: 'flex-end', maxWidth: '85%', gap: 2 },
  meBubble: { backgroundColor: colors.primary, padding: spacing.md, borderRadius: radii.md, borderBottomRightRadius: 4 },
  meMeta: { flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-end', gap: 4 },
  inputBar: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm, padding: spacing.md, borderTopWidth: 1, borderTopColor: colors.borderLight, backgroundColor: colors.surface },
  plus: { width: 40, height: 40, borderRadius: radii.full, borderWidth: 1.5, borderColor: colors.border, alignItems: 'center', justifyContent: 'center' },
  inputWrap: { flex: 1, flexDirection: 'row', alignItems: 'center', gap: spacing.sm, backgroundColor: colors.surfaceAlt, borderRadius: radii.full, paddingHorizontal: spacing.lg },
  input: { flex: 1, maxHeight: 100, fontFamily: fonts.regular, fontSize: fontSize.md, color: colors.text, paddingVertical: 12 },
  send: { width: 44, height: 44, borderRadius: radii.full, backgroundColor: colors.primary, alignItems: 'center', justifyContent: 'center' },
  sendDisabled: { opacity: 0.4 },
});
