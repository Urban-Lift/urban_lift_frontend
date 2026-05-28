import { cn } from '@/utils/cn'

interface CardProps {
  children: React.ReactNode
  className?: string
  onClick?: () => void
  padding?: 'none' | 'sm' | 'md' | 'lg'
}

const paddings = {
  none: '',
  sm:   'p-3',
  md:   'p-4',
  lg:   'p-5',
}

export default function Card({ children, className, onClick, padding = 'md' }: CardProps) {
  return (
    <div
      onClick={onClick}
      className={cn(
        'bg-white rounded-2xl border border-border shadow-card',
        paddings[padding],
        onClick && 'cursor-pointer hover:shadow-md transition-shadow active:scale-[0.99]',
        className,
      )}
    >
      {children}
    </div>
  )
}
