"use client";
import Link from "next/link";
import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { ChevronDown, Package } from "lucide-react";
import { inr } from "../../lib/format";
import { useStore } from "../../lib/store";
import { EASE, Reveal } from "../motion";
import { OrderTimeline, useCollapse } from "./fx";
import { OrderDetail } from "./OrderBits";
import { EmptyState, orderDate, Skeleton } from "./shared";

export default function MyOrders() {
  const { ready, orders } = useStore();
  // Which orders are open. `null` means "nothing chosen yet": the newest order starts open.
  const [open, setOpen] = useState<string[] | null>(null);
  const collapse = useCollapse();
  if (!ready) return <Skeleton label="Loading your orders" />;
  if (orders.length === 0) {
    return (
      <EmptyState icon={Package} tint="bg-aqua" title="You have not placed an order yet" text="When you place an order it appears here with its items, total and delivery address. Orders in this prototype are saved in this browser only.">
        <Link href="/shop" className="btn btn-primary">Start shopping</Link>
        <Link href="/cart" className="btn btn-ghost">Open your basket</Link>
      </EmptyState>
    );
  }
  const sorted = [...orders].sort((a, b) => b.date.localeCompare(a.date));
  const openList = open ?? [sorted[0].number];
  const toggle = (n: string) => setOpen(openList.includes(n) ? openList.filter((x) => x !== n) : [...openList, n]);
  return (
    <section className="wrap pb-5 pt-8 sm:pb-6 sm:pt-12">
      <Reveal as="p" y={12} className="mb-5 text-muted">
        {sorted.length} {sorted.length === 1 ? "order" : "orders"}, newest first. Orders in this prototype are saved in this browser only.
      </Reveal>
      <ul className="space-y-4">
        {sorted.map((o, idx) => {
          const items = o.lines.reduce((s, l) => s + l.qty, 0);
          const isOpen = openList.includes(o.number);
          const panel = `order-${o.number}`;
          return (
            <motion.li key={o.number} initial={{ opacity: 0, y: 22 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.55, ease: EASE, delay: Math.min(idx, 6) * 0.07 }}>
              <div className={`overflow-hidden rounded-[1.25rem] border bg-white transition-shadow duration-300 ${isOpen ? "border-leaf/40 shadow-[0_18px_40px_-22px_rgb(23_39_30/0.45)]" : "border-mist"}`}>
                <h2 className="t-h4 font-body font-normal">
                  <button type="button" aria-expanded={isOpen} aria-controls={panel} onClick={() => toggle(o.number)}
                    className="flex min-h-14 w-full cursor-pointer flex-wrap items-center gap-x-8 gap-y-2 px-4 py-4 text-left transition-colors hover:bg-mint/50 sm:px-6">
                    <span className="min-w-0 flex-1 basis-40">
                      <span className="block font-display text-xl font-bold text-forest-deep">Order {o.number}</span>
                      <span className="block text-[15px] text-muted">{orderDate(o.date)} · {items} {items === 1 ? "item" : "items"}</span>
                    </span>
                    <span className="rounded-full bg-butter px-3 py-1 text-sm font-semibold text-ink">Cash on delivery</span>
                    <span className="whitespace-nowrap font-display text-xl font-bold tabular-nums text-forest-deep">{inr(o.total)}</span>
                    <span className="flex items-center gap-1 rounded-full border border-mist px-3 py-1.5 text-[15px] font-semibold text-leaf">
                      {isOpen ? "Hide details" : "Show details"}
                      <motion.span aria-hidden className="grid" animate={{ rotate: isOpen ? 180 : 0 }} transition={{ type: "spring", stiffness: 320, damping: 24 }}><ChevronDown size={18} /></motion.span>
                    </span>
                  </button>
                </h2>
                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div key="panel" id={panel} role="region" aria-label={`Details of order ${o.number}`} className="overflow-hidden" {...collapse}>
                      <div className="space-y-6 border-t border-mist p-4 sm:p-6">
                        <OrderTimeline placedOn={orderDate(o.date)} />
                        <OrderDetail order={o} />
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.li>
          );
        })}
      </ul>
      <Reveal as="p" y={12} className="mt-8"><Link href="/shop" className="btn btn-ghost">Continue shopping</Link></Reveal>
    </section>
  );
}
