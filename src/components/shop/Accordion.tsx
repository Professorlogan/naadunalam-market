"use client";
import { useId, useState } from "react";
import { ChevronDown } from "lucide-react";

/**
 * One fold in a hairline-separated list. The heading is a real button; the panel opens with a quick
 * height and opacity change and is inert while closed, so its links cannot be reached by keyboard.
 */
export default function Accordion({ title, icon, defaultOpen = false, children }: {
  title: string; icon: React.ReactNode; defaultOpen?: boolean; children: React.ReactNode;
}) {
  const [open, setOpen] = useState(defaultOpen);
  const id = useId();
  return (
    <div className="border-b border-mist">
      <h2 className="font-body text-base font-semibold">
        <button type="button" id={`${id}-b`} aria-expanded={open} aria-controls={`${id}-p`} onClick={() => setOpen((v) => !v)}
          className="flex min-h-14 w-full items-center gap-3 text-left text-ink transition-colors duration-150 hover:text-forest">
          <span aria-hidden className="shrink-0 text-forest">{icon}</span>
          <span className="flex-1">{title}</span>
          <ChevronDown size={18} aria-hidden className={`shrink-0 text-muted transition-transform duration-200 ${open ? "rotate-180" : ""}`} />
        </button>
      </h2>
      <div id={`${id}-p`} role="region" aria-labelledby={`${id}-b`} inert={!open}
        className={`grid transition-[grid-template-rows,opacity] duration-200 ease-out motion-reduce:transition-none ${open ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"}`}>
        <div className="min-h-0 overflow-hidden">
          <div className="pb-5 pl-[30px] text-[15px] leading-relaxed">{children}</div>
        </div>
      </div>
    </div>
  );
}
