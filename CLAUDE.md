# UrbanLift — Frontend Build Plan

> Community carpooling platform for Ghana.
> **One frontend: a React Native + Expo app at the repo root**, running on iOS,
> Android and Web from a single codebase.
> This file is the single source of truth. Update status as work progresses.

> **⚠️ Migrated to Expo (2026-06-08).** The original separate React web app
> (`web/`) and Flutter mobile app (`mobile/`) were removed and rebuilt as one
> Expo app. They remain recoverable in git history. The folder/route maps below
> describe the *old* split build and are kept for historical reference — the
> **current** architecture is documented in [`WIRING.md`](WIRING.md). Routes now
> live in `app/` (expo-router, file-based) and shared code in `src/`.

---

## Project Structure

```
urbanLift/
├── CLAUDE.md                  ← this file
├── .claude/
│   └── settings.json
├── web/                       ← React + Vite + TypeScript
│   ├── public/
│   ├── src/
│   │   ├── assets/            ← images, icons, fonts
│   │   ├── components/        ← shared/reusable UI components
│   │   │   ├── ui/            ← primitives (Button, Input, Card, Badge…)
│   │   │   ├── layout/        ← Navbar, BottomNav, Sidebar, PageWrapper
│   │   │   └── maps/          ← MapView, DriverMarker, RoutePolyline
│   │   ├── features/          ← one folder per domain
│   │   │   ├── auth/
│   │   │   ├── passenger/
│   │   │   ├── driver/
│   │   │   ├── wallet/
│   │   │   └── community/
│   │   ├── hooks/             ← custom React hooks
│   │   ├── store/             ← Zustand stores
│   │   ├── services/          ← API calls (axios)
│   │   ├── types/             ← TypeScript interfaces & enums
│   │   ├── utils/             ← helpers (currency, date, etc.)
│   │   ├── routes/            ← React Router config
│   │   ├── App.tsx
│   │   └── main.tsx
│   ├── index.html
│   ├── tailwind.config.ts
│   ├── vite.config.ts
│   └── package.json
│
└── mobile/                    ← Flutter app
    ├── lib/
    │   ├── main.dart
    │   ├── core/
    │   │   ├── theme/          ← colors, typography, spacing
    │   │   ├── router/         ← go_router config
    │   │   ├── services/       ← API, storage, location
    │   │   └── utils/          ← helpers
    │   ├── features/
    │   │   ├── auth/
    │   │   │   ├── data/       ← models, repositories
    │   │   │   ├── domain/     ← use cases
    │   │   │   └── presentation/ ← screens, widgets, providers
    │   │   ├── passenger/
    │   │   ├── driver/
    │   │   ├── wallet/
    │   │   └── community/
    │   └── shared/
    │       ├── widgets/        ← reusable widgets
    │       └── constants/
    ├── pubspec.yaml
    └── test/
```

---

## Tech Stack

### React Web (`web/`)
| Concern | Choice | Reason |
|---|---|---|
| Bundler | Vite | Fast HMR, modern ESM |
| Language | TypeScript | Type safety |
| Styling | Tailwind CSS v3 | Matches design system quickly |
| Routing | React Router v6 | Industry standard |
| State | Zustand | Simple, no boilerplate |
| Server state | TanStack Query (React Query) | Caching, loading/error states |
| HTTP | Axios | Interceptors for auth tokens |
| Maps | Leaflet + react-leaflet | Free, no API key required |
| Forms | React Hook Form + Zod | Validation + TS inference |
| Icons | Lucide React | Clean, consistent |
| Notifications | react-hot-toast | Simple toasts |
| Date/time | date-fns | Lightweight |

### Flutter Mobile (`mobile/`)
| Concern | Choice | Reason |
|---|---|---|
| State | Riverpod 2.x | Compile-safe, testable |
| Navigation | go_router | Declarative, deep-link ready |
| HTTP | Dio | Interceptors, cancel tokens |
| Maps | flutter_map + latlong2 | Free maps (OpenStreetMap) |
| Local storage | shared_preferences | Simple key-value |
| Secure storage | flutter_secure_storage | Tokens |
| Forms | reactive_forms | Typed form validation |
| Icons | Material + custom SVG | Matches design |
| Animations | flutter_animate | Easy micro-animations |

---

## Design System / Brand Tokens

```
Primary Green:   #1A7A3C
Light Green:     #D1FAE5
Background:      #F9FAFB
Dark Text:       #111827
Gray:            #6B7280
Border:          #D1D5DB
Warning/Gold:    #D97706
Error:           #DC2626
Currency:        GHS (Ghana Cedis)
Phone prefix:    +233
```

---

## Build Phases & Steps

Every step below must be marked [x] when complete.

---

### PHASE 0 — Scaffold & Config
- [x] **0.1** Create `web/` using `npm create vite@latest web -- --template react-ts`
- [x] **0.2** Install web dependencies (Tailwind, Router, Zustand, React Query, Axios, Leaflet, RHF, Zod, Lucide, date-fns, react-hot-toast)
- [x] **0.3** Configure Tailwind with UrbanLift brand tokens (`tailwind.config.js`)
- [x] **0.4** Configure path aliases (`@/` → `src/`) in `vite.config.ts` & `tsconfig.app.json`
- [x] **0.5** Create `mobile/` using `flutter create mobile --org com.urbanlift`
- [x] **0.6** Add Flutter dependencies to `pubspec.yaml` (Riverpod, go_router, Dio, flutter_map, etc.)
- [x] **0.7** Set up Flutter folder structure (`features/`, `core/`, `shared/`)
- [x] **0.8** Create shared `types/` and `constants/` for both platforms
- [x] **0.9** Initialize git repo, add `.gitignore` for both

---

### PHASE 1 — Design System / UI Primitives

#### Web (React)
- [x] **1.1** `Button` component (variants: primary, secondary, outline, ghost; sizes: sm, md, lg)
- [x] **1.2** `Input` component (with label, error state, left/right icon slots)
- [x] **1.3** `Card` component
- [x] **1.4** `Badge` component (status: confirmed, pending, cancelled, etc.)
- [x] **1.5** `Avatar` component (with fallback initials)
- [x] **1.6** `StarRating` component
- [x] **1.7** `BottomNav` (mobile-style bottom bar for web)
- [x] **1.8** `Topbar` / `PageHeader`
- [x] **1.9** `OTPInput` (6-box OTP field)
- [x] **1.10** `LoadingSpinner` / `Skeleton` loaders
- [x] **1.11** `Modal` / `BottomSheet` component
- [x] **1.12** `RideCard` — reusable ride listing card (driver, route, price, seats)
- [x] **1.13** `DriverCard` — driver info card (photo, rating, vehicle, badge)
- [x] **1.14** `MapView` wrapper (Leaflet)

#### Flutter (Mobile)
- [x] **1.15** App theme (`ThemeData`, colors, typography, spacing constants)
- [x] **1.16** `ULButton` widget (primary/secondary/outline)
- [x] **1.17** `ULTextField` widget (with label, suffix icon, error text)
- [x] **1.18** `ULCard` widget
- [x] **1.19** `ULAvatar` widget
- [x] **1.20** `StarRating` widget
- [x] **1.21** `OTPField` widget (6 individual digit boxes)
- [x] **1.22** `BottomNavBar` widget (Home, Rides, Messages, Profile)
- [x] **1.23** `RideListTile` widget
- [x] **1.24** `LoadingOverlay` / `Shimmer` skeleton widget

---

### PHASE 2 — Auth Feature

#### Screens (same flow on both platforms)
- [x] **2.1** Startup / Splash screen — Web ✓ Flutter ✓
- [x] **2.2** Role Selection + Phone Number entry — Web ✓ Flutter ✓
- [x] **2.3** Phone OTP Verification screen — Web ✓ Flutter ✓
- [x] **2.4** Email Verification screen — Web ✓ Flutter ✓
- [x] **2.5** Passenger Account Setup screen — Web ✓ Flutter ✓
- [x] **2.6** Driver Account Setup — Step 1: Personal Info — Web ✓ Flutter ✓
- [x] **2.7** Driver Account Setup — Step 2: Vehicle Details — Web ✓ Flutter ✓

#### Logic
- [x] **2.8** `authStore` (Zustand) / `AuthNotifier` (Riverpod StateNotifier) — user, token, role ✓
- [x] **2.9** `AuthService` / `MockAuthRepository` — phone login, OTP verify, email verify, profile create ✓
- [x] **2.10** Protected route guard — Web PrivateRoute ✓ / Flutter splash redirect ✓
- [x] **2.11** Persist auth token — Zustand localStorage (web) / shared_preferences (Flutter) ✓

---

### PHASE 3 — Passenger Feature

#### Screens
- [x] **3.1** Passenger Home — "Find a Ride" form (pickup, destination, date/time, seats, trip type) — Web ✓ Flutter ✓
- [x] **3.2** Available Rides list (filter by route, time, price, seats) — Web ✓ Flutter ✓
- [x] **3.3** Ride Details page (driver info, route, amenities, seat selector, price, Book button) — Web ✓ Flutter ✓
- [x] **3.4** Booking Confirmation Success screen (driver, time, price, pickup, dropoff) — Web ✓ Flutter ✓
- [x] **3.5** My Rides — Upcoming tab (confirmed, pending bookings) — Web ✓ Flutter ✓
- [x] **3.6** My Rides — Past tab (completed/cancelled rides) — Web ✓ Flutter ✓
- [x] **3.7** Live Trip Tracking — "Driver on the way" view (map + ETA + driver card + SOS + Share Trip) — Web ✓ Flutter ✓
- [x] **3.8** Live Trip Tracking — "In Trip / Heading to destination" view (map + progress + cancel) — Web ✓ Flutter ✓
- [x] **3.9** Post-Trip Rating & Review screen (stars, quick tags, note, submit/skip) — Web ✓ Flutter ✓

#### Logic
- [x] **3.10** `rideStore` / `RideNotifier` — search params, available rides, selected ride — Web ✓ Flutter ✓
- [x] **3.11** `bookingStore` / `BookingNotifier` — booking state, status updates — Web ✓ Flutter ✓
- [x] **3.12** `RideService` — search rides, get ride detail, book seat, cancel booking — Web ✓ Flutter ✓
- [x] **3.13** `ReviewService` — submit review — Web ✓ Flutter ✓
- [x] **3.14** Real-time location polling (mock interval for now, WebSocket-ready) — Web ✓ Flutter ✓

---

### PHASE 4 — Driver Feature

#### Screens
- [x] **4.1** Driver Dashboard (earnings, online toggle, incoming request card, today's stats) — Web ✓ Flutter ✓
- [x] **4.2** Matching Passengers list (requests on route, filter by distance/earnings, accept/ignore) — Web ✓ Flutter ✓
- [x] **4.3** Navigating to Pickup view (map + ETA + passenger card + Emergency + Cancel) — Web ✓ Flutter ✓
- [x] **4.4** In-Trip Navigation view (passenger card + call + SOS + Complete Trip) — Web ✓ Flutter ✓

#### Logic
- [x] **4.5** `driverStore` / `DriverNotifier` — online status, earnings, stats — Web ✓ Flutter ✓
- [x] **4.6** `DriverService` — toggle status, get incoming requests, accept/decline ride — Web ✓ Flutter ✓
- [x] **4.7** Trip state machine (pending → navigating_to_pickup → in_trip → completed) — Web ✓ Flutter ✓

---

### PHASE 5 — Wallet & Payments

#### Screens
- [x] **5.1** My Wallet screen (balance, +% badge, Top Up button, linked accounts, recent activity) — Web ✓ Flutter ✓
- [x] **5.2** Top Up — Amount Selection (preset tiles: GHS 10/20/50/100, custom amount) — Web ✓ Flutter ✓
- [x] **5.3** Top Up — Provider Selection (MTN MoMo, Vodafone Cash, AT Money, Card coming soon) — Web ✓ Flutter ✓
- [x] **5.4** Top Up — Success screen (amount, new balance, reference ID, date) — Web ✓ Flutter ✓

#### Logic
- [x] **5.5** `walletStore` / `WalletNotifier` — balance, transactions — Web ✓ Flutter ✓
- [x] **5.6** `WalletService` — get balance, top up, get transaction history, link payment method — Web ✓ Flutter ✓

---

### PHASE 6 — Profile & Settings

#### Screens
- [x] **6.1** Profile & Settings screen (avatar, name, rating, balance, Edit Profile, Saved Routes, Notifications, Help, Refer a Friend, Logout) — Web ✓ Flutter ✓
- [x] **6.2** Edit Profile screen (update photo, name, email, emergency contact) — Web ✓ Flutter ✓
- [x] **6.3** Saved Routes screen (list of saved pickup→dropoff pairs, add/delete) — Web ✓ Flutter ✓
- [x] **6.4** Notifications Settings screen (toggle categories) — Web ✓ Flutter ✓
- [x] **6.5** Refer a Friend screen (referral code, share link, earned credit) — Web ✓ Flutter ✓

#### Logic
- [x] **6.6** `profileStore` / `ProfileNotifier` — user profile state — Web ✓ Flutter ✓
- [x] **6.7** `ProfileService` — update profile, saved routes CRUD — Web ✓ Flutter ✓

---

### PHASE 7 — Community Groups

#### Screens
- [x] **7.1** Community Groups Discovery (search bar, My Groups tab, Discover/Trending tab, join button) — Web ✓ Flutter ✓
- [x] **7.2** Create Community Group (cover image, name, primary route, privacy toggle, description) — Web ✓ Flutter ✓
- [x] **7.3** Community Group Chat (message list, text input, inline ride card sharing, member count) — Web ✓ Flutter ✓

#### Logic
- [x] **7.4** `communityStore` / `CommunityNotifier` — groups, membership, messages — Web ✓ Flutter ✓
- [x] **7.5** `CommunityService` — list groups, join, create, get messages, send message — Web ✓ Flutter ✓
- [x] **7.6** Real-time chat (mock polling for now, WebSocket-ready) — Web ✓ Flutter ✓

---

### PHASE 8 — Maps & Navigation

- [ ] **8.1** Integrate Leaflet (web) / flutter_map (mobile) with OpenStreetMap tiles
- [ ] **8.2** Driver location marker with pulsing animation
- [ ] **8.3** Route polyline (pickup → dropoff path)
- [ ] **8.4** ETA calculation (mock / Nominatim reverse geocode)
- [ ] **8.5** "Share Trip" — generate shareable link with current position

---

### PHASE 9 — Polish & Cross-Cutting Concerns

- [ ] **9.1** Error boundary / global error handling
- [ ] **9.2** Toast notifications (ride accepted, booking confirmed, payment success, etc.)
- [ ] **9.3** Empty states (no rides found, no messages, no history)
- [ ] **9.4** Offline / no-connection banner
- [ ] **9.5** Responsive layout (web: desktop sidebar + mobile bottom nav)
- [ ] **9.6** Dark mode toggle (optional, low priority)
- [ ] **9.7** Accessibility audit (ARIA labels, contrast ratios)
- [ ] **9.8** Loading skeletons on all list screens
- [ ] **9.9** Form validation error messages

---

### PHASE 10 — Mock API / Data Layer

- [ ] **10.1** Create `src/mocks/` with JSON fixtures for all entities (users, rides, bookings, trips, groups, wallet)
- [ ] **10.2** Mock service layer that returns fixture data with realistic delays
- [ ] **10.3** Feature flag `USE_MOCK_API=true` in `.env` so real API can be swapped in later
- [ ] **10.4** Seed realistic Accra-based data (locations: East Legon, Osu, Legon Campus, Airport City, etc.)

---

## Screens Checklist (Master)

| # | Screen | Web | Mobile |
|---|--------|-----|--------|
| 1 | Startup / Splash | [x] | [x] |
| 2 | Role Selection + Phone | [x] | [x] |
| 3 | Phone OTP Verification | [x] | [x] |
| 4 | Email Verification | [x] | [x] |
| 5 | Passenger Account Setup | [x] | [x] |
| 6 | Driver Account Setup (Personal) | [x] | [x] |
| 7 | Driver Account Setup (Vehicle) | [x] | [x] |
| 8 | Passenger Home / Find a Ride | [x] | [x] |
| 9 | Available Rides List | [x] | [x] |
| 10 | Lifts Available (route view) | [x] | [x] |
| 11 | Ride Details + Booking | [x] | [x] |
| 12 | Booking Confirmation Success | [x] | [x] |
| 13 | My Rides — Upcoming | [x] | [x] |
| 14 | My Rides — Past | [x] | [x] |
| 15 | Live Tracking — Driver on the way | [x] | [x] |
| 16 | Live Tracking — In Trip (Passenger) | [x] | [x] |
| 17 | Driver Navigating to Pickup | [x] | [x] |
| 18 | Driver In Trip Navigation | [x] | [x] |
| 19 | Driver Dashboard | [x] | [x] |
| 20 | Matching Passengers (Driver) | [x] | [x] |
| 21 | Post-Trip Rating & Review | [x] | [x] |
| 22 | My Wallet | [x] | [x] |
| 23 | Top Up — Amount | [x] | [x] |
| 24 | Top Up — Provider | [x] | [x] |
| 25 | Top Up — Success | [x] | [x] |
| 26 | Profile & Settings | [x] | [x] |
| 27 | Edit Profile | [x] | [x] |
| 28 | Saved Routes | [x] | [x] |
| 29 | Notification Settings | [x] | [x] |
| 30 | Refer a Friend | [x] | [x] |
| 31 | Community Groups Discovery | [x] | [x] |
| 32 | Create Community Group | [x] | [x] |
| 33 | Community Group Chat | [x] | [x] |

---

## Route Map (Web)

```
/                          → Startup
/auth/login                → Role + Phone
/auth/otp/phone            → Phone OTP
/auth/otp/email            → Email OTP
/auth/setup/passenger      → Passenger profile setup
/auth/setup/driver         → Driver profile setup (personal)
/auth/setup/driver/vehicle → Driver vehicle details

/passenger/home            → Find a Ride
/passenger/rides           → Available Rides
/passenger/rides/:id       → Ride Details
/passenger/booking/:id     → Booking Confirmation
/passenger/my-rides        → My Rides
/passenger/tracking/:id    → Live Tracking
/passenger/rate/:tripId    → Post-Trip Rating

/driver/dashboard          → Driver Dashboard
/driver/passengers         → Matching Passengers
/driver/navigate/:rideId   → Navigating to Pickup
/driver/trip/:tripId       → In-Trip Navigation

/wallet                    → My Wallet
/wallet/topup              → Top Up Amount
/wallet/topup/provider     → Top Up Provider
/wallet/topup/success      → Top Up Success

/profile                   → Profile & Settings
/profile/edit              → Edit Profile
/profile/saved-routes      → Saved Routes
/profile/notifications     → Notification Settings
/profile/refer             → Refer a Friend

/community                 → Community Groups
/community/create          → Create Group
/community/:groupId/chat   → Group Chat
```

## Route Map (Flutter / go_router)

```
/splash
/auth/login
/auth/otp-phone
/auth/otp-email
/auth/setup-passenger
/auth/setup-driver
/auth/setup-driver/vehicle

/home                      → passenger home
/rides                     → available rides
/rides/:id                 → ride details
/booking/:id               → booking confirmed
/my-rides                  → my rides
/tracking/:id              → live tracking
/rate/:tripId              → post-trip rating

/driver/home               → driver dashboard
/driver/passengers         → matching passengers
/driver/navigate/:rideId
/driver/trip/:tripId

/wallet
/wallet/topup
/wallet/topup/provider
/wallet/topup/success

/profile
/profile/edit
/profile/routes
/profile/notifications
/profile/refer

/community
/community/create
/community/:id/chat
```

---

## Working Rules

1. **Always update this file** — mark steps `[x]` as they are completed.
2. **Mock first, real API later** — all screens use mock data until a backend exists.
3. **Mobile-first on web** — design at 390px width first, then scale up.
4. **Shared design tokens** — both apps must use the exact same brand colors and spacing scale.
5. **One feature at a time** — complete Web + Mobile together per feature before moving on.
6. **No dead screens** — every screen must be reachable via navigation, even with mock data.
7. **TypeScript strict mode** on web — no `any` unless explicitly justified.
8. **Flutter analysis_options** — use `flutter_lints` package, fix all warnings.

---

## Current Status

**Platform:** React Native + Expo (SDK 56) — single codebase for iOS / Android / Web
**Phase:** 0–7 rebuilt in Expo ✓ — all 33 screens, typechecks clean, web bundle builds
**Last updated:** 2026-06-08
**Architecture doc:** [`WIRING.md`](WIRING.md) (how everything is wired up)
**Stack:** expo-router (routing) · Zustand (client state, auth persisted) ·
React Query (server state) · axios (mock services) · react-native-svg +
reanimated (MapView) · lucide-react-native (icons)
**Next step:** Phase 8 — real maps (react-native-maps / Leaflet), or Phase 9 — polish.

### Running it
`npm install` then `npm run web` / `npm run ios` / `npm run android` / `npm run start`
(Expo Go + QR). Mock data only — any 6-digit OTP works. `npm run typecheck` to verify.
