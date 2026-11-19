"use client";
import { useId, useRef, useState, type KeyboardEvent, type ReactNode } from "react";
import { motion } from "motion/react";

/**
 * Accessible tabs (WAI-ARIA tabs pattern, automatic activation): arrow keys, Home and End move between tabs,
 * and the active pill slides to the chosen one. Both panels stay in the page; the inactive one is hidden.
 */
export default function StoreTabs({ label, tabs }: { label: string; tabs: { key: string; label: string; panel: ReactNode }[] }) {
  const [active, setActive] = useState(tabs[0].key);
  const uid = useId();
  const refs = useRef<(HTMLButtonElement | null)[]>([]);

  const onKey = (e: KeyboardEvent, i: number) => {
    const last = tabs.length - 1;
    const to = e.key === "ArrowRight" ? (i === last ? 0 : i + 1) : e.key === "ArrowLeft" ? (i === 0 ? last : i - 1)
      : e.key === "Home" ? 0 : e.key === "End" ? last : -1;
    if (to < 0) return;
    e.preventDefault();
    setActive(tabs[to].key);
    refs.current[to]?.focus();
  };

  return (
    <>
      <div className="wrap pt-6 sm:pt-8">
        <div role="tablist" aria-label={label} className="flex flex-wrap gap-2">
          {tabs.map((t, i) => {
            const on = t.key === active;
            return (
              <button key={t.key} ref={(el) => { refs.current[i] = el; }} type="button" role="tab" id={`${uid}-tab-${t.key}`}
                aria-selected={on} aria-controls={`${uid}-panel-${t.key}`} tabIndex={on ? 0 : -1}
                onClick={() => setActive(t.key)} onKeyDown={(e) => onKey(e, i)}
                className={`relative isolate min-h-12 rounded-full px-6 text-base font-semibold transition-colors duration-150 ${on ? "text-white" : "border border-mist text-forest-deep hover:text-leaf"}`}>
                {on && <motion.span layoutId={`${uid}-pill`} aria-hidden className="absolute inset-0 -z-10 rounded-full bg-leaf" transition={{ duration: 0.2, ease: "easeOut" }} />}
                {t.label}
              </button>
            );
          })}
        </div>
      </div>
      {tabs.map((t) => (
        <div key={t.key} role="tabpanel" id={`${uid}-panel-${t.key}`} aria-labelledby={`${uid}-tab-${t.key}`} hidden={t.key !== active}>
          {t.panel}
        </div>
      ))}
    </>
  );
}
