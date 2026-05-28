export function formatCurrency(amount: number, currency = 'GHS'): string {
  return `${currency} ${amount.toFixed(2)}`
}

export function formatRating(rating: number): string {
  return rating.toFixed(1)
}

export function formatTime(isoString: string): string {
  return new Date(isoString).toLocaleTimeString('en-GH', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  })
}

export function formatDate(isoString: string): string {
  return new Date(isoString).toLocaleDateString('en-GH', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })
}

export function formatDateTime(isoString: string): string {
  return `${formatDate(isoString)} • ${formatTime(isoString)}`
}

export function maskPhone(phone: string): string {
  if (phone.length < 4) return phone
  return `**${phone.slice(-2)}`
}

export function maskAccount(account: string): string {
  if (account.length < 4) return account
  return `${account.slice(0, 3)}****${account.slice(-3)}`
}
