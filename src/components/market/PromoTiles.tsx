import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { Reveal } from "../motion";

const tiles = [
  { bg: "bg-aqua", img: "/img/m/promo-millets.webp", alt: "Pearl millet, finger millet, foxtail millet and little millet in brass bowls",
    eyebrow: "Siruthaniyam", title: "Millets for strong, steady energy", cta: "Shop millets", href: "/product-category/siruthaniyam" },
  { bg: "bg-butter", img: "/img/m/promo-health.webp", alt: "A clay cup of ragi porridge beside a bowl of millet health-mix flour",
    eyebrow: "Health mixes", title: "Porridge mixes for every age", cta: "Shop health mixes", href: "/product-category/health-mixes" },
];

export default function PromoTiles() {
  return (
    <section aria-label="Collections" className="wrap grid gap-4 pt-4 sm:gap-6 sm:pt-6 md:grid-cols-2">
      {tiles.map((t, n) => (
        <Reveal key={t.href} delay={n * 0.08} y={18}>
          <Link href={t.href} className={`group relative block h-full min-h-[15rem] overflow-hidden rounded-[1.75rem] ${t.bg} sm:min-h-[17rem]`}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={t.img} alt={t.alt} width={1200} height={900} loading="lazy"
              className="absolute inset-y-0 right-0 h-full w-[62%] object-cover object-right transition-transform duration-700 ease-[cubic-bezier(0.19,1,0.22,1)] group-hover:scale-105 [mask-image:linear-gradient(to_right,transparent,black_28%)]" />
            <div className="relative z-10 flex h-full max-w-[60%] flex-col justify-center p-6 sm:p-8">
              <p className="text-xs font-bold uppercase tracking-[0.14em] text-soil">{t.eyebrow}</p>
              <h2 className="mt-2 text-2xl leading-tight sm:text-[1.85rem]">{t.title}</h2>
              <span className="btn btn-primary mt-5 self-start !min-h-10 !px-4 text-[15px]">{t.cta} <ChevronRight size={16} className="transition-transform group-hover:translate-x-0.5" /></span>
            </div>
          </Link>
        </Reveal>
      ))}
    </section>
  );
}
