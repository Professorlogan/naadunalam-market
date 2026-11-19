"use client";
import { animate, useReducedMotion } from "motion/react";
import { useLayoutEffect, useRef } from "react";
import { EASE } from "../motion";

const plain = (n: number) => n.toLocaleString("en-IN");

/**
 * A number that ticks from its previous value to the new one whenever it changes.
 * The first render is plain text, so the server HTML already carries the right value.
 * `format` must be a stable function (declare it at module level).
 */
export default function AnimatedNumber({ value, format = plain, className }: { value: number; format?: (n: number) => string; className?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const shown = useRef(value);
  const reduce = useReducedMotion();

  useLayoutEffect(() => {
    const el = ref.current;
    const from = shown.current;
    if (!el || from === value) return;
    if (reduce) { shown.current = value; el.textContent = format(value); return; }
    el.textContent = format(Math.round(from));
    const controls = animate(from, value, {
      duration: 0.3, ease: EASE,
      onUpdate: (v) => { shown.current = v; el.textContent = format(Math.round(v)); },
      onComplete: () => { shown.current = value; el.textContent = format(value); },
    });
    return () => controls.stop();
  }, [value, format, reduce]);

  return <span ref={ref} className={className}>{format(value)}</span>;
}
