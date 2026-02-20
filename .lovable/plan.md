

# Fix 1H Chart Interval Rate Limiting

## Problem
The 1H interval makes a separate CoinGecko API call with `days=0.042`, which often gets rate-limited (HTTP 429) when users switch between intervals quickly.

## Solution
Instead of making a separate API call for 1H, fetch the 24H data and filter it to the last hour. The 24H endpoint returns data points every ~5 minutes, which provides plenty of granularity for a 1-hour view.

## Changes

### File: `src/components/dashboard/PriceChart.tsx`

1. When the user selects the "1H" interval, fetch (or reuse) the 24H chart data instead of calling `fetchMarketChart('bitcoin', 0.042)`
2. Filter the returned data points to only those within the last 60 minutes (`Date.now() - 3600000`)
3. Keep the existing formatting logic (time-based X-axis labels for 1H)

**Implementation approach:**
- In the `loadChart` callback, check if `intv === '1H'` -- if so, call `fetchMarketChart('bitcoin', 1)` (same as 24H) and then filter results to `timestamp >= Date.now() - 3_600_000`
- This means the 1H and 24H intervals share the same cached API response in `coingecko.ts` (cache key `bitcoin-1`), eliminating the extra network call entirely

This is a ~5-line change in `PriceChart.tsx` only. No changes needed to `coingecko.ts` or any other file.

