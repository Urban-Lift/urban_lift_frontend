import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft, Camera } from 'lucide-react'
import toast from 'react-hot-toast'
import { Button, Input } from '@/components/ui'
import { useAuthStore } from '@/store/auth.store'
import { profileService } from '@/services/profile.service'

export default function EditProfileScreen() {
  const navigate  = useNavigate()
  const { user, setAuth } = useAuthStore()
  const token = useAuthStore(s => s.token)

  const [fullName,        setFullName]        = useState(user?.fullName ?? '')
  const [email,           setEmail]           = useState(user?.email ?? '')
  const [emergencyContact,setEmergencyContact]= useState(user?.emergencyContact ?? '')
  const [saving,          setSaving]          = useState(false)

  async function handleSave() {
    if (!fullName.trim()) { toast.error('Name is required'); return }
    setSaving(true)
    try {
      await profileService.updateProfile({ fullName, email: email || undefined, emergencyContact: emergencyContact || undefined })
      if (user && token) {
        setAuth({ ...user, fullName, email: email || undefined, emergencyContact: emergencyContact || undefined }, token)
      }
      toast.success('Profile updated!')
      navigate(-1)
    } catch {
      toast.error('Failed to save changes')
    } finally {
      setSaving(false)
    }
  }

  const initials = fullName.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase() || '?'

  return (
    <div className="page-container bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-100 sticky top-0 z-10">
        <div className="content-shell pt-10 pb-4 flex items-center gap-3">
          <button onClick={() => navigate(-1)} className="w-9 h-9 bg-gray-100 rounded-xl flex items-center justify-center">
            <ArrowLeft size={18} />
          </button>
          <p className="font-bold text-gray-900 text-lg">Edit Profile</p>
        </div>
      </div>

      <div className="content-shell pt-6 pb-24 md:pb-8 space-y-6">
        {/* Avatar */}
        <div className="flex flex-col items-center gap-3">
          <div className="relative">
            <div className="w-20 h-20 rounded-2xl bg-green-100 flex items-center justify-center text-green-700 font-extrabold text-2xl">
              {initials}
            </div>
            <button className="absolute -bottom-1 -right-1 w-7 h-7 bg-green-700 rounded-full flex items-center justify-center">
              <Camera size={13} className="text-white" />
            </button>
          </div>
          <p className="text-xs text-gray-400">Tap to change photo</p>
        </div>

        {/* Form */}
        <div className="bg-white rounded-2xl border border-gray-100 p-5 space-y-4">
          <Input
            label="Full Name"
            placeholder="e.g. Kwame Mensah"
            value={fullName}
            onChange={e => setFullName(e.target.value)}
          />
          <Input
            label="Email Address"
            type="email"
            placeholder="e.g. kwame@example.com"
            value={email}
            onChange={e => setEmail(e.target.value)}
            hint="Used for receipts and account recovery"
          />
          <Input
            label="Emergency Contact"
            type="tel"
            placeholder="+233 20 123 4567"
            value={emergencyContact}
            onChange={e => setEmergencyContact(e.target.value)}
            hint="Shared with driver during SOS alerts"
          />

          {/* Phone — read-only */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Phone Number</label>
            <div className="flex items-center border border-gray-200 rounded-xl bg-gray-50 px-4 py-3 gap-2">
              <span className="text-sm text-gray-400">{user?.phoneNumber}</span>
              <span className="ml-auto text-xs text-gray-400 bg-gray-200 px-2 py-0.5 rounded-full">Verified</span>
            </div>
            <p className="text-xs text-gray-400 mt-1">Phone number cannot be changed</p>
          </div>
        </div>

        <Button fullWidth size="lg" onClick={handleSave} loading={saving}>
          Save Changes
        </Button>
      </div>
    </div>
  )
}
