"use client";
import Link from "next/link";
import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Check, Heart, ShoppingBasket, Trash2 } from "lucide-react";
import { getProductById, getStore, products } from "../../lib/data";
import { inr } from "../../lib/format";
import { useStore } from "../../lib/store";
import type { Product } from "../../lib/types";
import { EASE, Reveal } from "../motion";
import ProductGrid from "../ProductGrid";
import SectionHeading from "../SectionHeading";
import { useCollapse } from "./fx";
import { emptyCard, IconDisc, marketCard, roundIconBtn, Skeleton, toolLink } from "./shared";

function stockLabel(p: Product) {
  if (!p.inStock) return { text: "Sold out", cls: "text-soil" };
  if (p.stock > 0 && p.stock <= 5) return { text: `Only ${p.stock} left`, cls: "text-soil" };
  return { text: "In stock", cls: "text-leaf" };
}

export default function WishlistView() {
  const { ready, wishlist, toggleWishlist, clearWishlist, add, notify } = useStore();
  const [confirming, setConfirming] = useState(false);
  // Counts "Add all" presses; each press replays the ticks that run down the list.
  const [cascade, setCascade] = useState(0);
  const collapse = useCollapse();
  if (!ready) return <Skeleton label="Loading your wishlist" />;

  const saved = wishlist.map(getProductById).filter((p): p is Product => Boolean(p));
  const direct = saved.filter((p) => p.inStock && !p.variants);
  const suggestions = products.filter((p) => p.inStock && !wishlist.includes(p.id)).slice(0, 4);

  const addAll = () => {
    direct.forEach((p) => add(p.id));
    setCascade((n) => n + 1);
    const skipped = saved.length - direct.length;
    notify(skipped
      ? `Added ${direct.length} to your basket. ${skipped} need a pack size or are sold out.`
      : `Added ${direct.length} ${direct.length === 1 ? "product" : "products"} to your basket`);
  };

  return (
    <>
      <section className="wrap pb-8 pt-8 sm:pb-10 sm:pt-12">
        {saved.length === 0 ? (
          <Reveal className={emptyCard}>
            <IconDisc icon={Heart} tint="bg-peach" className="mb-6" />
            <h2 className="t-h3 font-bold text-forest-deep">Your wishlist is empty</h2>
            <p className="mt-3 max-w-[46ch] text-muted">Save the products you love and come back to them any time. They will be waiting right here. Tap the heart on any product to save it.</p>
            <p className="mt-7"><Link href="/shop" className="btn btn-primary">Start shopping</Link></p>
          </Reveal>
        ) : (
          <>
            <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
              <p className="text-muted">{saved.length} saved {saved.length === 1 ? "product" : "products"}</p>
              <div className="flex flex-wrap items-center gap-3">
                <button type="button" className="btn btn-primary" disabled={direct.length === 0} onClick={addAll}><ShoppingBasket size={18} aria-hidden /> Add all to basket</button>
                <AnimatePresence mode="wait" initial={false}>
                {confirming ? (
                  <motion.div key="confirm" role="group" aria-label="Confirm clearing your wishlist" className="flex origin-left flex-wrap items-center gap-2 rounded-2xl border border-soil/40 bg-white px-3 py-2"
                    initial={{ opacity: 0, scale: 0.92, x: 12 }} animate={{ opacity: 1, scale: 1, x: 0 }} exit={{ opacity: 0, scale: 0.95 }} transition={{ duration: 0.22, ease: EASE }}>
                    <span className="font-semibold text-soil">Remove all {saved.length} saved products?</span>
                    <button type="button" autoFocus className="btn !min-h-11 bg-soil !px-4 text-white hover:bg-soil-deep" onClick={() => { clearWishlist(); setConfirming(false); notify("Your wishlist was cleared"); }}>Yes, clear all</button>
                    <button type="button" className="btn btn-ghost !min-h-11 !px-4" onClick={() => setConfirming(false)}>Keep them</button>
                  </motion.div>
                ) : (
                  <motion.button key="ask" type="button" className={toolLink} onClick={() => setConfirming(true)}
                    initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.15 }}>Clear all</motion.button>
                )}
                </AnimatePresence>
              </div>
            </div>
            <motion.ul className="space-y-3" initial={{ opacity: 0, y: 22 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.55, ease: EASE }}>
              <AnimatePresence initial={false}>
              {saved.map((p) => {
                const seller = getStore(p.vendor);
                const stock = stockLabel(p);
                const order = direct.indexOf(p);
                return (
                  <motion.li key={p.id} className={`overflow-hidden ${marketCard} transition-shadow duration-200 hover:shadow-[0_18px_40px_-22px_rgb(23_39_30/0.45)]`} {...collapse}>
                  <div className="grid grid-cols-[5.5rem_minmax(0,1fr)] gap-x-4 gap-y-3 p-4 sm:px-6 md:grid-cols-[6.5rem_minmax(0,1fr)_8rem_7rem_auto] md:items-center">
                    <Link href={`/product/${p.slug}`} className="relative row-span-2 self-start md:row-span-1">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={p.images[0]?.src} alt={p.images[0]?.alt ?? p.name} width={104} height={104} className="aspect-square w-full rounded-xl bg-sky object-cover" />
                      {cascade > 0 && order >= 0 && (
                        <motion.span key={cascade} aria-hidden className="absolute inset-0 grid place-items-center rounded-xl bg-forest/55 text-white"
                          initial={{ opacity: 0 }} animate={{ opacity: [0, 1, 1, 0] }} transition={{ duration: 1.3, times: [0, 0.2, 0.75, 1], delay: order * 0.12 }}>
                          <motion.span className="grid h-10 w-10 place-items-center rounded-full bg-leaf" initial={{ scale: 0 }} animate={{ scale: 1 }}
                            transition={{ type: "spring", stiffness: 480, damping: 20, delay: order * 0.12 + 0.05 }}>
                            <Check size={22} strokeWidth={3} />
                          </motion.span>
                        </motion.span>
                      )}
                    </Link>
                    <div className="min-w-0">
                      <h2 className="t-h4 font-semibold"><Link href={`/product/${p.slug}`} className="-my-1.5 inline-block py-1.5 hover:text-leaf">{p.name}</Link></h2>
                      {p.nameTa && <p lang="ta" className="ta line-clamp-2 whitespace-normal text-[15px] text-leaf">{p.nameTa}</p>}
                      {seller && <p className="mt-0.5 text-sm text-muted">Sold by <Link href={`/store/${seller.slug}`} className="-my-3 inline-block py-3 hover:text-forest hover:underline">{seller.name}</Link></p>}
                    </div>
                    <div className="col-start-2 flex flex-wrap items-center gap-x-4 gap-y-2 md:contents">
                      <p>
                        <span className="whitespace-nowrap font-display text-xl font-bold text-forest-deep">{p.variants ? "From " : ""}{inr(p.price)}</span>
                        <span className="ml-1.5 text-sm text-muted">{p.pack}</span>
                      </p>
                      <p className={`font-semibold ${stock.cls}`}>{stock.text}</p>
                      <div className="flex w-full items-center gap-2 md:w-auto md:justify-end">
                        {p.variants ? (
                          <Link href={`/product/${p.slug}`} className="btn btn-ghost !min-h-11 text-[15px]">Choose pack</Link>
                        ) : (
                          <button type="button" disabled={!p.inStock} onClick={() => add(p.id)} className="btn btn-primary !min-h-11 text-[15px]" aria-label={`Add ${p.name} to basket`}>
                            {p.inStock ? "Add to basket" : "Sold out"}
                          </button>
                        )}
                        <motion.button type="button" aria-label={`Remove ${p.name} from wishlist`} onClick={() => toggleWishlist(p.id)} whileHover={{ scale: 1.1, rotate: -8 }} whileTap={{ scale: 0.88 }}
                          className={roundIconBtn}>
                          <Trash2 size={17} />
                        </motion.button>
                      </div>
                    </div>
                  </div>
                  </motion.li>
                );
              })}
              </AnimatePresence>
            </motion.ul>
            <p className="mt-6"><Link href="/shop" className="btn btn-ghost">Continue shopping</Link></p>
          </>
        )}
      </section>

      {suggestions.length > 0 && (
        <section className="wrap pb-6 sm:pb-8">
          <div className="rounded-[2rem] bg-white border border-mist px-5 pb-8 pt-10 sm:px-8 sm:pb-10 sm:pt-12 lg:px-10">
            <SectionHeading title="You may also like" intro="Explore more healthy choices" href="/shop" linkLabel="View all products" />
            {/* Keeps the card's "In your basket" badge clear of the heart button on narrow cards. */}
            <ProductGrid products={suggestions} className="[&_article>span.absolute]:max-w-[calc(100%-4.75rem)] [&_article>span.absolute]:rounded-xl [&_article>span.absolute]:text-xs [&_article>span.absolute]:leading-tight" />
          </div>
        </section>
      )}
    </>
  );
}
