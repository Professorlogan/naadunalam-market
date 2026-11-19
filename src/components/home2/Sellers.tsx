import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { stores } from "../../lib/data";

export default function Sellers() {
  return (
    <section aria-labelledby="sellers-title" className="wrap grid items-center gap-10 py-16 sm:py-24 lg:grid-cols-2 lg:gap-20">
      <div className="aspect-[5/4] overflow-hidden rounded-3xl bg-mist">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/img/Parambariya-Arisi-Vagaigal.webp" alt="A jute sack of mixed traditional rice varieties on a wooden floor" width={1024} height={1024} loading="lazy" className="h-full w-full object-cover" />
      </div>
      <div>
        <h2 id="sellers-title" className="t-h2">Many sellers. One basket.</h2>
        <p className="mt-5 max-w-lg text-lg leading-relaxed text-muted">Naadu Nalam is a marketplace, not a single shop. Each grower and small producer runs their own storefront, and you check out once.</p>
        <ul className="mt-8 border-b border-mist">
          {stores.map((s) => (
            <li key={s.slug} className="border-t border-mist">
              <Link href={`/store/${s.slug}`} className="group flex items-center justify-between gap-4 py-5">
                <span>
                  <span className="block font-display text-2xl font-semibold text-forest-deep group-hover:text-leaf">{s.name}</span>
                  <span className="text-base text-muted">{s.productCount} products</span>
                </span>
                <span className="flex items-center gap-2 text-base font-semibold text-forest">Visit store <ArrowRight size={18} className="transition-transform duration-300 group-hover:translate-x-1" /></span>
              </Link>
            </li>
          ))}
        </ul>
        <p className="mt-6 text-base text-muted">Grow or make food in Tamil Nadu? <Link href="/vendor-login" className="link font-semibold">Sell on Naadu Nalam</Link></p>
      </div>
    </section>
  );
}
