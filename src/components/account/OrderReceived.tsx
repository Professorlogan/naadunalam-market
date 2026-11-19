"use client";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect } from "react";
import { motion } from "motion/react";
import { SearchX } from "lucide-react";
import { site } from "../../lib/data";
import { inr } from "../../lib/format";
import { useStore } from "../../lib/store";
import { EASE, Reveal, SplitWords } from "../motion";
import { DrawnCheck, LeafBurst, RevealChars } from "./fx";
import { OrderDetail } from "./OrderBits";
import { EmptyState, orderDate, PrototypeNote, Skeleton } from "./shared";

const steps = [
  { title: "The seller packs your order", text: "Orders are packed within 24–48 hours on business days. Items from different sellers may be packed separately." },
  { title: "It is sent to your address", text: `${site.deliveryLine}. The seller may call your mobile number about delivery.` },
  { title: "You pay cash on delivery", text: "Keep the order total ready in cash. Nothing has been charged online." },
];

export default function OrderReceived() {
  const number = useSearchParams().get("order");
  const { ready, orders } = useStore();
  // The confirmation is reached from the bottom of the checkout form, so start at the top of the page.
  useEffect(() => { window.scrollTo(0, 0); }, [ready]);
  if (!ready) return <Skeleton rows={2} label="Loading your order" />;
  const order = orders.find((o) => o.number === number);
  if (!order) {
    return (
      <EmptyState
        icon={SearchX}
        tint="bg-peach"
        title={number ? "We could not find that order" : "No order to show"}
        text={number
          ? `Order ${number} is not saved in this browser. Orders in this prototype are kept only on the device where they were placed.`
          : "This page shows the confirmation right after you place an order."}
      >
        <Link href="/my-orders" className="btn btn-primary">See my orders</Link>
        <Link href="/shop" className="btn btn-ghost">Go to the shop</Link>
      </EmptyState>
    );
  }
  return (
    <>
      <section className="wrap py-8 sm:py-12">
        <div className="rounded-[1.75rem] border border-mist bg-white">
          <div className="flex flex-wrap items-center gap-5 rounded-t-[1.7rem] bg-aqua p-5 sm:p-8">
            <span className="relative grid h-24 w-24 shrink-0 place-items-center rounded-full bg-leaf text-white">
              <DrawnCheck size={60} />
              <LeafBurst />
            </span>
            <motion.div className="min-w-0 flex-1" initial={{ opacity: 0, x: -14 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6, ease: EASE, delay: 0.5 }}>
              <h2 className="text-2xl font-bold text-forest-deep sm:text-3xl">Thank you, {order.customer.name}. Your order is in.</h2>
              <p lang="ta" className="ta mt-1 font-display text-lg text-leaf">நன்றி</p>
            </motion.div>
            <motion.dl className="grid w-full grid-cols-2 gap-x-6 gap-y-3 rounded-[1.25rem] bg-white p-4 sm:w-auto sm:grid-cols-3 sm:px-6" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5, delay: 0.8 }}>
              <div><dt className="text-sm text-muted">Order number</dt><dd className="whitespace-nowrap font-display text-xl font-bold text-forest-deep"><RevealChars text={order.number} delay={1} /></dd></div>
              <div><dt className="text-sm text-muted">Placed on</dt><dd className="font-display text-xl font-bold text-forest-deep">{orderDate(order.date)}</dd></div>
              <div><dt className="text-sm text-muted">To pay on delivery</dt><dd className="whitespace-nowrap font-display text-xl font-bold tabular-nums text-forest-deep">{inr(order.total)}</dd></div>
            </motion.dl>
          </div>
          <Reveal y={18} delay={0.2} className="p-5 sm:p-8"><OrderDetail order={order} /></Reveal>
        </div>
        <Reveal y={14} className="mt-6 max-w-3xl">
          <PrototypeNote>This order was saved in your browser only. No seller has been notified and nothing will be delivered.</PrototypeNote>
        </Reveal>
      </section>

      <section className="wrap pb-6 sm:pb-8">
        <div className="rounded-[2rem] bg-butter px-5 pb-8 pt-10 sm:px-8 sm:pb-10 sm:pt-12 lg:px-10">
          <h2 className="text-3xl font-bold text-forest-deep sm:text-4xl"><SplitWords text="What happens next" inView /></h2>
          <motion.ol className="mt-6 grid gap-6 md:grid-cols-3" initial="hidden" whileInView="show" viewport={{ once: true, margin: "0px 0px -8% 0px" }}
            variants={{ hidden: {}, show: { transition: { staggerChildren: 0.22, delayChildren: 0.15 } } }}>
            {steps.map((s, i) => (
              <motion.li key={s.title} className="relative flex gap-4 md:block" variants={{ hidden: { opacity: 0, y: 22 }, show: { opacity: 1, y: 0, transition: { duration: 0.55, ease: EASE } } }}>
                {/* Progress line to the next step: down the side on phones, across the top from tablet up. Drawn after its step appears. */}
                {i < steps.length - 1 && (
                  <motion.span aria-hidden className="absolute -bottom-6 left-[1.3125rem] top-11 w-0.5 origin-top-left bg-leaf/40 md:-right-6 md:bottom-auto md:left-11 md:top-[1.3125rem] md:h-0.5 md:w-auto"
                    variants={{ hidden: { scale: 0 }, show: { scale: 1, transition: { duration: 0.6, ease: EASE, delay: 0.2 } } }} />
                )}
                <span aria-hidden className="relative grid h-11 w-11 shrink-0 place-items-center rounded-full bg-leaf font-display text-2xl font-bold leading-none text-white">{i + 1}</span>
                <div className="md:mt-3">
                  <h3 className="text-xl font-bold">{s.title}</h3>
                  <p className="mt-1.5 text-muted">{s.text}</p>
                </div>
              </motion.li>
            ))}
          </motion.ol>
          <Reveal y={14} delay={0.2} className="mt-8 flex flex-wrap gap-3">
            <Link href="/my-orders" className="btn btn-primary">See my orders</Link>
            <Link href="/shop" className="btn btn-ghost">Continue shopping</Link>
          </Reveal>
        </div>
      </section>
    </>
  );
}
