"use client";
import Link from "next/link";
import { Heart, Minus, Plus, ShoppingCart } from "lucide-react";
import { getStore } from "../lib/data";
import { inr } from "../lib/format";
import { useStore } from "../lib/store";
import type { Product } from "../lib/types";

/**
 * Market Colours product card: a soft white card, a big rounded photo, bilingual name,
 * price, and a round green cart button that turns into a quantity stepper once added.
 */
export default function ProductCard({ product: p, priority = false }: { product: Product; priority?: boolean; tall?: boolean }) {
  const { add, setQty, cart, ready, toggleWishlist, wishlist } = useStore();
  const wished = wishlist.includes(p.id);
  const seller = getStore(p.vendor);
  const line = ready && !p.variants ? cart.find((l) => l.id === p.id && l.variantId === undefined) : undefined;
  const label = /-pdf\.|11-product-turmeric/.test(p.images[0]?.src ?? ""); // pack-label artwork: show whole on a tint
  return (
    <article className="group relative flex h-full flex-col rounded-[1.25rem] border border-mist bg-white p-2.5 transition-[box-shadow,border-color] duration-300 hover:border-transparent hover:shadow-[0_18px_40px_-22px_rgb(23_39_30/0.45)] sm:p-3">
      <div className="relative">
        <Link href={`/product/${p.slug}`} className={`block aspect-square overflow-hidden rounded-2xl ${label ? "bg-butter" : "bg-sky"}`}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={p.images[0]?.src} alt={p.images[0]?.alt ?? p.name} loading={priority ? "eager" : "lazy"} width={640} height={640}
            className={`h-full w-full transition-transform duration-700 ease-[cubic-bezier(0.19,1,0.22,1)] group-hover:scale-[1.06] ${label ? "object-contain p-4 mix-blend-multiply" : "object-cover"}`} />
        </Link>
        <button type="button" aria-pressed={wished} aria-label={wished ? `Remove ${p.name} from wishlist` : `Save ${p.name} to wishlist`} onClick={() => toggleWishlist(p.id)}
          className={`absolute right-2 top-2 grid h-10 w-10 place-items-center rounded-full shadow-sm transition-colors active:scale-90 ${wished ? "bg-leaf text-white" : "bg-white/95 text-ink hover:text-leaf"}`}>
          <Heart size={17} fill={wished ? "currentColor" : "none"} />
        </button>
        {!p.inStock && <span className="absolute left-2 top-2 rounded-full bg-white/95 px-2.5 py-1 text-[12px] font-semibold text-ink">Sold out</span>}
      </div>
      <div className="flex flex-1 flex-col px-1 pb-1 pt-3">
        {seller && <Link href={`/store/${seller.slug}`} className="self-start text-[12px] font-medium uppercase tracking-wide text-leaf hover:underline">{seller.name}</Link>}
        <h3 className="mt-1 line-clamp-2 font-display text-[15px] !font-semibold leading-snug text-forest-deep sm:text-base">
          <Link href={`/product/${p.slug}`} className="hover:text-leaf">{p.name}</Link>
        </h3>
        {p.nameTa && <p lang="ta" className="ta line-clamp-2 min-h-[2.6em] text-[13px] leading-[1.3] text-muted">{p.nameTa}</p>}
        <div className="mt-auto flex items-end justify-between gap-2 pt-3">
          <p className="leading-tight">
            <span className="block font-display text-lg font-bold text-forest-deep">{p.variants ? "From " : ""}{inr(p.price)}</span>
            <span className="text-[13px] text-muted">{p.pack}</span>
          </p>
          {p.variants ? (
            <Link href={`/product/${p.slug}`} aria-label={`Choose a pack of ${p.name}`} className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-leaf text-white shadow-sm transition-colors hover:bg-forest"><ShoppingCart size={18} /></Link>
          ) : line ? (
            <div role="group" aria-label={`Quantity of ${p.name} in basket`} className="flex h-11 shrink-0 items-center rounded-full bg-forest text-white">
              <button type="button" aria-label={`Remove one ${p.name}`} onClick={() => setQty(p.id, undefined, line.qty - 1)} className="grid h-11 w-9 place-items-center rounded-full hover:bg-leaf"><Minus size={16} /></button>
              <span aria-live="polite" className="min-w-4 text-center text-[15px] font-semibold tabular-nums">{line.qty}</span>
              <button type="button" aria-label={`Add one more ${p.name}`} disabled={line.qty >= p.maxQty} onClick={() => setQty(p.id, undefined, line.qty + 1)} className="grid h-11 w-9 place-items-center rounded-full hover:bg-leaf disabled:opacity-40"><Plus size={16} /></button>
            </div>
          ) : (
            <button type="button" disabled={!p.inStock} onClick={() => add(p.id)} aria-label={p.inStock ? `Add ${p.name} to basket` : `${p.name} is sold out`}
              className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-leaf text-white shadow-sm transition-[background-color,transform] hover:bg-forest active:scale-90 disabled:opacity-40"><ShoppingCart size={18} /></button>
          )}
        </div>
      </div>
    </article>
  );
}
