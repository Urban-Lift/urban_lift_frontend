import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useWalletStore } from '@/store/wallet.store'

export default function TopUpSuccessScreen() {
  const navigate = useNavigate()
  const { topUpAmount, topUpResult, topUpProvider } = useWalletStore()

  useEffect(() => {
    if (!topUpResult || !topUpAmount) navigate('/wallet', { replace: true })
  }, [topUpResult, topUpAmount, navigate])

  if (!topUpResult || !topUpAmount) return null

  const dtFmt = new Intl.DateTimeFormat('en-GH', {
    day: 'numeric', month: 'short', year: 'numeric',
    hour: 'numeric', minute: '2-digit', hour12: true,
  })

  const providerLabel: Record<string, string> = {
    mtn_momo:      'MTN Mobile Money',
    vodafone_cash: 'Vodafone Cash',
    at_money:      'AT Money',
    card:          'Bank Card',
  }

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <div className="flex-1 flex flex-col max-w-sm mx-auto w-full px-6 pt-8 pb-8 items-center justify-center">
        {/* Glow check icon */}
        <div className="relative flex items-center justify-center mb-6">
          <div className="w-[110px] h-[110px] rounded-full bg-green-100/70" />
          <div className="absolute w-[80px] h-[80px] rounded-full bg-[#22C55E] flex items-center justify-center shadow-lg shadow-green-500/30">
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none">
              <path d="M5 13l4 4L19 7" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
        </div>

        <h1 className="text-2xl font-extrabold text-gray-900 text-center mb-1">Top-up Successful!</h1>
        <p className="text-sm text-gray-400 text-center mb-8">Your wallet has been funded.</p>

        {/* Details card */}
        <div className="w-full bg-gray-50 rounded-2xl border border-gray-200 overflow-hidden mb-auto">
          {/* Amount header */}
          <div className="py-5 text-center border-b border-gray-200">
            <p className="text-[11px] font-semibold text-gray-400 tracking-widest uppercase mb-1.5">Amount Added</p>
            <p className="text-[36px] font-extrabold text-green-600 leading-tight tracking-tight">
              GHS {topUpAmount.toFixed(2)}
            </p>
          </div>

          {/* Detail rows */}
          <div className="px-5 py-4 space-y-3.5">
            <DetailRow
              label="New Balance"
              value={`GHS ${topUpResult.newBalance.toFixed(2)}`}
              bold
            />
            <DetailRow
              label="Payment Method"
              value={`● ${providerLabel[topUpProvider ?? ''] ?? 'Mobile Money'}`}
            />
            <DetailRow
              label="Reference ID"
              value={topUpResult.referenceId}
              mono
            />
            <DetailRow
              label="Date"
              value={dtFmt.format(new Date(topUpResult.completedAt))}
            />
          </div>
        </div>

        <div className="w-full pt-8">
          <button
            onClick={() => navigate('/wallet', { replace: true })}
            className="w-full h-[54px] bg-[#22C55E] hover:bg-green-500 text-white rounded-2xl font-bold text-base transition-colors"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  )
}

function DetailRow({ label, value, bold, mono }: { label: string; value: string; bold?: boolean; mono?: boolean }) {
  return (
    <div className="flex items-center justify-between gap-4">
      <p className="text-sm text-gray-400 shrink-0">{label}</p>
      <p className={[
        'text-sm text-right',
        bold ? 'font-bold text-gray-900' : 'font-medium text-gray-700',
        mono ? 'font-mono text-xs bg-white px-2 py-0.5 rounded border border-gray-200' : '',
      ].filter(Boolean).join(' ')}>
        {value}
      </p>
    </div>
  )
}
