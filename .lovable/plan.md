

# Add STX Token Support and Repeating Alerts

## Overview
Two enhancements to the existing Price Alert system:
1. Add STX as a third token option (alongside BTC and sBTC) in price alerts
2. Add a "Repeat" toggle so alerts can fire multiple times without auto-removing

## Changes

### 1. Update PriceAlert type (`src/types/index.ts`)
- Expand the `symbol` union to `'BTC' | 'sBTC' | 'STX'`
- Add an optional `repeat: boolean` field (defaults to `false` for backward compatibility)

### 2. Add STX option to Settings form (`src/pages/Settings.tsx`)
- Add `<SelectItem value="STX">STX</SelectItem>` to the token dropdown
- Add a "Repeat" switch/toggle next to the Add button
- Show a repeat icon/badge on alerts that have `repeat: true`
- Pass the `repeat` flag when calling `addPriceAlert`

### 3. Update alert triggering logic (`src/hooks/usePriceAlerts.ts`)
- When a repeating alert crosses its threshold: fire the notification but do NOT call `removeAlert(id)`
- Use the existing `alerted` ref to prevent duplicate firing within the same poll cycle
- For repeating alerts, clear the `alerted` ref entry when the price moves back below/above the threshold so it can fire again on the next crossing

### 4. Update addAlert signature (`src/lib/priceAlerts.ts`)
- The `Omit<PriceAlert, 'id' | 'createdAt'>` type will automatically pick up the new `repeat` field -- no changes needed here

## Technical Details

### Type change (`src/types/index.ts`)
```typescript
export interface PriceAlert {
  id: string;
  symbol: 'BTC' | 'sBTC' | 'STX';
  direction: 'above' | 'below';
  targetPrice: number;
  createdAt: string;
  repeat?: boolean;
}
```

### Triggering logic change (`src/hooks/usePriceAlerts.ts`)
In the user-defined alerts loop:
- If `crossed && !alert.repeat` -- current behavior (notify + removeAlert)
- If `crossed && alert.repeat` -- notify only, keep alert in storage
- If `!crossed && alert.repeat` -- clear the `alerted` ref entry so it re-arms for the next crossing

### Settings UI change (`src/pages/Settings.tsx`)
- Add `alertRepeat` state (boolean, default `false`)
- Add a Switch labeled "Repeat" in the form row
- Pass `repeat: alertRepeat` into `addPriceAlert()`
- Show a small "Repeating" badge or refresh icon on alert list items where `repeat` is true
- Reset `alertRepeat` to `false` after adding

