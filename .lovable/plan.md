

# Add Demo Mode Indicator Badge to Dashboard Header

## Overview
Add a small pulsing badge in the dashboard header bar that appears when Demo Mode is active, so users always know they're viewing simulated prices.

## Change

**`src/components/layout/DashboardLayout.tsx`**
- Import `useDemoMode` hook
- In the header, next to the network badge (Mainnet/Testnet), conditionally render a new badge when `demoMode` is true
- Badge style: warning-colored with a subtle pulse animation, text "Demo Mode", with a FlaskConical icon

The badge will sit between the network badge and the theme toggle button in the header's right-side controls.

