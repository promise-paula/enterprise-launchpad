

# Add Breadcrumb Navigation to Dashboard Pages

## Overview
Add a breadcrumb component below the header and above each page's title across all dashboard routes, using the existing `Breadcrumb` UI components already in the project.

## Approach
Create a reusable `DashboardBreadcrumb` component that reads the current route via `useLocation` and renders the appropriate breadcrumb trail. Place it in the `DashboardLayout` just above the `<Outlet />` so it appears on every dashboard page automatically.

## Route-to-Breadcrumb Mapping

| Route | Breadcrumb |
|-------|-----------|
| `/dashboard` | Home > **Dashboard** |
| `/dashboard/history` | Home > Dashboard > **Transaction History** |
| `/dashboard/notifications` | Home > Dashboard > **Notifications** |
| `/settings` | Home > **Settings** |

## Changes

### 1. New file: `src/components/layout/DashboardBreadcrumb.tsx`
- Uses `useLocation` to determine current path
- Maps routes to labels
- Uses the existing `Breadcrumb`, `BreadcrumbList`, `BreadcrumbItem`, `BreadcrumbLink`, `BreadcrumbSeparator`, `BreadcrumbPage` components from `src/components/ui/breadcrumb.tsx`
- "Home" links to `/`, "Dashboard" links to `/dashboard`, current page is bold plain text
- Separator uses `ChevronRight` (the default from the breadcrumb component, which renders as `>`)
- Styled with `text-sm text-muted-foreground` for subtle appearance

### 2. Edit: `src/components/layout/DashboardLayout.tsx`
- Import `DashboardBreadcrumb`
- Place `<DashboardBreadcrumb />` inside the `<main>` tag, just before `<Outlet />`, so it sits below the header and above each page's content

## Technical Details

The breadcrumb component will define a simple route map:

```text
/dashboard            -> "Dashboard"
/dashboard/history    -> "Transaction History"  
/dashboard/notifications -> "Notifications"
/settings             -> "Settings"
```

For sub-pages (history, notifications), "Dashboard" becomes a clickable link. For top-level pages (dashboard, settings), the page name is rendered as bold, non-clickable text. All links use `react-router-dom`'s `Link` component via the `asChild` pattern on `BreadcrumbLink`.

