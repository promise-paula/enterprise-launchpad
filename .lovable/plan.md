

# Add Push Notification Support (Web Notifications API)

## Overview
Add browser push notifications so users receive alerts even when the sBTC tab is in the background. This integrates with the existing in-app toast and notification history system.

## How It Works for Users
- A new **"Browser notifications"** toggle appears in Settings under the Notifications card
- When enabled, the browser will ask for permission (the standard browser prompt)
- Once granted, price and transaction alerts will also appear as native OS notifications (works even when the tab is not focused)
- If the user denies permission, the toggle shows a helpful message explaining how to re-enable it in browser settings

## Changes

### 1. Create `src/lib/pushNotification.ts` (new file)
A small utility module with two functions:
- `requestPushPermission()` -- calls `Notification.requestPermission()`, returns the result
- `sendPushNotification(title, body)` -- creates a `new Notification(title, { body, icon })` if permission is granted and the preference is enabled; silently does nothing otherwise

### 2. Update `src/hooks/useNotificationPreferences.ts`
- Add `pushNotifications: boolean` (default `false`) to the `NotificationPreferences` interface and defaults

### 3. Update `src/hooks/usePriceAlerts.ts`
- After the existing `toast()` and `addNotification()` calls, also call `sendPushNotification('sBTC Price Alert', msg)`

### 4. Update `src/hooks/useTransactionAlerts.ts`
- Same pattern: call `sendPushNotification('sBTC Transaction', msg)` alongside the existing toast calls

### 5. Update `src/pages/Settings.tsx`
- Add a new toggle row for "Browser notifications" below the existing transaction alerts toggle
- When toggled on: call `requestPushPermission()`; if denied, show a toast explaining how to allow it in browser settings and reset the toggle
- Show the current permission state as a small badge (Granted / Denied / Not asked)

## Technical Notes
- The Web Notifications API is supported in all modern browsers (Chrome, Firefox, Edge, Safari 16.4+)
- No service worker is needed for basic `new Notification()` -- the tab just needs to be open (not necessarily focused)
- Push notifications are opt-in (default `false`) so existing users are not disrupted
- Falls back gracefully: if the browser doesn't support `Notification`, the toggle is hidden

