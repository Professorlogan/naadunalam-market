"use client";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { ArrowRight, BadgeCheck, GitCompareArrows, X } from "lucide-react";
import { getCategory, getProductById, getStore } from "../../lib/data";
import { inr } from "../../lib/format";
import { COMPARE_MAX, useStore } from "../../lib/store";
import type { Product } from "../../lib/types";
import { EASE, Reveal } from "../motion";
import { emptyCard, IconDisc, per100, Skeleton, toolLink } from "./shared";

const rowHead = "sticky left-0 z-10 w-[84px] min-w-[84px] border-r border-mist bg-mint px-2 py-3 text-left align-top text-sm font-semibold text-forest-deep sm:w-40 sm:min-w-40 sm:px-4 sm:text-[15px]";
const cell = "px-2 py-3 align-top sm:px-4";
/** Columns fade and grow in, fade out when removed, and the remaining ones slide across to close the gap. */
const column = {
  layout: "position" as const,
  initial: { opacity: 0, scale: 0.92 },
  animate: { opacity: 1, scale: 1 },
  exit: { opacity: 0, scale: 0.92 },
  transition: { duration: 0.32, ease: EASE },
};

/** True while the element's content is wider than the element itself (so it scrolls sideways). */
function useOverflow<T extends HTMLElement>(dep: number) {
  const ref = useRef<T>(null);
  const [over, setOver] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const check = () => setOver(el.scrollWidth > el.clientWidth + 1);
    const ro = new ResizeObserver(check);
    ro.observe(el);
    if (el.firstElementChild) ro.observe(el.firstElementChild);
    return () => ro.disconnect();
  }, [dep]);
  return [ref, over] as const;
}

export default function CompareView() {
  const { ready, compare, toggleCompare, clearCompare, add } = useStore();
  // Re-attach the observer when the table first appears (ready) or the number of columns changes.
  const [scroller, overflows] = useOverflow<HTMLDivElement>(ready ? compare.length : -1);
  if (!ready) return <Skeleton rows={2} label="Loading your comparison" />;
  const items = compare.map(getProductById).filter((p): p is Product => Boolean(p));

  if (items.length === 0) {
    return (
      <section className="wrap pb-6 pt-10 sm:pb-8 sm:pt-14">
        <Reveal className={emptyCard}>
          <IconDisc icon={GitCompareArrows} tint="bg-aqua" className="mb-6" />
          <h2 className="t-h3 font-bold text-forest-deep">Nothing to compare yet</h2>
          <p className="mt-3 max-w-[52ch] text-muted">
            Every product card in the shop has a compare button, the one with two arrows{" "}
            <GitCompareArrows size={18} aria-hidden className="inline align-[-3px] text-forest" /> under the heart. Tap it on up to {COMPARE_MAX} products,
            then come back here to see price, pack size, unit price, seller and stock side by side.
          </p>
          <p className="mt-7"><Link href="/shop" className="btn btn-primary">Choose products to compare</Link></p>
        </Reveal>
      </section>
    );
  }

  // Best value: the lowest price per 100 g (or per 100 ml) among products measured the same way. Needs a real difference.
  const units = items.map((p) => ({ id: p.id, u: per100(p.price, p.pack) }));
  const best = new Set<number>();
  for (const per of ["100 g", "100 ml"]) {
    const same = units.filter((x) => x.u?.per === per);
    const values = same.map((x) => x.u!.value);
    const min = Math.min(...values);
    if (same.length > 1 && min < Math.max(...values)) same.filter((x) => x.u!.value === min).forEach((x) => best.add(x.id));
  }

  const rows: { label: string; render: (p: Product) => React.ReactNode }[] = [
    { label: "Price", render: (p) => <span className="whitespace-nowrap font-display text-xl font-bold text-forest-deep">{p.variants ? "From " : ""}{inr(p.price)}</span> },
    { label: "Pack", render: (p) => (p.variants ? p.variants.map((v) => v.pack).join(", ") : p.pack) },
    {
      label: "Unit price",
      render: (p) => {
        const u = per100(p.price, p.pack);
        if (!u) return <span className="text-muted">Not available</span>;
        return (
          <>
            <span className="font-semibold tabular-nums">{inr(u.value)}</span> <span className="block whitespace-nowrap text-sm text-muted sm:inline sm:text-base">per {u.per}</span>
            <AnimatePresence initial={false}>
              {best.has(p.id) && (
                <motion.span key="best" className="mt-1.5 flex w-fit items-center gap-1 whitespace-nowrap rounded-full bg-butter px-2.5 py-1 text-sm font-semibold text-ink"
                  initial={{ opacity: 0, scale: 0.5, y: 6 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.6 }} transition={{ type: "spring", stiffness: 420, damping: 18, delay: 0.25 }}>
                  <motion.span aria-hidden className="grid" animate={{ rotate: [0, -14, 12, 0] }} transition={{ duration: 0.7, delay: 0.55 }}><BadgeCheck size={16} /></motion.span>
                  Best value
                </motion.span>
              )}
            </AnimatePresence>
          </>
        );
      },
    },
    {
      label: "Category",
      render: (p) => p.categories.map((slug, i) => {
        const c = getCategory(slug);
        return c ? <span key={slug}>{i > 0 && ", "}<Link href={`/product-category/${c.slug}`} className="link -my-2.5 inline-block py-2.5">{c.name}</Link></span> : null;
      }),
    },
    {
      label: "Seller",
      render: (p) => {
        const s = getStore(p.vendor);
        return s ? <Link href={`/store/${s.slug}`} className="link -my-2.5 inline-block py-2.5">{s.name}</Link> : "Naadu Nalam";
      },
    },
    { label: "Stock", render: (p) => <span className={`font-semibold ${p.inStock ? "text-leaf" : "text-soil"}`}>{p.inStock ? "In stock" : "Sold out"}</span> },
    { label: "About", render: (p) => <span className="block text-[15px] leading-relaxed text-muted">{p.short}</span> },
  ];

  return (
    <section className="wrap pb-5 pt-8 sm:pb-6 sm:pt-12">
      <Reveal y={14} className="mb-5 flex flex-wrap items-center justify-between gap-3">
        <p className="text-muted">
          Comparing {items.length} of up to {COMPARE_MAX} products.
          {items.length === 1 && " Add at least one more from the shop to see them side by side."}
        </p>
        <div className="flex flex-wrap items-center gap-3">
          {items.length < COMPARE_MAX && <Link href="/shop" className="btn btn-primary">Add another product</Link>}
          <button type="button" className={toolLink} onClick={clearCompare}>Clear comparison</button>
        </div>
      </Reveal>
      {/* Shown at any width, whenever the table is wider than its frame. The line keeps its height so the table does not jump. */}
      <p id="compare-scroll-hint" aria-hidden={!overflows} className={`mb-2 flex min-h-6 items-center gap-1.5 text-sm text-muted transition-opacity duration-300 ${overflows ? "opacity-100" : "opacity-0"}`}>
        Swipe sideways to see every product.
        {overflows && (
          <motion.span key={items.length} aria-hidden className="grid text-forest" animate={{ x: [0, 8, 0, 8, 0] }} transition={{ duration: 1.6, ease: "easeInOut", delay: 0.6 }}><ArrowRight size={16} /></motion.span>
        )}
      </p>
      <motion.div ref={scroller} layoutScroll role="region" aria-label="Product comparison" aria-describedby={overflows ? "compare-scroll-hint" : undefined} tabIndex={0} className="overflow-x-auto rounded-[1.5rem] border border-mist bg-white"
        initial={{ opacity: 0, y: 22 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.55, ease: EASE, delay: 0.1 }}>
        {/* Fixed layout with equal product columns, so every image is the same size and the titles line up across columns. */}
        <table className="w-full min-w-[calc(84px+var(--n)*136px)] table-fixed border-collapse text-left sm:min-w-[calc(10rem+var(--n)*13rem)]" style={{ "--n": items.length } as React.CSSProperties}>
          <caption className="sr-only">Side by side comparison of {items.length} products</caption>
          <colgroup>
            <col className="w-[84px] sm:w-40" />
            {items.map((p) => <col key={p.id} />)}
          </colgroup>
          <thead>
            <tr className="border-b border-mist">
              <th scope="col" className={rowHead}><span className="sr-only">Detail</span></th>
              <AnimatePresence initial={false}>
              {items.map((p) => (
                <motion.th key={p.id} scope="col" className={`${cell} font-normal`} {...column}>
                  <div className="relative max-w-[180px]">
                    <Link href={`/product/${p.slug}`} className="block overflow-hidden rounded-xl">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={p.images[0]?.src} alt={p.images[0]?.alt ?? p.name} width={180} height={180} className="aspect-square w-full bg-sky object-cover transition-transform duration-300 hover:scale-105" />
                    </Link>
                    <button type="button" aria-label={`Remove ${p.name} from compare`} onClick={() => toggleCompare(p.id)}
                      className="absolute right-1.5 top-1.5 grid h-11 w-11 place-items-center rounded-full border border-mist bg-white text-forest shadow-sm transition-colors hover:bg-peach hover:text-soil">
                      <X size={18} />
                    </button>
                  </div>
                  <Link href={`/product/${p.slug}`} className="mt-3 block font-display text-base font-semibold leading-snug text-forest-deep hover:text-leaf sm:text-lg">{p.name}</Link>
                  {p.nameTa && <span lang="ta" className="ta block text-[15px] text-leaf">{p.nameTa}</span>}
                </motion.th>
              ))}
              </AnimatePresence>
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.label} className="border-b border-mist transition-colors duration-200 hover:bg-butter/50">
                <th scope="row" className={rowHead}>{r.label}</th>
                <AnimatePresence initial={false}>
                  {items.map((p) => <motion.td key={p.id} className={cell} {...column}>{r.render(p)}</motion.td>)}
                </AnimatePresence>
              </tr>
            ))}
            <tr>
              <th scope="row" className={rowHead}>Buy</th>
              <AnimatePresence initial={false}>
              {items.map((p) => (
                <motion.td key={p.id} className={cell} {...column}>
                  {p.variants ? (
                    <Link href={`/product/${p.slug}`} className="btn btn-ghost w-full !px-2 text-sm sm:!px-3 sm:text-[15px]">Choose pack</Link>
                  ) : (
                    <button type="button" disabled={!p.inStock} onClick={() => add(p.id)} aria-label={`Add ${p.name} to basket`} className="btn btn-primary w-full !px-2 text-sm sm:!px-3 sm:text-[15px]">
                      {p.inStock ? "Add to basket" : "Sold out"}
                    </button>
                  )}
                </motion.td>
              ))}
              </AnimatePresence>
            </tr>
          </tbody>
        </table>
      </motion.div>
    </section>
  );
}
