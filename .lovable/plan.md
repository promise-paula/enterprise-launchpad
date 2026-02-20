
# Phase 7: Micro-interactions and Polish

## Overview
Add three micro-interaction effects to enhance the dashboard UX: price flash animations when values change, animated count-up for the portfolio total value, and slide-in animations for transaction rows.

---

## 1. Price Flash Animation

**What it does:** When BTC/STX/sBTC prices update (every 30s poll), the price text briefly flashes green (price went up) or red (price went down) for ~600ms.

**Implementation:**
- Create a new hook `src/hooks/usePriceFlash.ts` that compares old vs new price values using `useRef` to track previous prices
- Returns a CSS class name (`flash-green`, `flash-red`, or empty) per symbol
- Add `@keyframes flash-green` and `@keyframes flash-red` to `src/index.css` -- a quick background-color highlight that fades out
- Apply the flash class to the price `<p>` elements in `src/pages/Dashboard.tsx` for the BTC, STX, and sBTC stat cards

**New file:** `src/hooks/usePriceFlash.ts`
- Accepts current prices array
- Stores previous prices in a `useRef`
- On each render where prices differ, sets flash direction per symbol
- Auto-clears flash class after 600ms via `setTimeout`

**CSS additions to `src/index.css`:**
```css
@keyframes flashGreen {
  0% { background-color: hsl(142 76% 36% / 0.3); }
  100% { background-color: transparent; }
}
@keyframes flashRed {
  0% { background-color: hsl(0 84% 60% / 0.3); }
  100% { background-color: transparent; }
}
.flash-green { animation: flashGreen 0.6s ease-out; }
.flash-red { animation: flashRed 0.6s ease-out; }
```

**Dashboard changes:** Apply flash class to the price value `<p>` tags for BTC, STX stat cards and sBTC balance card.

---

## 2. Balance Count-up Effect

**What it does:** When the portfolio total value changes (e.g., from $12,450 to $12,520), the number animates smoothly from old value to new value over ~500ms.

**Implementation:**
- Create a new component `src/components/AnimatedNumber.tsx`
- Uses `useRef` to store previous value, `useState` for displayed value, and `requestAnimationFrame` to interpolate
- Accepts `value`, `duration` (default 500ms), and `formatter` function props
- Eases with a simple ease-out curve

**Dashboard changes:** Replace the static `{formatUsd(portfolio.totalValue)}` in the Portfolio Value card with `<AnimatedNumber value={portfolio.totalValue} formatter={formatUsd} />`

---

## 3. Transaction Slide-in Animation

**What it does:** Each transaction row in the "Recent Transactions" list enters with a staggered slide-up animation when the list first renders.

**Implementation:**
- Use framer-motion's `motion.div` with `variants` on each transaction row in `src/pages/Dashboard.tsx`
- Define item variants: `hidden: { opacity: 0, y: 20 }` and `visible: { opacity: 1, y: 0 }`
- Wrap the transaction list in a framer-motion container with `staggerChildren: 0.05`
- This leverages the existing `framer-motion` dependency already in the project

**Dashboard changes:** Wrap the transactions `.space-y-2` div in `motion.div` with stagger container variants, and wrap each transaction row in `motion.div` with item variants.

---

## Files Changed

| File | Change |
|------|--------|
| `src/hooks/usePriceFlash.ts` | New hook for detecting price direction changes |
| `src/components/AnimatedNumber.tsx` | New component for count-up number animation |
| `src/index.css` | Add `flash-green` and `flash-red` keyframe animations |
| `src/pages/Dashboard.tsx` | Integrate all three effects: flash classes on prices, AnimatedNumber on portfolio value, motion.div on transactions |

## Technical Notes
- The `usePriceFlash` hook uses a `key` state that increments to force re-triggering CSS animations even when the same direction flash occurs twice consecutively
- `AnimatedNumber` cleans up `requestAnimationFrame` on unmount to prevent memory leaks
- Transaction slide-in only runs on initial mount (not on re-renders) since `initial="hidden"` only fires once
- All animations respect the existing design system colors (success/destructive HSL values)
