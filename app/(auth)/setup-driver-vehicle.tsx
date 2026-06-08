import { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { router } from 'expo-router';
import { Button, Header, Input, Screen, Txt } from '@/components';
import { useAuthStore } from '@/store/authStore';
import { authService } from '@/services/authService';
import { spacing } from '@/theme';

/** Driver setup — step 2 of 2: vehicle details. Creates the account. */
export default function SetupDriverVehicle() {
  const draft = useAuthStore((s) => s.draft);
  const login = useAuthStore((s) => s.login);
  const [make, setMake] = useState('');
  const [model, setModel] = useState('');
  const [color, setColor] = useState('');
  const [plate, setPlate] = useState('');
  const [seats, setSeats] = useState('4');
  const [loading, setLoading] = useState(false);

  const valid = make && model && color && plate.length >= 4;

  async function finish() {
    setLoading(true);
    const user = await authService.createDriver({
      name: draft?.name ?? 'Driver',
      phone: draft?.phone ?? '',
      email: draft?.email,
      vehicle: { make, model, color, plate, seats: Number(seats) || 4 },
    });
    login(user, 'mock-token-' + user.id);
    setLoading(false);
    router.replace('/driver/dashboard');
  }

  return (
    <Screen scroll footer={<Button label="Finish & go online" onPress={finish} disabled={!valid} loading={loading} />}>
      <Header title="Driver setup" subtitle="Step 2 of 2 · Vehicle" />
      <View style={styles.body}>
        <Txt variant="muted">Passengers see this so they can spot your car.</Txt>
        <View style={styles.row}>
          <View style={styles.flex}>
            <Input label="Make" placeholder="Toyota" value={make} onChangeText={setMake} />
          </View>
          <View style={styles.flex}>
            <Input label="Model" placeholder="Corolla" value={model} onChangeText={setModel} />
          </View>
        </View>
        <View style={styles.row}>
          <View style={styles.flex}>
            <Input label="Colour" placeholder="Silver" value={color} onChangeText={setColor} />
          </View>
          <View style={styles.flex}>
            <Input label="Seats" placeholder="4" keyboardType="number-pad" value={seats} onChangeText={setSeats} />
          </View>
        </View>
        <Input label="Plate number" placeholder="GR 0000-23" autoCapitalize="characters" value={plate} onChangeText={setPlate} />
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  body: { gap: spacing.lg, marginTop: spacing.md },
  row: { flexDirection: 'row', gap: spacing.md },
  flex: { flex: 1 },
});
