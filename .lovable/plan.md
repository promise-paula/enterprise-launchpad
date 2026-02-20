

# Add User-Defined Price Alert System

## Overview
Allow users to create custom price alerts for BTC and sBTC (e.g., "Alert me when BTC crosses $100,000"). Alerts are stored in localStorage and checked against live prices on each poll cycle. When a threshold is crossed, the user gets a toast notification, a push notification (if enabled), and an entry in the notification history.

## User Experience
- A new "Price Alerts" card appears on the Settings page below the existing Notifications card
- Users select a token (BTC or sBTC), a direction (above/below), and enter a target price
- Active alerts are listed with the ability to delete them
- When a price crosses the threshold, the alert fires once, then auto-removes itself
- Triggered alerts appear in the existing Notification History page

## Changes

| File | Change |
|------|--------|
| `src/lib/priceAlerts.ts` | New file -- localStorage CRUD for user-defined price alerts |
| `src/hooks/usePriceAlerts.ts` | Extend to also check user-defined threshold alerts |
| `src/hooks/useUserPriceAlerts.ts` | New hook -- reactive state for managing custom alerts in the Settings UI |
| `src/pages/Settings.tsx` | Add "Price Alerts" card with form to create/delete custom alerts |
| `src/types/index.ts` | Add `PriceAlert` interface |

## Technical Details

### 1. `src/types/index.ts` -- Add PriceAlert type

```typescript
export interface PriceAlert {
  id: string;
  symbol: 'BTC' | 'sBTC';
  direction: 'above' | 'below';
  targetPrice: number;
  createdAt: string;
}
```

### 2. `src/lib/priceAlerts.ts` -- localStorage CRUD

- `loadAlerts(): PriceAlert[]` -- read from `price-alerts` key
- `saveAlerts(alerts: PriceAlert[]): void` -- persist to localStorage
- `addAlert(alert: Omit<PriceAlert, 'id' | 'createdAt'>): PriceAlert` -- generate ID, push, save, dispatch `price-alerts-change` custom event
- `removeAlert(id: string): void` -- filter out, save, dispatch event
- Validates `targetPrice > 0` before saving

### 3. `src/hooks/useUserPriceAlerts.ts` -- Reactive hook for Settings UI

- Uses `useState` initialized from `loadAlerts()`
- Listens to `price-alerts-change` custom event to stay in sync
- Exposes `{ alerts, add, remove }` interface

### 4. `src/hooks/usePriceAlerts.ts` -- Extend with threshold checking

Add a second check inside the existing `useEffect` that:
- Calls `loadAlerts()` to get user-defined alerts
- For each alert, compares current price against `targetPrice` using `direction`
- If crossed: fires toast, adds to notification history, sends push notification, then calls `removeAlert(id)` to auto-remove the triggered alert
- Uses the existing `alerted` ref to prevent duplicate firing within the same poll cycle

### 5. `src/pages/Settings.tsx` -- Price Alerts card

Add a new card after the Notifications card:
- Header: "Price Alerts" with a target icon
- Form row: Token select (BTC / sBTC dropdown), Direction select (Above / Below), Price input (number, validated > 0), "Add" button
- Below the form: list of active alerts, each showing "BTC above $100,000" with a delete (X) button
- Empty state: "No price alerts set" message
- Input validation: price must be a positive number, show inline error via toast if invalid

