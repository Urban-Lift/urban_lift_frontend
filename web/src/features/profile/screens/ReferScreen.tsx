import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft, Copy, Check, Gift, Users, Wallet } from 'lucide-react'
import toast from 'react-hot-toast'
import { useAuthStore } from '@/store/auth.store'

const HOW_IT_WORKS = [
  { icon: Copy,   label: 'Share your code', desc: 'Send your unique referral code to friends' },
  { icon: Users,  label: 'They sign up',    desc: 'Your friend creates an UrbanLift account' },
  { icon: Wallet, label: 'You both earn',   desc: 'Get GHS 10 added to your wallet instantly' },
]

export default function ReferScreen() {
  const navigate = useNavigate()
  const user = useAuthStore(s => s.user)
  const [copied, setCopied] = useState(false)

  const code = user?.referralCode ?? 'URBANLIFT'
  const link = `https://urbanlift.app/join?ref=${code}`

  function handleCopy(text: string) {
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true)
      toast.success('Copied to clipboard!')
      setTimeout(() => setCopied(false), 2000)
    })
  }

  return (
    <div className="page-container bg-gray-50">
      <div className="bg-white border-b border-gray-100 sticky top-0 z-10">
        <div className="content-shell pt-10 pb-4 flex items-center gap-3">
          <button onClick={() => navigate(-1)} className="w-9 h-9 bg-gray-100 rounded-xl flex items-center justify-center">
            <ArrowLeft size={18} />
          </button>
          <p className="font-bold text-gray-900 text-lg">Refer a Friend</p>
        </div>
      </div>

      <div className="content-shell pt-6 pb-24 md:pb-8 space-y-5">
        {/* Hero */}
        <div className="bg-green-700 rounded-2xl p-6 text-center">
          <div className="w-14 h-14 bg-white/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Gift size={28} className="text-white" />
          </div>
          <p className="text-white text-xl font-extrabold">Give GHS 10, Get GHS 10</p>
          <p className="text-green-200 text-sm mt-1">
            Invite a friend to UrbanLift — you both earn when they complete their first ride.
          </p>
        </div>

        {/* Referral code */}
        <div className="bg-white rounded-2xl border border-gray-100 p-5 space-y-3">
          <p className="text-sm font-semibold text-gray-700">Your Referral Code</p>
          <div className="flex items-center gap-3 bg-gray-50 rounded-xl px-4 py-3 border border-gray-200">
            <p className="flex-1 font-mono font-bold text-lg text-gray-900 tracking-widest">{code}</p>
            <button
              onClick={() => handleCopy(code)}
              className="flex items-center gap-1.5 text-green-700 text-sm font-semibold"
            >
              {copied ? <Check size={15} /> : <Copy size={15} />}
              {copied ? 'Copied!' : 'Copy'}
            </button>
          </div>

          <p className="text-sm font-semibold text-gray-700 pt-1">Or share your link</p>
          <div className="flex items-center gap-3 bg-gray-50 rounded-xl px-4 py-3 border border-gray-200">
            <p className="flex-1 text-xs text-gray-500 truncate">{link}</p>
            <button
              onClick={() => handleCopy(link)}
              className="shrink-0 text-green-700 text-sm font-semibold"
            >
              <Copy size={15} />
            </button>
          </div>
        </div>

        {/* How it works */}
        <div>
          <p className="text-sm font-semibold text-gray-700 mb-3">How it works</p>
          <div className="space-y-2">
            {HOW_IT_WORKS.map(({ icon: Icon, label, desc }, i) => (
              <div key={label} className="bg-white rounded-2xl border border-gray-100 p-4 flex items-center gap-4">
                <div className="w-9 h-9 bg-green-50 rounded-xl flex items-center justify-center shrink-0">
                  <Icon size={17} className="text-green-700" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-900">
                    <span className="text-green-700 mr-1">{i + 1}.</span>{label}
                  </p>
                  <p className="text-xs text-gray-400 mt-0.5">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Earnings summary */}
        <div className="bg-amber-50 rounded-2xl border border-amber-200 p-4 flex items-center gap-4">
          <div className="w-10 h-10 bg-amber-100 rounded-xl flex items-center justify-center shrink-0">
            <Wallet size={18} className="text-amber-700" />
          </div>
          <div>
            <p className="text-sm font-bold text-amber-900">You've earned GHS 10.00</p>
            <p className="text-xs text-amber-700 mt-0.5">From 1 successful referral</p>
          </div>
        </div>
      </div>
    </div>
  )
}
