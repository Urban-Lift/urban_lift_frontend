import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft, Check } from 'lucide-react'
import { useWalletStore } from '@/store/wallet.store'
import { cn } from '@/utils/cn'

const PRESETS: { label: string; amount: number }[] = [
  { label: 'Starter',  amount: 10  },
  { label: 'Commuter', amount: 20  },
  { label: 'Regular',  amount: 50  },
  { label: 'Pro',      amount: 100 },
]

export default function TopUpAmountScreen() {
  const navigate = useNavigate()
  const { wallet, setTopUpAmount } = useWalletStore()
  const [selected, setSelected] = useState<number>(10)
  const [custom, setCustom]     = useState('')

  const customNum = parseFloat(custom)
  const amount    = custom ? (isNaN(customNum) ? null : customNum) : selected
  const isValid   = amount !== null && amount >= 1

  function handleContinue() {
    if (!isValid || amount === null) return
    setTopUpAmount(amount)
    navigate('/wallet/topup/provider')
  }

  return (
    <div className="page-container bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-100 sticky top-0 z-10">
        <div className="content-shell pt-10 pb-4">
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate(-1)}
              className="w-9 h-9 flex items-center justify-center bg-gray-100 rounded-full"
            >
              <ArrowLeft size={18} className="text-gray-700" />
            </button>
            <p className="font-bold text-gray-900 text-lg">Top Up Wallet</p>
          </div>
        </div>
      </div>

      <div className="content-shell pt-5 pb-24 md:pb-8 space-y-5">
        {/* Dark gradient balance card */}
        {wallet && (
          <div
            className="rounded-2xl p-5 flex items-center justify-between"
            style={{ background: 'linear-gradient(135deg, #14532D 0%, #166534 100%)' }}
          >
            <div>
              <p className="text-green-300 text-xs font-medium mb-1">Current Balance</p>
              <p className="text-white text-3xl font-extrabold tracking-tight">
                GHS {wallet.balance.toFixed(2)}
              </p>
            </div>
            <div className="text-right">
              <p className="text-green-400 text-xs">UrbanLift Wallet</p>
            </div>
          </div>
        )}

        {/* Preset tiles — 2×2 grid */}
        <div>
          <p className="text-sm font-semibold text-gray-700 mb-3">Select amount</p>
          <div className="grid grid-cols-2 gap-3">
            {PRESETS.map(({ label, amount: p }) => {
              const isActive = selected === p && !custom
              return (
                <button
                  key={p}
                  onClick={() => { setSelected(p); setCustom('') }}
                  className={cn(
                    'relative py-5 rounded-2xl border-2 transition-all text-left pl-4',
                    isActive
                      ? 'border-green-700 bg-green-700 text-white shadow-md shadow-green-700/20'
                      : 'border-gray-200 bg-white text-gray-800 hover:border-green-400',
                  )}
                >
                  {isActive && (
                    <div className="absolute top-3 right-3 w-5 h-5 bg-white/20 rounded-full flex items-center justify-center">
                      <Check size={11} className="text-white" strokeWidth={3} />
                    </div>
                  )}
                  <p className={cn('text-[11px] font-semibold mb-1', isActive ? 'text-green-200' : 'text-gray-400')}>{label}</p>
                  <p className={cn('text-xl font-extrabold', isActive ? 'text-white' : 'text-gray-900')}>GHS {p}</p>
                </button>
              )
            })}
          </div>
        </div>

        {/* Custom amount */}
        <div>
          <p className="text-sm font-semibold text-gray-700 mb-2">Or enter custom amount</p>
          <div className={cn(
            'flex items-center border-2 rounded-2xl bg-white overflow-hidden transition-all',
            custom ? 'border-green-700' : 'border-gray-200 focus-within:border-green-700',
          )}>
            <span className="px-4 text-gray-500 font-semibold text-sm shrink-0">GHS</span>
            <div className="w-px h-6 bg-gray-200" />
            <input
              type="number"
              min={1}
              placeholder="0.00"
              value={custom}
              onChange={e => { setCustom(e.target.value); setSelected(0) }}
              className="flex-1 py-4 px-3 text-base font-semibold text-gray-900 outline-none bg-transparent"
            />
          </div>
          {custom && !isNaN(customNum) && customNum < 1 && (
            <p className="text-xs text-red-500 mt-1">Minimum top-up is GHS 1</p>
          )}
        </div>

        {/* Continue button */}
        <button
          onClick={handleContinue}
          disabled={!isValid}
          className={cn(
            'w-full h-14 rounded-2xl font-bold text-base flex items-center justify-center gap-2 transition-all',
            isValid
              ? 'bg-green-500 hover:bg-green-600 text-white shadow-md shadow-green-500/30'
              : 'bg-gray-200 text-gray-400 cursor-not-allowed',
          )}
        >
          Continue {amount ? `· GHS ${amount}` : ''} <span className="text-lg">→</span>
        </button>
      </div>
    </div>
  )
}
