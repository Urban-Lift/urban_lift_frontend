/**
 * Real auth flow against the UrbanLift API.
 *
 * Flow: signup → verify/phone_number (sends SMS OTP) → verify/otp (returns JWT)
 *       → [authenticated] → verify/email → verify/email/otp → profile/create.
 *
 * Phone numbers must be LOCAL Ghana format, e.g. 0241234567.
 */
import type { Role } from '@/types';
import { http, filePart } from './api';

/** Decode a JWT payload (base64url) without verifying — just to read claims. */
function decodeJwtPayload(token: string): any {
  try {
    const part = token.split('.')[1];
    if (!part) return {};
    const b64 = part.replace(/-/g, '+').replace(/_/g, '/');
    const bin = typeof atob === 'function' ? atob(b64) : '';
    const json = decodeURIComponent(
      bin
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join(''),
    );
    return JSON.parse(json);
  } catch {
    return {};
  }
}

/** The verify/otp response shape isn't documented; pull the token defensively. */
function extractToken(res: any): string {
  return (
    res?.access_token ??
    res?.token ??
    res?.jwt ??
    res?.accessToken ??
    res?.data?.access_token ??
    res?.data?.token ??
    ''
  );
}

export const authService = {
  /**
   * Send the phone OTP. Tries verify first (returning users) and only registers
   * if the number isn't known yet — avoids a noisy 409 on every repeat login.
   * NOTE: the SMS is delivered by Supabase Auth on the backend; "sent" here only
   * means Supabase accepted the request.
   */
  async requestPhoneOtp(phone: string, role: Role): Promise<void> {
    try {
      await http.postForm('/users/verify/phone_number', { phone_number: phone });
      return;
    } catch {
      // Most likely "User not found" → register, then send the OTP.
    }
    await http.postForm('/users/signup', { phone_number: phone, role });
    await http.postForm('/users/verify/phone_number', { phone_number: phone });
  },

  async resendPhoneOtp(phone: string): Promise<void> {
    await http.postForm('/users/verify/phone_number', { phone_number: phone });
  },

  /** Verify the phone OTP and return the bearer token. */
  async verifyPhoneOtp(phone: string, otp: string): Promise<string> {
    const res = await http.postForm('/users/verify/otp', { phone_number: phone, otp });
    const token = extractToken(res);
    if (!token) throw new Error('No token returned from verify/otp');
    return token;
  },

  /** Read the role from the session JWT (set in user_metadata at verify time). */
  roleFromToken(token: string): Role | undefined {
    const p = decodeJwtPayload(token);
    const role = p?.user_metadata?.role ?? p?.app_metadata?.role ?? p?.role;
    return role === 'driver' || role === 'passenger' || role === 'admin' ? role : undefined;
  },

  /** Fetch the current user's profile, or null if they haven't created one yet. */
  async getProfile(): Promise<any | null> {
    try {
      const res = await http.get('/users/profile/create');
      const data = res?.profile;
      const row = Array.isArray(data) ? data[0] : data;
      return row ?? null;
    } catch {
      // 404 → no profile yet (or role can't access this endpoint).
      return null;
    }
  },

  /** Send an email OTP (requires the phone token in the header). */
  async requestEmailOtp(email: string): Promise<void> {
    await http.postForm('/users/verify/email', { email });
  },

  async verifyEmailOtp(email: string, otp: string): Promise<void> {
    await http.postForm('/users/verify/email/otp', { email, otp });
  },

  /** Create the user profile (multipart — profile photo is required by the API). */
  async createProfile(input: { fullName: string; emergencyNumber: string; email?: string; photoUri: string }): Promise<void> {
    const form = new FormData();
    form.append('full_name', input.fullName);
    form.append('emergency_number', input.emergencyNumber);
    if (input.email) form.append('email', input.email);
    form.append('profile_pic', filePart(input.photoUri, 'profile.jpg'));
    await http.postMultipart('/users/profile/create', form);
  },

  async editProfile(input: { fullName?: string; emergencyNumber?: string; email?: string; photoUri?: string }): Promise<void> {
    const form = new FormData();
    if (input.fullName) form.append('full_name', input.fullName);
    if (input.emergencyNumber) form.append('emergency_number', input.emergencyNumber);
    if (input.email) form.append('email', input.email);
    if (input.photoUri) form.append('profile_pic', filePart(input.photoUri, 'profile.jpg'));
    await http.patchMultipart('/users/profile/edit', form);
  },

  /** Register a driver's car (multipart with several documents). */
  async registerDriver(input: {
    fullName: string;
    phone: string;
    email: string;
    ghanaCard: string;
    licensePlate: string;
    carModel: string;
    carColor: string;
    carYear: number;
    cardImageUri: string;
    licenseUri: string;
    insuranceUri: string;
    carPicUri: string;
  }): Promise<void> {
    const form = new FormData();
    form.append('full_name', input.fullName);
    form.append('phone_number', input.phone);
    form.append('email', input.email);
    form.append('ghana_card', input.ghanaCard);
    form.append('license_plate_num', input.licensePlate);
    form.append('car_model', input.carModel);
    form.append('car_color', input.carColor);
    form.append('car_year', String(input.carYear));
    form.append('card_image', filePart(input.cardImageUri, 'card.jpg'));
    form.append('driver_license', filePart(input.licenseUri, 'license.jpg'));
    form.append('vehicle_insurance', filePart(input.insuranceUri, 'insurance.jpg'));
    form.append('car_pic', filePart(input.carPicUri, 'car.jpg'));
    await http.postMultipart('/drivers/registration/create', form);
  },
};
