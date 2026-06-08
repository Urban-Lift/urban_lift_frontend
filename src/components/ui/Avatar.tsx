import { Image } from 'expo-image';
import { StyleSheet, Text, View } from 'react-native';
import { colors, fontWeight } from '@/theme';
import { initials } from '@/utils/format';

interface Props {
  name: string;
  uri?: string;
  size?: number;
}

export function Avatar({ name, uri, size = 44 }: Props) {
  const dim = { width: size, height: size, borderRadius: size / 2 };
  if (uri) {
    return <Image source={{ uri }} style={[styles.img, dim]} contentFit="cover" />;
  }
  return (
    <View style={[styles.fallback, dim]}>
      <Text style={[styles.initials, { fontSize: size * 0.38 }]}>{initials(name)}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  img: { backgroundColor: colors.borderLight },
  fallback: { alignItems: 'center', justifyContent: 'center', backgroundColor: colors.lightGreen },
  initials: { color: colors.primaryDark, fontWeight: fontWeight.bold },
});
