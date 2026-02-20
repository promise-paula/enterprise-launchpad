
# Fire Count Indicator + Settings Page Refactor

## Overview
Two changes: (1) track and display how many times each repeating alert has fired, and (2) break the 320-line Settings page into focused sub-components.

## Part 1: Fire Count for Repeating Alerts

### Type change (`src/types/index.ts`)
Add `fireCount?: number` to the `PriceAlert` interface (defaults to 0 for backward compatibility).

### Storage update (`src/lib/priceAlerts.ts`)
Add an `incrementFireCount(id: string)` function that loads alerts, finds the matching alert, increments its `fireCount` (initializing from 0 if missing), saves, and dispatches the change event.

### Triggering logic (`src/hooks/usePriceAlerts.ts`)
When a repeating alert fires, call `incrementFireCount(alert.id)` instead of doing nothing after the notification.

### UI display (`src/pages/Settings.tsx` / `PriceAlertsCard`)
Next to the RefreshCw icon on repeating alerts, show a small badge with the fire count (e.g., "x3") when `fireCount > 0`.

## Part 2: Settings Page Refactor

Split `src/pages/Settings.tsx` into 5 sub-components in `src/components/settings/`:

| Component | Responsibility |
|-----------|---------------|
| `AppearanceCard.tsx` | Theme selection (light/dark/system) |
| `NetworkCard.tsx` | Mainnet/testnet toggle |
| `DemoModeCard.tsx` | Demo mode switch |
| `NotificationsCard.tsx` | Price movement alerts, transaction confirmations, push notifications, threshold slider |
| `PriceAlertsCard.tsx` | Alert creation form, active alert list with fire counts |
| `WalletCard.tsx` | Connected address display, copy, disconnect |

### Props for each component
- **AppearanceCard**: `theme`, `setTheme`
- **NetworkCard**: `network`, `setNetwork`
- **DemoModeCard**: `demoMode`, `setDemoMode`
- **NotificationsCard**: `prefs`, `updatePrefs`, `supportsPush`, `pushPermission`, `onPushToggle`
- **PriceAlertsCard**: `alerts`, `addAlert`, `removeAlert`
- **WalletCard**: `wallet`, `disconnect`

### Resulting Settings page
The parent `SettingsPage` will become ~40 lines: hooks at the top, then rendering each card component in order. All local state (like `alertSymbol`, `alertPrice`, `copied`) moves into the respective sub-component.

## Technical Details

### `incrementFireCount` in `src/lib/priceAlerts.ts`
```typescript
export function incrementFireCount(id: string) {
  const alerts = loadAlerts();
  const alert = alerts.find(a => a.id === id);
  if (alert) {
    alert.fireCount = (alert.fireCount || 0) + 1;
    saveAlerts(alerts);
    notifyChange();
  }
}
```

### Fire count display in PriceAlertsCard
```tsx
{alert.repeat && (
  <span className="flex items-center gap-1 text-muted-foreground">
    <RefreshCw className="h-3 w-3" />
    {(alert.fireCount || 0) > 0 && (
      <span className="text-xs font-mono">x{alert.fireCount}</span>
    )}
  </span>
)}
```

### File creation summary
- Create 6 new files in `src/components/settings/`
- Edit `src/pages/Settings.tsx` (slim down to parent shell)
- Edit `src/types/index.ts` (add `fireCount`)
- Edit `src/lib/priceAlerts.ts` (add `incrementFireCount`)
- Edit `src/hooks/usePriceAlerts.ts` (call `incrementFireCount`)
