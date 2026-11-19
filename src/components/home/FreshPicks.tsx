"use client";
import Link from "next/link";
import { motion } from "motion/react";
import { useState } from "react";
import ProductGrid from "../ProductGrid";
import { categories, products, productsInCategory } from "../../lib/data";
import type { Product } from "../../lib/types";
import { Reveal } from "../motion";

const SHOWN = 8;
const tabCategories = [...categories].sort((a, b) => b.count - a.count).slice(0, 5);

/** "All" takes products category by category in turn, so the first screen shows the breadth of the marketplace. */
function mixed(): Product[] {
  const lists = categories.map((c) => productsInCategory(c.slug));
  const picked: Product[] = [];
  for (let round = 0; picked.length < SHOWN && round < products.length; round++) {
    for (const list of lists) {
      const p = list[round];
      if (p && !picked.includes(p) && picked.length < SHOWN) picked.push(p);
    }
  }
  return picked;
}

const tabs = [
  { slug: "all", label: "All", products: mixed(), total: products.length, href: "/shop", more: "all products" },
  ...tabCategories.map((c) => ({
    slug: c.slug, label: c.name, products: productsInCategory(c.slug).slice(0, SHOWN), total: c.count,
    href: `/product-category/${c.slug}`, more: c.name,
  })),
];

export default function FreshPicks() {
  const [active, setActive] = useState("all");
  const tab = tabs.find((t) => t.slug === active) ?? tabs[0];
  return (
    <section aria-labelledby="fresh-picks-title" className="border-y border-mist bg-white">
      <div className="wrap py-12 sm:py-16">
        <Reveal className="mb-5 max-w-2xl sm:mb-6">
          <h2 id="fresh-picks-title" className="t-h2 font-bold">Fresh picks from our sellers</h2>
          <p className="mt-2 text-muted">Choose a category to see what is listed right now.</p>
        </Reveal>
        <div role="group" aria-label="Filter fresh picks by category" className="mb-6 flex flex-wrap gap-2">
          {tabs.map((t) => {
            const on = t.slug === tab.slug;
            return (
              <button key={t.slug} type="button" aria-pressed={on} onClick={() => setActive(t.slug)}
                className={`relative min-h-11 rounded-full border-[1.5px] px-4 font-display text-base font-semibold transition-colors ${on ? "border-forest text-white" : "border-mist bg-sky text-forest hover:border-forest"}`}>
                {on && <motion.span layoutId="fresh-pill" className="absolute inset-[-1.5px] rounded-full bg-forest" transition={{ type: "spring", stiffness: 380, damping: 32 }} />}
                <span className="relative">{t.label}</span>
              </button>
            );
          })}
        </div>
        <ProductGrid products={tab.products} className="max-sm:[&>li:nth-child(n+5)]:hidden" />
        <p aria-live="polite" className="mt-7 flex flex-wrap items-center gap-x-5 gap-y-3">
          <span className="text-muted">{tab.total} {tab.total === 1 ? "product" : "products"} {tab.slug === "all" ? "on the marketplace" : `in ${tab.label}`}.</span>
          <Link href={tab.href} className="btn btn-ghost">Browse {tab.more}</Link>
        </p>
      </div>
    </section>
  );
}
