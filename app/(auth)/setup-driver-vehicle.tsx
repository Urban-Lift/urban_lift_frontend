import { useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { router } from 'expo-router';
import { ArrowRight, Camera, Car } from 'lucide-react-native';
import { Button, Header, Input, Screen, Txt } from '@/components';
import { useAuthStore } from '@/store/authStore';
import { authService } from '@/services/authService';
import { apiError } from '@/services/api';
import { pickImage } from '@/utils/image';
import { colors, radii, spacing } from '@/theme';

/** Driver setup — step 2 of 2: vehicle + documents. Submits driver registration. */
export default function SetupDriverVehicle() {
  const draft = useAuthStore((s) => s.draft);
  const token = useAuthStore((s) => s.token);
  const login = useAuthStore((s) => s.login);
  const [carModel, setCarModel] = useState('');
  const [color, setColor] = useState('');
  const [year, setYear] = useState('');
  const [plate, setPlate] = useState('');
  const [ghanaCard, setGhanaCard] = useState('');
  const [carPhoto, setCarPhoto] = useState<string>();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>();

  const valid = carModel && color && plate.length >= 4 && ghanaCard.length >= 4;

  async function chooseCarPhoto() {
    const uri = await pickImage();
    if (uri) setCarPhoto(uri);
  }

  async function finish() {
    if (!carPhoto) {
      setError('Please add a photo of your car.');
      return;
    }
    setLoading(true);
    setError(undefined);
    try {
      await authService.registerDriver({
        fullName: draft?.name ?? '',
        phone: draft?.phone ?? '',
        email: draft?.email ?? '',
        ghanaCard,
        licensePlate: plate,
        carModel,
        carColor: color,
        carYear: Number(year) || new Date().getFullYear(),
        // The API requires four separate documents; we submit the car photo for
        // each here. Replace with dedicated uploads (license, insurance, card)
        // when those inputs are added.
        cardImageUri: carPhoto,
        licenseUri: carPhoto,
        insuranceUri: carPhoto,
        carPicUri: carPhoto,
      });
      login(
        {
          id: draft?.phone ?? '',
          role: 'driver',
          name: draft?.name ?? 'Driver',
          phone: draft?.phone ?? '',
          email: draft?.email,
          rating: 5,
          avatarUrl: draft?.photoUri,
          vehicle: { make: carModel, model: '', color, plate, seats: 4 },
        },
        token ?? '',
      );
      router.replace('/driver-home');
    } catch (e) {
      setError(apiError(e));
    } finally {
      setLoading(false);
    }
  }

  return (
    <Screen scroll footer={<Button label="Create Account" icon={<ArrowRight size={20} color={colors.onPrimary} />} onPress={finish} disabled={!valid} loading={loading} />}>
      <Header title="Vehicle Details" subtitle="Step 2 of 2" />
      <View style={styles.body}>
        <Pressable style={styles.carPhoto} onPress={chooseCarPhoto}>
          <View style={styles.carIcon}>{carPhoto ? <Car size={22} color={colors.forest} /> : <Camera size={22} color={colors.forest} />}</View>
          <Txt variant="bodyStrong">{carPhoto ? 'Car photo added' : 'Add a photo of your car'}</Txt>
          <Txt variant="caption">Passengers use this to spot your car</Txt>
        </Pressable>
        {error ? <Txt variant="caption" color={colors.error}>{error}</Txt> : null}

        <Input label="Car Make & Model" placeholder="Toyota Corolla" value={carModel} onChangeText={setCarModel} />
        <View style={styles.row}>
          <View style={styles.flex}><Input label="Colour" placeholder="Silver" value={color} onChangeText={setColor} /></View>
          <View style={styles.flex}><Input label="Year" placeholder="2019" keyboardType="number-pad" value={year} onChangeText={setYear} /></View>
        </View>
        <Input label="License Plate" placeholder="GR 0000-23" autoCapitalize="characters" value={plate} onChangeText={setPlate} />
        <Input label="Ghana Card Number" placeholder="GHA-000000000-0" autoCapitalize="characters" value={ghanaCard} onChangeText={setGhanaCard} />
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  body: { gap: spacing.lg, marginTop: spacing.sm },
  carPhoto: { alignItems: 'center', gap: 2, paddingVertical: spacing.xl, borderRadius: radii.lg, borderWidth: 1.5, borderStyle: 'dashed', borderColor: colors.border, backgroundColor: colors.surfaceAlt },
  carIcon: { width: 44, height: 44, borderRadius: radii.full, backgroundColor: colors.surface, alignItems: 'center', justifyContent: 'center', marginBottom: spacing.xs },
  row: { flexDirection: 'row', gap: spacing.md },
  flex: { flex: 1 },
});
