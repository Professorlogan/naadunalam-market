"use client";
import { useEffect, type RefObject } from "react";

const SEL = 'a[href],button:not([disabled]),input:not([disabled]),select:not([disabled]),textarea:not([disabled]),[tabindex]:not([tabindex="-1"])';

/** Keeps keyboard focus inside an open dialog, and hands it back to the opener on close. */
export function useFocusTrap(ref: RefObject<HTMLElement | null>, active: boolean, onEscape?: () => void) {
  useEffect(() => {
    if (!active) return;
    const opener = document.activeElement as HTMLElement | null;
    const list = () => [...(ref.current?.querySelectorAll<HTMLElement>(SEL) ?? [])].filter((el) => el.tabIndex !== -1 && el.offsetParent !== null);
    const t = setTimeout(() => list()[0]?.focus(), 30);
    const key = (e: KeyboardEvent) => {
      if (e.key === "Escape") { onEscape?.(); return; }
      if (e.key !== "Tab" || !ref.current) return;
      const els = list();
      if (!els.length) return;
      const first = els[0], last = els[els.length - 1];
      const inside = ref.current.contains(document.activeElement);
      if (e.shiftKey && (!inside || document.activeElement === first)) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && (!inside || document.activeElement === last)) { e.preventDefault(); first.focus(); }
    };
    document.addEventListener("keydown", key);
    return () => { clearTimeout(t); document.removeEventListener("keydown", key); opener?.focus?.(); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [active]);
}
