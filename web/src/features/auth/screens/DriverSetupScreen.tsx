import { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Camera, ChevronLeft } from 'lucide-react'
import { Button, Input } from '@/components/ui'
import { useAuthStore } from '@/store/auth.store'

const schema = z.object({
  fullName:         z.string().min(2, 'Full name must be at least 2 characters'),
  email:            z.string().email('Enter a valid email').or(z.literal('')).optional(),
  emergencyContact: z.string()
    .regex(/^[+\d\s()-]{9,15}$/, 'Enter a valid emergency contact number'),
})

type FormValues = z.infer<typeof schema>

export default function DriverSetupScreen() {
  const navigate = useNavigate()
  const location = useLocation()
  const token    = (location.state as { token?: string } | null)?.token ?? ''
  const { pendingPhone, setPendingEmail } = useAuthStore()

  const [avatarPreview, setAvatarPreview] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { fullName: '', email: '', emergencyContact: '' },
  })

  function handleAvatarChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    setAvatarPreview(URL.createObjectURL(file))
  }

  function onSubmit(data: FormValues) {
    if (data.email) setPendingEmail(data.email)
    navigate('/auth/setup/driver/vehicle', {
      state: {
        token,
        driverData: {
          fullName:         data.fullName,
          email:            data.email || undefined,
          emergencyContact: data.emergencyContact,
          phone:            pendingPhone,
        },
      },
    })
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
              <div className="w-8 h-1.5 rounded-full bg-gray-200" />
            </div>
            <span className="text-xs text-gray-400">Step 1 of 2</span>
          </div>
          <h1 className="text-2xl font-bold text-gray-900">Your details</h1>
          <p className="mt-1 text-sm text-gray-500">Personal info for your driver account</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5">
          {/* Avatar Upload */}
          <div className="flex justify-center mb-2">
            <label className="relative cursor-pointer group">
              <div className="w-20 h-20 rounded-full bg-gray-100 border-2 border-dashed border-gray-300 group-hover:border-green-500 transition-colors overflow-hidden flex items-center justify-center">
                {avatarPreview ? (
                  <img src={avatarPreview} alt="avatar" className="w-full h-full object-cover" />
                ) : (
                  <Camera size={28} className="text-gray-400 group-hover:text-green-600 transition-colors" />
                )}
              </div>
              <div className="absolute bottom-0 right-0 w-6 h-6 bg-green-700 rounded-full flex items-center justify-center">
                <Camera size={12} className="text-white" />
              </div>
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleAvatarChange}
              />
            </label>
          </div>
          <p className="text-center text-xs text-gray-400 -mt-2">Add profile photo (optional)</p>

          <Input
            label="Full Name"
            placeholder="Kofi Osei"
            {...register('fullName')}
            error={errors.fullName?.message}
          />

          <Input
            label="Email Address (optional)"
            type="email"
            placeholder="kofi@example.com"
            {...register('email')}
            error={errors.email?.message}
            hint="For trip receipts and account recovery"
          />

          <Input
            label="Emergency Contact"
            type="tel"
            placeholder="+233 20 123 4567"
            {...register('emergencyContact')}
            error={errors.emergencyContact?.message}
            hint="A trusted person we can contact in an emergency"
            inputMode="tel"
          />

          <Button
            type="submit"
            fullWidth
            size="lg"
            loading={isSubmitting}
            className="mt-4"
          >
            Next: Vehicle Details
          </Button>
        </form>
      </div>
    </div>
  )
}
