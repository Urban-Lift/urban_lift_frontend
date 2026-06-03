import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { ChevronLeft } from 'lucide-react'
import toast from 'react-hot-toast'
import { Button, StarRating } from '@/components/ui'
import { rideService } from '@/services/ride.service'
import { useBookingStore } from '@/store/booking.store'
import { REVIEW_TAGS } from '@/utils/constants'
import { cn } from '@/utils/cn'

export default function RateTripScreen() {
  const { tripId } = useParams<{ tripId: string }>()
  const navigate   = useNavigate()
  const { past }   = useBookingStore()

  const booking = past.find(b => b.id === tripId)
  const ride    = booking?.ride

  const [rating,     setRating]     = useState(0)
  const [tags,       setTags]       = useState<string[]>([])
  const [note,       setNote]       = useState('')
  const [submitting, setSubmitting] = useState(false)

  function toggleTag(id: string) {
    setTags(prev => prev.includes(id) ? prev.filter(t => t !== id) : [...prev, id])
  }

  async function handleSubmit() {
    if (rating === 0) { toast.error('Please select a rating'); return }
    setSubmitting(true)
    try {
      await rideService.submitReview({ tripId: tripId!, rating, tags, note: note.trim() || undefined })
      toast.success('Thanks for your feedback!')
      navigate('/passenger/my-rides', { replace: true })
    } catch {
      toast.error('Failed to submit review')
    } finally {
      setSubmitting(false)
    }
  }

  const initials = ride?.driver.fullName.split(' ').map(n => n[0]).join('').slice(0, 2) ?? '?'

  return (
    <div className="page-container">
      <div className="flex-1 flex flex-col px-5 pt-6 pb-10">
        {/* Back */}
        <button onClick={() => navigate(-1)} className="self-start flex items-center gap-1 text-gray-500 hover:text-gray-700 -ml-1 mb-8">
          <ChevronLeft size={20} />
          <span className="text-sm">Back</span>
        </button>

        {/* Header */}
        <h1 className="text-2xl font-bold text-gray-900 mb-1">How was your ride?</h1>
        <p className="text-sm text-gray-500 mb-8">Your feedback helps drivers improve</p>

        {/* Driver */}
        {ride && (
          <div className="flex items-center gap-3 mb-8">
            <div className="w-14 h-14 rounded-full bg-green-100 flex items-center justify-center text-green-700 font-bold text-lg">
              {initials}
            </div>
            <div>
              <p className="font-semibold text-gray-900">{ride.driver.fullName}</p>
              <p className="text-xs text-gray-500">{ride.pickupLocation} → {ride.dropoffLocation}</p>
            </div>
          </div>
        )}

        {/* Star rating */}
        <div className="flex justify-center mb-8">
          <StarRating value={rating} onChange={setRating} size={40} showLabel />
        </div>

        {/* Tags */}
        {rating > 0 && (
          <div className="mb-6">
            <p className="text-sm font-medium text-gray-700 mb-3">What stood out?</p>
            <div className="flex flex-wrap gap-2">
              {REVIEW_TAGS.map(({ id, label }) => (
                <button
                  key={id}
                  onClick={() => toggleTag(id)}
                  className={cn(
                    'px-3 py-1.5 rounded-full text-sm font-medium border transition-all',
                    tags.includes(id)
                      ? 'bg-green-700 text-white border-green-700'
                      : 'bg-white text-gray-600 border-gray-300 hover:border-green-500'
                  )}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Note */}
        {rating > 0 && (
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Add a note <span className="text-gray-400 font-normal">(optional)</span>
            </label>
            <textarea
              value={note}
              onChange={e => setNote(e.target.value)}
              placeholder="Great ride, very punctual..."
              rows={3}
              maxLength={200}
              className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm resize-none focus:outline-none focus:border-green-600 focus:ring-2 focus:ring-green-600/20 transition-all"
            />
            <p className="text-right text-xs text-gray-400 mt-1">{note.length}/200</p>
          </div>
        )}

        <div className="flex-1" />

        <Button fullWidth size="lg" onClick={handleSubmit} loading={submitting} disabled={rating === 0}>
          Submit Review
        </Button>

        <button onClick={() => navigate('/passenger/my-rides', { replace: true })} className="mt-3 text-center text-sm text-gray-400 hover:text-gray-600">
          Skip
        </button>
      </div>
    </div>
  )
}
