"use client";
import { useEffect, useId, useState } from "react";
import { motion } from "motion/react";
import { ChevronDown } from "lucide-react";
import { EASE } from "../motion";
import type { TocItem } from "./policy";

/** Which section is being read: the last heading that has passed the upper part of the window. */
function useActiveSection(toc: TocItem[]) {
  const key = toc.map((t) => t.id).join(" ");
  const [active, setActive] = useState<string | null>(toc[0]?.id ?? null);
  useEffect(() => {
    const heads = key.split(" ").map((id) => document.getElementById(id)).filter((el): el is HTMLElement => el !== null);
    if (heads.length === 0 || !("IntersectionObserver" in window)) return;
    const pick = () => {
      const line = window.innerHeight * 0.4;
      let current = heads[0];
      for (const h of heads) if (h.getBoundingClientRect().top <= line) current = h;
      // At the very end of the page the last section is the one in view, even if its heading never reached the line.
      if (window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 4) current = heads[heads.length - 1];
      setActive(current.id);
    };
    // The observer's band ends at the same line, so it fires exactly when a heading crosses it in either direction.
    const io = new IntersectionObserver(pick, { rootMargin: "0px 0px -60% 0px", threshold: [0, 1] });
    heads.forEach((h) => io.observe(h));
    pick();
    return () => io.disconnect();
  }, [key]);
  return active;
}

function TocList({ toc, active, marker, onPick }: { toc: TocItem[]; active: string | null; marker: string; onPick?: () => void }) {
  return (
    <ul className="space-y-0.5">
      {toc.map((t) => {
        const on = t.id === active;
        return (
          <li key={t.id} className="relative">
            {on && <motion.span layoutId={marker} aria-hidden className="absolute inset-0 rounded-lg bg-sky" transition={{ type: "spring", stiffness: 420, damping: 36 }} />}
            {on && <motion.span layoutId={`${marker}-bar`} aria-hidden className="absolute inset-y-1.5 left-0 w-1 rounded-full bg-leaf" transition={{ type: "spring", stiffness: 420, damping: 36 }} />}
            <a href={`#${t.id}`} aria-current={on ? "location" : undefined} onClick={onPick}
              title={t.label}
              className={`relative flex h-11 items-center rounded-lg px-3 transition-colors duration-200 hover:text-leaf ${on ? "font-semibold text-forest" : "text-forest-deep"}`}>
              <span className="truncate">{t.label}</span>
            </a>
          </li>
        );
      })}
    </ul>
  );
}

/**
 * Contents for a policy page: a <details> on small screens, a sticky panel from lg up. The section being read is
 * marked, and the marker slides from one entry to the next. Jumps use the browser's own anchor scrolling, which is
 * smooth site-wide (and instant with reduced motion). Without JS both lists are plain anchor links.
 * The small-screen list fades and unfolds each time the <details> is opened; it carries no hidden state of its own.
 */
export default function PolicyToc({ toc }: { toc: TocItem[] }) {
  const active = useActiveSection(toc);
  const marker = useId();
  const [open, setOpen] = useState(false);
  const current = toc.find((t) => t.id === active);

  return (
    <>
      <details className="card group mb-8 lg:hidden" onToggle={(e) => setOpen(e.currentTarget.open)}>
        <summary className="flex min-h-12 cursor-pointer list-none items-center gap-3 px-4 font-display text-lg font-semibold text-forest-deep [&::-webkit-details-marker]:hidden">
          <span>On this page</span>
          {current && !open && <span className="min-w-0 flex-1 truncate text-base font-normal text-muted">{current.label}</span>}
          <ChevronDown aria-hidden size={20} className="ml-auto shrink-0 transition-transform duration-300 group-open:rotate-180" />
        </summary>
        <motion.nav aria-label="On this page" className="origin-top border-t border-mist p-2"
          initial={false} animate={open ? { opacity: [0, 1], y: [-12, 0], scaleY: [0.94, 1] } : {}} transition={{ duration: 0.34, ease: EASE }}>
          <TocList toc={toc} active={active} marker={`${marker}-m`} />
        </motion.nav>
      </details>
      <aside className="hidden lg:sticky lg:top-28 lg:block">
        <motion.nav aria-labelledby="policy-toc" className="max-h-[calc(100vh-8.5rem)] overflow-y-auto rounded-xl border border-mist bg-white p-3"
          initial={{ opacity: 0, x: -18 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6, ease: EASE, delay: 0.3 }}>
          <h2 id="policy-toc" className="px-3 pb-2 pt-1 text-lg font-semibold">On this page</h2>
          <TocList toc={toc} active={active} marker={`${marker}-d`} />
        </motion.nav>
      </aside>
    </>
  );
}
