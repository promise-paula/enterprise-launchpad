

# Fix Duplicate API Calls in Price Alerts

## Problem
`usePriceAlerts` creates its own `usePrices()` instance, causing duplicate CoinGecko API calls that get rate-limited (HTTP 429). This prevents price alert toasts from ever firing.

## Changes

### 1. `src/hooks/usePriceAlerts.ts`
- Remove the `usePrices()` import and call
- Accept `prices: PriceData[]` as a parameter instead

### 2. `src/components/notifications/NotificationProvider.tsx`
- Accept `prices: PriceData[]` as a prop
- Pass it through to `usePriceAlerts(prices)`

### 3. `src/pages/Dashboard.tsx`
- Pass the existing `prices` array from `usePrices()` into `<NotificationProvider prices={prices} />`

Three files, ~1-line change each. No new dependencies.

