
# Notifications System: Price Alerts and Transaction Confirmations

## Overview
Add a notification system that monitors live price data for significant movements (>5% in 24h) and watches for transaction status changes (pending to confirmed), surfacing toast alerts via `sonner`.

## Changes

### 1. New hook -- `src/hooks/usePriceAlerts.ts`
A lightweight hook that monitors the `usePrices` data and fires toast alerts when a token's `changePercent24h` crosses the 5% threshold (positive or negative).

- Tracks which symbols have already been alerted (via a `useRef<Set<string>>`) to avoid repeated toasts on every poll cycle
- Resets the "alerted" set when the price crosses back below the threshold
- Toast content: "BTC is up 6.2% in the last 24h" or "STX is down 5.4% in the last 24h" with appropriate icons (TrendingUp / TrendingDown)
- Uses `sonner`'s `toast()` with a custom duration of 8 seconds

### 2. New hook -- `src/hooks/useTransactionAlerts.ts`
Monitors the transaction list for status changes from `pending` to `confirmed`.

- Keeps a `useRef<Set<string>>` of previously-pending transaction IDs
- On each update, compares current statuses against the previous set
- When a transaction flips to `confirmed`, fires a toast: "Transaction confirmed: Sent 0.01 sBTC"
- Also alerts on new incoming transactions (type `receive`): "Received 0.05 sBTC"

### 3. New component -- `src/components/notifications/NotificationProvider.tsx`
A thin wrapper component that mounts both alert hooks. This keeps the Dashboard clean and makes the notification logic reusable.

- Renders nothing (returns `null`) -- purely a side-effect component
- Imports and calls `usePriceAlerts()` and `useTransactionAlerts()`

### 4. Update `src/pages/Dashboard.tsx`
- Import and render `<NotificationProvider />` at the top of the Dashboard component
- No other changes to the Dashboard layout

### 5. Notification preferences in Settings (optional enhancement)
- Add a "Notifications" section to the Settings page with toggles for:
  - Price movement alerts (on/off)
  - Transaction confirmations (on/off)  
  - Price threshold slider (default 5%, range 1-20%)
- Store preferences in `localStorage`
- Both alert hooks read from localStorage to respect user preferences

## Technical Notes
- No new dependencies -- uses existing `sonner` toast system
- Price alerts only fire once per threshold crossing per token (not on every 60s poll)
- Transaction alerts compare against a snapshot of previous state to detect changes
- The 5% threshold is configurable via the Settings page or a constant
- All alert logic is isolated in hooks, making it easy to test or disable
