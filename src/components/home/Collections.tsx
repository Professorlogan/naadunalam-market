import Link from "next/link";
import { getCategory } from "../../lib/data";
import { Reveal, Stagger, StaggerItem } from "../motion";

const collections = [
  { slug: "oil-vinegers", title: "Cold-pressed oils", text: "Sesame, groundnut and coconut — pressed without heat.", cta: "Shop oils", image: "/img/25-product-coconut-oil.webp" },
  { slug: "paruppu-pulses", title: "Lentils & pulses", text: "Toor, moong, urad and Bengal gram dals, plus chickpeas and green gram.", cta: "Shop pulses", image: "/img/Kadalai-Paruppu.webp" },
  { slug: "other-rice", title: "Other rice", text: "Ponni, idli rice and barley rice for everyday meals.", cta: "Shop rice", image: "/img/Ponni-Arisi.webp" },
  { slug: "personal-care", title: "Personal care", text: "Traditional herbal bathing powder and shikakai powder.", cta: "Shop personal care", image: "/img/Kuliyal-Podi.webp" },
];

export default function Collections() {
  return (
    <section aria-labelledby="collections-title" className="wrap py-12 sm:py-16">
      <div className="grid gap-x-12 gap-y-6 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,2fr)]">
        <Reveal>
          <h2 id="collections-title" className="t-h2 font-bold">Collections built around real cooking</h2>
          <p className="mt-3 text-muted">Four staples an Indian kitchen keeps stocked — each one a live category on the marketplace.</p>
        </Reveal>
        <Stagger as="ul" gap={0.1} className="grid border-t border-mist md:grid-cols-2 md:gap-x-10">
          {collections.map((c) => {
            const cat = getCategory(c.slug);
            return (
              <StaggerItem as="li" key={c.slug} className="group relative flex items-center gap-4 border-b border-mist py-3 sm:gap-5 sm:py-5">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={c.image} alt="" width={300} height={300} loading="lazy" className="h-20 w-20 shrink-0 rounded-full object-cover ring-4 ring-white transition-[scale,rotate] duration-500 group-hover:rotate-6 group-hover:scale-110 sm:h-28 sm:w-28" />
                <div className="min-w-0">
                  <h3 className="t-h4 font-semibold">{c.title}</h3>
                  {cat && <p lang="ta" className="ta hidden text-sm text-leaf sm:block">{cat.nameTa}</p>}
                  <p className="mt-1 text-base leading-snug text-muted">{c.text}</p>
                  <Link href={`/product-category/${c.slug}`} className="link mt-1.5 inline-flex min-h-11 items-center font-semibold after:absolute after:inset-0">
                    {c.cta}{cat ? ` (${cat.count})` : ""}
                  </Link>
                </div>
              </StaggerItem>
            );
          })}
        </Stagger>
      </div>
    </section>
  );
}
