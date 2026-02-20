

# Fix Sidebar Notification Badge Real-Time Updates

## Problem
The sidebar reads `getUnreadCount()` only on render/mount. When the user clicks "Mark all read" or "Clear" on the Notifications page, the sidebar badge stays stale until a navigation triggers a re-render.

## Solution
Use a lightweight event-based approach: dispatch a custom DOM event whenever notification state changes, and listen for it in the sidebar to trigger a re-read.

## Changes

### 1. `src/lib/notificationHistory.ts`
- Add a helper that dispatches a custom event `"notification-change"` on `window`
- Call it at the end of `addNotification()`, `markAllRead()`, and `clearHistory()`

### 2. `src/components/layout/AppSidebar.tsx`
- Replace the one-time `getUnreadCount()` call with a `useState` + `useEffect` that listens for the `"notification-change"` event and re-reads the count
- Clean up the event listener on unmount

## Technical Notes
- No new dependencies or context providers needed
- Custom DOM events are synchronous and zero-cost when no listener is attached
- The same pattern will automatically keep the mobile bottom nav in sync if a badge is added there later
