"use client";
/** Small client-side motion pieces for the community and seller pages. Transform and opacity only. */
import { createContext, useContext, useEffect, useRef, type ReactNode } from "react";
import { motion, useMotionValue, useScroll, useSpring, useTransform, type MotionValue } from "motion/react";
import { EASE } from "../motion";

/** Badge that pops in with a spring the first time it is seen (monograms, icons). */
export function Pop({ children, className, delay = 0 }: { children?: ReactNode; className?: string; delay?: number }) {
  return (
    <motion.span aria-hidden className={className} initial={{ scale: 0.4, opacity: 0 }} whileInView={{ scale: 1, opacity: 1 }}
      viewport={{ once: true, margin: "0px 0px -6% 0px" }} transition={{ type: "spring", stiffness: 420, damping: 16, delay }}>
      {children}
    </motion.span>
  );
}

/** Image that starts slightly enlarged and settles to rest when the page loads. Never hidden, so it shows without JS. */
export function SettleImage({ src, width, height, className }: { src: string; width: number; height: number; className?: string }) {
  return (
    <motion.img src={src} alt="" width={width} height={height} className={className}
      initial={{ scale: 1.12 }} animate={{ scale: 1 }} transition={{ duration: 1.4, ease: EASE }} />
  );
}

/** A line that draws itself from the left when it scrolls into view. */
export function DrawLine({ className, delay = 0 }: { className?: string; delay?: number }) {
  return (
    <motion.span aria-hidden className={`block origin-left ${className ?? ""}`} initial={{ scaleX: 0 }} whileInView={{ scaleX: 1 }}
      viewport={{ once: true, margin: "0px 0px -8% 0px" }} transition={{ duration: 0.7, ease: EASE, delay }} />
  );
}

/** Placeholder lines with a light sweep, for content that is still being gathered. Decorative only. */
export function SkeletonLines({ widths = ["w-11/12", "w-full", "w-4/5", "w-2/3"] }: { widths?: string[] }) {
  return (
    <div aria-hidden className="mt-6 space-y-3">
      {widths.map((w, i) => (
        <div key={i} className={`relative h-3.5 overflow-hidden rounded-full bg-mist ${w}`}>
          <motion.span className="absolute inset-y-0 left-0 w-1/3 bg-gradient-to-r from-transparent via-white to-transparent"
            initial={{ x: "-120%" }} animate={{ x: "420%" }} transition={{ duration: 1.8, ease: "linear", repeat: Infinity, repeatDelay: 0.6, delay: i * 0.15 }} />
        </div>
      ))}
    </div>
  );
}

/* ------------------------------------------------------------ reading progress */

const ReadingCtx = createContext<MotionValue<number> | null>(null);

/** Wraps the article body and measures how far the reader has scrolled through it. */
export function ReadingScope({ children, className }: { children: ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 0.35", "end 0.75"] });
  return (
    <ReadingCtx.Provider value={scrollYProgress}>
      <div ref={ref} className={className}>{children}</div>
    </ReadingCtx.Provider>
  );
}

/** Ring that fills as the article is read. Decorative: the page's own scrollbar carries the same information. */
export function ReadingRing({ minutes, floating = false }: { minutes: number; floating?: boolean }) {
  const fallback = useMotionValue(0);
  const raw = useContext(ReadingCtx) ?? fallback;
  const progress = useSpring(raw, { stiffness: 140, damping: 26, mass: 0.4 });
  const left = useTransform(raw, (v) => {
    const m = Math.ceil(minutes * (1 - v));
    return v >= 0.995 ? "Finished" : m <= 1 ? "Under a minute left" : `${m} minutes left`;
  });
  const pct = useTransform(raw, (v) => `${Math.round(v * 100)}%`);
  const fade = useTransform(raw, [0, 0.03, 0.97, 1], [0, 1, 1, 0]);
  const C = 2 * Math.PI * 20;
  const dash = useTransform(progress, (v) => C * (1 - v));
  const ring = (
    <svg viewBox="0 0 48 48" className="h-12 w-12 shrink-0 -rotate-90">
      <circle cx="24" cy="24" r="20" fill="none" strokeWidth="5" className="stroke-mist" />
      <motion.circle cx="24" cy="24" r="20" fill="none" strokeWidth="5" strokeLinecap="round" className="stroke-leaf" strokeDasharray={C} style={{ strokeDashoffset: dash }} />
    </svg>
  );
  if (floating) {
    return (
      <motion.div aria-hidden style={{ opacity: fade }}
        className="pointer-events-none fixed bottom-24 left-4 z-40 grid place-items-center rounded-full bg-white p-1 shadow-lift lg:hidden">
        {ring}
        <motion.span className="absolute text-sm font-semibold tabular-nums text-forest-deep">{pct}</motion.span>
      </motion.div>
    );
  }
  return (
    <div aria-hidden className="mb-5 hidden items-center gap-4 rounded-[1.25rem] border border-mist bg-white p-4 lg:flex">
      <div className="relative grid place-items-center">
        {ring}
        <motion.span className="absolute text-sm font-semibold tabular-nums text-forest-deep">{pct}</motion.span>
      </div>
      <p className="leading-snug">
        <span className="block font-display font-semibold text-forest-deep">Reading progress</span>
        <motion.span className="block text-sm text-muted">{left}</motion.span>
      </p>
    </div>
  );
}

/* ------------------------------------------------------------ headings inside captured HTML */

/**
 * Section headings inside server-rendered HTML (articles, policies) rise into place the first time they are
 * scrolled to. Headings already on screen at load, and everything when reduced motion is on, are left alone.
 * Nothing is hidden beforehand, so the text reads the same without JS.
 */
export function HeadingReveal({ scope, selector = "h2" }: { scope: string; selector?: string }) {
  useEffect(() => {
    const root = document.querySelector(scope);
    if (!root || window.matchMedia("(prefers-reduced-motion: reduce)").matches || !("IntersectionObserver" in window)) return;
    const below = [...root.querySelectorAll<HTMLElement>(selector)].filter((h) => h.getBoundingClientRect().top > window.innerHeight);
    const io = new IntersectionObserver((entries) => {
      for (const e of entries) {
        if (!e.isIntersecting) continue;
        io.unobserve(e.target);
        e.target.animate(
          [{ opacity: 0, transform: "translateY(18px)" }, { opacity: 1, transform: "none" }],
          { duration: 650, easing: "cubic-bezier(0.22, 1, 0.36, 1)" },
        );
      }
    }, { rootMargin: "0px 0px -8% 0px" });
    below.forEach((h) => io.observe(h));
    return () => io.disconnect();
  }, [scope, selector]);
  return null;
}
