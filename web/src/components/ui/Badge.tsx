import { cn } from '@/utils/cn'

export type BadgeVariant =
  | 'confirmed'
  | 'pending'
  | 'cancelled'
  | 'in_progress'
  | 'completed'
  | 'super_driver'
  | 'full'
  | 'green'
  | 'gray'

interface BadgeProps {
  variant?: BadgeVariant
  children: React.ReactNode
  className?: string
}

const styles: Record<BadgeVariant, string> = {
  confirmed:   'bg-green-100 text-green-700',
  pending:     'bg-yellow-100 text-yellow-700',
  cancelled:   'bg-red-100 text-red-600',
  in_progress: 'bg-blue-100 text-blue-700',
  completed:   'bg-gray-100 text-gray-600',
  super_driver:'bg-green-700 text-white',
  full:        'bg-red-100 text-red-600',
  green:       'bg-green-100 text-green-700',
  gray:        'bg-gray-100 text-gray-600',
}

export default function Badge({ variant = 'gray', children, className }: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold',
        styles[variant],
        className,
      )}
    >
      {children}
    </span>
  )
}
