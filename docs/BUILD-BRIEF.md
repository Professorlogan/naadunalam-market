# Naadu Nalam rebuild — build brief for every contributor

Rebuild of https://naadunalam.fastfilings.in/ (Tamil Nadu organic multi-vendor marketplace) as a Next.js 16 App Router
front-end prototype with improved UI/UX. Snapshot data, in-browser basket. No backend.

## Hard rules
- Work ONLY on the files assigned to you. Never edit: `src/lib/*`, `src/app/layout.tsx`, `src/app/globals.css`,
  `next.config.ts`, `package.json`, or anything directly in `src/components/` (shared). Put your own new
  components in `src/components/<your-area>/`. If a shared file truly needs a change, say so in your final report.
- Do NOT run `npm run build`, `next dev`, or `npm install` (other agents share this folder). To check your work run
  `npx tsc --noEmit` and `npx eslint <your files>`; both must be clean for your files.
- Next 16: dynamic route `params`/`searchParams` are Promises (`const { slug } = await params`). Every dynamic route
  needs `generateStaticParams` (the site is statically exported) and `export const dynamicParams = false`.
  `useSearchParams` must sit inside `<Suspense>`. Pages are Server Components unless they need state; put
  interactivity in small `"use client"` components.
- Each page exports `metadata` (title + a real description) and has exactly ONE `<h1>` (use `PageHero`, or your own hero).
- Images: plain `<img>` with width/height, meaningful `alt` (or `alt=""` if decorative), `loading="lazy"` below the fold.
  All images live in `public/img/` (list it). Never hotlink the live site.
- Internal links use `next/link`. No `href="#"` dead links. No fake social links. No lorem ipsum, no invented facts
  (no invented reviews, FSSAI/GST numbers, addresses, statistics). Keep the live site's real copy; you may tighten it.
- Forms are prototypes: `preventDefault`, validate, then show an on-page confirmation. No alert()/confirm().

## Content source (the live site, captured today)
- `/home/claude/capture/page-<slug>.txt` — text outline of every live page (`<h1>`, `<p>`, `[img …]`, `{a:…}` links).
- `/home/claude/capture/home.txt` — the live home page incl. header/footer.
- Data: `src/lib/data.ts` exports `products` (82), `categories` (12), `stores` (2), `posts` (8), `policies` (4),
  `collaborators` (5), `site` (phone, WhatsApp, email, delivery line…), plus getters. Types in `src/lib/types.ts`.
  Product names are split: `name` (English) and `nameTa` (Tamil) — always show both, Tamil with `lang="ta"` and class `ta`.
- Basket/wishlist/compare/orders: `useStore()` from `src/lib/store.tsx` (client only; check `ready` before
  rendering saved state to avoid hydration mismatch). `lineInfo(line)` resolves a basket line.

## Design system (already in `globals.css`)
Palette comes from the logo's five elements of nature. Tailwind colour names:
`forest` #1B5338 (primary), `forest-deep`, `leaf` #0F804A, `water` #0C8FC7 / `water-deep` (links, info),
`sun` #F9B52C (highlight, key CTA on dark), `soil` #6B3A2C / `soil-deep` (earthy bands, footer), `sky` (page bg),
`mist` (borders), `ink` (text), `muted`. White cards on `sky`.
- Type: headings `font-display` (Anek Tamil, bold, tight), body Anek Tamil. Both cover Tamil.
- Classes: `.wrap` (page container), `.btn` + `.btn-primary|.btn-sun|.btn-ghost|.btn-light`, `.field`, `.label`,
  `.card`, `.link`, `.prose-nn` (long text). Shadow: `shadow-lift`.
- Shared components (read them first): `PageHero`, `SectionHeading`, `Breadcrumbs`, `ProductCard`, `ProductGrid`,
  `Prose`, `QtyStepper`, `ElementStrip` (five-colour band, the site's signature divider — use sparingly),
  `NewsletterForm`. Icons: `lucide-react`.
- Section rhythm: `<section className="wrap py-12 sm:py-16">`. Alternate `sky` background with full-width white
  or `forest`/`soil-deep` bands for emphasis.

## Design direction
Rooted, warm, confident — a Tamil Nadu farm marketplace, not a SaaS template. Left-aligned layouts, big bilingual
headings, real product photography large. Avoid: all-caps eyebrow labels above every heading, "01/02/03" numbering
unless it is a real sequence, identical card grids everywhere, gradient washes, arrows appended to links, a single
accent-coloured word in headlines, fade-in-on-scroll animations. Vary layouts between sections (split image/text,
bands, lists with leaf markers, large numerals only for true step sequences).
Responsive from 360px up; the desktop nav appears at 768px, so tablet must look designed, not stretched-phone.
Touch targets ≥ 44px. Visible focus is global. Sentence case in copy. Buttons say what they do.

## UX fixes this rebuild must carry (from the Nov 2026 audit)
- "Become a seller" goes to `/vendor-login` (not `/my-account`).
- Category pages have their own H1 + intro (not "Shop All Organic Products").
- Compare actually works (store has `compare`, max 4).
- One delivery statement everywhere: `site.deliveryLine`.
- Sticky add-to-basket on mobile product pages; sort + filter usable on mobile.
- No testimonials invented: the live site honestly says no reviews yet — keep that honesty.

## Final report
List the routes/files you created, anything you could not do, and any shared-file change you need.
