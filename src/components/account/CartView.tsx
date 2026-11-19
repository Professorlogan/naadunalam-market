"use client";
import Link from "next/link";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { Trash2 } from "lucide-react";
import { site } from "../../lib/data";
import { inr, unitPrice } from "../../lib/format";
import { useStore } from "../../lib/store";
import QtyStepper from "../QtyStepper";
import { emptyCard, groupBySeller, lineKey, SellerLink, Skeleton, summaryTitle, toolLink, Totals } from "./shared";

export default function CartView() {
  const { ready, cart, count, setQty, remove, clearCart, subtotal, delivery, total } = useStore();
  const reduce = useReducedMotion();
  if (!ready) return <Skeleton label="Loading your basket" />;
  const groups = groupBySeller(cart);
  if (groups.length === 0) {
    return (
      <section className="wrap pb-6 pt-10 sm:pb-8 sm:pt-14">
        <div className={emptyCard}>
          <h2 className="text-2xl font-bold">Your basket is empty</h2>
          <p className="mt-2 text-muted">Add rice, millets, oils or anything else from any seller. You check out once, and pay by cash when the order arrives.</p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link href="/shop" className="btn btn-primary">Browse the shop</Link>
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
                    <section aria-label={`Your ${g.name} order`} className="card mb-6 overflow-hidden">
                      <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1 border-b border-mist px-4 py-3.5 sm:px-6">
                        <h2 className="text-lg font-bold sm:text-xl">Your <SellerLink slug={g.slug} name={g.name} /> order</h2>
                        <p className="text-[15px] text-muted">
                          {items} {items === 1 ? "item" : "items"} · <span className="whitespace-nowrap font-semibold tabular-nums text-forest-deep">{inr(sellerTotal)}</span>
                          <span className="sr-only"> subtotal</span>
                        </p>
                      </div>
                      <ul>
                        <AnimatePresence initial={false}>
                          {g.lines.map(({ line: l, info: i }) => {
                            const per = unitPrice(i.price, i.pack);
                            return (
                              <motion.li key={lineKey(l)} className="overflow-hidden border-mist [&:not(:first-child)]:border-t" {...collapse}>
                                <div className="grid grid-cols-[5rem_minmax(0,1fr)] gap-x-4 gap-y-3 p-4 @xl:grid-cols-[6rem_minmax(0,1fr)_auto_6.5rem_2.75rem] @xl:items-center sm:px-6">
                                  <Link href={`/product/${i.product.slug}`} className="self-start">
                                    {/* eslint-disable-next-line @next/next/no-img-element */}
                                    <img src={i.product.images[0]?.src} alt={i.product.images[0]?.alt ?? i.product.name} width={96} height={96} className="aspect-square w-full rounded-lg bg-sky object-cover" />
                                  </Link>
                                  <div className="min-w-0">
                                    <Link href={`/product/${i.product.slug}`} className="line-clamp-2 font-display text-base font-semibold leading-snug text-forest-deep hover:underline sm:text-lg">{i.product.name}</Link>
                                    {i.product.nameTa && <p lang="ta" className="ta line-clamp-2 whitespace-normal text-[15px] text-leaf">{i.product.nameTa}</p>}
                                    <p className="mt-1 text-[15px] text-muted">{i.pack} · <span className="whitespace-nowrap">{inr(i.price)} each</span></p>
                                    {per && <p className="text-sm tabular-nums text-muted">{per}</p>}
                                  </div>
                                  {/* Narrow: one full-width row (stepper, total, remove) so the total never has to wrap. Wide: three grid cells. */}
                                  <div className="col-span-2 flex items-center gap-3 @xl:contents">
                                    <QtyStepper value={l.qty} max={i.product.maxQty} onChange={(n) => setQty(l.id, l.variantId, n)} label={`Quantity of ${i.product.name}`} />
                                    <p className="min-w-0 flex-1 whitespace-nowrap text-right font-display text-lg font-bold tabular-nums text-forest-deep">
                                      <span className="sr-only">Line total </span>{inr(i.total)}
                                    </p>
                                    <button type="button" aria-label={`Remove ${i.product.name}, ${i.pack}, from basket`} onClick={() => remove(l.id, l.variantId)}
                                      className="grid h-11 min-h-11 w-11 min-w-11 shrink-0 place-items-center rounded-lg text-muted transition-colors duration-150 hover:bg-sky hover:text-soil">
                                      <Trash2 size={18} />
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

        <aside aria-labelledby="summary-title" className="card p-5 sm:p-6 md:sticky md:top-28">
          <h2 id="summary-title" className={summaryTitle}>Order summary</h2>
          <Totals subtotal={subtotal} delivery={delivery} total={total} />
          <p className="mt-3 text-[15px] font-semibold text-forest-deep">One delivery charge covers all sellers in this order.</p>
          <p className="mt-2 text-[15px] text-muted">{site.deliveryLine}. Pay by cash when your order arrives.</p>
          <Link href="/checkout" className="btn btn-primary mt-5 hidden w-full md:inline-flex">Proceed to checkout</Link>
        </aside>
      </div>

      {/* Phone only: the summary's checkout button is used from tablet up. */}
      <div className="sticky bottom-0 z-30 -mx-4 mt-6 flex items-center justify-between gap-4 border-t border-mist bg-white px-4 py-3 sm:-mx-6 sm:px-6 md:hidden">
        <p className="leading-tight">
          <span className="block text-sm text-muted">Total with delivery</span>
          <span className="whitespace-nowrap font-display text-xl font-bold tabular-nums text-forest-deep">{inr(total)}</span>
        </p>
        <Link href="/checkout" className="btn btn-primary">Proceed to checkout</Link>
      </div>
    </section>
  );
}
