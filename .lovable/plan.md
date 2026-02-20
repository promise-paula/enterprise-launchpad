

# Smooth Page Transitions & Staggered Card Animations

## Overview
Add framer-motion to the project for polished route transition animations and staggered entrance animations on dashboard cards, giving the app a premium, enterprise-grade feel.

## 1. Install framer-motion
- Add `framer-motion` as a dependency

## 2. Page Transition Wrapper
- Create `src/components/layout/PageTransition.tsx` — a reusable wrapper using framer-motion's `motion.div` with fade + slight slide-up on enter, fade-out on exit
- Wrap the `<Outlet />` in `DashboardLayout.tsx` with `<AnimatePresence mode="wait">` keyed by `location.pathname` so route changes animate smoothly
- Wrap the landing page (`Index.tsx`) content similarly

## 3. Staggered Card Entrance on Dashboard
- Create `src/components/layout/StaggerContainer.tsx` and `StaggerItem.tsx` using framer-motion's `staggerChildren` variant pattern
- Wrap the stat cards grid in `Dashboard.tsx` with `StaggerContainer`, and each card with `StaggerItem` so they fade/slide in one after another with a ~0.08s stagger delay
- Apply the same stagger pattern to the Holdings and Recent Transactions sections

## 4. Micro-interaction Enhancements
- Replace the CSS `hover-lift` class on cards with framer-motion's `whileHover={{ y: -4, boxShadow: "..." }}` for smoother, GPU-accelerated hover animations
- Add subtle scale-on-tap (`whileTap={{ scale: 0.98 }}`) to interactive cards and buttons in the dashboard

## 5. Landing Page Polish
- Stagger the hero headline, subheadline, and CTA button entrance
- Stagger the feature cards grid entrance as the user scrolls or on mount

## Technical Details

**Files to create:**
- `src/components/layout/PageTransition.tsx` — motion wrapper with enter/exit variants
- `src/components/layout/StaggerContainer.tsx` — parent container with staggerChildren orchestration
- `src/components/layout/StaggerItem.tsx` — child item with individual animation variants

**Files to modify:**
- `src/components/layout/DashboardLayout.tsx` — add AnimatePresence around Outlet, keyed by location
- `src/pages/Dashboard.tsx` — wrap card grids and sections with StaggerContainer/StaggerItem
- `src/pages/Index.tsx` — add staggered entrance to hero and feature sections
- `src/index.css` — remove the CSS-based `animate-fade-in` and `animate-slide-up` usages that will be replaced by framer-motion equivalents (keep the keyframes for non-framer usage)

**Animation specs:**
- Page transition: 0.3s ease-out, fade + translateY(12px -> 0)
- Card stagger: 0.08s delay between items, 0.4s duration each
- Hover lift: translateY(-4px) over 0.2s
- Exit: 0.2s fade-out

