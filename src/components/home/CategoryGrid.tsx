import Link from "next/link";
import { categories } from "../../lib/data";

/** Round category shortcuts straight under the hero, the way grocery marketplaces open. */
export default function CategoryGrid() {
  return (
    <section id="categories" aria-labelledby="categories-title" className="wrap scroll-mt-36 py-8 sm:py-10">
      <div className="mb-5 flex items-end justify-between gap-4">
        <h2 id="categories-title" className="text-2xl font-bold sm:text-[1.75rem]">Shop by category</h2>
        <Link href="/shop" className="link text-[15px] font-semibold">View all products</Link>
      </div>
      <ul className="grid grid-cols-3 gap-x-3 gap-y-6 sm:grid-cols-4 md:grid-cols-6">
        {categories.map((c) => (
          <li key={c.slug}>
            <Link href={`/product-category/${c.slug}`} className="group flex flex-col items-center text-center">
              <span className="block aspect-square w-full max-w-[7.5rem] overflow-hidden rounded-full border border-mist bg-white transition-colors duration-150 group-hover:border-forest">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={c.image} alt="" width={300} height={300} loading="lazy" className="h-full w-full object-cover transition-transform duration-700 ease-[cubic-bezier(0.19,1,0.22,1)] group-hover:scale-[1.08]" />
              </span>
              <span className="mt-2 text-[15px] font-semibold leading-tight text-ink group-hover:text-forest">{c.name}</span>
              <span lang="ta" className="ta text-[13px] leading-tight text-muted [overflow-wrap:normal] [word-break:keep-all]">{c.nameTa}</span>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
