import type { Wallet, Transaction, PaymentMethod } from '@/types'

const delay = (ms: number) => new Promise(res => setTimeout(res, ms))

const now = new Date()
const daysAgo = (d: number) => new Date(now.getTime() - d * 86_400_000).toISOString()

export const mockWalletData = {
  wallet: {
    id: 'wallet-001',
    userId: 'usr-001',
    balance: 245.50,
    currency: 'GHS',
    updatedAt: now.toISOString(),
  } satisfies Wallet,

  transactions: [
    {
      id: 'txn-001',
      walletId: 'wallet-001',
      type: 'top_up',
      amount: 100,
      direction: 'credit',
      paymentProvider: 'mtn_momo',
      referenceId: 'REF-7A3KP2',
      description: 'Top up via MTN MoMo',
      status: 'completed',
      createdAt: daysAgo(0),
    },
    {
      id: 'txn-002',
      walletId: 'wallet-001',
      type: 'ride_payment',
      amount: 25,
      direction: 'debit',
      description: 'Ride: East Legon → Osu',
      status: 'completed',
      createdAt: daysAgo(1),
    },
    {
      id: 'txn-003',
      walletId: 'wallet-001',
      type: 'referral_credit',
      amount: 10,
      direction: 'credit',
      referenceId: 'REF-KWAME10',
      description: 'Referral bonus — Ama joined',
      status: 'completed',
      createdAt: daysAgo(2),
    },
    {
      id: 'txn-004',
      walletId: 'wallet-001',
      type: 'ride_payment',
      amount: 18,
      direction: 'debit',
      description: 'Ride: Legon Campus → Airport City',
      status: 'completed',
      createdAt: daysAgo(3),
    },
    {
      id: 'txn-005',
      walletId: 'wallet-001',
      type: 'top_up',
      amount: 50,
      direction: 'credit',
      paymentProvider: 'vodafone_cash',
      referenceId: 'REF-9XZ1MN',
      description: 'Top up via Vodafone Cash',
      status: 'completed',
      createdAt: daysAgo(5),
    },
    {
      id: 'txn-006',
      walletId: 'wallet-001',
      type: 'ride_payment',
      amount: 30,
      direction: 'debit',
      description: 'Ride: Madina → Osu Oxford Street',
      status: 'completed',
      createdAt: daysAgo(7),
    },
  ] satisfies Transaction[],

  paymentMethods: [
    {
      id: 'pm-001',
      userId: 'usr-001',
      provider: 'mtn_momo',
      accountNumber: '0541234567',
      isDefault: true,
      isActive: true,
    },
    {
      id: 'pm-002',
      userId: 'usr-001',
      provider: 'vodafone_cash',
      accountNumber: '0201234567',
      isDefault: false,
      isActive: true,
    },
  ] satisfies PaymentMethod[],
}

export const mockWalletApi = {
  async getWallet(): Promise<Wallet> {
    await delay(600)
    return { ...mockWalletData.wallet }
  },

  async getTransactions(): Promise<Transaction[]> {
    await delay(700)
    return [...mockWalletData.transactions]
  },

  async getPaymentMethods(): Promise<PaymentMethod[]> {
    await delay(400)
    return [...mockWalletData.paymentMethods]
  },

  async topUp(amount: number, provider: string): Promise<{ wallet: Wallet; referenceId: string }> {
    await delay(1200)
    const newBalance = mockWalletData.wallet.balance + amount
    mockWalletData.wallet.balance = newBalance
    mockWalletData.wallet.updatedAt = new Date().toISOString()
    const referenceId = `REF-${Math.random().toString(36).slice(2, 8).toUpperCase()}`
    mockWalletData.transactions.unshift({
      id: `txn-${Date.now()}`,
      walletId: 'wallet-001',
      type: 'top_up',
      amount,
      direction: 'credit',
      paymentProvider: provider as any,
      referenceId,
      description: `Top up via ${provider.replace('_', ' ').replace(/\b\w/g, c => c.toUpperCase())}`,
      status: 'completed',
      createdAt: new Date().toISOString(),
    })
    return { wallet: { ...mockWalletData.wallet }, referenceId }
  },
}
