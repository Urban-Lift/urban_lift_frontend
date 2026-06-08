import { format, formatDistanceToNow, isToday, isTomorrow } from 'date-fns';

/** Format an amount as Ghana Cedis, e.g. 12.5 → "GHS 12.50". */
export function ghs(amount: number): string {
  const sign = amount < 0 ? '-' : '';
  return `${sign}GHS ${Math.abs(amount).toFixed(2)}`;
}

/** Compact cedis without decimals when whole, e.g. 10 → "GHS 10". */
export function ghsCompact(amount: number): string {
  const whole = Number.isInteger(amount);
  return `GHS ${whole ? amount : amount.toFixed(2)}`;
}

/** Normalise a Ghana phone number to +233 format for display. */
export function formatPhone(raw: string): string {
  const digits = raw.replace(/\D/g, '');
  const local = digits.startsWith('233') ? digits.slice(3) : digits.replace(/^0/, '');
  return `+233 ${local.slice(0, 2)} ${local.slice(2, 5)} ${local.slice(5)}`.trim();
}

/** Friendly departure label: "Today, 14:30", "Tomorrow, 08:00", or date. */
export function departLabel(iso: string): string {
  const d = new Date(iso);
  const time = format(d, 'HH:mm');
  if (isToday(d)) return `Today, ${time}`;
  if (isTomorrow(d)) return `Tomorrow, ${time}`;
  return format(d, 'EEE d MMM, HH:mm');
}

export function timeAgo(iso: string): string {
  return formatDistanceToNow(new Date(iso), { addSuffix: true });
}

export function clockTime(iso: string): string {
  return format(new Date(iso), 'HH:mm');
}

export function initials(name: string): string {
  return name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase())
    .join('');
}

/** Mock reference id e.g. "ULF-8F3K2P". */
export function refId(prefix = 'ULF'): string {
  return `${prefix}-${Math.random().toString(36).slice(2, 8).toUpperCase()}`;
}
