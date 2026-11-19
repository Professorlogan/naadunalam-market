"use client";
import Link from "next/link";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import { getCategory, lowestPrice, productsInCategory } from "../../lib/data";
import { inr } from "../../lib/format";
import { Reveal, Stagger, StaggerItem } from "../motion";

const SLUG = "masala-podi";

/** Featured category. Pointing at (or focusing) a powder in the list brings its photo forward. */
export default function FeaturedMasala() {
  const cat = getCategory(SLUG);
  const items = productsInCategory(SLUG);
  const first = items.find((p) => p.name.toLowerCase().includes("sambar")) ?? items[0];
  const [activeId, setActiveId] = useState(first?.id);
  if (!cat || items.length === 0) return null;
  const active = items.find((p) => p.id === activeId) ?? first;
  return (
    <section aria-labelledby="featured-title" className="border-b border-mist bg-white">
      <div className="wrap grid gap-8 py-12 sm:py-16 md:grid-cols-2 md:items-center md:gap-10 lg:gap-16">
        <Reveal x={-40} y={0}>
          <Link href={`/product/${active.slug}`} className="relative block aspect-[16/11] overflow-hidden rounded-3xl bg-sky">
            <AnimatePresence mode="popLayout" initial={false}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <motion.img key={active.id} src={active.images[0]?.src} alt={active.images[0]?.alt || active.name} width={600} height={600}
                initial={{ opacity: 0, scale: 1.12 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.5 }}
                className="absolute inset-0 h-full w-full object-cover" />
            </AnimatePresence>
            <motion.span key={`t-${active.id}`} initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="absolute bottom-3 left-3 rounded-full bg-white/95 px-4 py-1.5 font-display font-semibold text-forest-deep shadow-sm">
              {active.name} · {inr(active.price)}
            </motion.span>
          </Link>
          <ul className="mt-3 grid grid-cols-5 gap-2 sm:gap-3">
            {items.map((p) => (
              <li key={p.id}>
                <button type="button" aria-label={`Show ${p.name}`} aria-pressed={p.id === active.id} onClick={() => setActiveId(p.id)} onMouseEnter={() => setActiveId(p.id)}
                  className="relative block w-full overflow-hidden rounded-2xl bg-sky">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={p.images[0]?.src} alt="" width={300} height={300} loading="lazy" className="aspect-square h-full w-full object-cover" />
                  {p.id === active.id && <motion.span layoutId="masala-ring" className="absolute inset-0 rounded-2xl ring-4 ring-inset ring-sun" />}
                </button>
              </li>
            ))}
          </ul>
        </Reveal>
        <div>
          <Reveal>
            <p className="font-semibold text-soil">Featured category</p>
            <h2 id="featured-title" className="t-h2 mt-1 font-bold">{cat.name}, ground for the everyday Tamil kitchen</h2>
            <p lang="ta" className="ta mt-1 font-display text-xl font-medium text-leaf">{cat.nameTa}</p>
            <p className="mt-3 text-muted">
              The powders behind sambar, kuzhambu and rasam, plus chilli and turmeric — {items.length} listed on the
              marketplace right now.
            </p>
          </Reveal>
          <Stagger as="ul" gap={0.07} className="mt-5 border-t border-mist">
            {items.map((p) => (
              <StaggerItem as="li" key={p.id} y={14} className="relative border-b border-mist">
                {p.id === active.id && <motion.span layoutId="masala-row" className="absolute inset-y-0 -inset-x-3 rounded-xl bg-sky" transition={{ type: "spring", stiffness: 400, damping: 34 }} />}
                <Link href={`/product/${p.slug}`} onMouseEnter={() => setActiveId(p.id)} onFocus={() => setActiveId(p.id)} className="group relative flex min-h-12 items-baseline justify-between gap-4 py-2.5">
                  <span className="min-w-0">
                    <span className="font-semibold text-forest-deep group-hover:text-leaf">{p.name}</span>{" "}
                    <span lang="ta" className="ta text-[15px] text-leaf">{p.nameTa}</span>
                  </span>
                  <span className="shrink-0 whitespace-nowrap"><span className="font-display font-bold text-forest-deep">{inr(p.price)}</span> <span className="text-sm text-muted">{p.pack}</span></span>
                </Link>
              </StaggerItem>
            ))}
          </Stagger>
          <Reveal delay={0.1} className="mt-6 flex flex-wrap items-center gap-x-5 gap-y-3">
            <Link href={`/product-category/${SLUG}`} className="btn btn-primary">Shop masala &amp; powders</Link>
            <p className="font-display text-lg font-semibold text-soil">Starting at {inr(lowestPrice(SLUG))}</p>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
