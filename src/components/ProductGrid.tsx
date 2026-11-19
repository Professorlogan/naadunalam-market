"use client";
import { AnimatePresence, motion } from "motion/react";
import type { Product } from "../lib/types";
import ProductCard from "./ProductCard";

/** Product grid. Cards slide to their new places when the list is filtered or sorted; no entrance animation. */
export default function ProductGrid({ products, className = "" }: { products: Product[]; className?: string }) {
  return (
    <ul className={`grid grid-cols-2 gap-3 sm:gap-5 md:grid-cols-3 lg:grid-cols-4 ${className}`}>
      <AnimatePresence mode="popLayout" initial={false}>
        {products.map((p, i) => (
          <motion.li key={p.id} layout="position" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            transition={{ duration: 0.2, layout: { type: "spring", stiffness: 320, damping: 34 } }}>
            <ProductCard product={p} priority={i < 4} />
          </motion.li>
        ))}
      </AnimatePresence>
    </ul>
  );
}
