/** Wallet: balance + top up + linked payment methods (live API). */
import type { PaymentMethod, PaymentProvider, Transaction, Wallet } from '@/types';
import { http } from './api';
import { asList, mapPaymentMethod, mapTransaction } from './mappers';
import { refId } from '@/utils/format';

export const walletService = {
  async getWallet(): Promise<Wallet> {
    const [balanceRes, methodsRes, txnRes] = await Promise.all([
      http.get('/passenger/wallet/balance').catch(() => ({ balance: 0 })),
      http.get('/passenger/payment-methods').catch(() => ({ payment_methods: [] })),
      http.get('/passenger/transactions').catch(() => ({ transactions: [] })),
    ]);
    const methods = asList(methodsRes?.payment_methods ? { data: methodsRes.payment_methods } : methodsRes);
    const txns = asList(txnRes?.transactions ? { data: txnRes.transactions } : txnRes);
    return {
      balance: Number(balanceRes?.balance ?? 0),
      changePct: 0, // the API has no period-over-period figure
      linkedAccounts: methods.map(mapPaymentMethod),
      transactions: txns.map((t) => mapTransaction(t)),
    };
  },

  async topUp(
    amount: number,
    provider: PaymentProvider,
  ): Promise<{ reference: string; newBalance: number; transaction: Transaction }> {
    const res = await http.postForm('/passenger/wallet/topup', { amount });
    const transaction: Transaction = {
      id: refId('TX'),
      type: 'topup',
      label: `Top up · ${providerLabel(provider)}`,
      amount,
      date: new Date().toISOString(),
      status: 'completed',
    };
    return {
      reference: refId('REF'),
      newBalance: Number(res?.new_balance ?? amount),
      transaction,
    };
  },

  /** method_type must be 'mobile_money' or 'card'. */
  async addPaymentMethod(input: {
    methodType: 'mobile_money' | 'card';
    provider: string;
    accountNumber: string;
    accountName?: string;
  }): Promise<void> {
    await http.postForm('/passenger/payment-methods', {
      method_type: input.methodType,
      provider: input.provider,
      account_number: input.accountNumber,
      account_name: input.accountName,
    });
  },

  async deletePaymentMethod(method: PaymentMethod): Promise<void> {
    await http.del(`/passenger/payment-methods/${method.id}`);
  },
};

export function providerLabel(p: PaymentProvider): string {
  return { mtn: 'MTN MoMo', vodafone: 'Telecel Cash', at: 'AT Money', card: 'Card' }[p];
}
