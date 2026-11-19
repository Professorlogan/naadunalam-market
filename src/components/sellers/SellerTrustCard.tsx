import Link from "next/link";
import { getStore } from "../../lib/data";
import { SellerMonogram } from "./StoreBanner";
import { plural, storeSummary } from "./storeInfo";

/**
 * "Sold by" card: who the seller is, in facts the marketplace actually holds (product count, selling since).
 * No hooks, so it works in server and client components alike. Renders nothing for an unknown seller.
 */
export default function SellerTrustCard({ slug, className = "" }: { slug: string; className?: string }) {
  const store = getStore(slug);
  if (!store) return null;
  const s = storeSummary(store);
  return (
    <aside aria-label={`Sold by ${store.name}`} className={`flex items-center gap-3.5 rounded-xl border border-mist bg-white p-4 ${className}`}>
      <SellerMonogram monogram={s.monogram} tone={s.tone} />
      <div className="min-w-0 flex-1">
        <p className="text-sm text-muted">Sold by</p>
        <p className="font-display text-lg font-semibold leading-tight text-forest-deep">{store.name}</p>
        <p className="mt-0.5 text-sm text-muted">{plural(s.items.length, "product", "products")} · Selling since {s.since}</p>
      </div>
      <Link href={`/store/${store.slug}`} aria-label={`Visit the ${store.name} store`}
        className="inline-flex min-h-11 shrink-0 items-center rounded-lg border border-forest px-3.5 text-[15px] font-semibold text-forest transition-colors duration-150 hover:bg-forest hover:text-white">
        Visit store
      </Link>
    </aside>
  );
}
