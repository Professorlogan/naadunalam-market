"use client";
import Link from "next/link";
import { motion } from "motion/react";
import { useMemo, useState } from "react";
import { products, productsInCategory } from "../../lib/data";
import { productPhotos } from "../../lib/photos";
import ProductGrid from "../ProductGrid";

const tabs = [
  { id: "picks", label: "Our picks" },
  { id: "rice-grains", label: "Traditional rice" },
  { id: "siruthaniyam", label: "Millets" },
  { id: "oil-vinegers", label: "Ghee & oils" },
  { id: "health-mixes", label: "Health mixes" },
  { id: "natural-sweeteners", label: "Sweeteners" },
];

export default function PopularProducts() {
  const [tab, setTab] = useState("picks");
  const list = useMemo(() => {
    if (tab === "picks") {
      const withPhoto = products.filter((p) => productPhotos[p.slug]);
      return [...withPhoto, ...products.filter((p) => !productPhotos[p.slug])].slice(0, 8);
    }
    const inCat = productsInCategory(tab);
    return [...inCat.filter((p) => productPhotos[p.slug]), ...inCat.filter((p) => !productPhotos[p.slug])].slice(0, 8);
  }, [tab]);
  const more = tab === "picks" ? "/shop" : `/product-category/${tab}`;
  return (
    <section aria-labelledby="popular-title" className="wrap pt-14 sm:pt-20">
      <div className="mb-7 flex flex-wrap items-end justify-between gap-x-8 gap-y-4">
        <h2 id="popular-title" className="text-3xl sm:text-4xl">Popular products</h2>
        <div role="tablist" aria-label="Filter popular products" className="-mx-4 flex gap-2 overflow-x-auto px-4 pb-1 sm:mx-0 sm:flex-wrap sm:px-0">
          {tabs.map((t) => {
            const on = t.id === tab;
            return (
              <button key={t.id} role="tab" aria-selected={on} type="button" onClick={() => setTab(t.id)}
                className={`relative shrink-0 rounded-full px-4 py-2 text-[15px] font-semibold transition-colors ${on ? "text-white" : "text-ink hover:text-leaf"}`}>
                {on && <motion.span layoutId="pop-pill" className="absolute inset-0 rounded-full bg-leaf" transition={{ type: "spring", stiffness: 380, damping: 32 }} />}
                {!on && <span className="absolute inset-0 rounded-full border border-mist" />}
                <span className="relative">{t.label}</span>
              </button>
            );
          })}
        </div>
      </div>
      <ProductGrid products={list} />
      <div className="mt-8 text-center"><Link href={more} className="btn btn-ghost">View all {tab === "picks" ? `${products.length} products` : tabs.find((t) => t.id === tab)?.label.toLowerCase()}</Link></div>
    </section>
  );
}
