import { categories } from "../../lib/data";
import { Marquee } from "../motion";

/** A slow ticker of everything the marketplace stocks, in English and Tamil. Pauses on hover. */
export default function ValuesMarquee() {
  return (
    <section aria-label="What the marketplace stocks" className="bg-forest py-3.5 text-white">
      <Marquee seconds={46}>
        {categories.map((c) => (
          <span key={c.slug} className="flex items-center whitespace-nowrap font-display text-lg font-semibold">
            <span aria-hidden className="mx-5 h-3 w-3 rounded-[0_60%_0_60%] bg-sun" />
            {c.name}
            <span lang="ta" className="ta ml-2 font-medium text-sun">{c.nameTa}</span>
          </span>
        ))}
      </Marquee>
    </section>
  );
}
