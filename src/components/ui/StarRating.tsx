import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Star } from 'lucide-react-native';
import { colors, fontSize, fontWeight } from '@/theme';

interface Props {
  rating: number;
  size?: number;
  /** When set, stars become tappable and call back with the chosen value. */
  onChange?: (value: number) => void;
  showValue?: boolean;
}

export function StarRating({ rating, size = 16, onChange, showValue }: Props) {
  return (
    <View style={styles.row}>
      {[1, 2, 3, 4, 5].map((i) => {
        const filled = i <= Math.round(rating);
        const star = (
          <Star
            size={size}
            color={colors.warning}
            fill={filled ? colors.warning : 'transparent'}
          />
        );
        return onChange ? (
          <Pressable key={i} onPress={() => onChange(i)} hitSlop={6}>
            {star}
          </Pressable>
        ) : (
          <View key={i}>{star}</View>
        );
      })}
      {showValue ? <Text style={styles.value}>{rating.toFixed(1)}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', gap: 2 },
  value: {
    marginLeft: 4,
    fontSize: fontSize.sm,
    fontWeight: fontWeight.semibold,
    color: colors.text,
  },
});
