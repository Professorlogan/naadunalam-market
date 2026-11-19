"use client";
import Link from "next/link";
import { ArrowUpRight, Check, Heart, Plus } from "lucide-react";
import { getStore } from "../../lib/data";
import { inr } from "../../lib/format";
import { useStore } from "../../lib/store";
import type { Product } from "../../lib/types";

/** Quiet product card for the home page: the photograph leads, one small add control. */
export default function PickCard({ product: p }: { product: Product }) {
  const { add, cart, ready, toggleWishlist, wishlist } = useStore();
  const wished = wishlist.includes(p.id);
  const seller = getStore(p.vendor);
  const line = ready && !p.variants ? cart.find((l) => l.id === p.id && l.variantId === undefined) : undefined;
  return (
    <article className="group relative flex h-full flex-col">
      <div className="relative">
      <Link href={`/product/${p.slug}`} className="block aspect-[4/5] overflow-hidden rounded-2xl bg-mist">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={p.images[0]?.src} alt={p.images[0]?.alt ?? p.name} width={640} height={800} loading="lazy" className="h-full w-full object-cover transition-transform duration-[900ms] ease-[cubic-bezier(0.19,1,0.22,1)] group-hover:scale-[1.05]" />
      </Link>
      <button type="button" aria-pressed={wished} aria-label={wished ? `Remove ${p.name} from wishlist` : `Save ${p.name} to wishlist`} onClick={() => toggleWishlist(p.id)}
        className={`absolute right-3 top-3 grid h-11 w-11 place-items-center rounded-full transition-[opacity,background-color] duration-200 ${wished ? "bg-forest text-white" : "bg-white/90 text-forest-deep hover:bg-white md:opacity-0 md:focus-visible:opacity-100 md:group-hover:opacity-100"}`}>
        <Heart size={18} fill={wished ? "currentColor" : "none"} />
      </button>
        {p.variants ? (
          <Link href={`/product/${p.slug}`} aria-label={`Choose a pack of ${p.name}`} className="absolute bottom-3 right-3 grid h-11 w-11 place-items-center rounded-full bg-white text-forest-deep shadow-sm transition-colors hover:bg-forest hover:text-white"><ArrowUpRight size={20} /></Link>
        ) : (
          <button type="button" disabled={!p.inStock || (line ? line.qty >= p.maxQty : false)} onClick={() => add(p.id)} aria-label={line ? `Add one more ${p.name}, ${line.qty} in basket` : `Add ${p.name} to basket`}
            className={`absolute bottom-3 right-3 grid h-11 w-11 place-items-center rounded-full shadow-sm transition-colors disabled:opacity-40 ${line ? "bg-forest text-white" : "bg-white text-forest-deep hover:bg-forest hover:text-white"}`}>
            {line ? <span className="flex items-center text-sm font-semibold tabular-nums"><Check size={14} className="mr-0.5" />{line.qty}</span> : <Plus size={20} />}
          </button>
        )}
      </div>
      <div className="pt-4">
        {seller && <p className="text-sm text-muted">{seller.name}</p>}
        <h3 className="mt-0.5 font-body text-[17px] !font-semibold leading-snug text-ink"><Link href={`/product/${p.slug}`} className="hover:text-forest">{p.name}</Link></h3>
        {p.nameTa && <p lang="ta" className="ta text-[15px] leading-snug text-muted">{p.nameTa}</p>}
        <p className="mt-2 text-[17px] font-semibold text-forest-deep">{p.variants ? "From " : ""}{inr(p.price)} <span className="text-[15px] font-normal text-muted">· {p.pack}</span></p>
    </div>
    </article>
  );
}
