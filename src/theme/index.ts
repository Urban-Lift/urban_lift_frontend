/**
 * UrbanLift design tokens — the single source of truth for colors, spacing,
 * radii and typography across every screen. Mirrors the brand tokens defined
 * in CLAUDE.md so the Expo app matches the original design system exactly.
 */

export const colors = {
  primary: '#1A7A3C',
  primaryDark: '#136130',
  lightGreen: '#D1FAE5',
  background: '#F9FAFB',
  surface: '#FFFFFF',
  text: '#111827',
  textMuted: '#6B7280',
  border: '#D1D5DB',
  borderLight: '#E5E7EB',
  warning: '#D97706',
  warningLight: '#FEF3C7',
  error: '#DC2626',
  errorLight: '#FEE2E2',
  success: '#1A7A3C',
  white: '#FFFFFF',
  black: '#000000',
  // status colors for badges
  confirmed: '#1A7A3C',
  pending: '#D97706',
  cancelled: '#DC2626',
  completed: '#6B7280',
  overlay: 'rgba(17, 24, 39, 0.5)',
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
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  '2xl': 24,
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
  '4xl': 36,
} as const;

export const fontWeight = {
  regular: '400',
  medium: '500',
  semibold: '600',
  bold: '700',
} as const;

/** Soft elevation used by Card and floating elements. */
export const shadow = {
  card: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  floating: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 16,
    elevation: 6,
  },
} as const;

export const theme = { colors, spacing, radii, fontSize, fontWeight, shadow };
export type Theme = typeof theme;
