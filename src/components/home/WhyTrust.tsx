import { Reveal, Stagger, StaggerItem } from "../motion";

const reasons = [
  { title: "Sourced close to home", text: "Naadu Nalam works with local growers and small producers rather than anonymous supply chains." },
  { title: "Every seller has a storefront", text: "Each vendor has their own store page, so you can see who you are buying from before you add to basket." },
  { title: "Traditional staples", text: "Native rice, millets, cold-pressed oils, ground masalas and honey — stocked the way Indian kitchens actually use them." },
  { title: "Clear, upfront pricing", text: "Every listing shows its price and pack size, so you always see what you are paying." },
];

export default function WhyTrust() {
  return (
    <section aria-labelledby="trust-title" className="wrap py-12 sm:py-16">
      <div className="grid gap-x-12 gap-y-6 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,2fr)]">
        <Reveal>
          <h2 id="trust-title" className="text-3xl font-bold sm:text-4xl">Built around trust, not volume</h2>
          <p lang="ta" className="ta mt-2 font-display text-lg font-medium text-leaf">நம்ம மக்களின் நலம்</p>
        </Reveal>
        <Stagger as="dl" gap={0.1} className="grid gap-x-10 gap-y-7 sm:grid-cols-2">
          {reasons.map((r) => (
            <StaggerItem key={r.title} className="relative border-l-2 border-forest/30 pl-5">
              <dt className="font-display text-xl font-semibold text-forest-deep">{r.title}</dt>
              <dd className="mt-1 text-muted">{r.text}</dd>
            </StaggerItem>
          ))}
        </Stagger>
      </div>
    </section>
  );
}
