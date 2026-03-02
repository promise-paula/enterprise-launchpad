

# Add Proper Navigation to Both Landing Page and Dashboard

## Problem
1. The landing page (`/`) header only has the logo, theme toggle, and "Connect Wallet" button -- no navigation links to Dashboard, History, Settings, etc.
2. The breadcrumb component exists in the dashboard layout but both areas need improvements for a complete navigation experience.

## Changes

### 1. Update Landing Page Header (`src/pages/Index.tsx`)

Add navigation links to the landing page's top fixed header, between the logo and the right-side buttons:

- Add nav links: **Dashboard**, **Features** (anchor to `#features`), **Docs** (external link)
- On mobile, these collapse or show as a compact set
- Style: `text-sm text-muted-foreground hover:text-foreground` to stay subtle and match the dark theme

**Updated header structure:**
```text
[ Logo: sBTC Tracker ]   [ Dashboard | Features | Docs ]   [ Theme Toggle ] [ Connect Wallet ]
```

- "Dashboard" links to `/dashboard`
- "Features" scrolls to `#features` section on the page
- "Docs" links externally to `https://docs.stacks.co`
- On small screens, only show the icon-based or abbreviated links to avoid crowding

### 2. Enhance Dashboard Header (`src/components/layout/DashboardLayout.tsx`)

Add the app name/logo text to the dashboard header so it feels like a proper navbar (currently only shows the logo icon on mobile and the sidebar trigger on desktop):

- Make the logo/brand area clickable, linking back to `/` (Home)
- Add a visible "sBTC Tracker" label on desktop next to the sidebar trigger so the header isn't mostly empty on the left side

### 3. Breadcrumb remains as-is

The `DashboardBreadcrumb` component is already correctly placed in the layout and renders the `Home > Dashboard > [Current Page]` trail. No changes needed there.

## Technical Details

**File: `src/pages/Index.tsx`** (lines 62-84)
- Insert a `<nav>` element between the logo `<div>` and the right-side button group
- Contains `<Link to="/dashboard">Dashboard</Link>`, `<a href="#features">Features</a>`, and an external docs link
- Hidden on very small screens (`hidden sm:flex`) to avoid crowding, since "Connect Wallet" already links to `/dashboard`

**File: `src/components/layout/DashboardLayout.tsx`** (lines 64-71)
- Wrap the existing mobile logo in a `<Link to="/">` so tapping it navigates home
- Add "sBTC Tracker" text visible on desktop (`hidden md:inline`) next to the sidebar trigger for brand presence

