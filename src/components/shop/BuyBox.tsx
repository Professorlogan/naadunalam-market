"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { Banknote, Check, GitCompareArrows, Heart, Minus, PackageCheck, Plus, ShoppingBasket, Truck } from "lucide-react";
import { site } from "../../lib/data";
import { inr, unitPrice } from "../../lib/format";
import { useStore } from "../../lib/store";
import type { Product } from "../../lib/types";
import AnimatedNumber from "./AnimatedNumber";

type Props = { product: Pick<Product, "id" | "name" | "price" | "pack" | "variants" | "inStock" | "stock" | "maxQty"> };

/** Price, pack choice, delivery line and the buying actions, plus the mobile sticky bar. */
export default function BuyBox({ product: p }: Props) {
  const router = useRouter();
  const { add, setQty, cart, toggleWishlist, toggleCompare, wishlist, compare, ready } = useStore();
  const [variantId, setVariantId] = useState<number | undefined>(p.variants?.[0]?.id);
  const [pinned, setPinned] = useState(false);
  const [mounted, setMounted] = useState(false);
  const actions = useRef<HTMLDivElement>(null);

  const variant = p.variants?.find((v) => v.id === variantId);
  const price = variant?.price ?? p.price;
  const pack = variant?.pack ?? p.pack;
  const per = unitPrice(price, pack);
  const max = Math.max(1, Math.min(p.maxQty, 99));
  const line = ready ? cart.find((l) => l.id === p.id && l.variantId === variantId) : undefined;
  const wished = ready && wishlist.includes(p.id);
  const compared = ready && compare.includes(p.id);
  const lowStock = p.inStock && p.stock > 0 && p.stock <= 10;

  // eslint-disable-next-line react-hooks/set-state-in-effect -- the sticky bar is portalled, which needs the document
  useEffect(() => setMounted(true), []);

  // The sticky bar shows only once the main button has scrolled away above the viewport (never while it is
  // still below the fold, as on first load), and steps aside again when the footer is reached.
  useEffect(() => {
    const target = actions.current;
    if (!target || typeof IntersectionObserver === "undefined") return;
    const footer = document.querySelector("body footer");
    let passed = false, footerSeen = false;
    const io = new IntersectionObserver((entries) => {
      for (const e of entries) {
        if (e.target === target) passed = !e.isIntersecting && e.boundingClientRect.bottom <= 0;
        else footerSeen = e.isIntersecting;
      }
      setPinned(passed && !footerSeen);
    });
    io.observe(target);
    if (footer) io.observe(footer);
    return () => io.disconnect();
  }, []);

  const addToBasket = () => add(p.id, 1, variantId);
  const change = (qty: number) => setQty(p.id, variantId, qty);
  const buyNow = () => { if (!line) add(p.id, 1, variantId); router.push("/checkout"); };
  const stepperName = p.variants ? `${p.name}, ${pack}` : p.name;

  return (
    <div>
      <p className="flex flex-wrap items-baseline gap-x-2.5 gap-y-1">
        <AnimatedNumber value={price} format={inr} className="font-display text-[36px] font-bold leading-none tabular-nums text-forest-deep sm:text-[42px]" />
        <span className="text-base text-muted">{pack}</span>
      </p>
      {per && <p className="mt-1 text-sm text-muted">{per}</p>}

      {p.variants && (
        <fieldset className="mt-5">
          <legend className="mb-2 text-sm font-semibold text-ink">Pack size</legend>
          <div className="flex flex-wrap gap-2">
            {p.variants.map((v) => {
              const on = v.id === variantId;
              return (
                <label key={v.id}
                  className={`relative flex min-h-11 cursor-pointer items-center gap-2 rounded-full border bg-white px-4 text-[15px] transition-colors duration-200 has-[:focus-visible]:outline has-[:focus-visible]:outline-[3px] has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-water ${on ? "border-leaf text-white" : "border-mist hover:border-leaf hover:text-leaf"}`}>
                  {on && (
                    <motion.span aria-hidden layoutId={`pack-pill-${p.id}`} className="absolute -inset-px rounded-full bg-leaf"
                      transition={{ duration: 0.2, ease: "easeOut" }} />
                  )}
                  <input type="radio" name="pack" className="sr-only" aria-label={`${v.pack}, ${inr(v.price)}`} checked={on} onChange={() => setVariantId(v.id)} />
                  <span className="relative font-semibold">{v.pack}</span>
                  <span className={`relative transition-colors duration-200 ${on ? "text-white/85" : "text-muted"}`}>{inr(v.price)}</span>
                </label>
              );
            })}
          </div>
        </fieldset>
      )}

      <p className="mt-4 flex items-center gap-2 text-[15px] font-semibold">
        <span aria-hidden className={`h-2 w-2 rounded-full ${p.inStock ? "bg-leaf" : "bg-soil"}`} />
        {p.inStock
          ? <span className="text-leaf">{lowStock ? `In stock, only ${p.stock} left` : "In stock"}</span>
          : <span className="text-soil">Sold out for now</span>}
      </p>

      <ul className="mt-5 space-y-2.5 border-t border-mist pt-5 text-[15px] text-ink">
        <li className="flex items-center gap-3"><span aria-hidden className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-mint text-forest"><Truck size={18} /></span>{site.deliveryLine}</li>
        <li className="flex items-center gap-3"><span aria-hidden className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-butter text-forest"><PackageCheck size={18} /></span>Packed within 24–48 hours on business days</li>
        <li className="flex items-center gap-3"><span aria-hidden className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-mint text-forest"><Banknote size={18} /></span>{site.payment}</li>
      </ul>

      {/* The two buttons always sit 12px apart; the basket note goes under them so it never changes that gap. */}
      <div ref={actions} className="mt-6 flex flex-col gap-3">
        {line ? (
          <BasketStepper qty={line.qty} max={max} name={stepperName} onChange={change} className="h-12 w-full" />
        ) : (
          <button type="button" disabled={!p.inStock} onClick={addToBasket} className="btn btn-primary !min-h-[3.25rem] w-full !rounded-full !text-base">
            <ShoppingBasket size={19} aria-hidden /> {p.inStock ? "Add to basket" : "Sold out"}
          </button>
        )}
        <button type="button" disabled={!p.inStock} onClick={buyNow} className="btn btn-ghost !min-h-12 w-full !rounded-full">Buy now</button>
        <p aria-live="polite" className={line ? "flex items-center justify-between gap-3 text-sm" : "sr-only"}>
          {line && (
            <>
              <span className="flex items-center gap-1.5 font-semibold text-leaf"><Check size={16} aria-hidden />In your basket</span>
              <Link href="/cart" className="link inline-flex min-h-11 items-center font-semibold">View basket</Link>
            </>
          )}
        </p>
      </div>

      <div className="mt-2 flex flex-wrap gap-x-1 gap-y-1">
        <button type="button" aria-pressed={wished} onClick={() => toggleWishlist(p.id)}
          className="-ml-2 inline-flex min-h-11 items-center gap-2 rounded-full px-3 text-[15px] font-semibold text-forest transition-colors duration-150 hover:bg-mint">
          <Heart size={18} aria-hidden fill={wished ? "currentColor" : "none"} />
          {wished ? "Saved to wishlist" : "Save to wishlist"}
        </button>
        <button type="button" aria-pressed={compared} onClick={() => toggleCompare(p.id)}
          className="inline-flex min-h-11 items-center gap-2 rounded-full px-3 text-[15px] font-semibold text-forest transition-colors duration-150 hover:bg-mint">
          {compared ? <Check size={18} aria-hidden /> : <GitCompareArrows size={18} aria-hidden />}
          {compared ? "Added to compare" : "Compare"}
        </button>
      </div>

      {mounted && createPortal(
        <AnimatePresence>
          {pinned && p.inStock && (
            <motion.div key="sticky-add" role="region" aria-label="Quick add to basket"
              initial={{ y: "100%" }} animate={{ y: 0 }} exit={{ y: "100%" }} transition={{ duration: 0.2, ease: "easeOut" }}
              className="fixed inset-x-0 bottom-0 z-40 rounded-t-[1.5rem] bg-white px-4 shadow-[0_-12px_32px_-18px_rgb(23_39_30/0.45)] pb-[max(0.75rem,env(safe-area-inset-bottom))] pt-3 md:hidden">
              <div className="flex items-center justify-between gap-3">
                <p className="min-w-0 leading-tight">
                  <span className="block truncate text-sm text-muted">{p.name}</span>
                  <AnimatedNumber value={price} format={inr} className="font-display text-xl font-bold tabular-nums text-forest-deep" />
                  <span className="ml-1.5 text-sm text-muted">{pack}</span>
                </p>
                {line ? (
                  <BasketStepper qty={line.qty} max={max} name={stepperName} onChange={change} className="h-12 w-[9.5rem] shrink-0" />
                ) : (
                  <button type="button" onClick={addToBasket} className="btn btn-primary !min-h-12 min-w-[9.5rem] shrink-0 !rounded-full">
                    <ShoppingBasket size={18} aria-hidden /> Add to basket
                  </button>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>,
        document.body,
      )}
    </div>
  );
}

/** The − qty + control that takes the Add button's place. Going below one removes the product from the basket. */
function BasketStepper({ qty, max, name, onChange, className }: {
  qty: number; max: number; name: string; onChange: (qty: number) => void; className: string;
}) {
  const side = "grid h-12 w-12 shrink-0 place-items-center rounded-full transition-colors duration-150 hover:bg-forest disabled:opacity-40";
  return (
    <div role="group" aria-label={`Quantity of ${name} in basket`} className={`flex items-center justify-between rounded-full bg-leaf text-white ${className}`}>
      <button type="button" aria-label={qty <= 1 ? `Remove ${name} from basket` : `Remove one ${name}`} onClick={() => onChange(qty - 1)} className={side}><Minus size={18} aria-hidden /></button>
      <span aria-live="polite" className="font-semibold tabular-nums">{qty}</span>
      <button type="button" aria-label={`Add one more ${name}`} disabled={qty >= max} onClick={() => onChange(qty + 1)} className={side}><Plus size={18} aria-hidden /></button>
    </div>
  );
}
