# Yurist Online — Expo mobile app

Native Android/iOS rewrite of the Yurist Online miniapp. The original Vite/React web project remains separate and unchanged. This app uses Expo SDK 58, React Native, TypeScript, Expo Router, StyleSheet, native Lucide icons, Inter/Manrope fonts, device document and camera pickers, and AsyncStorage for local demo state.

## Run with Expo Go

1. Install Node.js 22.13 or newer and install Expo Go on a physical Android/iOS device.
2. From this project directory, run `npm install` once, then `npm run start`.
3. Scan the Metro QR code using Expo Go. The computer and phone should be on the same network. If network discovery is blocked, try `npx expo start --tunnel`.
4. `npm run start:clear` clears Metro's cache if the bundler gets stale.

Expo SDK 58 is the current stable SDK for this project. Expo Go must support the SDK version; if the installed store build has not yet been updated to SDK 58, use an SDK 58 development build or temporarily target the SDK supported by that Expo Go release.

## Quality checks

- `npm run typecheck` — TypeScript check.
- `npm run lint` — Expo lint.
- `npx expo-doctor` — SDK/config/dependency diagnostics.
- `npx expo export --platform android` and `npx expo export --platform ios` — Metro bundle checks for both native targets.

## Android and iOS builds

Cloud builds use EAS Build. Run `npx eas-cli@latest login` and `npx eas-cli@latest build:configure` if this Expo account/project has not been configured yet, then:

- Android test APK: `npm run build:android:preview`.
- Android Play Store AAB: `npm run build:android:production`.
- iOS App Store/TestFlight build: `npm run build:ios:production`.

iOS distribution requires an Apple Developer account and signing credentials. Android/iOS binaries require EAS Build credentials; those are not included in this repository.

## Migrated screens and behavior

- Home: legal-specialty browsing, search, featured consultation, lawyer cards, popular services.
- Lawyers: searchable/filterable/sortable directory, saved lawyers, profile navigation, and a native ariza form with optional local file attachment.
- Lawyer profile: specialties, experience, consultation type, schedule, description and booking.
- Document submission: native document picker and camera, 25 MB size check, type selection, lawyer choice and demo submission.
- My requests: status/type/search filters, consultation entry, progress and completed-review entry.
- Consultation: native chat composer, quick replies, local document attachment, camera/mic/speaker UI toggles, end-to-review flow.
- Review: star rating, selected review factors, comment, anonymity/public-rating preferences.
- Profile: local settings and preferences, security toggles, support and sign-out confirmation.
- Five-tab Expo Router navigation and local persistence for requests, saved lawyers, reviews and preferences.

## Demo/backend boundaries

The source web app had no API, authentication, payment gateway, upload endpoint, push notification service, or live WebRTC stream. Migrated demo data and interactions remain local; AsyncStorage stores demo state on the device. Document and image pickers access files on-device, but files are not uploaded or shared. The call screen is a native interface simulation, not a live call. OneID, payment, real lawyer verification, cloud document storage, real push notifications, account authentication, and WebRTC need backend/provider credentials and service integration before production use. Demo profiles, prices, license numbers, outcomes, and ratings are not verified real-world claims.

## Project layout

- `src/app/` — Expo Router tabs and detail routes.
- `src/screens/` — native screen UI.
- `src/components/` — shared React Native controls and cards.
- `src/constants/` — demo content and visual tokens.
- `src/hooks/` — AsyncStorage-backed demo app state.
- `src/types/` — shared TypeScript models.
- `src/utils/` — small routing/data helpers.

## Branding assets

Colors and fonts use Yurist Online's blue/white palette, Inter and Manrope. The iOS icon now uses a custom vector scales mark and the splash uses the brand-blue background. The Android adaptive/home-screen raster icon still uses the Expo scaffold artwork and must be replaced with a Yurist Online PNG before store release.
