
# Portfolio Performance Chart

## Overview
Add a new "Portfolio Value" chart component below the existing sBTC Price chart on the Dashboard. It derives historical portfolio value by combining BTC and STX market chart data with the user's mock balances, then displays the total value over time with a gain/loss summary.

## How It Works
- Fetch BTC and STX historical market charts from CoinGecko (same `fetchMarketChart` already used)
- For each timestamp, compute: `(sBTC_balance * btc_price * 0.9995) + (STX_balance * stx_price)` using the mock balances
- Display an AreaChart with time interval selector (7D, 30D) -- shorter intervals (1H, 24H) are less meaningful for portfolio trend
- Show a summary header with current portfolio value, absolute gain/loss, and percentage change over the selected period
- Color the chart gradient green or red based on whether the portfolio gained or lost value

## Files Changed

| File | Change |
|------|--------|
| `src/components/dashboard/PortfolioChart.tsx` | New component: fetches BTC + STX chart data, computes portfolio values, renders AreaChart |
| `src/pages/Dashboard.tsx` | Import and render `PortfolioChart` between the PriceChart and Holdings sections |

## Technical Details

### `src/components/dashboard/PortfolioChart.tsx` (new)
- Imports `fetchMarketChart` from `@/lib/coingecko` and uses the same mock balances as `usePortfolio` (sBTC: 0.128567, STX: 2450.50)
- Supports two intervals: `7D` and `30D` (selectable via buttons)
- On mount / interval change:
  1. Fetch `fetchMarketChart('bitcoin', days)` and `fetchMarketChart('blockstack', days)` in parallel
  2. Merge the two datasets by aligning timestamps (use nearest-match since CoinGecko returns slightly different timestamps for each coin)
  3. For each aligned point, compute `portfolioValue = sBTC_balance * btcPrice * 0.9995 + STX_balance * stxPrice`
- Computes gain/loss: `startValue` (first point) vs `endValue` (last point), percentage = `((end - start) / start) * 100`
- Header shows: "Portfolio Value" title, absolute and percentage change badges (green/red)
- Chart: Recharts `AreaChart` with green gradient when positive, red when negative
- Tooltip shows: formatted USD value and date/time
- Loading state: Skeleton, Error state: reuses existing `ErrorState` component
- Downsamples to ~60 points for performance (same pattern as PriceChart)

### `src/pages/Dashboard.tsx` changes
- Import `PortfolioChart`
- Add a new `StaggerContainer > StaggerItem` block after the PriceChart section (line ~229) containing `<PortfolioChart />`
