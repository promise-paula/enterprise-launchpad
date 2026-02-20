

# sBTC Portfolio Tracker — Phase 1: Core UI & Design System

## Overview
Build the foundational UI for a production-grade sBTC portfolio tracker with a polished design system, landing page, and dashboard layout — all powered by realistic mock data, ready for live API integration later.

---

## 1. Design System Setup
- **Custom color palette**: Stacks Purple (#5546FF) as primary, Bitcoin Orange (#F7931A) as accent, plus success/warning/destructive colors per PRD spec
- **Typography**: Inter font for headings/body, JetBrains Mono for addresses and numbers
- **Dark/Light theme**: Full theme toggle with CSS variables matching the PRD's light and dark palettes
- **Custom component variants**: Glass cards, gradient cards, interactive hover-lift cards, stat cards with change indicators (green/red badges)
- **Animation system**: Fade-in, slide-up, shimmer skeletons, hover effects, and subtle micro-interactions

## 2. Landing Page
- **Hero section** with headline "Track Your sBTC Portfolio", subheadline, and prominent "Connect Wallet" CTA with a subtle pulse glow animation
- **Features grid** showcasing Portfolio Analytics, DeFi Positions, and Multi-Wallet Support with icons and descriptions
- **Live stats section** displaying BTC and STX prices (mock data) — visible even without wallet connection
- **Footer** with copyright, doc/GitHub/Twitter links, and version number
- Background: subtle purple-to-orange gradient at low opacity

## 3. Dashboard Layout & Navigation
- **Fixed header** (64px) with logo, theme toggle, network badge (Mainnet/Testnet), and wallet status indicator
- **Collapsible sidebar** (240px expanded / 64px collapsed) for desktop navigation
- **Mobile-responsive layout**: Bottom navigation or hamburger menu on small screens
- **Route structure**: `/` (landing), `/dashboard` (main view), `/dashboard/history` (transactions), `/settings`

## 4. Portfolio Dashboard (Mock Data)
- **Portfolio Value Hero Card**: Large dollar amount, 24h change ($ and %), last updated timestamp
- **sBTC Balance Card**: Balance displayed with 8-decimal precision, USD value, 24h change badge
- **BTC & STX Price Cards**: Current price, 24h change percentage, mini sparkline charts
- **Price Chart**: Interactive line chart (Recharts) with 1H/24H/7D/30D time interval selector, gradient fill, and tooltips
- **Holdings Table**: Sortable columns (Token, Balance, Value, 24h Change), token icons, mobile card-view fallback
- **Recent Transactions**: Last 10 transactions with type icons (↑ sent, ↓ received, ↔ swap), relative timestamps, status badges (Pending/Confirmed), and "View All" link
- **Loading skeletons** for every component with shimmer animation

## 5. Mock Data & Placeholder Hooks
- Create mock hooks (`useWallet`, `usePrices`, `useSbtcBalance`, `usePortfolio`, `useTransactions`) matching the PRD's TypeScript interfaces exactly
- Include sample data from the PRD appendix (portfolio value $12,500, BTC at $97,200, etc.)
- Simulate loading states (300ms minimum display) and configurable error states
- Utility formatters: `formatUsd`, `formatTokenAmount`, `truncateAddress`, `formatRelativeTime`

## 6. Settings Page
- **Appearance**: Theme toggle (Light/Dark/System)
- **Network**: Mainnet/Testnet selector
- **Wallet**: Connected address display with copy button, disconnect button
- All preferences persisted in localStorage

## 7. Error & Empty States
- **Empty states** for no balance ("No sBTC yet" + Get sBTC link), no transactions, new wallet welcome
- **Error states** with user-friendly messages, retry buttons, and appropriate icons
- **Offline banner** when connection is lost, showing cached data

## 8. Accessibility & Polish
- WCAG 2.1 AA compliance: proper ARIA labels, keyboard navigation, focus indicators
- Screen reader live regions for value updates and errors
- Skip-to-content link, logical tab order
- 44px minimum touch targets on mobile
- Semantic HTML structure with proper heading hierarchy

---

## What's Next (Future Phases)
After this foundation is solid, we can layer on:
- **Phase 2**: Live API integration (CoinGecko prices, Stacks/Hiro blockchain data, wallet connection via @stacks/connect)
- **Phase 3**: Transaction History page with filters, search, pagination, CSV export
- **Phase 4**: DeFi Position Tracking (ALEX, Zest, BitFlow, StackingDAO)
- **Phase 5**: Multi-wallet watch mode, portfolio analytics, alerts

