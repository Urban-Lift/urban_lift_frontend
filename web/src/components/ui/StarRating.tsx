import { useState } from 'react'
import { Star } from 'lucide-react'
import { cn } from '@/utils/cn'

const LABELS: Record<number, string> = {
  1: 'Poor',
  2: 'Fair',
  3: 'Good',
  4: 'Great',
  5: 'Excellent',
}

interface StarRatingProps {
  value?: number
  max?: number
  readOnly?: boolean
  size?: number
  onChange?: (value: number) => void
  showLabel?: boolean
  className?: string
}

export default function StarRating({
  value = 0,
  max = 5,
  readOnly = false,
  size = 28,
  onChange,
  showLabel = false,
  className,
}: StarRatingProps) {
  const [hover, setHover] = useState(0)
  const active = hover || value

  return (
    <div className={cn('flex flex-col items-center gap-1', className)}>
      <div className="flex items-center gap-1">
        {Array.from({ length: max }, (_, i) => i + 1).map(star => (
          <button
            key={star}
            type="button"
            disabled={readOnly}
            onClick={() => !readOnly && onChange?.(star)}
            onMouseEnter={() => !readOnly && setHover(star)}
            onMouseLeave={() => !readOnly && setHover(0)}
            className={cn(
              'transition-transform',
              !readOnly && 'hover:scale-110 cursor-pointer',
              readOnly && 'cursor-default',
            )}
          >
            <Star
              size={size}
              className={cn(
                'transition-colors',
                star <= active ? 'fill-yellow-400 text-yellow-400' : 'fill-gray-200 text-gray-200',
              )}
            />
          </button>
        ))}
      </div>
      {showLabel && active > 0 && (
        <span className="text-sm text-gray-500 font-medium">{LABELS[active]}</span>
      )}
    </div>
  )
}
