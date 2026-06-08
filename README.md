# UrbanLift

Community carpooling for Ghana — a **React Native + Expo** app running on
**iOS, Android and Web** from one codebase.

## Quick start

```bash
npm install
npm run start      # Expo dev server (press i / a / w, or scan the QR in Expo Go)
# or target one platform:
npm run web
npm run ios
npm run android
```

The app uses **mock data** only (no backend yet) — any 6-digit code works on the
OTP screens. Run `npm run typecheck` to type-check.

## Docs

- **[WIRING.md](WIRING.md)** — how everything is wired up (start here if you're
  new to Expo: routing, state, services, the design system, an end-to-end flow).
- **[CLAUDE.md](CLAUDE.md)** — the build plan, phase checklist and all 33 screens.

## Layout in one line

`app/` = screens/routes (expo-router, file-based) · `src/` = everything else
(theme, types, components, stores, services, mocks, hooks).
