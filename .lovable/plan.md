
# Add Demo Mode for Micro-interaction Testing

## Overview
Add a "Demo Mode" toggle to the Settings page that simulates random price fluctuations every 3 seconds. This lets you visually verify the price flash animations (green/red), the AnimatedNumber count-up effect on portfolio value, and the sBTC balance changes -- all without waiting for real CoinGecko API updates.

## How It Works
- A global demo mode state (stored in localStorage, exposed via a small hook) controls whether `usePrices` applies random jitter to prices on a fast interval
- When enabled, `usePrices` runs a secondary 3-second timer that takes the last fetched real prices and applies a small random offset (+/- 0.5%), triggering re-renders that cause:
  - `usePriceFlash` to detect the price change and flash green/red
  - `AnimatedNumber` to animate the portfolio total smoothly
  - `useSbtcBalance` and `usePortfolio` to recompute derived values

## Files Changed

| File | Change |
|------|--------|
| `src/hooks/useDemoMode.ts` | New hook: read/write `demoMode` boolean from localStorage |
| `src/hooks/usePrices.ts` | When demo mode is on, run a 3s interval that jitters prices by +/- 0.5% |
| `src/pages/Settings.tsx` | Add a "Demo Mode" toggle card with description |

## Technical Details

### `src/hooks/useDemoMode.ts` (new)
- Simple hook using `useState` initialized from `localStorage.getItem('demoMode')`
- `setDemoMode(val)` writes to localStorage and updates state
- Dispatches a `storage` event so other hook instances stay in sync across components

### `src/hooks/usePrices.ts` changes
- Import `useDemoMode`
- Add a new `useEffect` that, when `demoMode === true` and `prices.length > 0`, sets up a 3-second interval
- Each tick copies current prices and applies `price * (1 + (Math.random() - 0.5) * 0.01)` (random +/- 0.5%)
- Calls `setPrices(jitteredPrices)` to trigger downstream updates
- Clears interval when demo mode is off or on unmount

### `src/pages/Settings.tsx` changes
- Import `useDemoMode`
- Add a new card between Network and Notifications sections titled "Demo Mode"
- Contains a Switch toggle and description: "Simulate price changes every 3 seconds to preview flash animations and count-up effects"
- Shows a small badge "Active" when demo mode is on
