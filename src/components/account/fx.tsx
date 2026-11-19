"use client";
/**
 * Motion pieces shared by the basket, checkout, order and account pages.
 * Built on the site motion kit; transform/opacity only, apart from the height collapse used for lists and accordions.
 */
import { animate, AnimatePresence, motion, useAnimationControls, useReducedMotion } from "motion/react";
import { useEffect, useRef, type ReactNode } from "react";
import { Check } from "lucide-react";
import { inr } from "../../lib/format";
import { EASE } from "../motion";

/** Props for an element that collapses its height as it enters or leaves a list. Give the element `overflow-hidden`. */
export function useCollapse() {
  const reduce = useReducedMotion();
  return {
    initial: { opacity: 0, height: 0 },
    animate: { opacity: 1, height: "auto" },
    exit: { opacity: 0, height: 0 },
    transition: reduce ? { duration: 0 } : { duration: 0.38, ease: EASE },
  } as const;
}

/** A rupee amount that ticks from its old value to the new one when it changes. */
export function Ticker({ value, className }: { value: number; className?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const prev = useRef(value);
  const reduce = useReducedMotion();
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const from = prev.current;
    prev.current = value;
    if (from === value || reduce) { el.textContent = inr(value); return; }
    const c = animate(from, value, {
      duration: 0.5, ease: EASE,
      onUpdate: (v) => { el.textContent = inr(Math.round(v)); },
      onComplete: () => { el.textContent = inr(value); },
    });
    return () => { c.stop(); el.textContent = inr(value); };
  }, [value, reduce]);
  return <span ref={ref} className={className}>{inr(value)}</span>;
}

/** Shakes its content once each time `tick` changes while `on` is true (a failed submit with this field in error). */
export function Shake({ on, tick, children, className }: { on: boolean; tick: number; children: ReactNode; className?: string }) {
  const controls = useAnimationControls();
  const seen = useRef(tick);
  useEffect(() => {
    if (seen.current === tick) return;
    seen.current = tick;
    if (on) void controls.start({ x: [0, -8, 8, -5, 5, 0], transition: { duration: 0.42, ease: "easeInOut" } });
  }, [tick, on, controls]);
  return <motion.div className={className} animate={controls}>{children}</motion.div>;
}

/** Validation message that slides in under its field. Renders nothing when there is no message. */
export function FieldError({ id, message }: { id: string; message?: string }) {
  return (
    <AnimatePresence initial={false}>
      {message && (
        <motion.p key="e" id={id} className="mt-1.5 text-[15px] font-semibold text-soil"
          initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -4 }} transition={{ duration: 0.25, ease: EASE }}>
          {message}
        </motion.p>
      )}
    </AnimatePresence>
  );
}

/** Empty-basket picture built from plain shapes: a basket with three leaves drifting above it. */
export function EmptyArt() {
  const leaves = [
    { c: "bg-leaf", x: "18%", y: "8%", s: "h-6 w-6", d: "0s" },
    { c: "bg-sun", x: "46%", y: "0%", s: "h-5 w-5", d: "-2s" },
    { c: "bg-water", x: "70%", y: "14%", s: "h-4 w-4", d: "-4s" },
  ];
  return (
    <motion.div aria-hidden className="relative mb-6 h-28 w-32" initial={{ opacity: 0, scale: 0.85 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.6, ease: EASE }}>
      {leaves.map((l) => (
        <span key={l.c} className={`nn-float absolute rounded-[0_60%_0_60%] ${l.c} ${l.s}`} style={{ left: l.x, top: l.y, animationDelay: l.d }} />
      ))}
      <span className="absolute bottom-[3.1rem] left-1/2 h-9 w-16 -translate-x-1/2 rounded-t-full border-[5px] border-b-0 border-soil" />
      <span className="absolute bottom-10 left-0 h-3 w-full rounded-full bg-soil" />
      <span className="absolute bottom-0 left-[8%] flex h-11 w-[84%] justify-evenly overflow-hidden rounded-b-3xl bg-sun">
        <i className="h-full w-1 bg-soil/35" /><i className="h-full w-1 bg-soil/35" /><i className="h-full w-1 bg-soil/35" /><i className="h-full w-1 bg-soil/35" />
      </span>
    </motion.div>
  );
}

/** Circle and tick that draw themselves (SVG pathLength). */
export function DrawnCheck({ size = 56, className = "" }: { size?: number; className?: string }) {
  return (
    <svg aria-hidden width={size} height={size} viewBox="0 0 56 56" fill="none" className={className}>
      <motion.circle cx="28" cy="28" r="25" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round"
        initial={{ pathLength: 0, opacity: 0 }} animate={{ pathLength: 1, opacity: 1 }} transition={{ duration: 0.7, ease: EASE, delay: 0.15 }} />
      <motion.path d="M17 29.5l7.5 7.5L40 20.5" stroke="currentColor" strokeWidth="4.5" strokeLinecap="round" strokeLinejoin="round"
        initial={{ pathLength: 0, opacity: 0 }} animate={{ pathLength: 1, opacity: 1 }} transition={{ duration: 0.45, ease: EASE, delay: 0.7 }} />
    </svg>
  );
}

/** Sun, water, leaf and soil from the logo palette. */
const BURST = ["#f9b52c", "#0c8fc7", "#0f804a", "#f9b52c", "#6b3a2c", "#0c8fc7"];
/** One burst of leaf shapes from its centre. Plays once; not rendered at all for people who ask for reduced motion. */
export function LeafBurst({ count = 30, delay = 0.95 }: { count?: number; delay?: number }) {
  const reduce = useReducedMotion();
  if (reduce) return null;
  return (
    <span aria-hidden className="pointer-events-none absolute left-1/2 top-1/2 z-10 block h-0 w-0">
      {Array.from({ length: count }, (_, i) => {
        // Spread from the index (no randomness, so server and client agree): a fan aimed up and to the right.
        const angle = (-200 + (i * 240) / count + (i % 3) * 9) * (Math.PI / 180);
        const dist = 70 + ((i * 37) % 90);
        const size = 8 + ((i * 5) % 9);
        const x = Math.cos(angle) * dist;
        const y = Math.sin(angle) * dist;
        return (
          <motion.span key={i} className="absolute block rounded-[0_60%_0_60%]"
            style={{ width: size, height: size, left: -size / 2, top: -size / 2, background: BURST[i % BURST.length] }}
            initial={{ x: 0, y: 0, opacity: 0, scale: 0.3, rotate: 0 }}
            animate={{ x: [0, x, x * 1.12], y: [0, y, y + 46], opacity: [0, 1, 0], scale: [0.3, 1, 0.8], rotate: (i % 2 ? 1 : -1) * (120 + ((i * 53) % 200)) }}
            transition={{ duration: 1.5 + (i % 5) * 0.12, ease: "easeOut", times: [0, 0.4, 1], delay: delay + (i % 6) * 0.02 }} />
        );
      })}
    </span>
  );
}

/** Text that appears character by character from behind a mask (order numbers). Screen readers get the plain text. */
export function RevealChars({ text, delay = 0, className }: { text: string; delay?: number; className?: string }) {
  return (
    <span className={className}>
      <span className="sr-only">{text}</span>
      <motion.span aria-hidden initial="hidden" animate="show" variants={{ hidden: {}, show: { transition: { staggerChildren: 0.045, delayChildren: delay } } }}>
        {Array.from(text).map((ch, i) => (
          <span key={i} className="inline-block overflow-hidden align-bottom">
            <motion.span className="inline-block" variants={{ hidden: { y: "110%" }, show: { y: 0, transition: { duration: 0.5, ease: EASE } } }}>{ch}</motion.span>
          </span>
        ))}
      </motion.span>
    </span>
  );
}

/**
 * Where an order stands. In this prototype an order is only ever "placed", so the first step is the one marked done;
 * the line draws to it and the remaining steps are shown as still to come.
 */
export function OrderTimeline({ placedOn }: { placedOn: string }) {
  const steps = [
    { label: "Order placed", note: placedOn, done: true },
    { label: "Packed by the seller", note: "Within 24–48 hours on business days", done: false },
    { label: "On its way", note: "Sent to your address", done: false },
    { label: "Delivered", note: "You pay in cash", done: false },
  ];
  return (
    <ol aria-label="Order status" className="grid gap-y-4 sm:grid-cols-4 sm:gap-x-4">
      {steps.map((s, i) => (
        <motion.li key={s.label} className="relative flex gap-3 sm:block" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.45, ease: EASE, delay: 0.1 + i * 0.12 }}>
          {i < steps.length - 1 && (
            <>
              <span aria-hidden className="absolute -bottom-4 left-[0.8125rem] top-7 w-0.5 bg-mist sm:-right-4 sm:bottom-auto sm:left-7 sm:top-[0.8125rem] sm:h-0.5 sm:w-auto" />
              {i === 0 && (
                <motion.span aria-hidden className="absolute left-[0.8125rem] top-7 h-[calc(50%-0.5rem)] w-0.5 origin-top-left bg-leaf sm:left-7 sm:top-[0.8125rem] sm:h-0.5 sm:w-[calc(50%-0.5rem)]"
                  initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ duration: 0.7, ease: EASE, delay: 0.45 }} />
              )}
            </>
          )}
          <motion.span aria-hidden className={`relative grid h-7 w-7 shrink-0 place-items-center rounded-full border-2 ${s.done ? "border-leaf bg-leaf text-white" : "border-mist bg-white"}`}
            initial={{ scale: 0.4 }} animate={{ scale: 1 }} transition={{ type: "spring", stiffness: 420, damping: 22, delay: 0.15 + i * 0.12 }}>
            {s.done && <Check size={15} strokeWidth={3} />}
          </motion.span>
          <span className="block sm:mt-2">
            <span className={`block font-semibold leading-snug ${s.done ? "text-forest-deep" : "text-muted"}`}>
              {s.label}<span className="sr-only">{s.done ? " (done)" : " (to come)"}</span>
            </span>
            <span className="block text-sm text-muted">{s.note}</span>
          </span>
        </motion.li>
      ))}
    </ol>
  );
}
