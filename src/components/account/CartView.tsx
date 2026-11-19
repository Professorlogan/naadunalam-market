"use client";
import Link from "next/link";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { Trash2 } from "lucide-react";
import { site } from "../../lib/data";
import { inr, unitPrice } from "../../lib/format";
import { useStore } from "../../lib/store";
import QtyStepper from "../QtyStepper";
import { emptyCard, groupBySeller, IconDisc, lineKey, marketCard, pastelPanel, roundIconBtn, SellerLink, Skeleton, stepperTint, summaryTitle, toolLink, Totals } from "./shared";

export default function CartView() {
  const { ready, cart, count, setQty, remove, clearCart, subtotal, delivery, total } = useStore();
  const reduce = useReducedMotion();
  if (!ready) return <Skeleton label="Loading your basket" />;
  const groups = groupBySeller(cart);
  if (groups.length === 0) {
    return (
      <section className="wrap pb-6 pt-10 sm:pb-8 sm:pt-14">
        <div className={emptyCard}>
          <IconDisc className="mb-6" />
          <h2 className="text-2xl font-bold text-forest-deep sm:text-3xl">Your basket is empty</h2>
          <p className="mt-3 max-w-[46ch] text-muted">Add rice, millets, oils or anything else from any seller. You check out once, and pay by cash when the order arrives.</p>
          <div className="mt-7 flex flex-wrap justify-center gap-3">
            <Link href="/shop" className="btn btn-primary">Start shopping</Link>
            <Link href="/wishlist" className="btn btn-ghost">See your wishlist</Link>
          </div>
        </div>
      </section>
    );
  }
  // The only motion here is feedback for a removal: the row (or the whole seller card) closes up quickly.
  const collapse = { initial: false, exit: { opacity: 0, height: 0 }, transition: { duration: reduce ? 0 : 0.2, ease: "easeOut" } } as const;
  return (
    <section className="wrap pb-4 pt-8 sm:pb-6 sm:pt-12">
      {/* Above both columns, so the summary starts level with the first seller card. */}
      <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
        <p className="text-muted">
          {count} {count === 1 ? "item" : "items"} from {groups.length} {groups.length === 1 ? "seller" : "sellers"}, one checkout.
        </p>
        <button type="button" onClick={clearCart} className={toolLink}>Empty basket</button>
      </div>
      {/* Two columns (items + summary) from tablet up; the line rows size themselves to the items column, not the window. */}
      <div className="grid gap-8 md:grid-cols-[minmax(0,1fr)_18rem] md:items-start lg:grid-cols-[minmax(0,1fr)_22rem]">
        <div className="@container">
          <div>
            <AnimatePresence initial={false}>
              {groups.map((g) => {
                const items = g.lines.reduce((n, { line }) => n + line.qty, 0);
                const sellerTotal = g.lines.reduce((n, { info }) => n + info.total, 0);
                return (
                  <motion.div key={g.slug} className="overflow-hidden" {...collapse}>
                    <section aria-label={`Your ${g.name} order`} className="mb-6">
                      <div className="mb-3 flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1 rounded-full bg-sky px-5 py-2.5 sm:px-6">
                        <h2 className="text-lg font-bold sm:text-xl">Your <SellerLink slug={g.slug} name={g.name} /> order</h2>
                        <p className="text-[15px] text-muted">
                          {items} {items === 1 ? "item" : "items"} · <span className="whitespace-nowrap font-semibold tabular-nums text-forest-deep">{inr(sellerTotal)}</span>
                          <span className="sr-only"> subtotal</span>
                        </p>
                      </div>
                      <ul className="space-y-3">
                        <AnimatePresence initial={false}>
                          {g.lines.map(({ line: l, info: i }) => {
                            const per = unitPrice(i.price, i.pack);
                            return (
                              <motion.li key={lineKey(l)} className={`overflow-hidden ${marketCard} transition-shadow duration-200 hover:shadow-[0_18px_40px_-22px_rgb(23_39_30/0.45)]`} {...collapse}>
                                <div className="grid grid-cols-[5rem_minmax(0,1fr)] gap-x-4 gap-y-3 p-4 @xl:grid-cols-[6rem_minmax(0,1fr)_auto_6.5rem_2.75rem] @xl:items-center sm:px-6">
                                  <Link href={`/product/${i.product.slug}`} className="self-start">
                                    {/* eslint-disable-next-line @next/next/no-img-element */}
                                    <img src={i.product.images[0]?.src} alt={i.product.images[0]?.alt ?? i.product.name} width={96} height={96} className="aspect-square w-full rounded-xl bg-sky object-cover" />
                                  </Link>
                                  <div className="min-w-0">
                                    <Link href={`/product/${i.product.slug}`} className="line-clamp-2 font-display text-base font-semibold leading-snug text-forest-deep hover:underline sm:text-lg">{i.product.name}</Link>
                                    {i.product.nameTa && <p lang="ta" className="ta line-clamp-2 whitespace-normal text-[15px] text-leaf">{i.product.nameTa}</p>}
                                    <p className="mt-1 text-[15px] text-muted">{i.pack} · <span className="whitespace-nowrap">{inr(i.price)} each</span></p>
                                    {per && <p className="text-sm tabular-nums text-muted">{per}</p>}
                                  </div>
                                  {/* Narrow: one full-width row (stepper, total, remove) so the total never has to wrap. Wide: three grid cells. */}
                                  <div className="col-span-2 flex items-center gap-3 @xl:contents">
                                    <span className={stepperTint}><QtyStepper value={l.qty} max={i.product.maxQty} onChange={(n) => setQty(l.id, l.variantId, n)} label={`Quantity of ${i.product.name}`} /></span>
                                    <p className="min-w-0 flex-1 whitespace-nowrap text-right font-display text-lg font-bold tabular-nums text-forest-deep">
                                      <span className="sr-only">Line total </span>{inr(i.total)}
                                    </p>
                                    <button type="button" aria-label={`Remove ${i.product.name}, ${i.pack}, from basket`} onClick={() => remove(l.id, l.variantId)}
                                      className={roundIconBtn}>
                                      <Trash2 size={17} />
                                    </button>
                                  </div>
                                </div>
                              </motion.li>
                            );
                          })}
                        </AnimatePresence>
                      </ul>
                    </section>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
          <p><Link href="/shop" className="btn btn-ghost">Continue shopping</Link></p>
        </div>

        <aside aria-labelledby="summary-title" className={`${pastelPanel} bg-mint md:sticky md:top-28`}>
          <h2 id="summary-title" className={summaryTitle}>Order summary</h2>
          <Totals subtotal={subtotal} delivery={delivery} total={total} />
          <p className="mt-3 text-[15px] font-semibold text-forest-deep">One delivery charge covers all sellers in this order.</p>
          <p className="mt-2 text-[15px] text-muted">{site.deliveryLine}. Pay by cash when your order arrives.</p>
          <Link href="/checkout" className="btn btn-primary mt-6 hidden !min-h-14 w-full text-lg md:inline-flex">Proceed to checkout</Link>
        </aside>
      </div>

      {/* Phone only: the summary's checkout button is used from tablet up. */}
      <div className="sticky bottom-0 z-30 -mx-4 mt-6 flex items-center justify-between gap-4 rounded-t-[1.5rem] border-t border-mist bg-mint px-4 py-3 sm:-mx-6 sm:px-6 md:hidden">
        <p className="leading-tight">
          <span className="block text-sm text-muted">Total with delivery</span>
          <span className="whitespace-nowrap font-display text-xl font-bold tabular-nums text-forest-deep">{inr(total)}</span>
        </p>
        <Link href="/checkout" className="btn btn-primary">Proceed to checkout</Link>
      </div>
    </section>
  );
}
