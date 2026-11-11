# Hujjatlar Hamyoni

A simple Expo + React‑Native application that helps users store, organise and remind about important documents (contracts, warranties, receipts, etc.).

## Project structure
```
📦 hujjatlar-hamyoni
├─ 📁 src
│  └─ 📁 screens
│     ├─ HomeScreen.tsx          # Dashboard – entry point
│     ├─ DocumentsScreen.tsx      # List / search documents
│     ├─ UploadScreen.tsx         # Upload new file + metadata
│     ├─ DetailsScreen.tsx        # Document preview & actions
│     ├─ AIScreen.tsx             # AI‑powered search & summarisation
│     ├─ RemindersScreen.tsx      # Manage expiry reminders
│     ├─ LegalScreen.tsx          # Legal‑evidence collection
│     └─ ProfileScreen.tsx        # Security & account settings
├─ App.tsx                         # Navigation container & stack
├─ package.json                    # Dependencies (Expo, React‑Native, Paper, Navigation…)
└─ README.md                       # This file
```

## How to run
```bash
# Install dependencies (run **outside** the sandbox on Windows)
pnpm install
# Start the Expo dev server (sandboxed)
pnpm start
```
- `pnpm android` – launch on Android emulator/device
- `pnpm ios` – launch on iOS simulator
- `pnpm web` – run in a browser

## Next steps (awaiting your design details)
1. Implement each screen UI according to the design you will provide.
2. Add document storage using `expo-file-system` and secure storage with `expo-secure-store`.
3. Wire‑up reminder notifications via `expo-notifications`.
4. Integrate AI assistance (e.g., local LLM or Gemini API) for semantic search.
5. Add authentication / encryption as described in the spec.

Feel free to share the detailed designs for any page, and we will flesh out the components accordingly.
