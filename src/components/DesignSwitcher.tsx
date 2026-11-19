"use client";
import { useEffect, useState } from "react";

const designs = [
  { id: "a", label: "A", name: "Forest" },
  { id: "b", label: "B", name: "Soil & Sun" },
  { id: "c", label: "C", name: "Water & Leaf" },
];

/** Prototype-only control for comparing the three design variations. Remove before launch. */
export default function DesignSwitcher() {
  const [design, setDesign] = useState("a");
  useEffect(() => {
    let d = "a";
    try {
      d = new URLSearchParams(location.search).get("design") || localStorage.getItem("nn-design") || "a";
    } catch {}
    if (!designs.some((x) => x.id === d)) d = "a";
    // eslint-disable-next-line react-hooks/set-state-in-effect -- one-time read of the saved choice
    setDesign(d);
  }, []);
  useEffect(() => {
    if (design === "a") document.documentElement.removeAttribute("data-design");
    else document.documentElement.setAttribute("data-design", design);
    try { localStorage.setItem("nn-design", design); } catch {}
  }, [design]);
  return (
    <div role="group" aria-label="Design variation" className="fixed right-0 top-1/2 z-40 hidden -translate-y-1/2 flex-col md:flex items-center gap-1 rounded-l-xl border border-r-0 border-mist bg-white/95 p-1 text-[13px] shadow-lift">
      <span className="sr-only">Design</span>
      {designs.map((d) => (
        <button key={d.id} type="button" aria-pressed={design === d.id} title={d.name} onClick={() => setDesign(d.id)}
          className={`h-8 w-8 rounded-lg font-semibold transition-colors ${design === d.id ? "bg-forest text-white" : "text-ink hover:bg-sky"}`}>
          {d.label}<span className="sr-only"> {d.name}</span>
        </button>
      ))}
    </div>
  );
}
