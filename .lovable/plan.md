

# Fix Dashboard Deadlock, Landing Page Issues, and Pagination

## Overview
Four targeted fixes to resolve the infinite skeleton deadlock on the Dashboard, fix misleading landing page links, and add proper pagination truncation.

## 1. Dashboard Loading Deadlock

**Problem**: When CoinGecko API fails after retries, `usePrices` sets `isLoading = false` but `prices` stays empty. The Dashboard checks `isLoading || !portfolio` which is always true (portfolio is null when prices are empty), so skeletons render forever with no way out.

**Fix**:
- Add `hasError: boolean` state to `usePrices` hook, set it to `true` in the catch block after max retries
- Return `hasError` from the hook
- In `Dashboard.tsx`, check for the error state and render the existing `ErrorState` component (variant `"api"`) with a retry button instead of infinite skeletons
- Apply the same pattern to the `PriceChart` and `PortfolioChart` components if they also deadlock

### Changes

**`src/hooks/usePrices.ts`**:
- Add `const [hasError, setHasError] = useState(false)`
- In the catch block (after max retries): call `setHasError(true)`
- In the success path: call `setHasError(false)`
- Return `hasError` in the hook's return object

**`src/pages/Dashboard.tsx`**:
- Destructure `hasError` and `retry` from `usePrices()`
- After the stale warning, add an early return: if `!isLoading && hasError && prices.length === 0`, render `ErrorState` with `variant="api"` and `onRetry={retry}`
- For each stat card, change `isLoading || !portfolio` to `isLoading` only -- the error state above catches the failure case

## 2. "Learn More" Button Scroll

**Problem**: The "Learn More" button links to `/dashboard` -- identical to "Connect Wallet".

**Fix in `src/pages/Index.tsx`**:
- Add `id="features"` to the features `<section>` element
- Change the "Learn More" button from `<Link to="/dashboard">` to a plain `<a href="#features">` that scrolls smoothly
- Add `scroll-behavior: smooth` to the page wrapper or use `scroll-mt-20` on the section for header clearance

## 3. Footer Placeholder Links

**Problem**: All three footer links (`Docs`, `GitHub`, `Twitter`) point to `href="#"`.

**Fix in `src/pages/Index.tsx`**:
- Replace with real ecosystem links:
  - Docs: `https://docs.stacks.co`
  - GitHub: `https://github.com/stacks-network`
  - Twitter: `https://twitter.com/Stacks`
- Add `target="_blank"` and `rel="noopener noreferrer"` to each

## 4. Pagination Ellipsis Truncation

**Problem**: `TransactionHistory.tsx` renders every page number in a loop, which overflows horizontally with large datasets.

**Fix in `src/pages/TransactionHistory.tsx`**:
- Replace the raw `Array.from({ length: totalPages })` loop with a helper function `getPageNumbers(current, total)` that returns a compact array like `[1, '...', 4, 5, 6, '...', 20]`
- Logic: always show first page, last page, and up to 2 pages around the current page; insert `'...'` ellipsis for gaps
- Render `PaginationEllipsis` for `'...'` entries and `PaginationLink` for number entries
- Import `PaginationEllipsis` from the pagination component

### Pagination helper logic

```
function getPageNumbers(current: number, total: number): (number | 'ellipsis')[] {
  if (total <= 7) return range 1..total
  
  const pages: (number | 'ellipsis')[] = []
  pages.push(1)
  
  if (current > 3) pages.push('ellipsis')
  
  for i from max(2, current-1) to min(total-1, current+1):
    pages.push(i)
  
  if (current < total - 2) pages.push('ellipsis')
  
  pages.push(total)
  return pages
}
```

## File Change Summary

| File | Change |
|------|--------|
| `src/hooks/usePrices.ts` | Add `hasError` state, set on failure, clear on success, return it |
| `src/pages/Dashboard.tsx` | Import `ErrorState`, show error UI when API fails instead of infinite skeletons |
| `src/pages/Index.tsx` | "Learn More" scrolls to `#features`, add `id` to features section, update footer links to real URLs |
| `src/pages/TransactionHistory.tsx` | Add `getPageNumbers` helper, import `PaginationEllipsis`, render truncated pagination |
