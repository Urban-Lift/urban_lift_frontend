import * as ImagePicker from 'expo-image-picker';

/** Open the gallery and return the chosen image uri, or null if cancelled. */
export async function pickImage(): Promise<string | null> {
  const perm = await ImagePicker.requestMediaLibraryPermissionsAsync();
  if (!perm.granted) return null;
  const result = await ImagePicker.launchImageLibraryAsync({
    mediaTypes: ['images'],
    allowsEditing: true,
    aspect: [1, 1],
    quality: 0.6,
  });
  if (result.canceled) return null;
  return result.assets[0]?.uri ?? null;
}
