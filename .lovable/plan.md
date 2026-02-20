

# Add Fallback Mock Data to Portfolio Value Chart

## Overview
When the CoinGecko API is unavailable or Demo Mode is active, the Portfolio Value chart will display realistic mock data instead of showing an error state. A "Demo Data" badge will indicate the data is simulated. In Demo Mode, values will jitter every 3 seconds to simulate live updates (matching the pattern in `usePrices`).

## How It Works
- Generate 60 mock portfolio data points spanning the selected interval (7D or 30D), using a realistic base value (~$9,200) with subtle random walk variation
- When Demo Mode is on: skip the API call entirely and use mock data, with a 3-second jitter interval
- When API fails: fall back to mock data instead of showing the "Service Unavailable" error
- A small "Demo Data" badge appears above the chart to indicate simulated data

## Changes

| File | Change |
|------|--------|
| `src/components/dashboard/PortfolioChart.tsx` | Add mock data generator, integrate `useDemoMode`, use fallback on API failure, add jitter effect and "Demo Data" badge |

## Technical Details

### `src/components/dashboard/PortfolioChart.tsx`

1. **Add `generateMockData(days)` function** -- creates 60 `PortfolioPoint` entries with timestamps spanning `days` back from now, values using a seeded random walk around $9,200

2. **Import and use `useDemoMode`** -- when `demoMode` is true, skip the API fetch and immediately set mock data

3. **Fallback on error** -- in the `catch` block, instead of only setting the error state, also call `setData(generateMockData(days))` so the chart always renders

4. **Track `isUsingMockData`** state -- boolean flag set to `true` when mock/fallback data is used, drives the "Demo Data" badge

5. **Add jitter effect** -- same pattern as `usePrices`: when `demoMode` is active, run a 3-second interval that applies +/-0.5% random jitter to each point's value

6. **"Demo Data" badge** -- render a small warning-styled badge (`border-warning/50 text-warning`) reading "Demo Data" when `isUsingMockData` is true, placed next to the gain/loss badge in the header
