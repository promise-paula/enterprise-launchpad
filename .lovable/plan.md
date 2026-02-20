

# Fix: Route Navigation Blank Page Bug

## Problem
When navigating between routes using the sidebar (e.g., Dashboard to History), the main content area goes completely blank. The page works fine on direct URL load. This is caused by `AnimatePresence mode="wait"` in `DashboardLayout.tsx` -- the exit animation completes but the new `PageTransition` component never mounts.

## Root Cause
`AnimatePresence` with `mode="wait"` requires proper key changes to trigger the exit/enter cycle. The issue is that React Router's `<Outlet />` doesn't re-mount when the route changes within the same layout -- it just swaps the child content. The `key={location.pathname}` on `PageTransition` should work, but the combination with `<Outlet />` inside can cause the new content to not render after the exit animation.

## Fix

**File: `src/components/layout/DashboardLayout.tsx`**

Replace the current AnimatePresence pattern. Instead of wrapping `<Outlet />` inside a single `PageTransition` keyed by pathname, each page component already wraps itself in `PageTransition`. The layout should just render `<Outlet />` directly, and let each page handle its own entrance animation independently. Remove `AnimatePresence` from the layout since page-level `PageTransition` components already handle fade-in.

Alternatively, if we want to keep exit animations, we can use a different approach: clone the outlet content with a key. The simplest reliable fix is:

1. Remove `AnimatePresence` and `PageTransition` from `DashboardLayout.tsx`
2. Each page (Dashboard, TransactionHistory, Settings) already wraps content in `PageTransition`, so entrance animations will still work

This removes the exit animation (fade-out on route change) but guarantees reliable route transitions. The entrance fade-in/slide-up on each page will still provide a polished feel.

## Technical Details

**File to modify:** `src/components/layout/DashboardLayout.tsx`
- Remove `AnimatePresence` and `PageTransition` imports
- Replace the `<AnimatePresence mode="wait"><PageTransition key={...}><Outlet /></PageTransition></AnimatePresence>` block with just `<Outlet />`

No other files need changes -- `Dashboard.tsx`, `TransactionHistory.tsx`, and `Settings.tsx` already include their own `PageTransition` wrappers.

