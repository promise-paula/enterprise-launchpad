

# Smooth Scroll, Active Nav State & Mobile Menu Test

## Changes

### 1. Smooth scroll for Features link (`src/pages/Index.tsx`)

Replace the `<a href="#features">` links (both desktop nav and mobile menu) with `onClick` handlers that call `document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' })` and prevent default. Also apply the same to the "Learn More" button. The `scroll-smooth` class on the container already helps, but explicit `scrollIntoView` is more reliable.

### 2. Active state highlight for nav links (`src/pages/Index.tsx`)

Add an `activeSection` state tracked via `IntersectionObserver`:
- Observe the hero section and `#features` section
- When hero is in view, no link is active (or "Home" concept)
- When `#features` is in view, highlight the "Features" link
- Active style: `text-foreground font-medium` instead of `text-muted-foreground`
- Apply to both desktop and mobile nav links

### 3. Mobile menu testing

Will be done during implementation via browser tools -- click hamburger, tap Dashboard, verify navigation to `/dashboard` and menu closure.

## Technical Details

**New state:** `const [activeSection, setActiveSection] = useState<string>('')`

**useEffect with IntersectionObserver:**
- Observe `#features` element
- On intersect → `setActiveSection('features')`, otherwise `setActiveSection('')`

**Smooth scroll helper:**
```ts
const scrollToFeatures = (e: React.MouseEvent) => {
  e.preventDefault();
  setMobileMenuOpen(false);
  document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' });
};
```

**Nav link className update (desktop, line 75):**
```
className={cn("text-sm transition-colors", activeSection === 'features' ? "text-foreground font-medium" : "text-muted-foreground hover:text-foreground")}
```

Same pattern for mobile menu link on line 112.

**Import `useEffect` and `cn`** (cn is already available from `@/lib/utils`).

