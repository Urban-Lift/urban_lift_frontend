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

The app talks to the live **UrbanLift API** (`https://urban-lift-api.onrender.com`).
Sign-in uses a **real SMS OTP** sent to a Ghana number in local format
(e.g. `0241234567`). A few features without API endpoints yet (wallet, community,
driver stats, saved routes, notifications) still use local fixtures — flagged in
`src/config.ts`. Run `npm run typecheck` to type-check.

## Docs

- **[WIRING.md](WIRING.md)** — how everything is wired up (start here if you're
  new to Expo: routing, state, services, the design system, an end-to-end flow).
- **[CLAUDE.md](CLAUDE.md)** — the build plan, phase checklist and all 33 screens.

## Layout in one line

`app/` = screens/routes (expo-router, file-based) · `src/` = everything else
(theme, types, components, stores, services, mocks, hooks).
