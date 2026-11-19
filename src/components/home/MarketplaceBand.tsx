import Link from "next/link";
import { Store } from "lucide-react";
import { stores } from "../../lib/data";
import { CountUp, Reveal, SplitWords, Stagger, StaggerItem } from "../motion";

const points = [
  { title: "Independent storefronts", text: "Every seller manages their own listings, pricing and stock." },
  { title: "One cart, one checkout", text: "Add items from different sellers and pay in a single order." },
  { title: "Open to new sellers", text: "Growers and small producers can register and open a store on Naadu Nalam." },
];

export default function MarketplaceBand() {
  return (
    <section aria-labelledby="marketplace-title" className="bg-forest text-white">
      <div className="wrap grid gap-10 py-12 sm:py-16 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,1fr)] lg:gap-16">
        <div>
          <h2 id="marketplace-title" className="t-h2 font-bold !text-white"><SplitWords inView text="Many sellers. One basket." /></h2>
          <p className="mt-4 max-w-xl text-lg text-white/85">
            Naadu Nalam is a marketplace, not a single shop. Independent growers, home producers and small brands each run
            their own storefront here — you browse them side by side and check out once.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link href="/vendor-login" className="btn btn-sun">Become a seller</Link>
            <Link href="/store-listing" className="btn btn-light">Browse the marketplace</Link>
          </div>
        </div>
        <Reveal x={40} y={0}>
          <h3 className="t-h4 font-semibold !text-white">Stores open on the marketplace today</h3>
          <ul className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-1">
            {stores.map((s) => (
              <li key={s.slug}>
                <Link href={`/store/${s.slug}`} className="group flex items-center gap-4 rounded-2xl bg-white p-4 text-ink transition-[background-color,translate] duration-300 hover:translate-x-1.5 hover:bg-sun sm:p-5">
                  <span aria-hidden className="grid h-14 w-14 shrink-0 place-items-center rounded-full bg-sky text-forest"><Store size={26} /></span>
                  <span className="min-w-0 flex-1">
                    <span className="block font-display text-xl font-bold leading-tight text-forest-deep">{s.name}</span>
                    <span className="block text-[15px] text-muted group-hover:text-ink"><CountUp to={s.productCount} /> products listed</span>
                  </span>
                  <span className="shrink-0 font-semibold text-forest underline underline-offset-4">Visit store</span>
                </Link>
              </li>
            ))}
          </ul>
        </Reveal>
        <Stagger as="ul" gap={0.12} className="grid gap-6 border-t border-white/20 pt-8 sm:grid-cols-3 sm:gap-10 lg:col-span-2">
          {points.map((p) => (
            <StaggerItem as="li" key={p.title} className="relative pl-6">
              <span aria-hidden className="absolute left-0 top-[0.45rem] h-3 w-3 rounded-[0_60%_0_60%] bg-sun" />
              <h3 className="t-h5 font-semibold !text-white">{p.title}</h3>
              <p className="mt-1 text-base leading-snug text-white/80">{p.text}</p>
            </StaggerItem>
          ))}
        </Stagger>
      </div>
    </section>
  );
}
