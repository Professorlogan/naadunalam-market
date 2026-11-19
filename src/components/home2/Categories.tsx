import Link from "next/link";
import { categories } from "../../lib/data";

/** Categories as photographs you can walk into, not icons. */
export default function Categories() {
  return (
    <section id="categories" aria-labelledby="categories-title" className="wrap scroll-mt-36 py-16 sm:py-24">
      <div className="mb-8 flex items-end justify-between gap-6 sm:mb-10">
        <h2 id="categories-title" className="t-h2">Shop by category</h2>
        <Link href="/shop" className="link shrink-0 text-base font-semibold">View all products</Link>
      </div>
      <ul className="grid grid-cols-2 gap-3 sm:gap-5 md:grid-cols-3 lg:grid-cols-4">
        {categories.map((c) => (
          <li key={c.slug}>
            <Link href={`/product-category/${c.slug}`} className="group relative block aspect-[4/5] overflow-hidden rounded-2xl bg-mist sm:aspect-[4/3]">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={c.image} alt="" width={640} height={640} loading="lazy" className="h-full w-full object-cover transition-transform duration-[900ms] ease-[cubic-bezier(0.19,1,0.22,1)] group-hover:scale-[1.06]" />
              <span aria-hidden className="absolute inset-0 bg-[linear-gradient(180deg,transparent_35%,rgb(20_14_10/0.82)_100%)]" />
              <span className="absolute inset-x-0 bottom-0 p-4 sm:p-5">
                <span className="block font-display text-lg font-semibold leading-tight text-white sm:text-xl">{c.name}</span>
                <span lang="ta" className="ta mt-0.5 block text-sm leading-snug text-white/85">{c.nameTa}</span>
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
