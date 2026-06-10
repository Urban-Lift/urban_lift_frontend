# UrbanLift — How Everything Is Wired Up

> A guided tour of the **React Native + Expo** app for someone new to Expo.
> Read this top to bottom once and you'll understand where every piece lives
> and how a tap on the screen flows all the way to (mock) data and back.

---

## 1. The big picture

UrbanLift is now **one Expo app** that runs on **iOS, Android and Web** from a
single codebase. The old separate React web app and Flutter mobile app were
removed (they're still recoverable in git history) and replaced by this.

```
Tap on screen
   ↓
Screen component (app/…)            ← what the user sees (a route file)
   ↓ calls
Zustand store  and/or  React Query  ← state: client state vs. server state
   ↓ which calls
Service (src/services/…)            ← talks to the live UrbanLift API.
   ↓ reads
Mock fixtures (src/mocks/data.ts)   ← seed data (Accra locations, drivers…)
```

The app talks to a **real backend** for auth, rides and bookings (see §6).
A few features the API doesn't cover yet (wallet, community, driver stats, saved
routes, notifications) still use local fixtures, flagged in `src/config.ts`.
Screens never touch the network directly — only services do.

---

## 2. Folder map

```
urbanLift/
├── app/                     ← ROUTES. Every file here is a screen/URL (expo-router)
│   ├── _layout.tsx          ← root: providers + top-level Stack
│   ├── index.tsx            ← "/"  splash / startup
│   ├── (auth)/              ← login + OTP + account setup (logged-out area)
│   └── (app)/               ← everything after login (auth-guarded)
│       ├── _layout.tsx      ← the guard: no user → redirect to login
│       ├── (tabs)/          ← passenger bottom-tab screens
│       ├── rides/ booking/ tracking/ rate/   ← passenger detail screens
│       ├── driver/          ← driver screens
│       ├── wallet/          ← top-up flow
│       ├── profile/         ← profile sub-screens
│       └── community/       ← create + chat
│
├── src/                     ← EVERYTHING THAT ISN'T A ROUTE
│   ├── theme/               ← colors, spacing, radii, fonts (design tokens)
│   ├── types/               ← all TypeScript interfaces (User, Ride, Booking…)
│   ├── components/          ← reusable UI (ui/ primitives + domain cards)
│   ├── features/            ← small feature-specific components
│   ├── store/               ← Zustand stores (client state)
│   ├── services/            ← the mock "API" layer
│   ├── mocks/               ← seed fixtures
│   ├── hooks/               ← custom hooks (e.g. live-trip polling)
│   ├── lib/                 ← queryClient + storage adapter
│   └── utils/               ← formatters (currency, dates) + route helpers
│
├── app.json                 ← Expo config (name, scheme, platforms, plugins)
├── babel.config.js          ← babel-preset-expo + reanimated worklets plugin
├── metro.config.js          ← bundler (default; picks up the @/ alias)
├── tsconfig.json            ← strict TS + the "@/*" → "src/*" path alias
└── package.json             ← deps + scripts (start / android / ios / web)
```

> **`app/` = pages, `src/` = everything else.** That single rule explains the
> whole layout.

---

## 3. Routing (expo-router) — the part most new to Expo

We use **expo-router**, which is **file-based routing**: the file's path *is*
the URL. No central route table — you add a screen by adding a file.

| File | URL / route |
|------|-------------|
| `app/index.tsx` | `/` |
| `app/(auth)/login.tsx` | `/login` |
| `app/(app)/(tabs)/home.tsx` | `/home` |
| `app/(app)/rides/[id].tsx` | `/rides/r1` (dynamic) |
| `app/(app)/community/[id]/chat.tsx` | `/community/g1/chat` |

Key conventions:

- **`_layout.tsx`** wraps every screen in its folder. It declares a `Stack`
  (push/pop) or `Tabs` (bottom bar) and shared options.
- **`(parentheses)` = a "group".** It organizes files **without** adding to the
  URL. `(auth)` and `(app)` group screens and give each its own layout, but
  `/login` and `/home` stay clean. `(tabs)` groups the five bottom-tab screens.
- **`[brackets]` = a dynamic segment.** `[id].tsx` reads its value with
  `useLocalSearchParams()`.

### Navigating in code
```ts
import { router } from 'expo-router';
router.push('/rides');             // go forward (can go back)
router.replace('/home');           // go forward, no back (after login)
router.back();                     // pop
router.push(`/rides/${ride.id}`);  // pass an id via the URL
router.push(`/wallet/topup-provider?amount=50`); // pass data via query params
```

### The three layout levels
1. **`app/_layout.tsx`** — wraps the *entire* app in providers (see §4) and a
   root `Stack` with `index`, `(auth)`, `(app)`.
2. **`app/(app)/_layout.tsx`** — the **auth guard**. It reads the auth store; if
   not hydrated it shows a spinner, if there's no user it `<Redirect>`s to
   `/login`. Everything under `(app)` therefore assumes a logged-in user.
3. **`app/(app)/(tabs)/_layout.tsx`** — the passenger **bottom tab bar**
   (Home · My Rides · Wallet · Community · Profile).

Drivers don't use the tab bar — after login they're sent to `/driver/dashboard`
(a plain stack screen), and reach Wallet/Profile via the header icons there.

---

## 4. App-wide providers (`app/_layout.tsx`)

Three providers wrap the whole tree, in this order:

1. **`GestureHandlerRootView`** — required by gestures + Reanimated animations.
2. **`SafeAreaProvider`** — gives screens the notch/status-bar insets. Our
   `<Screen>` component uses it so content never sits under the notch.
3. **`QueryClientProvider`** — makes React Query available everywhere. The
   client is configured once in `src/lib/queryClient.ts`.

---

## 5. State management — two kinds, on purpose

We deliberately split state into two tools. This is the modern RN/React pattern.

### a) Server state → **React Query** (`@tanstack/react-query`)
Anything that "comes from the API" (rides, bookings, wallet, groups, messages).
React Query handles caching, loading and error flags, and refetching.

```ts
const { data, isLoading } = useQuery({
  queryKey: ['rides', searchParams],          // cache key
  queryFn: () => rideService.search(searchParams),
});
```
The `queryKey` is the cache identity. Mutations update the cache with
`queryClient.setQueryData(...)` (see the community "join" button) or
`invalidateQueries(...)` to force a refetch.

### b) Client/UI state → **Zustand** (`src/store/`)
Things the UI owns that aren't from a server: the current search, the selected
ride, the driver's online toggle, the active trip, and **auth**.

```ts
const user   = useAuthStore((s) => s.user);    // read one slice (re-renders on change)
const logout = useAuthStore((s) => s.logout);  // read an action
```

The stores:

| Store | Holds | Notable |
|-------|-------|---------|
| `authStore` | `user`, `token`, onboarding `draft` | **persisted** to device storage |
| `rideStore` | current `searchParams`, `selectedRide` | passes data Home → List → Detail |
| `bookingStore` | `lastBooking`, live `activeTrip` | tracking screen reads `activeTrip` |
| `driverStore` | `online`, `activeRequest`, `tripStatus` | the driver trip state machine |

> **Why is auth special?** `authStore` uses Zustand's `persist` middleware with
> an AsyncStorage adapter (`src/lib/storage.ts`). Your login survives app
> reloads. On startup the store rehydrates and flips a `hydrated` flag — the
> splash and the `(app)` guard wait for that flag before deciding where to go.

---

## 6. The services layer (now a REAL backend)

`src/services/` is the **only** place that talks to the network. Each service
returns the exact shapes in `src/types/`, so screens don't care where data comes
from.

The app talks to the live **UrbanLift API** (`https://urban-lift-api.onrender.com`,
set in `src/config.ts`). Key things `api.ts` hides from the rest of the app:

- **Form-encoded bodies** — most POST/PATCH endpoints are
  `application/x-www-form-urlencoded`, *not* JSON. `http.postForm()` handles this.
- **Multipart uploads** — profile photo and driver documents go through
  `http.postMultipart()` with `filePart(uri)`.
- **Bearer auth** — the JWT from `/users/verify/otp` is stored in `authStore`
  and injected by an axios interceptor.
- **Local phone format** — `toLocalPhone()` converts to `0XXXXXXXXX` (what the
  API expects).
- **`apiError()`** — turns FastAPI `detail` errors into readable messages.

Because the API's response schemas aren't in its OpenAPI spec, raw responses are
normalised in **one place** — `src/services/mappers.ts` (`mapRide`, `mapBooking`,
`mapTrip`). They read several likely field names and fall back to defaults; if a
real response uses different keys, fix it there and every screen benefits.

**Live endpoints used:** auth (signup → phone OTP → email OTP → profile create),
ride search/book/bookings/review/track/SOS, **wallet** (balance, top up, payment
methods), **saved routes**, **community** (groups, join, create, chat),
**driver earnings**, **admin** (registrations, users), driver registration, and
the public `geocode` / `reverse_geocode` / `ride/distance` helpers.

**Still mock** — flagged in `src/config.ts` under `MOCK` (only three things the
API doesn't expose): **driver incoming requests** (the API is offer-based —
drivers post rides, passengers book them — so there's no request feed),
**wallet transaction history** (balance + top up are live; there's no list
endpoint), and **notification settings**.

> **Auth is real SMS OTP now** — "any 6 digits" no longer works. You verify with
> a real Ghana phone number; the API texts the code.

---

## 7. Design system (`src/theme/`)

All colors, spacing, radii and font sizes live in `src/theme/index.ts` — the
same brand tokens from the original spec (UrbanLift green `#1A7A3C`, GHS
currency, etc.). **Components import tokens; they never hardcode hex values.**
Change a token once and it updates everywhere.

UI primitives in `src/components/ui/` are built on those tokens:
`Button, Input, Card, Badge, Avatar, StarRating, OTPInput, Screen, Header,
Txt, Gradient, BottomSheet, Spinner/Skeleton, EmptyState`. Domain components sit
one level up: `RideCard, DriverCard, RouteLine, MapView`. Import them from
`@/components`.

Brand **gradients** live in `theme.gradients` and are applied through the
`<Gradient>` component (a thin wrapper over `expo-linear-gradient`) — used on the
splash/login logo, the wallet balance card, the driver earnings card and the
primary `Button`. The primary button also has a press-scale micro-animation
(Reanimated) and a colored shadow (`shadow.primary`).

### The map is real (OpenStreetMap via Leaflet)
`MapView` is a **real map**, free and key-less, and it's **platform-split** so it
works everywhere:

- **`src/components/map/MapView.tsx`** (native) — renders Leaflet inside a
  `react-native-webview`. Runs in **Expo Go**, no native build needed.
- **`src/components/map/MapView.web.tsx`** (web) — the same map via
  `react-leaflet`.

Metro automatically serves the right file per platform; screens just import one
`MapView` from `@/components`. Both share `mapShared.ts` (the prop type, the
linear-interpolation driver helper, and an Accra fallback for screens that don't
carry coordinates yet, like the driver navigation views). The driver marker moves
as the `progress` prop (0→1) changes — on native via `injectJavaScript` so the
map never reloads, on web by re-rendering the marker.

---

## 8. End-to-end example: booking a ride

Follow one real flow through every layer:

1. **`/home`** (`(tabs)/home.tsx`) — passenger fills the form, taps *Find a
   ride*. We save the form to `rideStore.setSearchParams` and `router.push('/rides')`.
2. **`/rides`** (`rides/index.tsx`) — `useQuery(['rides', params])` calls
   `rideService.search`. Results render as `<RideCard>`s (skeletons while
   loading, `<EmptyState>` if none). Tapping a card saves it to
   `rideStore.selectRide` and pushes `/rides/[id]`.
3. **`/rides/r1`** (`rides/[id].tsx`) — reads the ride, shows `MapView`,
   `DriverCard`, seat stepper, price. *Book* calls `rideService.book`, stores
   the result in `bookingStore.setLastBooking`, pushes `/booking/[id]`.
4. **`/booking/BK-…`** (`booking/[id].tsx`) — success screen from
   `bookingStore.lastBooking`. *Track your ride* → `/tracking/[id]`.
5. **`/tracking/BK-…`** (`tracking/[id].tsx`) — the `useTripTracking` hook
   (`src/hooks/`) seeds a `Trip` from the booking and polls
   `rideService.pollTrip` every 2.5s, writing each tick into `bookingStore`.
   The screen re-renders the moving marker, progress bar and ETA, advancing
   `navigating_to_pickup → in_trip → completed`, then offers *Rate your trip*.
6. **`/rate/BK-…`** (`rate/[tripId].tsx`) — stars + tags + note →
   `profileService.submitReview` → back to My Rides.

That's the whole architecture exercised in one journey.

---

## 9. Running the app

```bash
npm install            # once

npm run start          # Expo dev server — press i / a / w, or scan the QR
npm run ios            # iOS simulator (needs a Mac)
npm run android        # Android emulator/device
npm run web            # browser

npm run typecheck      # tsc --noEmit (no errors = good)
```

Install **Expo Go** on your phone, run `npm start`, scan the QR code, and the
app loads live with hot reload. For web it opens in the browser. Sign-in uses a
**real SMS OTP** to a Ghana number (local format, e.g. `0241234567`); rides and
bookings come from the live API.

---

## 10. Where to plug in real things later

| Want to… | Touch only… |
|----------|-------------|
| Point at a different backend | `src/config.ts` (`API_BASE_URL`) |
| Fix a wrong API field mapping | `src/services/mappers.ts` |
| Turn a mock feature real once its endpoint ships | flip its flag in `src/config.ts` `MOCK` + implement in its service |
| Add a screen | a new file in `app/…` |
| Change brand look | `src/theme/index.ts` |
| Tune the map (upgrade to react-native-maps, add a tile key, etc.) | `src/components/map/*` |
| Real-time chat / tracking | swap the polling in `communityService` / `useTripTracking` for WebSockets |
| Add a new data shape | `src/types/` then the service + mock |

---

*Generated as part of the Flutter/React → Expo migration. The build phases and
screen checklist live in `CLAUDE.md`.*
