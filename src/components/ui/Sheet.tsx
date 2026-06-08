import { type ReactNode } from 'react';
import { Modal, Pressable, StyleSheet, Text, View } from 'react-native';
import { X } from 'lucide-react-native';
import { colors, fontSize, fontWeight, radii, spacing } from '@/theme';

interface Props {
  visible: boolean;
  onClose: () => void;
  title?: string;
  children: ReactNode;
}

/** Bottom sheet (mobile) / centered modal feel, backed by RN Modal so it
 *  works on web and native without extra deps. */
export function BottomSheet({ visible, onClose, title, children }: Props) {
  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <Pressable style={styles.backdrop} onPress={onClose} />
      <View style={styles.sheet}>
        <View style={styles.handle} />
        <View style={styles.header}>
          {title ? <Text style={styles.title}>{title}</Text> : <View />}
          <Pressable onPress={onClose} hitSlop={8}>
            <X size={22} color={colors.textMuted} />
          </Pressable>
        </View>
        {children}
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: { flex: 1, backgroundColor: colors.overlay },
  sheet: {
    backgroundColor: colors.surface,
    borderTopLeftRadius: radii['2xl'],
    borderTopRightRadius: radii['2xl'],
    padding: spacing.xl,
    paddingBottom: spacing['3xl'],
    gap: spacing.md,
  },
  handle: {
    alignSelf: 'center',
    width: 40,
    height: 4,
    borderRadius: radii.full,
    backgroundColor: colors.border,
    marginBottom: spacing.sm,
  },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  title: { fontSize: fontSize.lg, fontWeight: fontWeight.bold, color: colors.text },
});
