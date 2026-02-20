

# Notification History Panel

## Overview
Create a notification history system that logs all price and transaction alerts, allowing users to review past notifications. The history will be stored in `localStorage` and accessible from the sidebar navigation.

## Changes

### 1. Notification store -- `src/lib/notificationHistory.ts`
A small module that manages a log of past notifications in `localStorage`.

- **Data model**: Each entry has an `id`, `type` ("price" | "transaction"), `message`, `timestamp`, and `read` flag
- **API**:
  - `addNotification(type, message)` -- appends to log, caps at 100 entries (oldest trimmed)
  - `getNotifications()` -- returns all entries, newest first
  - `markAllRead()` -- sets all entries' `read` to `true`
  - `clearHistory()` -- empties the log
- Stored under `localStorage` key `"notification-history"`

### 2. Update alert hooks to log entries

**`src/hooks/usePriceAlerts.ts`**
- After each `toast()` call, also call `addNotification("price", message)`

**`src/hooks/useTransactionAlerts.ts`**
- After each `toast.success()` call, also call `addNotification("transaction", message)`

### 3. New page -- `src/pages/NotificationHistory.tsx`
A dedicated page for reviewing past alerts.

- Header with title "Notification History" and action buttons: "Mark all read" and "Clear history"
- Unread count badge next to the title
- List of notification cards, each showing:
  - Icon (TrendingUp/TrendingDown for price, ArrowUpRight/ArrowDownLeft for transaction)
  - Message text
  - Relative timestamp (e.g., "5 min ago")
  - Unread dot indicator
- Empty state when no notifications exist
- Uses existing `glass-card` styling and `StaggerContainer`/`StaggerItem` for consistency

### 4. Add route -- `src/App.tsx`
- Add route: `<Route path="/dashboard/notifications" element={<NotificationHistory />} />`

### 5. Add sidebar link -- `src/components/layout/AppSidebar.tsx`
- Add a "Notifications" item with the `Bell` icon between "History" and "Settings"
- Include an unread count badge (small dot or number) when there are unread notifications

## Technical Notes
- No new dependencies -- uses existing `localStorage`, `lucide-react`, and UI components
- History capped at 100 entries to keep `localStorage` usage reasonable
- `addNotification` is a plain function (not a hook) so it can be called from existing hooks without refactoring
- Unread badge reads from `localStorage` on sidebar mount, keeping it lightweight

