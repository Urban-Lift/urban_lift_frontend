import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft, Check, Lock } from 'lucide-react'
import { useWalletStore } from '@/store/wallet.store'
import { walletService } from '@/services/wallet.service'
import { cn } from '@/utils/cn'
import toast from 'react-hot-toast'

const FEE = 0.50

interface Provider {
  id: string
  label: string
  displayLines: string[]
  subtitle: string
  bg: string
  textColor: string
  available: boolean
}

const PROVIDERS: Provider[] = [
  {
    id: 'mtn_momo',
    label: 'MTN MoMo',
    displayLines: ['MTN', 'MoMo'],
    subtitle: 'Pay via *170#',
    bg: 'bg-amber-400',
    textColor: 'text-amber-900',
    available: true,
  },
  {
    id: 'vodafone_cash',
    label: 'Vodafone Cash',
    displayLines: ['Voda', 'Cash'],
    subtitle: 'Pay via *110#',
    bg: 'bg-red-500',
    textColor: 'text-white',
    available: true,
  },
  {
    id: 'at_money',
    label: 'AT Money',
    displayLines: ['AT', 'Money'],
    subtitle: 'Coming soon',
    bg: 'bg-[#1E3A5F]',
    textColor: 'text-white',
    available: false,
  },
  {
    id: 'card',
    label: 'Credit / Debit Card',
    displayLines: ['💳'],
    subtitle: 'Coming soon',
    bg: 'bg-gray-200',
    textColor: 'text-gray-600',
    available: false,
  },
]

export default function TopUpProviderScreen() {
  const navigate = useNavigate()
  const { topUpAmount, setTopUpProvider, setTopUpResult, setWallet } = useWalletStore()
  const [selected, setSelected] = useState<string | null>(null)
  const [loading, setLoading]   = useState(false)

  if (!topUpAmount) {
    navigate('/wallet/topup', { replace: true })
    return null
  }

  const total = topUpAmount + FEE

  async function handlePay() {
    if (!selected || !topUpAmount) return
    setLoading(true)
    try {
      setTopUpProvider(selected)
      const { wallet, referenceId } = await walletService.topUp(topUpAmount, selected)
      setWallet(wallet)
      setTopUpResult({
        referenceId,
        newBalance: wallet.balance,
        completedAt: new Date().toISOString(),
      })
      navigate('/wallet/topup/success', { replace: true })
    } catch {
      toast.error('Payment failed. Please try again.')
    } finally {
      setLoading(false)
    }
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
            <p className="font-bold text-gray-900 text-lg">Select Provider</p>
          </div>
        </div>
      </div>

      <div className="content-shell pt-5 pb-24 md:pb-8 space-y-3">
        {/* Amount card */}
        <div className="bg-white rounded-2xl border border-gray-100 px-5 py-4 flex items-center justify-between">
          <div>
            <p className="text-xs text-gray-400 font-medium mb-0.5">Amount to top up</p>
            <p className="text-2xl font-extrabold text-gray-900">GHS {topUpAmount.toFixed(2)}</p>
          </div>
          <div className="text-right">
            <p className="text-xs text-gray-400 font-medium mb-0.5">Fee</p>
            <p className="text-sm font-semibold text-gray-500">GHS {FEE.toFixed(2)}</p>
          </div>
        </div>

        <p className="text-xs font-semibold text-gray-500 pt-1">Payment method</p>

        {/* Providers */}
        {PROVIDERS.map(p => (
          <button
            key={p.id}
            onClick={() => p.available && setSelected(p.id)}
            disabled={!p.available}
            className={cn(
              'w-full flex items-center gap-4 p-4 rounded-2xl border-2 transition-all text-left',
              !p.available && 'opacity-50 cursor-not-allowed',
              selected === p.id
                ? 'border-green-700 bg-white shadow-sm'
                : 'border-gray-200 bg-white hover:border-green-300',
            )}
          >
            {/* Provider square */}
            <div className={`w-12 h-12 ${p.bg} rounded-xl flex flex-col items-center justify-center shrink-0`}>
              {p.displayLines.map((line, i) => (
                <span key={i} className={`${p.textColor} font-extrabold leading-tight`} style={{ fontSize: p.displayLines.length === 1 ? 22 : 11 }}>
                  {line}
                </span>
              ))}
            </div>
            <div className="flex-1">
              <p className="font-semibold text-gray-900 text-sm">{p.label}</p>
              <p className="text-xs text-gray-400 mt-0.5">{p.subtitle}</p>
            </div>
            {p.available && (
              <div className={cn(
                'w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 transition-all',
                selected === p.id ? 'border-green-700 bg-green-700' : 'border-gray-300',
              )}>
                {selected === p.id && <Check size={11} className="text-white" strokeWidth={3} />}
              </div>
            )}
          </button>
        ))}

        <div className="flex items-center gap-2 justify-center text-gray-400 pt-1">
          <Lock size={12} />
          <p className="text-xs">Payments are encrypted and secure</p>
        </div>
      </div>

      {/* Sticky bottom bar */}
      <div className="fixed bottom-0 inset-x-0 bg-white border-t border-gray-100 safe-area-bottom md:static md:border-0 md:bg-transparent md:mt-0">
        <div className="content-shell py-4 space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-500">Transaction fee</span>
            <span className="font-semibold text-gray-700">GHS {FEE.toFixed(2)}</span>
          </div>
          <button
            onClick={handlePay}
            disabled={!selected || loading}
            className={cn(
              'w-full h-14 rounded-2xl font-bold text-base flex items-center justify-center gap-2 transition-all',
              selected && !loading
                ? 'bg-green-500 hover:bg-green-600 text-white shadow-md shadow-green-500/30'
                : 'bg-gray-200 text-gray-400 cursor-not-allowed',
            )}
          >
            {loading ? (
              <div className="w-5 h-5 border-2 border-white/40 border-t-white rounded-full animate-spin" />
            ) : (
              <>Proceed to Pay GHS {total.toFixed(2)} <span className="text-lg">→</span></>
            )}
          </button>
        </div>
      </div>
    </div>
  )
}
