import { useNavigate } from 'react-router-dom'
import { ChevronLeft } from 'lucide-react'
import { cn } from '@/utils/cn'

interface PageHeaderProps {
  title: string
  subtitle?: string
  onBack?: () => void
  rightAction?: React.ReactNode
  transparent?: boolean
  className?: string
}

export default function PageHeader({
  title,
  subtitle,
  onBack,
  rightAction,
  transparent = false,
  className,
}: PageHeaderProps) {
  const navigate = useNavigate()
  const handleBack = onBack ?? (() => navigate(-1))

  return (
    <header
      className={cn(
        'flex items-center gap-3 px-4 h-14 shrink-0',
        !transparent && 'bg-white border-b border-border',
        className,
      )}
    >
      <button
        onClick={handleBack}
        className="p-1.5 -ml-1.5 rounded-xl text-gray-600 hover:bg-gray-100 transition-colors"
        aria-label="Go back"
      >
        <ChevronLeft size={22} />
      </button>

      <div className="flex-1 min-w-0">
        <h1 className="text-base font-semibold text-gray-900 truncate">{title}</h1>
        {subtitle && <p className="text-xs text-gray-500 truncate">{subtitle}</p>}
      </div>

      {rightAction && <div className="shrink-0">{rightAction}</div>}
    </header>
  )
}
