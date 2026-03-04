

# Page Transition Animations

## Approach

A `PageTransition` component already exists but isn't used. The fix is to wrap each route's page content with it and add `AnimatePresence` in `App.tsx` keyed to the current location.

## Changes

### 1. `src/App.tsx`
- Import `AnimatePresence` from `framer-motion` and `useLocation` from `react-router-dom`
- Extract routes into a child component that calls `useLocation()` (must be inside `BrowserRouter`)
- Wrap `<Routes>` with `<AnimatePresence mode="wait">` keyed by `location.pathname`
- Pass `location` to `<Routes location={location}>`

### 2. Wrap pages with `PageTransition`
- `src/pages/Index.tsx` — wrap return JSX in `<PageTransition>`
- `src/pages/Dashboard.tsx` — wrap return JSX in `<PageTransition>`
- `src/pages/TransactionHistory.tsx` — wrap in `<PageTransition>`
- `src/pages/Settings.tsx` — wrap in `<PageTransition>`
- `src/pages/NotificationHistory.tsx` — wrap in `<PageTransition>`
- `src/pages/NotFound.tsx` — wrap in `<PageTransition>`

Each page just gets an import and a wrapper — the `PageTransition` component handles the fade+slide animation on mount/unmount.

