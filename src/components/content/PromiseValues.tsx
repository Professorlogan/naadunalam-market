"use client";
import { motion, useReducedMotion, useScroll, useTransform, type MotionValue } from "motion/react";
import { useRef, useSyncExternalStore } from "react";
import { values } from "./values";

const noop = () => () => {};

function Value({ v, i, progress, live }: { v: (typeof values)[number]; i: number; progress: MotionValue<number>; live: boolean }) {
  // Only a short rise and the accent bar are tied to the scroll. Opacity is never touched, so the words are
  // at full contrast in every state: before script runs, mid-scroll and at rest.
  const t = useTransform(progress, [i * 0.2, i * 0.2 + 0.6], [0, 1], { clamp: true });
  const y = useTransform(t, [0, 1], [10, 0]);
  const bar = useTransform(t, [0, 1], [0.4, 1]);
  return (
    <li className={i === 0 ? "md:pr-6" : "md:border-l md:border-mist md:px-6"}>
      <motion.span aria-hidden className={`block h-1 w-14 origin-left rounded-full ${v.bar}`} style={live ? { scaleX: bar } : undefined} />
      <motion.div style={live ? { y } : undefined}>
        {/* Sized so the longest word fits its column at every width (one column on phones, three from 768px) and never wraps. */}
        <p lang="ta" className={`ta mt-4 whitespace-nowrap font-display text-[clamp(2.5rem,13vw,4.5rem)] font-bold leading-[1.25] md:text-[clamp(2.5rem,5.6vw,4.5rem)] ${v.colour}`}>
          {v.ta}
        </p>
        <p className="mt-1 font-display text-xl font-bold text-forest-deep sm:text-2xl">
          {v.roman}
          <span className="block text-lg font-medium text-muted">{v.en}</span>
        </p>
      </motion.div>
    </li>
  );
}

/**
 * "Our promise": நம்பிக்கை, நலம், மரபு with their transliteration and meaning.
 * All three are fully visible at rest; the scroll only settles them a few pixels, and that finishes
 * while the list is still entering the viewport.
 */
export default function PromiseValues() {
  const ref = useRef<HTMLUListElement>(null);
  const reduce = useReducedMotion();
  const hydrated = useSyncExternalStore(noop, () => true, () => false);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 1", "start 0.75"] });
  const live = hydrated && !reduce;
  return (
    <ul ref={ref} className="mt-8 grid gap-y-8 md:grid-cols-[minmax(0,1.5fr)_minmax(0,1fr)_minmax(0,1fr)] md:gap-0">
      {values.map((v, i) => <Value key={v.en} v={v} i={i} progress={scrollYProgress} live={live} />)}
    </ul>
  );
}
