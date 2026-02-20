

# Phased Implementation Plan: Close All PRD Gaps

## Current State Summary
The app has a working dashboard with portfolio stats, price charts, holdings table, transaction history, notifications, and settings. However, many PRD requirements are missing or incomplete.

---

## Phase 1: Quick Fixes (Low effort, high compliance)

**1a. Change polling interval from 60s to 30s**
- File: `src/hooks/usePrices.ts` -- change `POLL_INTERVAL` from `60_000` to `30_000`

**1b. Change transaction pagination from 5 to 20 per page**
- File: `src/pages/TransactionHistory.tsx` -- change `PAGE_SIZE` from `5` to `20`

**1c. Wire explorer links to real Stacks explorer**
- Files: `src/pages/TransactionHistory.tsx`, `src/pages/Dashboard.tsx`
- Replace `href="#"` with `https://explorer.hiro.so/txid/{txHash}?chain=mainnet`

**1d. Fix landing page secondary CTA text**
- File: `src/pages/Index.tsx` -- change "View Demo" to "Learn More" per PRD section 17.1

**1e. Show last 10 transactions on dashboard (not 6)**
- File: `src/pages/Dashboard.tsx` -- change `transactions.slice(0, 6)` to `transactions.slice(0, 10)`

---

## Phase 2: Sortable Holdings Table

**Changes:**
- File: `src/pages/Dashboard.tsx`
- Add sort state (`sortColumn`, `sortDirection`) for the holdings table
- Make table headers clickable with sort indicators (arrow icons)
- Sort holdings array by the selected column (Token, Balance, Value, 24h Change)
- Add token icons (inline SVG or emoji placeholders for BTC/STX)
- Add empty state for zero holdings: icon + "No sBTC yet" + link to bridge

---

## Phase 3: Error Handling and Resilience

**3a. Create a React Error Boundary component**
- New file: `src/components/ErrorBoundary.tsx`
- Catches render errors, shows friendly UI with "Something went wrong" message and a Retry button
- Wrap main content in `DashboardLayout` and the app root

**3b. Create structured error UI components**
- New file: `src/components/ErrorState.tsx`
- Reusable component: icon + message + retry button
- Variants for different error types (API down, offline, rate limited)

**3c. Add offline detection banner**
- New file: `src/hooks/useOnlineStatus.ts` -- listens to `navigator.onLine` and `online`/`offline` events
- New component: `src/components/OfflineBanner.tsx` -- sticky banner "You're offline. Showing cached data."
- Add to `DashboardLayout`

**3d. Add stale price warning**
- File: `src/hooks/usePrices.ts` -- track `lastSuccessfulFetch` timestamp
- File: `src/pages/Dashboard.tsx` / `PriceChart.tsx` -- if data is older than 5 minutes, show yellow warning badge "Price may be outdated"

**3e. Add retry logic with exponential backoff**
- File: `src/hooks/usePrices.ts` -- implement 3 retries (1s, 2s, 4s) before showing error state
- Show manual retry button after all retries fail

---

## Phase 4: Accessibility (WCAG 2.1 AA)

**4a. Skip-to-content link**
- File: `src/components/layout/DashboardLayout.tsx`
- Add visually hidden "Skip to main content" link that appears on focus, targeting `<main>` with `id="main-content"`

**4b. ARIA live regions**
- File: `src/pages/Dashboard.tsx`
- Wrap portfolio value and price displays in `aria-live="polite"` regions so screen readers announce updates

**4c. ARIA labels on interactive elements**
- Add `aria-label` to all icon-only buttons (theme toggle, copy address, sidebar trigger)
- Add `aria-label` to wallet connect button, sort headers, filter buttons
- Files: `DashboardLayout.tsx`, `Dashboard.tsx`, `TransactionHistory.tsx`, `Settings.tsx`

**4d. Keyboard navigation improvements**
- Ensure all interactive elements have visible focus indicators (already handled by Tailwind's `ring` utility but verify)
- Add `role` and `aria-sort` attributes to sortable table headers
- Ensure bottom mobile nav items are properly focusable

**4e. Screen reader announcements**
- Add `aria-busy="true"` to loading states
- Announce errors with `aria-live="assertive"`
- Announce wallet connect/disconnect events

---

## Phase 5: Wallet Connection (Real Integration)

**Note:** Real `@stacks/connect` integration requires the wallet browser extension to be installed. Since this is a Lovable-hosted app (iframe preview), real wallet signing won't work in the preview. The implementation will be structurally correct but testable only in a deployed environment.

**5a. Install @stacks/connect dependency**
- Add `@stacks/connect` package

**5b. Rewrite `src/hooks/useWallet.ts`**
- Replace mock with real `showConnect()` from `@stacks/connect`
- Support Leather and Xverse wallet detection
- Persist session in localStorage
- Handle error codes: `WALLET_NOT_FOUND`, `USER_REJECTED`, `CONNECTION_TIMEOUT`
- Add `isConnecting` state

**5c. Add wallet selection modal**
- New file: `src/components/WalletModal.tsx`
- Show Leather and Xverse options with install links if not detected
- Connection status indicator (green dot)

**5d. Update landing page CTA**
- File: `src/pages/Index.tsx`
- "Connect Wallet" button triggers the wallet modal instead of navigating to `/dashboard`

**5e. Update DashboardLayout header**
- Show wallet dropdown when connected (address, disconnect, network info)
- Connection status green dot indicator

**5f. Session persistence**
- Store connected address and session in localStorage
- Auto-reconnect on page load
- Detect external disconnect within 5 seconds

---

## Phase 6: SEO and Meta Tags

**6a. Add meta tags**
- File: `index.html`
- Add OpenGraph tags, Twitter card tags, descriptive title/description
- Add semantic HTML improvements (`<main>`, `<nav>`, `<section>` where missing)

---

## Phase 7: Micro-interactions and Polish

**7a. Price flash animation**
- Add CSS keyframes `flash-green` and `flash-red` for price changes
- Apply to price values when they update

**7b. Balance count-up effect**
- Animate portfolio value number when it changes (count from old to new value)

**7c. New transaction slide-in**
- First transaction in the list gets `slide-in-top` animation

---

## Phase 8: Post-MVP Features (Future)

These are documented but explicitly lower priority:
- **F7: DeFi Position Tracking** (ALEX, Zest, BitFlow, StackingDAO)
- **F8: Multi-Wallet Watch Mode** (add/label/aggregate wallets by address)
- **F9: Portfolio Analytics** (value over time chart, allocation pie chart)

---

## Implementation Order Recommendation

Phases 1-4 can be done immediately and will have the most visible impact on PRD compliance. Phase 5 (wallet) is the most complex and will need deployment testing. Phases 6-7 are polish. Phase 8 is post-MVP.

**Estimated scope per phase:**
- Phase 1: ~5 file edits (small changes)
- Phase 2: ~1 file edit (moderate)
- Phase 3: ~3 new files + 3 edits (moderate)
- Phase 4: ~5 file edits (moderate)
- Phase 5: ~1 new package + 3 new files + 4 edits (large)
- Phase 6: ~1 file edit (small)
- Phase 7: ~2 file edits + CSS additions (small)

