import Link from "next/link";
import { categories } from "../../lib/data";
import { Reveal } from "../motion";

const tints = ["bg-mint", "bg-butter", "bg-peach", "bg-aqua", "bg-clay"];

export default function CategoryRow() {
  return (
    <section aria-labelledby="cat-title" className="wrap pt-14 sm:pt-20">
      <Reveal className="mb-6 flex items-end justify-between gap-4">
        <h2 id="cat-title" className="t-h2">Shop by category</h2>
        <Link href="/shop" className="link shrink-0 whitespace-nowrap font-semibold">All products</Link>
      </Reveal>
      <ul className="-mx-4 flex snap-x scroll-px-4 gap-4 overflow-x-auto px-4 pb-2 sm:mx-0 sm:grid sm:grid-cols-4 sm:gap-5 sm:overflow-visible sm:px-0 lg:grid-cols-6">
        {categories.map((c, n) => (
          <li key={c.slug} className="w-[30%] shrink-0 snap-start sm:w-auto">
            <Link href={`/product-category/${c.slug}`} className="group flex flex-col items-center text-center">
              <span className={`block aspect-square w-full overflow-hidden rounded-full p-1.5 ${tints[n % tints.length]} transition-transform duration-300 group-hover:-translate-y-1`}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={c.image} alt="" width={240} height={240} loading="lazy" className="h-full w-full rounded-full object-cover transition-transform duration-500 group-hover:scale-105" />
              </span>
              <span className="mt-3 font-display text-[15px] font-semibold leading-tight text-forest-deep group-hover:text-leaf sm:text-base">{c.name}</span>
              <span lang="ta" className="ta text-[13px] text-muted">{c.nameTa}</span>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
