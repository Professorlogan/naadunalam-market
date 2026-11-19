"use client";
/**
 * Small motion pieces for the content pages (About, Services, Contact, Reviews, Newsletter, 404).
 * The "variant" pieces (RuleLine, Pop, LeafDot, TickMark) take their timing from the
 * nearest <Stagger>/<StaggerItem> parent, so they draw in step with the row they sit in.
 */
import { animate, motion, useReducedMotion } from "motion/react";
import { useEffect, useRef, useState, type ReactNode } from "react";
import { EASE } from "../motion";

const VIEW = { once: true, margin: "0px 0px -8% 0px" } as const;
const SPRING = { type: "spring", stiffness: 420, damping: 18 } as const;

/** A hairline that draws from the left. Position it with classes (e.g. "absolute inset-x-0 bottom-0 h-px bg-mist"). */
export function RuleLine({ className = "" }: { className?: string }) {
  return <motion.span aria-hidden className={`block origin-left ${className}`} variants={{ hidden: { scaleX: 0 }, show: { scaleX: 1, transition: { duration: 0.7, ease: EASE } } }} />;
}

/** Pops its content in with a small overshoot (icons, number discs). */
export function Pop({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <motion.span aria-hidden className={className} variants={{ hidden: { scale: 0, rotate: -25, opacity: 0 }, show: { scale: 1, rotate: 0, opacity: 1, transition: { ...SPRING, delay: 0.08 } } }}>
      {children}
    </motion.span>
  );
}

/** The leaf-shaped list marker, growing out of its stem corner. */
export function LeafDot({ dark = false }: { dark?: boolean }) {
  return (
    <motion.span aria-hidden className={`mt-[0.55em] h-2.5 w-2.5 shrink-0 origin-bottom-left rounded-[0_60%_0_60%] ${dark ? "bg-sun" : "bg-leaf"}`}
      variants={{ hidden: { scale: 0, rotate: -60 }, show: { scale: 1, rotate: 0, transition: SPRING } }} />
  );
}

/** A check mark that draws itself inside a disc. */
export function TickMark({ dark = false, className = "" }: { dark?: boolean; className?: string }) {
  return (
    <svg aria-hidden viewBox="0 0 24 24" className={className}>
      <motion.circle cx="12" cy="12" r="11" className={dark ? "fill-sun" : "fill-leaf"} variants={{ hidden: { scale: 0, opacity: 0 }, show: { scale: 1, opacity: 1, transition: SPRING } }} />
      <motion.path d="M7 12.6l3.3 3.3L17.2 9" fill="none" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" className={dark ? "stroke-ink" : "stroke-white"}
        variants={{ hidden: { pathLength: 0, opacity: 0 }, show: { pathLength: 1, opacity: 1, transition: { duration: 0.4, ease: EASE, delay: 0.18 } } }} />
    </svg>
  );
}

/** Step numeral shared by every numbered sequence on the content pages: a plain sun-coloured figure, no disc. */
export function StepNumeral({ n, className = "" }: { n: number; className?: string }) {
  return <span aria-hidden className={`block font-display text-5xl font-bold leading-none tabular-nums text-sun ${className}`}>{n}</span>;
}

/** Image reveal: a coloured panel wipes away while the picture settles from a slight zoom. */
export function WipeImage({ children, className = "", panel = "bg-leaf" }: { children: ReactNode; className?: string; panel?: string }) {
  return (
    <motion.div className={`relative overflow-hidden ${className}`} initial="hidden" whileInView="show" viewport={VIEW}>
      <motion.div className="h-full" variants={{ hidden: { scale: 1.14 }, show: { scale: 1, transition: { duration: 1.1, ease: EASE } } }}>{children}</motion.div>
      <motion.span aria-hidden className={`pointer-events-none absolute inset-0 origin-right ${panel}`} variants={{ hidden: { scaleX: 1 }, show: { scaleX: 0, transition: { duration: 0.8, ease: EASE, delay: 0.05 } } }} />
    </motion.div>
  );
}

/** Draws attention to its content once, shortly after it scrolls into view. */
export function PulseOnce({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <motion.div className={`relative inline-block ${className}`} initial="rest" whileInView="pulse" viewport={{ once: true, amount: 0.8 }}>
      <motion.span aria-hidden className="pointer-events-none absolute inset-0 rounded-full bg-sun"
        variants={{ rest: { scale: 1, opacity: 0 }, pulse: { scale: [1, 1.18, 1.3], opacity: [0, 0.5, 0], transition: { duration: 0.8, delay: 1.1, ease: "easeOut" } } }} />
      <motion.div className="relative" variants={{ rest: { scale: 1 }, pulse: { scale: [1, 1.05, 1, 1.04, 1], transition: { duration: 0.8, delay: 1.1, ease: "easeInOut" } } }}>{children}</motion.div>
    </motion.div>
  );
}

/** Success mark: the circle draws, then the check. Plays when it mounts. */
export function SuccessCheck({ size = 44, className = "text-leaf" }: { size?: number; className?: string }) {
  return (
    <svg aria-hidden viewBox="0 0 48 48" width={size} height={size} className={`shrink-0 ${className}`}>
      <motion.circle cx="24" cy="24" r="21" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" transform="rotate(-90 24 24)"
        initial={{ pathLength: 0, opacity: 0 }} animate={{ pathLength: 1, opacity: 1 }} transition={{ duration: 0.6, ease: EASE, delay: 0.15 }} />
      <motion.path d="M14.5 24.8l6.4 6.4 12.8-13.4" fill="none" stroke="currentColor" strokeWidth="3.4" strokeLinecap="round" strokeLinejoin="round"
        initial={{ pathLength: 0, opacity: 0 }} animate={{ pathLength: 1, opacity: 1 }} transition={{ duration: 0.4, ease: EASE, delay: 0.6 }} />
    </svg>
  );
}

/**
 * Wraps the shared newsletter form. A valid submit bubbles up to this wrapper, which then plays a
 * drawn check beside the form's own "thanks" message.
 */
export function SubscribeMoment({ children }: { children: ReactNode }) {
  const [done, setDone] = useState(false);
  return (
    <div onSubmit={() => setDone(true)} className="flex min-h-12 items-center gap-3">
      {done && <SuccessCheck size={40} />}
      <motion.div className="min-w-0 flex-1" animate={done ? { opacity: [0, 1], x: [-14, 0] } : undefined} transition={{ duration: 0.5, ease: EASE, delay: 0.25 }}>
        {children}
      </motion.div>
    </div>
  );
}

/** A step number that counts up from zero after `delay` seconds once `run` is true. */
export function CountIn({ to, run, delay = 0, className = "" }: { to: number; run: boolean; delay?: number; className?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const reduce = useReducedMotion();
  useEffect(() => {
    const el = ref.current;
    if (!run || !el || reduce) return;
    el.textContent = "0";
    const c = animate(0, to, { duration: 0.2 + to * 0.12, delay, ease: "linear", onUpdate: (v) => { el.textContent = String(Math.round(v)); } });
    return () => { c.stop(); el.textContent = String(to); };
  }, [run, to, delay, reduce]);
  return <span ref={ref} className={className}>{to}</span>;
}

