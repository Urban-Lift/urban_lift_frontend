import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Plus, ArrowDownLeft, ArrowUpRight, TrendingUp, CreditCard } from 'lucide-react'
import { useWalletStore } from '@/store/wallet.store'
import { walletService } from '@/services/wallet.service'
import { formatCurrency, formatDateTime, maskAccount } from '@/utils/format'
import type { Transaction, PaymentMethod } from '@/types'

const PROVIDER_LABELS: Record<string, { label: string; color: string }> = {
  mtn_momo:      { label: 'MTN MoMo',      color: 'bg-yellow-400' },
  vodafone_cash: { label: 'Vodafone Cash', color: 'bg-red-500'    },
  at_money:      { label: 'AT Money',      color: 'bg-blue-500'   },
  card:          { label: 'Bank Card',     color: 'bg-gray-400'   },
}

export default function MyWalletScreen() {
  const navigate = useNavigate()
  const { wallet, transactions, paymentMethods, isLoading, setWallet, setTransactions, setPaymentMethods, setLoading, resetTopUp } =
    useWalletStore()

  useEffect(() => {
    resetTopUp()
    setLoading(true)
    Promise.all([
      walletService.getWallet(),
      walletService.getTransactions(),
      walletService.getPaymentMethods(),
    ])
      .then(([w, t, m]) => { setWallet(w); setTransactions(t); setPaymentMethods(m) })
      .finally(() => setLoading(false))
  }, [])

  return (
    <div className="page-container bg-gray-50">
      {/* Dark gradient balance card */}
      <div style={{ background: 'linear-gradient(135deg, #14532D 0%, #166534 100%)' }}>
        <div className="content-shell pt-10 pb-8">
          <p className="text-green-300 text-xs font-semibold uppercase tracking-wider">My Wallet</p>
          {isLoading || !wallet ? (
            <div className="mt-2 h-10 w-40 bg-white/20 rounded-xl animate-pulse" />
          ) : (
            <p className="text-white text-4xl font-extrabold mt-1 tracking-tight">
              {formatCurrency(wallet.balance)}
            </p>
          )}
          <p className="text-green-400 text-xs mt-1">Available balance</p>

          <button
            onClick={() => navigate('/wallet/topup')}
            className="mt-5 flex items-center gap-2 bg-white text-green-700 font-bold text-sm px-5 py-2.5 rounded-2xl hover:bg-green-50 transition-colors shadow-md shadow-black/10"
          >
            <Plus size={16} />
            Top Up
          </button>
        </div>
      </div>

      <div className="content-shell pt-5 pb-24 md:pb-8 space-y-6">
        {/* Linked payment methods */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <p className="font-bold text-gray-900">Linked Accounts</p>
            <button className="text-xs text-green-700 font-semibold">+ Add</button>
          </div>
          {isLoading ? (
            <div className="space-y-2">
              {[1, 2].map(i => <div key={i} className="h-14 bg-white rounded-2xl animate-pulse border border-gray-100" />)}
            </div>
          ) : paymentMethods.length === 0 ? (
            <div className="bg-white rounded-2xl border border-gray-100 p-6 text-center">
              <CreditCard size={24} className="text-gray-300 mx-auto mb-2" />
              <p className="text-sm text-gray-500">No linked accounts yet</p>
            </div>
          ) : (
            <div className="space-y-2">
              {paymentMethods.map(pm => <PaymentMethodRow key={pm.id} pm={pm} />)}
            </div>
          )}
        </div>

        {/* Transactions */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <p className="font-bold text-gray-900">Recent Activity</p>
            {transactions.length > 5 && (
              <button className="text-xs text-green-700 font-semibold">See all</button>
            )}
          </div>
          {isLoading ? (
            <div className="space-y-2">
              {[1, 2, 3].map(i => <div key={i} className="h-16 bg-white rounded-2xl animate-pulse border border-gray-100" />)}
            </div>
          ) : transactions.length === 0 ? (
            <div className="bg-white rounded-2xl border border-gray-100 p-6 text-center">
              <TrendingUp size={24} className="text-gray-300 mx-auto mb-2" />
              <p className="text-sm text-gray-500">No transactions yet</p>
            </div>
          ) : (
            <div className="bg-white rounded-2xl border border-gray-100 divide-y divide-gray-50 overflow-hidden">
              {transactions.slice(0, 8).map(txn => (
                <TransactionRow key={txn.id} txn={txn} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

function PaymentMethodRow({ pm }: { pm: PaymentMethod }) {
  const info = PROVIDER_LABELS[pm.provider] ?? { label: pm.provider, color: 'bg-gray-400' }
  return (
    <div className="bg-white rounded-2xl border border-gray-100 px-4 py-3 flex items-center gap-3">
      <div className={`w-8 h-8 ${info.color} rounded-lg shrink-0`} />
      <div className="flex-1">
        <p className="text-sm font-semibold text-gray-900">{info.label}</p>
        <p className="text-xs text-gray-400">{maskAccount(pm.accountNumber)}</p>
      </div>
      {pm.isDefault && (
        <span className="text-[10px] font-semibold bg-green-100 text-green-700 px-2 py-0.5 rounded-full">Default</span>
      )}
    </div>
  )
}

function TransactionRow({ txn }: { txn: Transaction }) {
  const isCredit = txn.direction === 'credit'
  return (
    <div className="px-4 py-3.5 flex items-center gap-3">
      <div className={`w-9 h-9 rounded-full flex items-center justify-center shrink-0 ${isCredit ? 'bg-green-50' : 'bg-red-50'}`}>
        {isCredit
          ? <ArrowDownLeft size={16} className="text-green-600" />
          : <ArrowUpRight size={16} className="text-red-500" />}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-gray-900 truncate">{txn.description}</p>
        <p className="text-xs text-gray-400">{formatDateTime(txn.createdAt)}</p>
      </div>
      <p className={`text-sm font-bold shrink-0 ${isCredit ? 'text-green-700' : 'text-red-500'}`}>
        {isCredit ? '+' : '-'}{formatCurrency(txn.amount)}
      </p>
    </div>
  )
}
