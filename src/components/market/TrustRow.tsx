import { HandCoins, Sprout, Store, Truck } from "lucide-react";

const items = [
  { icon: Truck, bg: "bg-mint", t: "Flat ₹50 delivery", d: "Anywhere in Tamil Nadu" },
  { icon: HandCoins, bg: "bg-butter", t: "Cash on delivery", d: "Pay when your order arrives" },
  { icon: Store, bg: "bg-aqua", t: "Named sellers", d: "Every product shows who sells it" },
  { icon: Sprout, bg: "bg-peach", t: "Native varieties", d: "Heritage rice, millets and pulses" },
];

export default function TrustRow() {
  return (
    <section aria-label="Why shop with Naadu Nalam" className="wrap pt-14 sm:pt-20">
      <ul className="grid gap-3 sm:grid-cols-2 sm:gap-5 lg:grid-cols-4">
        {items.map(({ icon: Icon, bg, t, d }) => (
          <li key={t} className="flex items-center gap-4 rounded-[1.25rem] border border-mist bg-white p-4 sm:p-5">
            <span className={`grid h-12 w-12 shrink-0 place-items-center rounded-full ${bg} text-forest`}><Icon size={22} /></span>
            <span><span className="block font-display text-lg font-bold leading-tight text-forest-deep">{t}</span><span className="mt-0.5 block text-sm text-muted">{d}</span></span>
          </li>
        ))}
      </ul>
    </section>
  );
}
