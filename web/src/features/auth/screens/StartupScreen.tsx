import { useNavigate } from 'react-router-dom'
import { Leaf, Users, PiggyBank } from 'lucide-react'

const FEATURES = [
  { icon: Leaf,     color: 'text-green-600',  bg: 'bg-green-100',  label: 'Green',  sub: 'Reduce CO2'  },
  { icon: Users,    color: 'text-amber-600',  bg: 'bg-amber-100',  label: 'Social', sub: 'Meet people' },
  { icon: PiggyBank,color: 'text-blue-600',   bg: 'bg-blue-100',   label: 'Save',   sub: 'Cut costs'   },
]

export default function StartupScreen() {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen flex flex-col bg-white relative overflow-hidden">
      {/* Map-like decorative background */}
      <div className="absolute top-0 inset-x-0 h-[45%] bg-gradient-to-br from-green-50 to-emerald-50 overflow-hidden">
        <svg className="absolute inset-0 w-full h-full opacity-40" xmlns="http://www.w3.org/2000/svg">
          <line x1="0" y1="30%" x2="100%" y2="35%" stroke="#9CA3AF" strokeWidth="1.5"/>
          <line x1="0" y1="60%" x2="100%" y2="65%" stroke="#9CA3AF" strokeWidth="1"/>
          <line x1="0" y1="80%" x2="100%" y2="78%" stroke="#9CA3AF" strokeWidth="0.8"/>
          <line x1="25%" y1="0" x2="28%" y2="100%" stroke="#9CA3AF" strokeWidth="1.5"/>
          <line x1="60%" y1="0" x2="58%" y2="100%" stroke="#9CA3AF" strokeWidth="1"/>
          <line x1="82%" y1="0" x2="85%" y2="100%" stroke="#9CA3AF" strokeWidth="0.8"/>
          <line x1="5%" y1="10%" x2="50%" y2="85%" stroke="#9CA3AF" strokeWidth="0.8"/>
          <circle cx="60%" cy="38%" r="8" fill="#1A7A3C" opacity="0.7"/>
          <circle cx="60%" cy="38%" r="4" fill="white"/>
        </svg>
      </div>

      {/* Skip */}
      <div className="relative z-10 flex justify-end px-5 pt-safe pt-4">
        <button
          onClick={() => navigate('/auth/login')}
          className="text-sm text-gray-500 font-medium hover:text-gray-700 py-1 px-3"
        >
          Skip
        </button>
      </div>

      {/* Main content — centered card on desktop */}
      <div className="relative z-10 flex-1 flex flex-col items-center justify-end md:justify-center">
        <div className="w-full max-w-sm flex flex-col items-center px-6">
          {/* Logo — positioned in the map area */}
          <div className="mb-4 -mt-8 md:mt-0">
            <div className="relative inline-block">
              <div className="w-20 h-20 bg-green-700 rounded-[22px] flex items-center justify-center shadow-lg shadow-green-900/25">
                <span className="text-white text-3xl font-black tracking-tighter leading-none">UL</span>
              </div>
              <div className="absolute -top-1 -right-1 w-5 h-5 bg-amber-400 rounded-full border-2 border-white" />
            </div>
          </div>

          {/* UrbanLift wordmark */}
          <p className="text-lg font-black tracking-tight mb-8">
            <span className="text-gray-900">Urban</span>
            <span className="text-green-700">Lift</span>
          </p>

          {/* Heading */}
          <h1 className="text-[2rem] font-extrabold text-center leading-tight mb-3">
            Move Together,{' '}
            <span className="text-green-600">Grow Together</span>
          </h1>
          <p className="text-gray-500 text-sm text-center leading-relaxed mb-8">
            The community carpooling app<br/>designed for your city.
          </p>

          {/* Feature cards */}
          <div className="grid grid-cols-3 gap-3 w-full mb-9">
            {FEATURES.map(({ icon: Icon, color, bg, label, sub }) => (
              <div
                key={label}
                className="flex flex-col items-center gap-2 bg-white rounded-2xl border border-gray-100 py-4 px-2 shadow-sm"
              >
                <div className={`w-10 h-10 ${bg} rounded-full flex items-center justify-center`}>
                  <Icon size={18} className={color} />
                </div>
                <span className="text-xs font-bold text-gray-900">{label}</span>
                <span className="text-[10px] text-gray-400 text-center">{sub}</span>
              </div>
            ))}
          </div>

          {/* CTA */}
          <button
            onClick={() => navigate('/auth/login')}
            className="w-full h-14 bg-green-500 hover:bg-green-600 text-white rounded-2xl font-bold text-base flex items-center justify-center gap-2 transition-colors shadow-md shadow-green-500/30 mb-4"
          >
            Get Started
            <span className="text-lg">→</span>
          </button>

          <p className="text-sm text-gray-400 mb-8">
            Have an account?{' '}
            <button
              onClick={() => navigate('/auth/login')}
              className="text-green-700 font-bold hover:underline"
            >
              Log in
            </button>
          </p>
        </div>
      </div>
    </div>
  )
}
