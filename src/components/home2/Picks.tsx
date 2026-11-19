import Link from "next/link";
import { categories, productsInCategory } from "../../lib/data";
import type { Product } from "../../lib/types";
import ProductCard from "../ProductCard";

const isLabelArt = (src: string) => /-pdf\.|11-product-turmeric/.test(src);

/** One product from each of eight categories, each with its own photograph. */
function pick(): Product[] {
  const seen = new Set<string>();
  const out: Product[] = [];
  for (const c of categories) {
    const p = productsInCategory(c.slug).find((x) => x.inStock && x.images[0] && !isLabelArt(x.images[0].src) && !seen.has(x.images[0].src) && !out.includes(x));
    if (p) { seen.add(p.images[0].src); out.push(p); }
    if (out.length === 8) break;
  }
  return out;
}

export default function Picks() {
  const items = pick();
  return (
    <section aria-labelledby="picks-title" className="border-t border-mist bg-white">
      <div className="wrap py-16 sm:py-24">
        <div className="mb-8 flex items-end justify-between gap-6 sm:mb-12">
          <div>
            <h2 id="picks-title" className="text-3xl tracking-[-0.02em] sm:text-[2.75rem]">From the marketplace</h2>
            <p className="mt-3 max-w-lg text-lg text-muted">One staple from each shelf, to start your basket.</p>
          </div>
          <Link href="/shop" className="link shrink-0 text-base font-semibold">Shop all</Link>
        </div>
        <ul className="grid grid-cols-2 gap-x-4 gap-y-10 sm:gap-x-6 lg:grid-cols-4 lg:gap-y-14">
          {items.map((p) => <li key={p.id}><ProductCard product={p} tall /></li>)}
        </ul>
      </div>
    </section>
  );
}
