

# Fix Price Chart Error Handling

## Problem
The CoinGecko `/market_chart` endpoint frequently fails (CORS/rate-limiting in the iframe environment), causing a generic "Failed to load chart data" toast with no recovery path. The chart shows a skeleton forever or goes blank.

## Root Causes
1. **No retry logic** in `PriceChart.tsx` -- a single failure immediately shows an error toast
2. **No error state UI** -- the chart area is empty after a failure (just stops loading)
3. **No fallback data** -- if the API is unreachable, there's nothing to show
4. **Cache too short** -- `fetchMarketChart` cache expires every 30s, so stale-but-valid data is discarded quickly

## Solution

### 1. Add retry with exponential backoff to `fetchMarketChart` (`src/lib/coingecko.ts`)
- Add a helper function `fetchWithRetry` that wraps fetch with 3 attempts (1s, 2s, 4s delays)
- Apply it to the `fetchMarketChart` function
- Extend cache lifetime to 5 minutes so cached data survives transient failures

### 2. Add error state and retry button to `PriceChart.tsx`
- Track an `error` state (with variant: `'api' | 'rate-limited' | null`)
- On failure, show the existing `ErrorState` component inside the chart area with a Retry button
- If cached data exists, show the chart with a subtle "May be outdated" warning instead of an error
- Clear error state on successful load

### 3. Suppress duplicate toast spam
- Remove the `toast.error` call from `PriceChart` (the inline `ErrorState` replaces it)
- This prevents repeated toast popups every 30s when the API is persistently down

## Files Changed

| File | Change |
|------|--------|
| `src/lib/coingecko.ts` | Add `fetchWithRetry` helper, increase chart cache TTL to 5 min, apply retry to `fetchMarketChart` |
| `src/components/dashboard/PriceChart.tsx` | Add `error` state, show `ErrorState` component on failure with retry button, show stale warning when using cached data |

## Technical Details

**`src/lib/coingecko.ts` changes:**
- New `CHART_CACHE_TTL = 300_000` (5 min) constant for chart cache, separate from the price polling interval
- Retry loop inside `fetchMarketChart`: up to 3 attempts with `Math.pow(2, attempt) * 1000` ms delay
- On all retries exhausted, still fall back to cached data if available (even if expired)

**`src/components/dashboard/PriceChart.tsx` changes:**
- Add `error` state: `useState<'api' | 'rate-limited' | null>(null)`
- In `loadChart` catch block: detect rate-limit (check error message) vs generic API error, set error state accordingly
- Render logic: if `error && chartData.length === 0` show `ErrorState` with retry; if `error && chartData.length > 0` show chart with stale badge
- Import `ErrorState` component
- Remove `toast.error` call

