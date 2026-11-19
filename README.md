# Naadu Nalam — Next.js storefront (front-end prototype)

A rebuild of https://naadunalam.fastfilings.in/ in Next.js 16 (React 19, Tailwind 4) with a redesigned UI.
Content is a snapshot of the live site taken on 18 Nov 2026: 82 products, 12 categories, 2 sellers, 8 blog posts,
4 policies and every live page (139 pages in all).

This is a prototype: the basket, wishlist, compare list and orders are kept in the visitor's browser.
No order, message, sign-in or seller application is sent anywhere.

## Run it

Needs Node.js 20 or newer.

    npm install
    npm run dev        # http://localhost:3000

On Windows you can double-click `start-preview.bat` instead.

    npm run build && npm start        # production build
    NN_EXPORT=1 npm run build         # static copy of the whole site in ./out

## Where things are

- `src/app/` — one folder per page; URLs match the live site (`/shop`, `/product/<slug>`,
  `/product-category/<slug>`, `/store/<slug>`, blog posts at the root, and so on).
- `src/components/` — shared pieces (header, footer, product card, basket drawer); page-specific pieces in subfolders.
- `src/lib/data.ts` — data access and the `site` constants (phone, email, delivery line). Change a fact once here.
- `src/lib/store.tsx` — basket, wishlist, compare and orders (localStorage).
- `src/data/*.json` — the content snapshot. `public/img/` — images.
- `src/app/globals.css` — design tokens. The palette is taken from the logo's five elements
  (leaf, soil, water, sun, sky).
- `scripts/build-data.py` — rebuilds `src/data` and `public/img` from a fresh capture of the live site's public API.
- `docs/BUILD-BRIEF.md` — design rules and conventions used for the build.

## To make it a real shop

Replace `src/lib/data.ts` and `src/lib/store.tsx` with calls to the shop backend (products, basket, checkout,
accounts, seller registration), and connect the contact, newsletter and seller forms.
