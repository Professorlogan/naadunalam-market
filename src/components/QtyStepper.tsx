"use client";
import { Minus, Plus } from "lucide-react";

export default function QtyStepper({ value, onChange, max = 99, label = "Quantity" }: {
  value: number; onChange: (n: number) => void; max?: number; label?: string;
}) {
  return (
    <div role="group" aria-label={label} className="inline-flex h-11 items-center rounded-full border-[1.5px] border-mist bg-white">
      <button type="button" aria-label="Decrease quantity" className="grid h-11 w-11 place-items-center rounded-full text-forest hover:bg-sky disabled:opacity-40" disabled={value <= 1} onClick={() => onChange(value - 1)}><Minus size={18} /></button>
      <span aria-live="polite" className="w-8 text-center font-semibold tabular-nums">{value}</span>
      <button type="button" aria-label="Increase quantity" className="grid h-11 w-11 place-items-center rounded-full text-forest hover:bg-sky disabled:opacity-40" disabled={value >= max} onClick={() => onChange(value + 1)}><Plus size={18} /></button>
    </div>
  );
}
