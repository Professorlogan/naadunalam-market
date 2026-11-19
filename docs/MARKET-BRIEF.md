# Market Colours restyle — brief for every agent

Project: `/home/claude/market` — a Next.js 16 front-end prototype of the Naadu Nalam marketplace (Tamil Nadu,
multi-seller, traditional rice/millets/pulses/oils/sweeteners). Data and logic already work. We are giving the
whole site a new look inspired by thaiman.in: bright, colourful, photo-led, soft pastel colour blocks, big rounded
cards. Read `docs/BUILD-BRIEF.md` too for the original rules (data helpers, store, one H1, a11y).

## Already done (read, do NOT edit)
`src/app/globals.css`, `src/app/layout.tsx`, `src/app/page.tsx`, `src/components/Header.tsx`,
`src/components/ProductCard.tsx`, `src/components/ProductGrid.tsx`, `src/components/PageHero.tsx`,
`src/components/market/*` (homepage), `src/lib/*`. Look at them for the style: `PageHero` (pastel rounded banner),
`ProductCard` (white rounded card, round green cart button), `components/market/FeatureBand.tsx`, `TrustRow.tsx`.
If a shared file needs a change, say so in your final report instead of editing it.

## The look
- Page background white. Tailwind colours available: `forest` #1B5338 (primary text/buttons), `forest-deep`,
  `leaf` #0F804A (accent, active states, cart buttons), `water`, `sun`, `soil`, `ink`, `muted`, `mist` (borders),
  `sky` (light grey-green surface) and the NEW pastel tints: `mint`, `butter`, `peach`, `aqua`, `clay`.
- Containers and panels: `rounded-[1.25rem]`–`rounded-[2rem]`, `border border-mist bg-white`, or a pastel tint
  background (`bg-mint`, `bg-butter`…) for emphasis blocks, side panels, summaries, filters, callouts.
  Alternate tints between sections; never the same tint twice in a row.
- Replace dark heavy bands (`bg-forest`, `bg-soil-deep`, `bg-forest-deep` full-width blocks) with pastel tint blocks
  inside `.wrap` with rounded corners. Dark green only for small things (primary buttons, active pills).
- Pills/tabs/filters: rounded-full; active = `bg-leaf text-white`; inactive = `border border-mist` + hover `text-leaf`.
- Small uppercase eyebrow labels are OK in this design (`text-xs/sm font-bold uppercase tracking-[0.14em] text-leaf`)
  above section headings — use sparingly.
- Headings: font-display (Catamaran), bold, `text-forest-deep`. Body `text-ink/75` or `text-muted`.
- Photos big with rounded-2xl corners. Hover: gentle `-translate-y-1` + soft shadow
  `hover:shadow-[0_18px_40px_-22px_rgb(23_39_30/0.45)]`.
- Icons in round pastel discs (`grid h-12 w-12 place-items-center rounded-full bg-mint text-forest`).
- Keep all motion components, functionality, forms, validation, ids, aria, links and copy exactly as they are,
  except the wording rule below.

## Wording rule (client instruction)
Do not use the words "organic", "fresh", "freshly" anywhere in visible text, alt text, metadata or titles in the
files you own. Rephrase naturally ("traditional", "natural", "farm", "newly harvested", "wood-pressed"…).

## Rules
- Edit ONLY the files listed in your assignment (and new files in your own folder if needed).
- Do NOT run `npm run build`, `next dev`, `npm install` (others share this folder). Check with
  `cd /home/claude/market && npx tsc --noEmit` and `npx eslint <your files>` — zero errors for your files.
- Final report under 200 words: what changed, anything not done, any shared-file change you need.
