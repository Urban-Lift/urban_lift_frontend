import { create } from 'zustand'
import type { Wallet, Transaction, PaymentMethod } from '@/types'

interface WalletStore {
  wallet: Wallet | null
  transactions: Transaction[]
  paymentMethods: PaymentMethod[]
  isLoading: boolean
  // top-up flow state
  topUpAmount: number | null
  topUpProvider: string | null
  topUpResult: { referenceId: string; newBalance: number; completedAt: string } | null

  setWallet: (w: Wallet) => void
  setTransactions: (t: Transaction[]) => void
  setPaymentMethods: (m: PaymentMethod[]) => void
  setLoading: (v: boolean) => void
  setTopUpAmount: (a: number | null) => void
  setTopUpProvider: (p: string | null) => void
  setTopUpResult: (r: WalletStore['topUpResult']) => void
  resetTopUp: () => void
}

export const useWalletStore = create<WalletStore>(set => ({
  wallet: null,
  transactions: [],
  paymentMethods: [],
  isLoading: false,
  topUpAmount: null,
  topUpProvider: null,
  topUpResult: null,

  setWallet:         w  => set({ wallet: w }),
  setTransactions:   t  => set({ transactions: t }),
  setPaymentMethods: m  => set({ paymentMethods: m }),
  setLoading:        v  => set({ isLoading: v }),
  setTopUpAmount:    a  => set({ topUpAmount: a }),
  setTopUpProvider:  p  => set({ topUpProvider: p }),
  setTopUpResult:    r  => set({ topUpResult: r }),
  resetTopUp: () => set({ topUpAmount: null, topUpProvider: null, topUpResult: null }),
}))
