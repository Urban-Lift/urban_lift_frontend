import { type ReactNode } from 'react';
import { StyleSheet, View } from 'react-native';
import { colors, radii, spacing } from '@/theme';
import { Txt } from './Typography';

interface Props {
  icon?: ReactNode;
  title: string;
  message?: string;
  action?: ReactNode;
}

export function EmptyState({ icon, title, message, action }: Props) {
  return (
    <View style={styles.wrap}>
      {icon ? <View style={styles.iconWrap}>{icon}</View> : null}
      <Txt variant="h3" center>
        {title}
      </Txt>
      {message ? (
        <Txt variant="caption" center>
          {message}
        </Txt>
      ) : null}
      {action ? <View style={styles.action}>{action}</View> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { alignItems: 'center', justifyContent: 'center', padding: spacing['3xl'], gap: spacing.sm },
  iconWrap: {
    width: 72,
    height: 72,
    borderRadius: radii.full,
    backgroundColor: colors.lightGreen,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.sm,
  },
  action: { marginTop: spacing.md, alignSelf: 'stretch' },
});
