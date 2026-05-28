import { cn } from '@/utils/cn'

type AvatarSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl'

interface AvatarProps {
  src?: string
  name?: string
  size?: AvatarSize
  online?: boolean
  verified?: boolean
  className?: string
}

const sizes: Record<AvatarSize, { container: string; text: string; indicator: string }> = {
  xs: { container: 'w-7 h-7',   text: 'text-xs',  indicator: 'w-2 h-2 border' },
  sm: { container: 'w-9 h-9',   text: 'text-sm',  indicator: 'w-2.5 h-2.5 border' },
  md: { container: 'w-12 h-12', text: 'text-base', indicator: 'w-3 h-3 border-2' },
  lg: { container: 'w-16 h-16', text: 'text-xl',  indicator: 'w-3.5 h-3.5 border-2' },
  xl: { container: 'w-20 h-20', text: 'text-2xl', indicator: 'w-4 h-4 border-2' },
}

function initials(name?: string): string {
  if (!name) return '?'
  return name
    .split(' ')
    .slice(0, 2)
    .map(w => w[0])
    .join('')
    .toUpperCase()
}

export default function Avatar({ src, name, size = 'md', online, verified, className }: AvatarProps) {
  const s = sizes[size]
  return (
    <div className={cn('relative inline-flex shrink-0', className)}>
      <div
        className={cn(
          s.container,
          'rounded-full overflow-hidden bg-green-100 flex items-center justify-center font-semibold text-green-700 ring-2 ring-white',
        )}
      >
        {src ? (
          <img src={src} alt={name ?? 'avatar'} className="w-full h-full object-cover" />
        ) : (
          <span className={s.text}>{initials(name)}</span>
        )}
      </div>

      {online !== undefined && (
        <span
          className={cn(
            'absolute bottom-0 right-0 rounded-full border-white',
            s.indicator,
            online ? 'bg-green-500' : 'bg-gray-400',
          )}
        />
      )}

      {verified && (
        <span className="absolute -bottom-0.5 -right-0.5 bg-green-700 rounded-full p-0.5">
          <svg className="w-2.5 h-2.5 text-white" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
          </svg>
        </span>
      )}
    </div>
  )
}
