

# Edit Alerts, Reset Fire Count, and End-to-End Verification

## Overview
Three items:
1. **Verification** -- Test the repeating STX alert fire count by enabling Demo Mode, creating a repeating alert above $0.01, navigating to Dashboard, and confirming the count increments.
2. **Edit action** -- Allow inline editing of an existing alert's symbol, direction, and target price.
3. **Reset count** -- Add a button to zero out the fire count on repeating alerts.

## Part 1: Verification (manual testing after implementation)
After implementation, I will navigate to Settings, enable Demo Mode, create a repeating STX alert above $0.01, go to Dashboard to trigger price polling, then return to Settings to confirm the fire count badge shows and increments.

## Part 2: Reset Fire Count

### `src/lib/priceAlerts.ts`
Add a `resetFireCount(id: string)` function that sets `fireCount` to `0`, saves, and dispatches the change event.

### `src/hooks/useUserPriceAlerts.ts`
Expose a `resetCount` callback that calls `resetFireCount`.

### `src/components/settings/PriceAlertsCard.tsx`
- Accept new prop `resetCount: (id: string) => void`
- Next to the fire count badge (`x3`), show a small ghost button with a `RotateCcw` icon that calls `resetCount(alert.id)`
- Only visible when `fireCount > 0`

### `src/pages/Settings.tsx`
Pass `resetCount` from the hook to `PriceAlertsCard`.

## Part 3: Edit Action

### `src/lib/priceAlerts.ts`
Add an `updateAlert(id: string, updates: Partial<Pick<PriceAlert, 'symbol' | 'direction' | 'targetPrice'>>)` function that finds the alert by ID, merges the updates, saves, and dispatches the change event.

### `src/hooks/useUserPriceAlerts.ts`
Expose an `update` callback that calls `updateAlert`.

### `src/components/settings/PriceAlertsCard.tsx`
- Accept new prop `updateAlert: (id, updates) => void`
- Add `editingId` state (string | null) to track which alert is being edited
- When not editing: show current alert info with a `Pencil` icon button next to the delete button
- When editing: replace the alert row with inline select/input controls (same as the creation form) pre-filled with current values, plus "Save" and "Cancel" buttons
- On save: call `updateAlert(id, { symbol, direction, targetPrice })`, clear `editingId`, show success toast
- On cancel: clear `editingId`, discard changes

### `src/pages/Settings.tsx`
Pass `update` from the hook to `PriceAlertsCard`.

## Technical Details

### New functions in `src/lib/priceAlerts.ts`

```typescript
export function updateAlert(id: string, updates: Partial<Pick<PriceAlert, 'symbol' | 'direction' | 'targetPrice'>>) {
  const alerts = loadAlerts();
  const alert = alerts.find(a => a.id === id);
  if (alert) {
    Object.assign(alert, updates);
    saveAlerts(alerts);
    notifyChange();
  }
}

export function resetFireCount(id: string) {
  const alerts = loadAlerts();
  const alert = alerts.find(a => a.id === id);
  if (alert) {
    alert.fireCount = 0;
    saveAlerts(alerts);
    notifyChange();
  }
}
```

### Updated PriceAlertsCard props

```typescript
interface PriceAlertsCardProps {
  alerts: PriceAlert[];
  addAlert: (alert: Omit<PriceAlert, 'id' | 'createdAt'>) => PriceAlert | null;
  removeAlert: (id: string) => void;
  updateAlert: (id: string, updates: Partial<Pick<PriceAlert, 'symbol' | 'direction' | 'targetPrice'>>) => void;
  resetCount: (id: string) => void;
}
```

### File changes summary
- **Edit**: `src/lib/priceAlerts.ts` -- add `updateAlert` and `resetFireCount`
- **Edit**: `src/hooks/useUserPriceAlerts.ts` -- expose `update` and `resetCount`
- **Edit**: `src/components/settings/PriceAlertsCard.tsx` -- add inline edit mode and reset button
- **Edit**: `src/pages/Settings.tsx` -- pass new props to PriceAlertsCard

