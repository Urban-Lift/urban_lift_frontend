import { useRef } from 'react'
import type { KeyboardEvent, ClipboardEvent } from 'react'
import { cn } from '@/utils/cn'

interface OTPInputProps {
  length?: number
  value: string
  onChange: (value: string) => void
  className?: string
  disabled?: boolean
  error?: string
}

export default function OTPInput({ length = 6, value, onChange, className, disabled, error }: OTPInputProps) {
  const digits = value.split('').concat(Array(length).fill('')).slice(0, length)
  const refs = useRef<(HTMLInputElement | null)[]>([])

  const focus = (i: number) => refs.current[i]?.focus()

  function handleChange(i: number, char: string) {
    const cleaned = char.replace(/\D/g, '').slice(-1)
    const next = [...digits]
    next[i] = cleaned
    onChange(next.join(''))
    if (cleaned && i < length - 1) focus(i + 1)
  }

  function handleKey(i: number, e: KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Backspace' && !digits[i] && i > 0) {
      focus(i - 1)
    }
    if (e.key === 'ArrowLeft' && i > 0) focus(i - 1)
    if (e.key === 'ArrowRight' && i < length - 1) focus(i + 1)
  }

  function handlePaste(e: ClipboardEvent<HTMLInputElement>) {
    e.preventDefault()
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, length)
    onChange(pasted.padEnd(length, '').slice(0, length))
    focus(Math.min(pasted.length, length - 1))
  }

  return (
    <div className={cn('flex flex-col items-center gap-3', className)}>
      <div className="flex gap-3">
      {digits.map((digit, i) => (
        <input
          key={i}
          ref={el => { refs.current[i] = el }}
          type="text"
          inputMode="numeric"
          maxLength={1}
          value={digit}
          disabled={disabled}
          onChange={e => handleChange(i, e.target.value)}
          onKeyDown={e => handleKey(i, e)}
          onPaste={handlePaste}
          onFocus={e => e.target.select()}
          className={cn(
            'w-12 h-14 text-center text-xl font-semibold rounded-xl border-2 bg-white transition-colors',
            'focus:outline-none focus:border-green-700 focus:ring-2 focus:ring-green-700/20',
            digit ? 'border-green-700 text-gray-900' : 'border-border text-gray-900',
            'disabled:opacity-50 disabled:cursor-not-allowed',
          )}
        />
      ))}
      </div>
      {error && <p className="text-xs text-red-600 text-center">{error}</p>}
    </div>
  )
}
