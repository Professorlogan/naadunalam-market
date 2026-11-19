"use client";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { AnimatePresence, motion } from "motion/react";
import { Suspense, useCallback, useEffect, useId, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { ChevronDown, SearchX, SlidersHorizontal, X } from "lucide-react";
import ProductCard from "../ProductCard";
import { useFocusTrap } from "../motion/useFocusTrap";
import { categories, products as allProducts, stores } from "../../lib/data";
import type { Product } from "../../lib/types";
import {
  matches, NO_FILTERS, packsOf, packWeight, parseView, PRICE_BANDS, sortProducts, SORTS, VIEW_KEYS, viewQuery,
  type Filters, type SortKey, type View,
} from "./catalogue-utils";

const PAGE = 24;
/** Where the sticky filter panel sits below the header (Tailwind `top-36`). */
const SIDE_TOP = 144;
type ListKey = "cats" | "sellers" | "packs";
type Chip = { key: string; group: keyof Filters; label: string; clear: () => void };
type Props = { lockedCategory?: string; items?: Product[]; featuredLabel?: string };

/**
 * Shared product browser for shop, category and search pages.
 * `lockedCategory` scopes the list to one category; `items` scopes it to a given list (search results).
 * Filters and sort live in the query string (?cat=&seller=&pack=&price=&stock=&sort=), so a view can be
 * shared and survives back-navigation. The fallback is the same browser with nothing filtered, which is
 * what a statically rendered page carries in its HTML.
 */
export default function Catalogue(props: Props) {
  return (
    <Suspense fallback={<CatalogueView {...props} urlQuery="" />}>
      <UrlCatalogue {...props} />
    </Suspense>
  );
}

function UrlCatalogue(props: Props) {
  const params = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const urlQuery = viewQuery(parseView(params));
  const others = useMemo(() => {
    const rest = new URLSearchParams(params.toString());
    VIEW_KEYS.forEach((k) => rest.delete(k));
    return rest.toString();
  }, [params]);
  const write = useCallback((query: string) => {
    const qs = [others, query].filter(Boolean).join("&");
    router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
  }, [others, pathname, router]);
  return <CatalogueView {...props} urlQuery={urlQuery} onWrite={write} />;
}

function CatalogueView({ lockedCategory, items, featuredLabel = "Featured", urlQuery, onWrite }: Props & {
  urlQuery: string; onWrite?: (query: string) => void;
}) {
  const base = useMemo(
    () => (items ?? allProducts).filter((p) => !lockedCategory || p.categories.includes(lockedCategory)),
    [items, lockedCategory],
  );
  // On a category page the category is fixed, so a ?cat= in the URL is ignored.
  const read = useCallback((query: string): View => {
    const v = parseView(new URLSearchParams(query));
    return lockedCategory ? { ...v, filters: { ...v.filters, cats: [] } } : v;
  }, [lockedCategory]);

  const [view, setView] = useState<View>(() => read(urlQuery));
  const [shown, setShown] = useState(PAGE);
  const [drawer, setDrawer] = useState(false);
  const [mounted, setMounted] = useState(false);
  const trigger = useRef<HTMLButtonElement>(null);
  const panel = useRef<HTMLDivElement>(null);
  const side = useRef<HTMLDivElement>(null);
  const [sideFits, setSideFits] = useState(false);
  // `pending` is the query this component last asked the router for, until the address bar shows it.
  const [pending, setPending] = useState<string | null>(null);
  const [seenUrl, setSeenUrl] = useState(urlQuery);
  const { filters, sort } = view;

  const apply = useCallback((next: View) => {
    setView(next);
    setShown(PAGE);
    if (!onWrite) return;
    const query = viewQuery(next);
    // Nothing to wait for when the address bar already shows this view.
    if (query === seenUrl && pending === null) return;
    setPending(query);
    onWrite(query);
  }, [onWrite, seenUrl, pending]);

  // Follow the address bar when it changes from outside (back/forward, a link to the plain page),
  // but not while it is still catching up with a change made here.
  if (urlQuery !== seenUrl) {
    setSeenUrl(urlQuery);
    if (pending !== null) {
      if (pending === urlQuery) setPending(null);
    } else if (viewQuery(view) !== viewQuery(read(urlQuery))) {
      setView(read(urlQuery));
      setShown(PAGE);
    }
  }

  // eslint-disable-next-line react-hooks/set-state-in-effect -- the drawer is portalled, which needs the document
  useEffect(() => setMounted(true), []);

  // The desktop panel is always shown at its full height. It sticks below the header only while the whole
  // panel fits in the viewport; a taller panel scrolls with the page, so nothing is ever cut off.
  useEffect(() => {
    const el = side.current;
    if (!el || typeof ResizeObserver === "undefined") return;
    const measure = () => setSideFits(el.offsetHeight > 0 && el.offsetHeight <= window.innerHeight - SIDE_TOP - 16);
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    window.addEventListener("resize", measure);
    return () => { ro.disconnect(); window.removeEventListener("resize", measure); };
  }, []);

  const change = (next: Filters) => apply({ filters: next, sort });
  const toggle = (key: ListKey, value: string) =>
    change({ ...filters, [key]: filters[key].includes(value) ? filters[key].filter((v) => v !== value) : [...filters[key], value] });
  const changeSort = (s: SortKey) => apply({ filters, sort: s });
  const clearAll = () => change(NO_FILTERS);

  const results = useMemo(() => sortProducts(base.filter((p) => matches(p, filters)), sort, !items), [base, filters, sort, items]);
  const visible = results.slice(0, shown);
  const remaining = results.length - visible.length;

  // Facet counts answer "how many would I see if I ticked this?", so each group ignores its own selection.
  // `total` is the count with no filters at all: an option that can never match here is left out of the panel.
  const facets = useMemo(() => {
    const facet = (skip: keyof Filters, test: (p: Product) => boolean) => ({
      n: base.filter((p) => matches(p, filters, skip) && test(p)).length,
      total: base.filter(test).length,
    });
    const packs = [...new Set(base.flatMap(packsOf))].sort((a, b) => packWeight(a) - packWeight(b));
    return {
      cats: categories.map((c) => ({ id: c.slug, label: c.name, labelTa: c.nameTa, ...facet("cats", (p) => p.categories.includes(c.slug)) })),
      sellers: stores.map((s) => ({ id: s.slug, label: s.name, ...facet("sellers", (p) => p.vendor === s.slug) })),
      packs: packs.map((k) => ({ id: k, label: k, ...facet("packs", (p) => packsOf(p).includes(k)) })),
      prices: PRICE_BANDS.map((b) => ({ id: b.id, label: b.label, ...facet("price", (p) => p.price >= b.min && p.price < b.max) })),
      inStock: { ...facet("inStock", (p) => p.inStock), all: base.length },
    };
  }, [base, filters]);

  const chips: Chip[] = [
    ...filters.cats.map((id) => ({ key: `c-${id}`, group: "cats" as const, label: categories.find((c) => c.slug === id)?.name ?? id, clear: () => toggle("cats", id) })),
    ...filters.sellers.map((id) => ({ key: `s-${id}`, group: "sellers" as const, label: `Sold by ${stores.find((s) => s.slug === id)?.name ?? id}`, clear: () => toggle("sellers", id) })),
    ...filters.packs.map((id) => ({ key: `p-${id}`, group: "packs" as const, label: id, clear: () => toggle("packs", id) })),
    ...(filters.price ? [{ key: "price", group: "price" as const, label: PRICE_BANDS.find((b) => b.id === filters.price)?.label ?? "", clear: () => change({ ...filters, price: "" }) }] : []),
    ...(filters.inStock ? [{ key: "stock", group: "inStock" as const, label: "In stock only", clear: () => change({ ...filters, inStock: false }) }] : []),
  ];

  // The one pill row: categories, on the shop and search pages only. Inside a category there is none; every
  // other filter lives in the panel. The pills read and write the same filter state as the panel.
  const quick = useMemo((): { key: ListKey; label: string; options: Facet[] } | null => {
    if (lockedCategory) return null;
    const options = facets.cats.filter((o) => o.total > 0);
    return options.length > 1 ? { key: "cats", label: "category", options } : null;
  }, [facets, lockedCategory]);

  const closeDrawer = useCallback(() => setDrawer(false), []);
  // Keeps focus inside the open drawer, closes it on Escape and returns focus to the button that opened it.
  useFocusTrap(panel, drawer, closeDrawer);

  useEffect(() => {
    if (!drawer) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    // Close the drawer if the viewport grows into the desktop layout, where the sidebar takes over.
    const mq = window.matchMedia("(min-width: 1024px)");
    const onWide = () => mq.matches && setDrawer(false);
    mq.addEventListener("change", onWide);
    return () => {
      document.body.style.overflow = prev;
      mq.removeEventListener("change", onWide);
    };
  }, [drawer]);

  // The category group starts folded wherever the pill row already offers the same choice.
  const panelProps = { filters, facets, lockedCategory, toggle, change, catsOpen: !quick };
  const summary = results.length === 0
    ? "No products match"
    : `Showing ${visible.length} of ${results.length} ${results.length === 1 ? "product" : "products"}`;

  const pill = (on: boolean) =>
    `inline-flex min-h-11 shrink-0 items-center gap-1.5 rounded-full border px-4 text-sm font-semibold transition-colors duration-150 disabled:cursor-not-allowed disabled:opacity-45 lg:max-xl:px-3 lg:max-xl:text-[13px] ${on ? "border-leaf bg-leaf text-white" : "border-mist bg-white text-ink hover:border-leaf hover:text-leaf"}`;

  return (
    <div>
      {/* One row of category pills across the full width: it scrolls sideways on phones and tablets and wraps
          to no more than two lines on desktop (the counts drop out below 1280px to keep it to two). */}
      {quick && (
        <div role="group" aria-label={`Quick filter by ${quick.label}`}
          className="-mx-4 mb-4 flex gap-2 overflow-x-auto px-4 pb-1 [scrollbar-width:none] sm:-mx-6 sm:px-6 lg:mx-0 lg:mb-6 lg:flex-wrap lg:gap-1.5 lg:overflow-visible lg:px-0 lg:pb-0 xl:gap-2 [&::-webkit-scrollbar]:hidden">
          <button type="button" aria-pressed={filters[quick.key].length === 0} onClick={() => change({ ...filters, [quick.key]: [] })} className={pill(filters[quick.key].length === 0)}>All</button>
          {quick.options.map((o) => {
            const on = filters[quick.key].includes(o.id);
            return (
              <button key={o.id} type="button" aria-pressed={on} disabled={o.n === 0 && !on} onClick={() => toggle(quick.key, o.id)}
                aria-label={`${o.label}, ${o.n} ${o.n === 1 ? "product" : "products"}`} className={pill(on)}>
                {o.label}
                <span aria-hidden className={`font-normal tabular-nums lg:max-xl:hidden ${on ? "text-white/80" : "text-muted"}`}>{o.n}</span>
              </button>
            );
          })}
        </div>
      )}

    <div className="lg:grid lg:grid-cols-[15rem_minmax(0,1fr)] lg:items-start lg:gap-8">
      <aside aria-label="Filters" className={`hidden lg:block ${sideFits ? "sticky top-36" : ""}`}>
        <div ref={side} className="rounded-[1.5rem] bg-sky px-5 py-4">
          <div className="flex min-h-9 items-center justify-between">
            <h2 className="font-display text-lg font-bold text-forest-deep">Filters</h2>
            {chips.length > 0 && <button type="button" className="link text-sm" onClick={clearAll}>Clear all</button>}
          </div>
          <FilterPanel idPrefix="side" {...panelProps} />
        </div>
      </aside>

      <div className="min-w-0">
        <div className="flex flex-wrap items-center justify-between gap-x-3 gap-y-2">
          <p className="flex min-h-6 flex-wrap items-center gap-x-3 text-sm text-muted">
            <span role="status">{summary}</span>
            {chips.length > 0 && (
              <button type="button" className="link text-sm" onClick={clearAll}>
                Clear {chips.length} {chips.length === 1 ? "filter" : "filters"}
              </button>
            )}
          </p>
          {/* On phones and tablets the button and the sort select share one row, half each, both 44px tall. */}
          <div className="flex w-full items-center gap-2 sm:w-auto">
            <button ref={trigger} type="button" onClick={() => setDrawer(true)} aria-haspopup="dialog" aria-expanded={drawer}
              className="btn btn-ghost h-11 !min-h-11 min-w-0 flex-1 basis-0 whitespace-nowrap !rounded-full !px-3 !py-0 !text-sm sm:flex-none sm:basis-auto sm:!px-4 sm:!text-[15px] lg:hidden">
              <SlidersHorizontal size={17} aria-hidden className="shrink-0" /> Filter and sort
              {chips.length > 0 && (
                <span className="grid h-5 min-w-5 shrink-0 place-items-center rounded-full bg-leaf px-1 text-xs text-white">
                  <span className="sr-only">Active filters: </span>{chips.length}
                </span>
              )}
            </button>
            <label htmlFor="catalogue-sort" className="sr-only lg:not-sr-only lg:shrink-0 lg:text-sm lg:text-muted">Sort by</label>
            <select id="catalogue-sort" value={sort} onChange={(e) => changeSort(e.target.value as SortKey)}
              className="field h-11 !min-h-11 !w-auto min-w-0 flex-1 basis-0 !rounded-full !py-0 !pl-3.5 !pr-2 text-sm font-semibold sm:min-w-[12.5rem] sm:flex-none sm:basis-auto sm:!px-4 sm:text-[15px]">
              {SORTS.map((s) => <option key={s.id} value={s.id}>{s.id === "featured" ? featuredLabel : s.label}</option>)}
            </select>
          </div>
        </div>

        {results.length === 0 && (
          <div className="mt-5 rounded-[1.5rem] bg-butter p-6 sm:p-8">
            <span aria-hidden className="mb-4 grid h-12 w-12 place-items-center rounded-full bg-white text-forest"><SearchX size={24} /></span>
            <h2 className="font-display text-xl font-bold text-forest-deep">Nothing matches those filters</h2>
            <p className="mt-2 max-w-xl text-[15px] text-muted">
              Try removing a filter. Most products come in one pack size, so combining pack size, price and seller narrows things quickly.
            </p>
            <div className="mt-5 flex flex-wrap gap-3">
              <button type="button" className="btn btn-primary" onClick={clearAll}>Clear all filters</button>
              {(lockedCategory || items) && <Link href="/shop" className="btn btn-ghost">Shop all products</Link>}
            </div>
          </div>
        )}

        {/* Two columns on phones, three from 768px, four from 1280px beside the filter panel. */}
        {results.length > 0 && (
          <ul className="mt-4 grid grid-cols-2 gap-x-3 gap-y-8 md:grid-cols-3 md:gap-x-5 md:gap-y-10 xl:grid-cols-4">
            {visible.map((p, i) => <li key={p.id}><ProductCard product={p} priority={i < 4} /></li>)}
          </ul>
        )}

        {remaining > 0 && (
          <div className="mt-8 flex flex-col items-center gap-2">
            <button type="button" className="btn btn-ghost !rounded-full" onClick={() => setShown((n) => n + PAGE)}>
              Show {Math.min(PAGE, remaining)} more {Math.min(PAGE, remaining) === 1 ? "product" : "products"}
            </button>
            <p className="text-sm text-muted">{remaining} more to see</p>
          </div>
        )}
      </div>

      {mounted && createPortal(
        <AnimatePresence>
          {drawer && (
            <div key="drawer" className="fixed inset-0 z-50 lg:hidden" role="dialog" aria-modal="true" aria-labelledby="filter-drawer-title">
              <motion.button type="button" tabIndex={-1} aria-label="Close filters" className="absolute inset-0 bg-ink/50" onClick={closeDrawer}
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }} />
              <motion.div ref={panel} className="absolute inset-y-0 left-0 flex w-[min(23rem,100vw)] flex-col overflow-hidden rounded-r-[1.5rem] bg-sky shadow-[0_18px_40px_-22px_rgb(23_39_30/0.45)]"
                initial={{ x: "-100%" }} animate={{ x: 0 }} exit={{ x: "-100%" }} transition={{ duration: 0.25, ease: "easeOut" }}>
                <div className="flex items-center justify-between px-5 py-2.5">
                  <h2 id="filter-drawer-title" className="font-display text-lg font-bold text-forest-deep">Filter and sort</h2>
                  <button type="button" aria-label="Close filters" onClick={closeDrawer} className="grid h-11 w-11 place-items-center rounded-full bg-white text-forest transition-colors duration-150 hover:text-leaf"><X aria-hidden /></button>
                </div>
                <div className="flex-1 overflow-y-auto overscroll-contain px-5 pb-6">
                  <Group title="Sort by">
                    {SORTS.map((s) => {
                      const text = s.id === "featured" ? featuredLabel : s.label;
                      return (
                        <label key={s.id} className="flex min-h-11 cursor-pointer items-center gap-3 text-[15px]">
                          <input type="radio" name="drawer-sort" aria-label={`Sort by ${text}`} className="h-5 w-5 accent-leaf" checked={sort === s.id} onChange={() => changeSort(s.id)} />
                          <span>{text}</span>
                        </label>
                      );
                    })}
                  </Group>
                  <FilterPanel idPrefix="drawer" {...panelProps} />
                </div>
                <div className="flex gap-3 rounded-t-[1.25rem] bg-white px-5 py-3">
                  <button type="button" className="btn btn-ghost flex-1" disabled={chips.length === 0} onClick={clearAll}>Clear all</button>
                  <button type="button" className="btn btn-primary flex-[1.6]" onClick={closeDrawer}>
                    {results.length === 0 ? "No products match" : `Show ${results.length} ${results.length === 1 ? "product" : "products"}`}
                  </button>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>,
        document.body,
      )}
    </div>
    </div>
  );
}

type Facet = { id: string; label: string; labelTa?: string; n: number; total: number };

function FilterPanel({ idPrefix, filters, facets, lockedCategory, toggle, change, catsOpen }: {
  idPrefix: string; filters: Filters; lockedCategory?: string; catsOpen: boolean;
  facets: { cats: Facet[]; sellers: Facet[]; packs: Facet[]; prices: Facet[]; inStock: { n: number; total: number; all: number } };
  toggle: (key: ListKey, value: string) => void; change: (next: Filters) => void;
}) {
  const locked = lockedCategory ? categories.find((c) => c.slug === lockedCategory) : undefined;
  // Options with nothing to offer on this page (for example a seller with no honey) are hidden unless ticked.
  const live = (list: Facet[], picked: string[]) => list.filter((f) => f.total > 0 || picked.includes(f.id));
  const cats = live(facets.cats, filters.cats);
  const sellers = live(facets.sellers, filters.sellers);
  const packs = live(facets.packs, filters.packs);
  const prices = live(facets.prices, [filters.price]);
  // A group with a single option cannot narrow anything, so it is left out. "In stock only" is that kind of
  // group when everything here is in stock, or nothing is.
  const stockTotal = facets.inStock;
  const showCats = cats.length > 1 || filters.cats.length > 0;
  const showStock = filters.inStock || (stockTotal.total > 0 && stockTotal.total < stockTotal.all);
  const groups = [
    !locked && showCats, sellers.length > 1, packs.length > 1, prices.length > 1, showStock,
  ].filter(Boolean).length;
  let left = groups;
  const last = () => --left === 0;
  return (
    <div>
      {locked && (
        <div className={`my-2 rounded-[1.25rem] bg-white px-4 py-3 text-[15px] ${groups > 0 ? "mb-1" : ""}`}>
          <p className="text-sm text-muted">Category</p>
          <p className="mt-0.5 font-semibold leading-snug text-ink">
            {locked.name}
            {locked.nameTa && <span lang="ta" className="ta block text-[13px] font-normal text-muted">{locked.nameTa}</span>}
          </p>
          <Link href="/shop" className="link mt-1 inline-flex min-h-11 items-center text-sm">Shop all products</Link>
        </div>
      )}
      {!locked && showCats && (
        <Group title="Category" defaultOpen={catsOpen} last={last()}>
          {cats.map((c) => (
            <Row key={c.id} type="checkbox" checked={filters.cats.includes(c.id)} disabled={c.n === 0 && !filters.cats.includes(c.id)}
              onChange={() => toggle("cats", c.id)} label={c.label} labelTa={c.labelTa} n={c.n} />
          ))}
        </Group>
      )}
      {sellers.length > 1 && (
        <Group title="Seller" last={last()}>
          {sellers.map((s) => (
            <Row key={s.id} type="checkbox" checked={filters.sellers.includes(s.id)} disabled={s.n === 0 && !filters.sellers.includes(s.id)}
              onChange={() => toggle("sellers", s.id)} label={s.label} n={s.n} />
          ))}
        </Group>
      )}
      {packs.length > 1 && (
        <Group title="Pack size" last={last()}>
          {packs.map((k) => (
            <Row key={k.id} type="checkbox" checked={filters.packs.includes(k.id)} disabled={k.n === 0 && !filters.packs.includes(k.id)}
              onChange={() => toggle("packs", k.id)} label={k.label} n={k.n} />
          ))}
        </Group>
      )}
      {prices.length > 1 && (
        <Group title="Price" last={last()}>
          <Row type="radio" name={`${idPrefix}-price`} checked={filters.price === ""} onChange={() => change({ ...filters, price: "" })} label="Any price" />
          {prices.map((b) => (
            <Row key={b.id} type="radio" name={`${idPrefix}-price`} checked={filters.price === b.id} disabled={b.n === 0 && filters.price !== b.id}
              onChange={() => change({ ...filters, price: b.id })} label={b.label} n={b.n} />
          ))}
        </Group>
      )}
      {showStock && (
        <Group title="Availability" last={last()}>
          <Row type="checkbox" checked={filters.inStock} onChange={() => change({ ...filters, inStock: !filters.inStock })} label="In stock only" n={stockTotal.n} />
        </Group>
      )}
      {!locked && groups === 0 && <p className="py-2 text-sm text-muted">No filters apply to these products.</p>}
    </div>
  );
}

/** One filter group: a fieldset whose legend is a button that folds the options away. */
function Group({ title, children, last = false, defaultOpen = true }: {
  title: string; children: React.ReactNode; last?: boolean; defaultOpen?: boolean;
}) {
  const [open, setOpen] = useState(defaultOpen);
  const body = useId();
  return (
    <fieldset className={`min-w-0 py-1.5 ${last ? "" : "border-b border-white"}`}>
      <legend className="float-left w-full">
        <button type="button" aria-expanded={open} aria-controls={body} onClick={() => setOpen((v) => !v)}
          className="flex min-h-11 w-full items-center justify-between gap-3 rounded-lg text-left text-[15px] font-semibold text-forest-deep transition-colors duration-150 hover:text-leaf">
          {title}
          <ChevronDown size={17} aria-hidden className={`shrink-0 text-muted transition-transform duration-200 ${open ? "rotate-180" : ""}`} />
        </button>
      </legend>
      <div id={body} inert={!open}
        className={`clear-both grid transition-[grid-template-rows,opacity] duration-200 ease-out motion-reduce:transition-none ${open ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"}`}>
        <div className="-mx-1 min-h-0 overflow-hidden px-1"><div className="pb-1.5">{children}</div></div>
      </div>
    </fieldset>
  );
}

function Row({ type, name, checked, disabled = false, onChange, label, labelTa, n }: {
  type: "checkbox" | "radio"; name?: string; checked: boolean; disabled?: boolean; onChange: () => void;
  label: string; labelTa?: string; n?: number;
}) {
  // The accessible name is the option itself plus its count in words, rather than a bare trailing number.
  const accessibleName = n === undefined ? label : `${label}, ${n} ${n === 1 ? "product" : "products"}`;
  return (
    <label className={`flex min-h-11 items-center gap-3 rounded-lg py-1 text-[15px] transition-colors duration-150 ${disabled ? "text-muted" : "cursor-pointer hover:text-leaf"}`}>
      <input type={type} name={name} checked={checked} disabled={disabled} onChange={onChange} aria-label={accessibleName}
        className="h-[18px] w-[18px] shrink-0 accent-leaf" />
      <span className="min-w-0 flex-1 leading-snug">
        {label}
        {labelTa && <span lang="ta" className="ta block text-[13px] text-muted">{labelTa}</span>}
      </span>
      {n !== undefined && <span aria-hidden className="grid min-w-7 place-items-center rounded-full bg-white px-1.5 py-0.5 text-xs tabular-nums text-muted">{n}</span>}
    </label>
  );
}
