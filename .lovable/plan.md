
# Full Transaction History Page

## Overview
Replace the placeholder "Coming Soon" page with a fully functional Transaction History page featuring type filters, date range picker, search, pagination, and CSV export.

## Features

### Filter Bar
- **Type filter**: Toggle buttons for All / Send / Receive / Swap with transaction-type icons and color coding
- **Date range picker**: Two date pickers (From / To) using the existing Shadcn Calendar + Popover components with `date-fns` formatting
- **Search**: Text input to search by address or transaction hash (debounced, case-insensitive)
- **Clear filters**: Button to reset all filters at once

### Transaction Table
- Desktop: Full table with columns -- Type, Token, Amount, Value (USD), From/To, Date, Status, Tx Hash (linked)
- Mobile: Compact card layout (reusing the pattern from Dashboard's recent transactions)
- Empty state when no transactions match the current filters

### Pagination
- 5 transactions per page using the existing Shadcn Pagination component
- Page numbers with Previous/Next navigation
- "Showing X-Y of Z transactions" summary text

### CSV Export
- "Export CSV" button in the header that downloads all filtered transactions as a `.csv` file

### Animations
- Page wrapped in `PageTransition` for route animation
- Filter bar and table wrapped in `StaggerContainer` / `StaggerItem` for entrance animations

## More Mock Data
- Expand `useTransactions` from 8 to ~20 mock transactions to make pagination and filtering meaningful, adding variety in types, tokens, dates, and statuses

## Technical Details

**Files to modify:**
- `src/hooks/useTransactions.ts` -- add ~12 more mock transactions spanning several days
- `src/pages/TransactionHistory.tsx` -- full rewrite with filter state, search, pagination logic, table, mobile cards, CSV export

**No new dependencies needed.** Uses existing: `date-fns`, Shadcn Calendar/Popover/Select/Input/Table/Pagination/Badge/Button, `lucide-react` icons, framer-motion wrappers.

**Filter logic** (all client-side):
1. Filter by type (if not "all")
2. Filter by date range (if dates selected)
3. Filter by search query (match against `from`, `to`, `txHash` fields)
4. Paginate the resulting array (5 per page)

**CSV export**: Generate CSV string from filtered transactions, create a Blob, and trigger download via a temporary anchor element.
