import { StyleSheet, View } from 'react-native';
import { CreditCard, Smartphone } from 'lucide-react-native';
import type { PaymentProvider } from '@/types';
import { radii } from '@/theme';
import { Txt } from '@/components';

const meta: Record<PaymentProvider, { bg: string; short: string }> = {
  mtn: { bg: '#FFCC00', short: 'MTN' },
  vodafone: { bg: '#E60000', short: 'VF' },
  at: { bg: '#003DA5', short: 'AT' },
  card: { bg: '#111827', short: '' },
};

export function ProviderIcon({ provider, size = 40 }: { provider: PaymentProvider; size?: number }) {
  const m = meta[provider];
  return (
    <View style={[styles.box, { backgroundColor: m.bg, width: size, height: size, borderRadius: radii.sm }]}>
      {provider === 'card' ? (
        <CreditCard size={size * 0.5} color="#fff" />
      ) : provider === 'at' ? (
        <Smartphone size={size * 0.5} color="#fff" />
      ) : (
        <Txt variant="caption" color={provider === 'mtn' ? '#111827' : '#fff'}>
          {m.short}
        </Txt>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  box: { alignItems: 'center', justifyContent: 'center' },
});
