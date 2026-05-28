# UrbanLift — Frontend Build Plan

> Community carpooling platform for Ghana.
> Two frontends: **React web app** (`web/`) and **Flutter mobile app** (`mobile/`).
> This file is the single source of truth. Update status as work progresses.

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
- [ ] **0.1** Create `web/` using `npm create vite@latest web -- --template react-ts`
- [ ] **0.2** Install web dependencies (Tailwind, Router, Zustand, React Query, Axios, Leaflet, RHF, Zod, Lucide, date-fns, react-hot-toast)
- [ ] **0.3** Configure Tailwind with UrbanLift brand tokens (`tailwind.config.ts`)
- [ ] **0.4** Configure path aliases (`@/` → `src/`) in `vite.config.ts` & `tsconfig.json`
- [ ] **0.5** Create `mobile/` using `flutter create mobile --org com.urbanlift`
- [ ] **0.6** Add Flutter dependencies to `pubspec.yaml` (Riverpod, go_router, Dio, flutter_map, etc.)
- [ ] **0.7** Set up Flutter folder structure (`features/`, `core/`, `shared/`)
- [ ] **0.8** Create shared `types/` and `constants/` for both platforms
- [ ] **0.9** Initialize git repo, add `.gitignore` for both

---

### PHASE 1 — Design System / UI Primitives

#### Web (React)
- [ ] **1.1** `Button` component (variants: primary, secondary, outline, ghost; sizes: sm, md, lg)
- [ ] **1.2** `Input` component (with label, error state, left/right icon slots)
- [ ] **1.3** `Card` component
- [ ] **1.4** `Badge` component (status: confirmed, pending, cancelled, etc.)
- [ ] **1.5** `Avatar` component (with fallback initials)
- [ ] **1.6** `StarRating` component
- [ ] **1.7** `BottomNav` (mobile-style bottom bar for web)
- [ ] **1.8** `Topbar` / `PageHeader`
- [ ] **1.9** `OTPInput` (6-box OTP field)
- [ ] **1.10** `LoadingSpinner` / `Skeleton` loaders
- [ ] **1.11** `Modal` / `BottomSheet` component
- [ ] **1.12** `RideCard` — reusable ride listing card (driver, route, price, seats)
- [ ] **1.13** `DriverCard` — driver info card (photo, rating, vehicle, badge)
- [ ] **1.14** `MapView` wrapper (Leaflet)

#### Flutter (Mobile)
- [ ] **1.15** App theme (`ThemeData`, colors, typography, spacing constants)
- [ ] **1.16** `ULButton` widget (primary/secondary/outline)
- [ ] **1.17** `ULTextField` widget (with label, suffix icon, error text)
- [ ] **1.18** `ULCard` widget
- [ ] **1.19** `ULAvatar` widget
- [ ] **1.20** `StarRating` widget
- [ ] **1.21** `OTPField` widget (6 individual digit boxes)
- [ ] **1.22** `BottomNavBar` widget (Home, Rides, Messages, Profile)
- [ ] **1.23** `RideListTile` widget
- [ ] **1.24** `LoadingOverlay` / `Shimmer` skeleton widget

---

### PHASE 2 — Auth Feature

#### Screens (same flow on both platforms)
- [ ] **2.1** Startup / Splash screen (logo, tagline, "Get Started", "Login")
- [ ] **2.2** Role Selection + Phone Number entry (Passenger / Driver toggle)
- [ ] **2.3** Phone OTP Verification screen (6-digit input + countdown timer + resend)
- [ ] **2.4** Email Verification screen (6-digit input + resend)
- [ ] **2.5** Passenger Account Setup screen (photo, full name, email, emergency contact)
- [ ] **2.6** Driver Account Setup — Step 1: Personal Info (same fields as passenger)
- [ ] **2.7** Driver Account Setup — Step 2: Vehicle Details (make, model, color, plate, amenities)

#### Logic
- [ ] **2.8** `authStore` (Zustand) / `AuthNotifier` (Riverpod) — user, token, role
- [ ] **2.9** `AuthService` — phone login, OTP verify, email verify, profile create
- [ ] **2.10** Protected route guard (redirect to login if not authenticated)
- [ ] **2.11** Persist auth token (localStorage web / flutter_secure_storage mobile)

---

### PHASE 3 — Passenger Feature

#### Screens
- [ ] **3.1** Passenger Home — "Find a Ride" form (pickup, destination, date/time, seats, trip type)
- [ ] **3.2** Available Rides list (filter by route, time, price, seats)
- [ ] **3.3** Ride Details page (driver info, route, amenities, seat selector, price, Book button)
- [ ] **3.4** Booking Confirmation Success screen (driver, time, price, pickup, dropoff, Add to Calendar)
- [ ] **3.5** My Rides — Upcoming tab (confirmed, pending bookings)
- [ ] **3.6** My Rides — Past tab (completed/cancelled rides)
- [ ] **3.7** Live Trip Tracking — "Driver on the way" view (map + ETA + driver card + SOS + Share Trip)
- [ ] **3.8** Live Trip Tracking — "In Trip / Heading to destination" view (map + progress + cancel)
- [ ] **3.9** Post-Trip Rating & Review screen (stars, quick tags, note, submit/skip)

#### Logic
- [ ] **3.10** `rideStore` / `RideNotifier` — search params, available rides, selected ride
- [ ] **3.11** `bookingStore` / `BookingNotifier` — booking state, status updates
- [ ] **3.12** `RideService` — search rides, get ride detail, book seat, cancel booking
- [ ] **3.13** `ReviewService` — submit review
- [ ] **3.14** Real-time location polling (mock interval for now, WebSocket-ready)

---

### PHASE 4 — Driver Feature

#### Screens
- [ ] **4.1** Driver Dashboard (earnings, online toggle, incoming request card, today's stats)
- [ ] **4.2** Matching Passengers list (requests on route, filter by distance/earnings, accept/ignore)
- [ ] **4.3** Navigating to Pickup view (map + ETA + passenger card + Emergency + Cancel)
- [ ] **4.4** In-Trip Navigation view (turn-by-turn instructions + passenger card + call/message + SOS)

#### Logic
- [ ] **4.5** `driverStore` / `DriverNotifier` — online status, earnings, stats
- [ ] **4.6** `DriverService` — toggle status, get incoming requests, accept/decline ride
- [ ] **4.7** Trip state machine (pending → navigating_to_pickup → in_trip → completed)

---

### PHASE 5 — Wallet & Payments

#### Screens
- [ ] **5.1** My Wallet screen (balance, +% badge, Top Up button, linked accounts, recent activity)
- [ ] **5.2** Top Up — Amount Selection (preset tiles: GHS 10/20/50/100, custom amount)
- [ ] **5.3** Top Up — Provider Selection (MTN MoMo, Vodafone Cash, AT Money, Card coming soon)
- [ ] **5.4** Top Up — Success screen (amount, new balance, reference ID, date)

#### Logic
- [ ] **5.5** `walletStore` / `WalletNotifier` — balance, transactions
- [ ] **5.6** `WalletService` — get balance, top up, get transaction history, link payment method

---

### PHASE 6 — Profile & Settings

#### Screens
- [ ] **6.1** Profile & Settings screen (avatar, name, rating, balance, Edit Profile, Saved Routes, Notifications, Help, Refer a Friend, Logout)
- [ ] **6.2** Edit Profile screen (update photo, name, email, emergency contact)
- [ ] **6.3** Saved Routes screen (list of saved pickup→dropoff pairs, add/delete)
- [ ] **6.4** Notifications Settings screen (toggle categories)
- [ ] **6.5** Refer a Friend screen (referral code, share link, earned credit)

#### Logic
- [ ] **6.6** `profileStore` / `ProfileNotifier` — user profile state
- [ ] **6.7** `ProfileService` — update profile, saved routes CRUD

---

### PHASE 7 — Community Groups

#### Screens
- [ ] **7.1** Community Groups Discovery (search bar, My Groups tab, Discover/Trending tab, join button)
- [ ] **7.2** Create Community Group (cover image, name, primary route, privacy toggle, description)
- [ ] **7.3** Community Group Chat (message list, text input, inline ride card sharing, member count)

#### Logic
- [ ] **7.4** `communityStore` / `CommunityNotifier` — groups, membership, messages
- [ ] **7.5** `CommunityService` — list groups, join, create, get messages, send message
- [ ] **7.6** Real-time chat (mock polling for now, WebSocket-ready)

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
| 1 | Startup / Splash | [ ] | [ ] |
| 2 | Role Selection + Phone | [ ] | [ ] |
| 3 | Phone OTP Verification | [ ] | [ ] |
| 4 | Email Verification | [ ] | [ ] |
| 5 | Passenger Account Setup | [ ] | [ ] |
| 6 | Driver Account Setup (Personal) | [ ] | [ ] |
| 7 | Driver Account Setup (Vehicle) | [ ] | [ ] |
| 8 | Passenger Home / Find a Ride | [ ] | [ ] |
| 9 | Available Rides List | [ ] | [ ] |
| 10 | Lifts Available (route view) | [ ] | [ ] |
| 11 | Ride Details + Booking | [ ] | [ ] |
| 12 | Booking Confirmation Success | [ ] | [ ] |
| 13 | My Rides — Upcoming | [ ] | [ ] |
| 14 | My Rides — Past | [ ] | [ ] |
| 15 | Live Tracking — Driver on the way | [ ] | [ ] |
| 16 | Live Tracking — In Trip (Passenger) | [ ] | [ ] |
| 17 | Driver Navigating to Pickup | [ ] | [ ] |
| 18 | Driver In Trip Navigation | [ ] | [ ] |
| 19 | Driver Dashboard | [ ] | [ ] |
| 20 | Matching Passengers (Driver) | [ ] | [ ] |
| 21 | Post-Trip Rating & Review | [ ] | [ ] |
| 22 | My Wallet | [ ] | [ ] |
| 23 | Top Up — Amount | [ ] | [ ] |
| 24 | Top Up — Provider | [ ] | [ ] |
| 25 | Top Up — Success | [ ] | [ ] |
| 26 | Profile & Settings | [ ] | [ ] |
| 27 | Edit Profile | [ ] | [ ] |
| 28 | Saved Routes | [ ] | [ ] |
| 29 | Notification Settings | [ ] | [ ] |
| 30 | Refer a Friend | [ ] | [ ] |
| 31 | Community Groups Discovery | [ ] | [ ] |
| 32 | Create Community Group | [ ] | [ ] |
| 33 | Community Group Chat | [ ] | [ ] |

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

**Phase:** 0 — Scaffold & Config  
**Last updated:** 2026-05-28  
**Next step:** 0.1 — Create web/ with Vite + React + TypeScript
