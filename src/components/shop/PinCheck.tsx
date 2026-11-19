"use client";
import { useState } from "react";
import { CircleCheck, MapPinOff, TriangleAlert } from "lucide-react";
import { site } from "../../lib/data";
import { inr } from "../../lib/format";

type Tone = "ok" | "no" | "error";
type Result = { tone: Tone; text: string } | null;

/** Each outcome has its own colour and icon, so it reads at a glance and never by colour alone. */
const LOOK: Record<Tone, { Icon: typeof CircleCheck; text: string }> = {
  ok: { Icon: CircleCheck, text: "text-leaf" },
  no: { Icon: MapPinOff, text: "text-soil" },
  error: { Icon: TriangleAlert, text: "text-soil" },
};

/** Prototype estimate only: Tamil Nadu PIN codes begin with 60 to 64. */
export default function PinCheck() {
  const [pin, setPin] = useState("");
  const [result, setResult] = useState<Result>(null);

  const check = (e: React.FormEvent) => {
    e.preventDefault();
    if (!/^[1-9]\d{5}$/.test(pin)) return setResult({ tone: "error", text: "Enter a valid 6-digit PIN code, for example 600113." });
    const prefix = Number(pin.slice(0, 2));
    setResult(prefix >= 60 && prefix <= 64
      ? { tone: "ok", text: `We deliver to ${pin}, flat ${inr(site.deliveryFee)}.` }
      : { tone: "no", text: `We currently deliver within Tamil Nadu only, so we cannot deliver to ${pin} yet.` });
  };
  const look = result ? LOOK[result.tone] : null;

  return (
    <form onSubmit={check} noValidate>
      <label htmlFor="pin-check" className="mb-1.5 block text-sm font-semibold text-ink">Check delivery to your PIN code <span className="font-normal text-muted">(estimate)</span></label>
      <div className="flex gap-2">
        <input id="pin-check" className="field max-w-44 !rounded-full !px-4" inputMode="numeric" autoComplete="postal-code" maxLength={6} placeholder="6-digit PIN"
          value={pin} aria-invalid={result?.tone === "error" ? true : undefined} aria-describedby="pin-check-note"
          onChange={(e) => { setPin(e.target.value.replace(/\D/g, "").slice(0, 6)); setResult(null); }} />
        <button type="submit" className="btn btn-ghost shrink-0 !rounded-full">Check PIN</button>
      </div>
      <div id="pin-check-note" aria-live="polite">
        {result && look && (
          <p className={`flex items-start gap-2 pt-2.5 text-[15px] font-semibold ${look.text}`}>
            <look.Icon size={18} aria-hidden className="mt-0.5 shrink-0" />
            <span>{result.text}</span>
          </p>
        )}
        <p className="mt-2 text-[13px] text-muted">This is an estimate based on the first two digits of the PIN code, not a confirmed delivery promise.</p>
      </div>
    </form>
  );
}
