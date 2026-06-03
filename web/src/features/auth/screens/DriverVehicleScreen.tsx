import { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { ChevronLeft, Check } from 'lucide-react'
import toast from 'react-hot-toast'
import { Button, Input } from '@/components/ui'
import { useAuthStore } from '@/store/auth.store'
import { authService } from '@/services/auth.service'
import { cn } from '@/utils/cn'

const AMENITIES = [
  { id: 'ac',      label: 'A/C' },
  { id: 'wifi',    label: 'Wi-Fi' },
  { id: 'music',   label: 'Music' },
  { id: 'luggage', label: 'Luggage space' },
  { id: 'pet',     label: 'Pet friendly' },
  { id: 'silent',  label: 'Quiet ride' },
]

const COLORS = ['Black', 'White', 'Silver', 'Red', 'Blue', 'Gold', 'Grey', 'Brown']

const schema = z.object({
  make:  z.string().min(2, 'Enter vehicle make'),
  model: z.string().min(1, 'Enter vehicle model'),
  year:  z.string().regex(/^\d{4}$/, 'Enter a 4-digit year'),
  color: z.string().min(1, 'Select a color'),
  licensePlate: z.string()
    .min(4, 'Enter license plate')
    .regex(/^[A-Za-z0-9\s-]+$/, 'Invalid plate format'),
  seats: z.string().min(1, 'Select available seats'),
})

type FormValues = z.infer<typeof schema>

interface LocationState {
  token?: string
  driverData?: {
    fullName: string
    email?: string
    emergencyContact: string
    phone: string
  }
}

export default function DriverVehicleScreen() {
  const navigate = useNavigate()
  const location = useLocation()
  const state    = (location.state ?? {}) as LocationState
  const { setAuth, setPendingEmail } = useAuthStore()

  const [amenities, setAmenities] = useState<string[]>([])

  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { make: '', model: '', year: '', color: '', licensePlate: '', seats: '3' },
  })

  function toggleAmenity(id: string) {
    setAmenities(prev => prev.includes(id) ? prev.filter(a => a !== id) : [...prev, id])
  }

  async function onSubmit(data: FormValues) {
    if (!state.driverData) {
      toast.error('Missing driver info — please go back')
      return
    }
    // Vehicle fields (data.make, data.model, etc.) will be sent to the real API;
    // mock only needs the driver profile basics for now
    void data
    try {
      const user = await authService.createDriverProfile(state.driverData)
      setAuth(user, state.token ?? '')

      if (state.driverData.email) {
        setPendingEmail(state.driverData.email)
        await authService.sendEmailCode(state.driverData.email)
        navigate('/auth/otp/email')
      } else {
        toast.success('Driver account created!')
        navigate('/driver/dashboard', { replace: true })
      }
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Account creation failed')
    }
  }

  return (
    <div className="page-container">
      <div className="flex-1 flex flex-col px-6 pt-6 pb-10">
        {/* Back */}
        <button
          onClick={() => navigate(-1)}
          className="self-start flex items-center gap-1 text-gray-500 hover:text-gray-700 -ml-1 mb-6"
        >
          <ChevronLeft size={20} />
          <span className="text-sm">Back</span>
        </button>

        {/* Header + Progress */}
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-3">
            <div className="flex gap-1.5">
              <div className="w-8 h-1.5 rounded-full bg-green-700" />
              <div className="w-8 h-1.5 rounded-full bg-green-700" />
            </div>
            <span className="text-xs text-gray-400">Step 2 of 2</span>
          </div>
          <h1 className="text-2xl font-bold text-gray-900">Your vehicle</h1>
          <p className="mt-1 text-sm text-gray-500">Tell passengers about your car</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5">
          <div className="grid grid-cols-2 gap-3">
            <Input
              label="Make"
              placeholder="Toyota"
              {...register('make')}
              error={errors.make?.message}
            />
            <Input
              label="Model"
              placeholder="Corolla"
              {...register('model')}
              error={errors.model?.message}
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <Input
              label="Year"
              placeholder="2019"
              inputMode="numeric"
              maxLength={4}
              {...register('year')}
              error={errors.year?.message}
            />
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Available Seats
              </label>
              <Controller
                control={control}
                name="seats"
                render={({ field }) => (
                  <select
                    {...field}
                    className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                  >
                    {[1, 2, 3, 4, 5, 6].map(n => (
                      <option key={n} value={String(n)}>{n} seat{n > 1 ? 's' : ''}</option>
                    ))}
                  </select>
                )}
              />
              {errors.seats && <p className="mt-1 text-xs text-red-600">{errors.seats.message}</p>}
            </div>
          </div>

          {/* Color picker */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Car Color</label>
            <Controller
              control={control}
              name="color"
              render={({ field }) => (
                <div className="flex flex-wrap gap-2">
                  {COLORS.map(c => (
                    <button
                      key={c}
                      type="button"
                      onClick={() => field.onChange(c)}
                      className={cn(
                        'px-3 py-1.5 rounded-full text-xs font-medium border transition-all',
                        field.value === c
                          ? 'bg-green-700 text-white border-green-700'
                          : 'bg-white text-gray-600 border-gray-300 hover:border-green-500'
                      )}
                    >
                      {c}
                    </button>
                  ))}
                </div>
              )}
            />
            {errors.color && <p className="mt-1 text-xs text-red-600">{errors.color.message}</p>}
          </div>

          <Input
            label="License Plate"
            placeholder="GR-1234-21"
            {...register('licensePlate')}
            error={errors.licensePlate?.message}
          />

          {/* Amenities */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Amenities <span className="text-gray-400 font-normal">(optional)</span>
            </label>
            <div className="flex flex-wrap gap-2">
              {AMENITIES.map(({ id, label }) => {
                const active = amenities.includes(id)
                return (
                  <button
                    key={id}
                    type="button"
                    onClick={() => toggleAmenity(id)}
                    className={cn(
                      'flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium border transition-all',
                      active
                        ? 'bg-green-50 text-green-700 border-green-500'
                        : 'bg-white text-gray-600 border-gray-300 hover:border-green-400'
                    )}
                  >
                    {active && <Check size={12} />}
                    {label}
                  </button>
                )
              })}
            </div>
          </div>

          <Button
            type="submit"
            fullWidth
            size="lg"
            loading={isSubmitting}
            className="mt-4"
          >
            Create Driver Account
          </Button>
        </form>
      </div>
    </div>
  )
}
