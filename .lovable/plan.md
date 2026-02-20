

# Live CoinGecko Price Integration

## Overview
Replace all mock price data with real-time prices from the CoinGecko free API (Demo plan, no API key required). This updates the Dashboard stat cards, sBTC price chart, and portfolio value calculations.

## API Details

CoinGecko free API base: `https://api.coingecko.com/api/v3`

**Endpoints used:**
- `/simple/price?ids=bitcoin,blockstack&vs_currencies=usd&include_24hr_change=true` -- current BTC and STX prices with 24h change
- `/coins/bitcoin/market_chart?vs_currency=usd&days=N` -- historical BTC price data for the chart (days=1 for 24H, 7 for 7D, 30 for 30D)

**Coin IDs:** `bitcoin` for BTC, `blockstack` for STX. sBTC pegs ~1:1 to BTC, so its price derives from the BTC price (with a tiny offset to simulate the peg spread).

## Changes

### 1. New API service -- `src/lib/coingecko.ts`
Create a fetch wrapper with:
- `fetchPrices()` -- calls `/simple/price`, returns BTC and STX current price + 24h change percentage
- `fetchMarketChart(coinId, days)` -- calls `/coins/{id}/market_chart`, returns array of `[timestamp, price]` pairs for the chart
- Basic error handling with fallback to last-known values
- Rate-limit-friendly: no polling faster than 30 seconds

### 2. Update `src/hooks/usePrices.ts`
- Replace mock data with a `useEffect` that calls `fetchPrices()` on mount
- Add 60-second polling interval via `setInterval` for auto-refresh
- Derive sBTC price from BTC (apply a small -0.05% spread)
- Generate sparkline from the 7-day market chart data on initial load
- Keep `isLoading`, `prices`, and `getPrice` return shape unchanged
- Graceful fallback: if the API fails, use last cached values and show a toast error

### 3. Update `src/hooks/usePortfolio.ts`
- Import `usePrices` to compute holdings values dynamically
- Keep mock balances (0.128567 sBTC, 2450.50 STX) but calculate USD values from live prices
- Compute `totalValue`, `change24h`, `changePercent24h` from real price data
- `lastUpdated` set to current time on each price refresh

### 4. Update `src/hooks/useSbtcBalance.ts`
- Import `usePrices` to derive `balanceUsd` and `changePercent24h` from live BTC price
- Keep mock balance amount (0.128567) but calculate USD value dynamically

### 5. Update `src/components/dashboard/PriceChart.tsx`
- Replace `generateChartData` with real data from `fetchMarketChart('bitcoin', days)`
- Map interval buttons to days: 1H=0.042 (1 hour), 24H=1, 7D=7, 30D=30
- Use actual timestamps for XAxis labels (format hours or dates depending on interval)
- Add loading state while chart data fetches
- Cache chart data per interval to avoid re-fetching on toggle

### 6. Error handling and UX
- Show a toast notification (via `sonner`) if the API call fails
- Display a subtle "Live" or "Offline" indicator near the price display
- If rate-limited (HTTP 429), back off and retry after 60 seconds

## Technical Notes

- No API key needed for CoinGecko's free tier (but limited to ~30 calls/minute)
- All fetches happen client-side (no edge function needed since this is a public API)
- No new dependencies required
- The `PriceData` type in `src/types/index.ts` stays unchanged
- `usePortfolio` and `useSbtcBalance` will accept `prices` as a parameter or import `usePrices` internally to avoid prop drilling

