/**
 * UrbanLift design tokens — tuned to match the high-fidelity reference designs.
 *
 * Key idea: a BRIGHT, vibrant green (`primary`) is used for call-to-action
 * buttons and active states, while a DEEP forest green (`forest` / the `hero`
 * gradient) is reserved for hero surfaces like the splash, wallet balance and
 * driver earnings cards. Text on bright-green CTAs is near-black for punch.
 */

export const colors = {
  // Bright CTA green
  primary: '#22C55E',
  primaryPressed: '#16A34A',
  onPrimary: '#06281A', // near-black green for text/icons on bright green

  // Deep forest green — wordmark, hero gradients, dark accents
  forest: '#1A7A3C',
  forestDark: '#0B3D1E',
  primaryDark: '#1A7A3C', // alias for `forest`, kept for existing styles

  // Greens for chips / soft backgrounds
  lightGreen: '#DCFCE7',
  mint: '#E9F9EF',

  // Neutrals
  background: '#F4F6F5',
  surface: '#FFFFFF',
  surfaceAlt: '#F3F4F6',
  text: '#101828',
  textStrong: '#0B1220',
  textMuted: '#667085',
  textLight: '#98A2B3',
  border: '#E4E7EC',
  borderLight: '#EFF1F0',

  // Accents
  warning: '#F59E0B',
  warningLight: '#FEF3C7',
  gold: '#F59E0B',
  error: '#EF4444',
  errorLight: '#FEE4E2',
  info: '#3B82F6',
  infoLight: '#DBEAFE',
  purple: '#7C3AED',
  purpleLight: '#EDE9FE',

  white: '#FFFFFF',
  black: '#000000',

  // status (badges)
  confirmed: '#22C55E',
  pending: '#F59E0B',
  cancelled: '#EF4444',
  completed: '#667085',

  overlay: 'rgba(11, 18, 32, 0.55)',
} as const;

export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  '2xl': 24,
  '3xl': 32,
  '4xl': 40,
} as const;

export const radii = {
  xs: 6,
  sm: 10,
  md: 14,
  lg: 18,
  xl: 22,
  '2xl': 28,
  full: 999,
} as const;

export const fontSize = {
  xs: 12,
  sm: 14,
  md: 16,
  lg: 18,
  xl: 20,
  '2xl': 24,
  '3xl': 30,
  '4xl': 34,
  '5xl': 40,
} as const;

/** Plus Jakarta Sans family names (registered in app/_layout.tsx). */
export const fonts = {
  regular: 'Jakarta_400Regular',
  medium: 'Jakarta_500Medium',
  semibold: 'Jakarta_600SemiBold',
  bold: 'Jakarta_700Bold',
  extrabold: 'Jakarta_800ExtraBold',
} as const;

// Legacy alias (numeric weights) kept so existing styles don't break.
export const fontWeight = {
  regular: '400',
  medium: '500',
  semibold: '600',
  bold: '700',
} as const;

export const shadow = {
  /** Soft neutral card elevation. */
  card: {
    shadowColor: '#101828',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.06,
    shadowRadius: 16,
    elevation: 3,
  },
  /** Floating elements (sheets, FABs, badges). */
  floating: {
    shadowColor: '#101828',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.14,
    shadowRadius: 24,
    elevation: 10,
  },
  /** Green glow under primary buttons. */
  primary: {
    shadowColor: '#22C55E',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.4,
    shadowRadius: 18,
    elevation: 8,
  },
} as const;

/** Brand gradients (use with expo-linear-gradient via <Gradient />). */
export const gradients = {
  primary: ['#28D06A', '#16A34A'] as const,
  hero: ['#0F6B33', '#0A3D1E'] as const,
  heroDark: ['#114E29', '#06270F'] as const,
  emerald: ['#34D27A', '#1A7A3C'] as const,
  gold: ['#FBBF24', '#F59E0B'] as const,
};

export const theme = { colors, spacing, radii, fontSize, fontWeight, fonts, shadow, gradients };
export type Theme = typeof theme;
