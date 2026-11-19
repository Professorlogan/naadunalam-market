import Link from "next/link";
import { posts } from "../../lib/data";
import { Reveal } from "../motion";

export default function BlogStrip() {
  const list = posts.slice(0, 3);
  return (
    <section aria-labelledby="blog-title" className="wrap pt-14 sm:pt-20">
      <Reveal className="mb-6 flex items-end justify-between gap-4">
        <h2 id="blog-title" className="t-h2">From our kitchen notes</h2>
        <Link href="/blog" className="link shrink-0 whitespace-nowrap font-semibold">All articles</Link>
      </Reveal>
      <ul className="grid gap-5 md:grid-cols-3">
        {list.map((p) => (
          <li key={p.slug}>
            <Link href={`/${p.slug}`} className="group block h-full overflow-hidden rounded-[1.25rem] border border-mist bg-white transition-shadow hover:shadow-[0_18px_40px_-22px_rgb(23_39_30/0.45)]">
              <span className="block aspect-[16/10] overflow-hidden bg-sky">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={p.image} alt="" width={800} height={500} loading="lazy" className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105" />
              </span>
              <span className="block p-5">
                <span className="text-sm text-muted">{new Date(p.date).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })}</span>
                <span className="mt-1 block font-display text-xl font-bold leading-snug text-forest-deep group-hover:text-leaf">{p.title}</span>
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
