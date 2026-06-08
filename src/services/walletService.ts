/** Wallet balance, top up, transaction history. */
import type { PaymentProvider, Transaction, Wallet } from '@/types';
import { wallet } from '@/mocks/data';
import { refId } from '@/utils/format';
import { delay } from './api';

export const walletService = {
  async getWallet(): Promise<Wallet> {
    return delay(wallet, 500);
  },

  async topUp(
    amount: number,
    provider: PaymentProvider,
  ): Promise<{ reference: string; newBalance: number; transaction: Transaction }> {
    const transaction: Transaction = {
      id: refId('TX'),
      type: 'topup',
      label: `Top up · ${providerLabel(provider)}`,
      amount,
      date: new Date().toISOString(),
      status: 'completed',
    };
    return delay(
      {
        reference: refId('REF'),
        newBalance: wallet.balance + amount,
        transaction,
      },
      1200,
    );
  },
};

export function providerLabel(p: PaymentProvider): string {
  return { mtn: 'MTN MoMo', vodafone: 'Vodafone Cash', at: 'AT Money', card: 'Card' }[p];
}
