# Motion and interaction brief (read fully before editing)

Goal: every page of this Next.js 16 site should feel alive and high-quality — rich, smooth motion and interaction —
without hurting usability. The client asked explicitly for "high quality motion, interactive website, each page".

## Already done (do NOT redo or edit these shared files)
`src/components/motion/index.tsx` (the kit), `motion/useFocusTrap.ts`, `src/app/template.tsx` (page transition),
`layout.tsx`, `globals.css`, `Header`, `CartDrawer`, `Footer`, `PageHero` (animated title, strip, floating leaves),
`SectionHeading` (reveals itself), `ProductCard` (hover lift, add feedback), `ProductGrid` (stagger + layout animation),
everything in `src/components/home/` and `src/app/page.tsx`, `src/lib/*`.
If a shared file needs a change, say so in your report instead of editing it.

## The kit — import from "<relative>/components/motion"
All are client components that accept server-rendered children, so server pages can use them directly.
- `<Reveal as? delay? y? x? scale? className>` — fade + lift on scroll into view (once).
- `<Stagger as? gap? delay? className>` with `<StaggerItem as? y? className>` children — staggered entrance for
  grids/lists (`as="ul"` + `as="li"` for lists; `as="dl"` etc.). Tags allowed: div, section, ul, ol, li, dl, p, span, article, header.
- `<SplitWords text delay? inView? />` — heading words rise from a mask (use inside an h2 with `inView`).
- `<CountUp to prefix? suffix? />` — number counts up in view (real numbers only: product counts, prices, steps).
- `<Parallax amount?>` — content drifts while crossing the screen (images).
- `<Tilt max?>` — card leans toward the mouse (feature tiles, big images; not for dense lists).
- `<Lift as?>` — hover lift + tap press for whole-card links.
- `<DrawStrip className />` — five-colour strip that draws in.
- `<Marquee seconds?>` — endless ticker.
- CSS classes: `nn-float` (slow bob), `nn-pulse-ring`, `nn-flow` (svg dash flow), `.btn` already has press + shine.
For custom needs import from `"motion/react"` (`motion`, `AnimatePresence`, `useScroll`, `useTransform`, `useSpring`,
`layout`/`layoutId`) inside your own `"use client"` components. `useFocusTrap(ref, open, onEscape)` for any dialog/drawer.

## What "high quality" means here
- Every section of every page enters with motion (Reveal / Stagger); headings of key sections may use SplitWords.
- Every interactive thing answers the user: hover and press states, animated open/close (accordions, drawers, filter
  panels, tabs with a sliding `layoutId` indicator), list items that animate in/out (`AnimatePresence`), numbers that
  count, validation messages that slide in, success states that animate (e.g. a drawn check mark).
- Give each page ONE signature moment suited to its content (examples in your assignment), not ten competing ones.
- Animate only `transform` and `opacity` (plus `layout`). Durations 0.2–0.8s, ease `[0.22, 1, 0.36, 1]` or springs.
  No scroll-jacking, no motion that delays reading or blocks clicks, nothing looping near body text.
  Do not hide content from users without JS beyond the kit's own initial states.
- Reduced motion is handled globally (MotionConfig + CSS) — do not disable it.
- Keep all existing content, links, forms, validation, accessibility attributes, ids and behaviour exactly as they are.
  Exactly one `<h1>` per page. Server pages stay server components (they export `metadata`); put new interactivity
  in small client components in your own folder. Tailwind v4 `translate-*`/`scale-*` utilities use the separate CSS
  `translate`/`scale` properties, so they combine fine with motion transforms.
- Also fix the audit items listed in your assignment while you are in those files.

## Rules
- Edit ONLY the files in your assignment. Do NOT run `npm run build`, `next dev` or `npm install`.
- Verify with `npx tsc --noEmit` and `npx eslint <your files>` (0 errors). Design tokens and conventions: `docs/BUILD-BRIEF.md`.
- Final report (under 250 words): what motion each page got, audit items fixed, anything not done.
