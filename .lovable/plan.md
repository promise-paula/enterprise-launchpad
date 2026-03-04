

# Fix: Mobile Menu Smooth Scroll Timing

## Problem
On mobile, clicking "Features" in the hamburger menu closes the menu but doesn't scroll to the Features section. The `scrollIntoView` call fires simultaneously with the menu closing animation (`AnimatePresence`), causing the scroll to be lost.

## Fix

**File: `src/pages/Index.tsx`** (line 75-79)

Delay the `scrollIntoView` call by ~300ms using `setTimeout` so the menu exit animation completes first:

```ts
const scrollToFeatures = (e: React.MouseEvent) => {
  e.preventDefault();
  setMobileMenuOpen(false);
  setTimeout(() => {
    document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' });
  }, 300);
};
```

This is a single-line change wrapping the existing `scrollIntoView` in a `setTimeout`. Desktop behavior remains unaffected since the menu isn't open on desktop.

## Verification
- Desktop: smooth scroll and active state highlight -- already confirmed working
- Mobile: menu closure -- confirmed working; smooth scroll needs the timing fix above
