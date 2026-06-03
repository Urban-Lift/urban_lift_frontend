import { mockWalletApi } from '@/mocks/wallet.mock'
import type { Wallet, Transaction, PaymentMethod } from '@/types'

export const walletService = {
  getWallet: (): Promise<Wallet> => mockWalletApi.getWallet(),
  getTransactions: (): Promise<Transaction[]> => mockWalletApi.getTransactions(),
  getPaymentMethods: (): Promise<PaymentMethod[]> => mockWalletApi.getPaymentMethods(),
  topUp: (amount: number, provider: string): Promise<{ wallet: Wallet; referenceId: string }> =>
    mockWalletApi.topUp(amount, provider),
}
