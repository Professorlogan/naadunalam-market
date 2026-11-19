"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useRef } from "react";
import { Trash2, X } from "lucide-react";
import { stores } from "../lib/data";
import { inr } from "../lib/format";
import { lineInfo, useStore } from "../lib/store";
import { useFocusTrap } from "./motion/useFocusTrap";
import QtyStepper from "./QtyStepper";

export default function CartDrawer() {
  const { drawerOpen, setDrawerOpen, cart, setQty, remove, subtotal, delivery, total, toast } = useStore();
  const pathname = usePathname();
  useEffect(() => setDrawerOpen(false), [pathname, setDrawerOpen]);
  const panel = useRef<HTMLDivElement>(null);
  useFocusTrap(panel, drawerOpen, () => setDrawerOpen(false));
  useEffect(() => { document.body.style.overflow = drawerOpen ? "hidden" : ""; }, [drawerOpen]);
  return (
    <>
      <div aria-live="polite" className="pointer-events-none fixed inset-x-0 bottom-24 z-[60] md:bottom-6 flex justify-center px-4">
        <AnimatePresence>{toast && <motion.p key={toast} initial={{ opacity: 0, y: 24, scale: 0.92 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 12, scale: 0.96 }} transition={{ type: "spring", stiffness: 420, damping: 28 }} className="rounded-full bg-ink px-5 py-3 text-white shadow-lift">{toast}</motion.p>}</AnimatePresence>
      </div>
      <AnimatePresence>
      {drawerOpen && (
        <div ref={panel} className="fixed inset-0 z-50" role="dialog" aria-modal="true" aria-label="Your basket">
          <motion.button initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }} type="button" tabIndex={-1} aria-label="Close basket" className="absolute inset-0 bg-ink/50" onClick={() => setDrawerOpen(false)} />
          <motion.div initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }} transition={{ duration: 0.28, ease: [0.2, 0.75, 0.25, 1] }} className="absolute inset-y-0 right-0 flex w-[min(29rem,100vw)] flex-col bg-white">
            <div className="flex items-center justify-between border-b border-mist px-5 py-3">
              <h2 className="text-2xl font-bold">Your basket</h2>
              <button type="button" aria-label="Close basket" onClick={() => setDrawerOpen(false)} className="grid h-11 w-11 place-items-center rounded-full hover:bg-sky"><X /></button>
            </div>
            {cart.length === 0 ? (
              <div className="flex flex-1 flex-col items-start justify-center gap-4 px-6">
                <p className="font-display text-2xl font-semibold text-forest-deep">Your basket is empty</p>
                <p className="text-muted">Add rice, millets, oils or anything else from any seller. You check out once.</p>
                <Link href="/shop" className="btn btn-primary">Browse the shop</Link>
              </div>
            ) : (
              <>
                <div className="flex-1 space-y-3 overflow-y-auto overflow-x-hidden bg-sky px-4 py-4">
                  {stores.filter((st) => cart.some((l) => lineInfo(l)?.product.vendor === st.slug)).map((st) => (
                    <section key={st.slug} aria-label={`From ${st.name}`} className="rounded-xl border border-mist bg-white">
                      <h3 className="border-b border-mist px-4 py-2.5 font-body text-sm font-semibold text-muted">From <Link href={`/store/${st.slug}`} className="font-bold text-leaf hover:underline">{st.name}</Link></h3>
                      <ul className="divide-y divide-mist px-4">
                        <AnimatePresence initial={false}>{cart.map((l) => {
                          const i = lineInfo(l); if (!i || i.product.vendor !== st.slug) return null;
                          return (
                            <motion.li layout initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0, height: 0 }} transition={{ duration: 0.2 }} key={`${l.id}-${l.variantId ?? 0}`} className="flex gap-3 py-3">
                              {/* eslint-disable-next-line @next/next/no-img-element */}
                              <img src={i.product.images[0]?.src} alt="" width={64} height={64} className="h-16 w-16 rounded-lg object-cover" />
                              <div className="min-w-0 flex-1">
                                <Link href={`/product/${i.product.slug}`} className="line-clamp-2 text-[15px] font-semibold leading-snug hover:text-leaf">{i.product.name}</Link>
                                <p className="text-[13px] text-muted">{i.pack} · {inr(i.price)}</p>
                                <div className="mt-1.5 flex items-center justify-between">
                                  <QtyStepper value={l.qty} max={i.product.maxQty} onChange={(n) => setQty(l.id, l.variantId, n)} label={`Quantity of ${i.product.name}`} />
                                  <span className="whitespace-nowrap font-semibold">{inr(i.total)}</span>
                                </div>
                              </div>
                              <button type="button" aria-label={`Remove ${i.product.name} (${i.pack})`} onClick={() => remove(l.id, l.variantId)} className="grid h-11 w-11 shrink-0 place-items-center self-start rounded-full text-muted hover:bg-sky hover:text-soil"><Trash2 size={17} /></button>
                            </motion.li>
                          );
                        })}</AnimatePresence>
                      </ul>
                    </section>
                  ))}
                </div>
                <div className="border-t border-mist bg-white px-5 py-4">
                  <dl className="space-y-1">
                    <div className="flex justify-between"><dt>Subtotal</dt><dd>{inr(subtotal)}</dd></div>
                    <div className="flex justify-between"><dt>Delivery (flat)</dt><dd>{inr(delivery)}</dd></div>
                    <div className="flex justify-between pt-1 font-display text-xl font-bold text-forest-deep"><dt>Total</dt><dd>{inr(total)}</dd></div>
                  </dl>
                  <div className="mt-4 grid grid-cols-2 gap-3">
                    <Link href="/cart" className="btn btn-ghost">View basket</Link>
                    <Link href="/checkout" className="btn btn-primary">Checkout</Link>
                  </div>
                  <p className="mt-3 text-center text-sm text-muted">Pay by cash when your order arrives.</p>
                </div>
              </>
            )}
          </motion.div>
        </div>
      )}
      </AnimatePresence>
    </>
  );
}
