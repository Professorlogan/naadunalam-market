"use client";
/**
 * Motion kit for the whole site. Everything here animates transform/opacity only and
 * respects "reduce motion" (MotionProvider sets reducedMotion="user").
 */
import { animate, motion, MotionConfig, useInView, useMotionValue, useReducedMotion, useScroll, useSpring, useTransform } from "motion/react";
import { usePathname } from "next/navigation";
import { useEffect, useRef, type ReactNode, type PointerEvent as RPointerEvent } from "react";

export const EASE = [0.22, 1, 0.36, 1] as const;
// Trigger as soon as any part is on screen, so content can never stay hidden near the bottom of a page.
const VIEW = { once: true, amount: 0, margin: "0px 0px 0px 0px" } as const;

/**
 * Shopping pages stay calm: entrance animations are switched off there and only quick
 * interaction feedback remains. Story pages (home, about, sellers...) keep the expressive motion.
 */
const EXPRESSIVE = ["/about-us", "/services", "/store-listing", "/testimonials", "/collaborators", "/vendor-login", "/order-received"];
export function useCalm() {
  const p = (usePathname() || "/").replace(/\/$/, "") || "/";
  return !(p === "/" || EXPRESSIVE.some((e) => p === e || p.startsWith(e + "/")));
}

export function MotionProvider({ children }: { children: ReactNode }) {
  return <MotionConfig reducedMotion="user" transition={{ duration: 0.6, ease: EASE }}>{children}</MotionConfig>;
}

const tags = { div: motion.div, section: motion.section, ul: motion.ul, ol: motion.ol, li: motion.li, dl: motion.dl, p: motion.p, span: motion.span, article: motion.article, header: motion.header } as const;
type Tag = keyof typeof tags;
type Base = { children?: ReactNode; className?: string; as?: Tag; id?: string; "aria-labelledby"?: string; "aria-label"?: string };

/** Fades and lifts its content into place the first time it scrolls into view. */
export function Reveal({ children, className, as = "div", delay = 0, y = 28, x = 0, scale = 1, ...rest }: Base & { delay?: number; y?: number; x?: number; scale?: number }) {
  const M = tags[as] as typeof motion.div;
  const calm = useCalm();
  if (calm) return <M className={className} {...rest}>{children}</M>;
  return (
    <M className={className} initial={{ opacity: 0, y, x, scale }} whileInView={{ opacity: 1, y: 0, x: 0, scale: 1 }} viewport={VIEW} transition={{ duration: 0.7, ease: EASE, delay }} {...rest}>
      {children}
    </M>
  );
}

/** Parent for a staggered entrance: wrap a grid or list, and make each child a <StaggerItem>. */
export function Stagger({ children, className, as = "div", gap = 0.07, delay = 0, ...rest }: Base & { gap?: number; delay?: number }) {
  const M = tags[as] as typeof motion.div;
  const calm = useCalm();
  if (calm) return <M className={className} {...rest}>{children}</M>;
  return (
    <M className={className} initial="hidden" whileInView="show" viewport={VIEW} variants={{ hidden: {}, show: { transition: { staggerChildren: gap, delayChildren: delay } } }} {...rest}>
      {children}
    </M>
  );
}
export function StaggerItem({ children, className, as = "div", y = 26, ...rest }: Base & { y?: number }) {
  const M = tags[as] as typeof motion.div;
  const calm = useCalm();
  if (calm) return <M className={className} {...rest}>{children}</M>;
  return (
    <M className={className} variants={{ hidden: { opacity: 0, y }, show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: EASE } } }} {...rest}>
      {children}
    </M>
  );
}

/** Heading text that rises word by word from behind a mask. Screen readers get the plain sentence. */
export function SplitWords({ text, className, delay = 0, inView = false }: { text: string; className?: string; delay?: number; inView?: boolean }) {
  const calm = useCalm();
  const words = text.split(" ");
  if (calm) return <span className={className}>{text}</span>;
  const anim = inView ? { whileInView: "show" as const, viewport: VIEW } : { animate: "show" as const };
  return (
    <motion.span className={className} aria-label={text} initial="hidden" {...anim} variants={{ hidden: {}, show: { transition: { staggerChildren: 0.055, delayChildren: delay } } }}>
      {words.map((w, i) => (
        <span key={i} aria-hidden className="inline-block overflow-hidden pb-[0.12em] align-bottom [margin-bottom:-0.12em]">
          <motion.span className="inline-block" variants={{ hidden: { y: "110%" }, show: { y: 0, transition: { duration: 0.75, ease: EASE } } }}>
            {w}{i < words.length - 1 ? " " : ""}
          </motion.span>
        </span>
      ))}
    </motion.span>
  );
}

/** Counts up to a number when it scrolls into view. */
export function CountUp({ to, className, prefix = "", suffix = "" }: { to: number; className?: string; prefix?: string; suffix?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const seen = useInView(ref, { once: true, amount: 0 });
  const reduce = useReducedMotion();
  useEffect(() => {
    if (!seen || !ref.current) return;
    const el = ref.current;
    if (reduce) { el.textContent = prefix + to.toLocaleString("en-IN") + suffix; return; }
    const c = animate(0, to, { duration: 1.4, ease: EASE, onUpdate: (v) => { el.textContent = prefix + Math.round(v).toLocaleString("en-IN") + suffix; } });
    return () => c.stop();
  }, [seen, to, prefix, suffix, reduce]);
  return <span ref={ref} className={className}>{prefix}{to.toLocaleString("en-IN")}{suffix}</span>;
}

/** Moves its content a little slower than the page while it crosses the screen. */
export function Parallax({ children, className, amount = 40 }: { children: ReactNode; className?: string; amount?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], [amount, -amount]);
  return <motion.div ref={ref} className={className} style={{ y }}>{children}</motion.div>;
}

/** Card that leans toward the pointer. Mouse only; touch devices get a plain card. */
export function Tilt({ children, className, max = 3 }: { children: ReactNode; className?: string; max?: number }) {
  const rx = useSpring(useMotionValue(0), { stiffness: 220, damping: 18 });
  const ry = useSpring(useMotionValue(0), { stiffness: 220, damping: 18 });
  const move = (e: RPointerEvent<HTMLDivElement>) => {
    if (e.pointerType !== "mouse") return;
    const r = e.currentTarget.getBoundingClientRect();
    ry.set(((e.clientX - r.left) / r.width - 0.5) * 2 * max);
    rx.set(-((e.clientY - r.top) / r.height - 0.5) * 2 * max);
  };
  const leave = () => { rx.set(0); ry.set(0); };
  return (
    <div className={className} style={{ perspective: 900 }} onPointerMove={move} onPointerLeave={leave}>
      <motion.div className="h-full" style={{ rotateX: rx, rotateY: ry, transformStyle: "preserve-3d" }}>{children}</motion.div>
    </div>
  );
}

/** Lifts on hover and presses on tap: for tiles and buttons that are whole-card links. */
export function Lift({ children, className, as = "div" }: Base) {
  const M = tags[as] as typeof motion.div;
  return <M className={className} whileTap={{ scale: 0.985 }} transition={{ type: "spring", stiffness: 380, damping: 24 }}>{children}</M>;
}

/** The five-element strip, drawn in from the left. */
export function DrawStrip({ className = "" }: { className?: string }) {
  const parts = [["bg-leaf", 3], ["bg-soil", 2], ["bg-water", 3], ["bg-sun", 1]] as const;
  return (
    <motion.div aria-hidden className={`flex h-1.5 overflow-hidden rounded-full ${className}`} initial="hidden" whileInView="show" viewport={VIEW} variants={{ hidden: {}, show: { transition: { staggerChildren: 0.12, delayChildren: 0.25 } } }}>
      {parts.map(([c, f]) => (
        <motion.span key={c} className={`${c} origin-left`} style={{ flex: f }} variants={{ hidden: { scaleX: 0 }, show: { scaleX: 1, transition: { duration: 0.5, ease: EASE } } }} />
      ))}
    </motion.div>
  );
}

/** Thin reading-progress bar in the logo's element colours, fixed to the top of the window. */
export function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 140, damping: 26, mass: 0.4 });
  return (
    <motion.div aria-hidden className="pointer-events-none fixed inset-x-0 top-0 z-[80] h-1 origin-left"
      style={{ scaleX, background: "linear-gradient(90deg,#0f804a 0 30%,#6b3a2c 30% 50%,#0c8fc7 50% 80%,#f9b52c 80% 100%)" }} />
  );
}

/** Endless sideways ticker. Content is duplicated for the loop; the copy is hidden from screen readers. */
export function Marquee({ children, className = "", seconds = 38 }: { children: ReactNode; className?: string; seconds?: number }) {
  return (
    <div className={`nn-marquee overflow-hidden ${className}`}>
      <div className="nn-marquee-track flex w-max" style={{ animationDuration: `${seconds}s` }}>
        <div className="flex shrink-0 items-center">{children}</div>
        <div aria-hidden className="flex shrink-0 items-center">{children}</div>
      </div>
    </div>
  );
}
