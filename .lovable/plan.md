

# Fix PriceAlertsCard Mobile Layout

## Problem
The alert creation form uses `flex gap-2 flex-wrap`, causing inputs, selects, and the repeat toggle to wrap awkwardly at narrow widths -- elements break mid-row creating an inconsistent layout.

## Solution
Switch the form container to a vertical stack on mobile (`flex-col`) and horizontal on larger screens (`sm:flex-row`). Group related controls together so they stay paired.

## Changes

**`src/components/settings/PriceAlertsCard.tsx`** -- Creation form layout (around line 62):

1. Change the outer `<div className="flex gap-2 flex-wrap">` to `<div className="flex flex-col sm:flex-row sm:flex-wrap gap-2">`
2. Group the two `Select` components (symbol + direction) into a sub-row: `<div className="flex gap-2">` so they always sit side-by-side
3. Group the Repeat switch + Add button into a sub-row: `<div className="flex items-center gap-2 justify-between sm:justify-start">` so they share one line on mobile
4. The price `Input` stays full-width on mobile naturally since the parent is `flex-col`

**Result on mobile (vertical stack):**
```
[ BTC ▾ ] [ Above ▾ ]      <- paired selects
[ Price (USD)         ]     <- full-width input
[ Repeat 🔘 ]    [ Add ]   <- toggle + button
```

**Result on desktop (horizontal row):**
Same as current layout -- all items flow in one row with wrapping only at natural breakpoints.

No other files are changed.

