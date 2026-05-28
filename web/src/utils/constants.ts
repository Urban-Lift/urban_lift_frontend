export const BRAND = {
  name: 'UrbanLift',
  tagline: 'Move Together, Grow Together',
  currency: 'GHS',
  phonePrefix: '+233',
  countryCode: 'GH',
} as const

export const COLORS = {
  primary: '#1A7A3C',
  primaryLight: '#D1FAE5',
  primaryDark: '#0f4522',
  surface: '#F9FAFB',
  border: '#D1D5DB',
  dark: '#111827',
  gray: '#6B7280',
  warning: '#D97706',
  error: '#DC2626',
} as const

export const TOP_UP_PRESETS = [
  { label: 'Starter',  amount: 10 },
  { label: 'Commuter', amount: 20 },
  { label: 'Regular',  amount: 50 },
  { label: 'Pro',      amount: 100 },
] as const

export const PAYMENT_PROVIDERS = [
  { id: 'mtn_momo',      label: 'MTN Mobile Money',  ussd: '*170#', color: '#FBC02D' },
  { id: 'vodafone_cash', label: 'Vodafone Cash',     ussd: '*110#', color: '#E53935' },
  { id: 'at_money',      label: 'AT Money',          ussd: '*110#', color: '#1565C0' },
  { id: 'card',          label: 'Credit / Debit Card', ussd: '',    color: '#6B7280', comingSoon: true },
] as const

export const REVIEW_TAGS = [
  { id: 'safe_driver', label: 'Safe driver' },
  { id: 'clean_car',   label: 'Clean car' },
  { id: 'friendly',    label: 'Friendly' },
  { id: 'on_time',     label: 'On time' },
  { id: 'great_music', label: 'Great music' },
] as const

export const ACCRA_LOCATIONS = [
  'East Legon',
  'Osu Oxford Street',
  'Legon Campus',
  'Airport City',
  'Accra Mall, Tetteh Quarshie',
  'Kotoka International Airport',
  'Tema Community 1',
  'Madina Station',
  'Labone',
  'Cantonments',
  'Spintex Road',
  'Ring Road Central',
  'Kwame Nkrumah Circle',
  'Accra Central',
  'Boundary Road, East Legon',
] as const

export const TRANSACTION_FEE = 0.50

export const OTP_RESEND_SECONDS = 60

export const USE_MOCK_API = import.meta.env.VITE_USE_MOCK_API !== 'false'
