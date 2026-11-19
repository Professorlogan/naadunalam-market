import Link from "next/link";
import { lowestPrice } from "../../lib/data";
import { inr } from "../../lib/format";
import { Stagger, StaggerItem, Tilt } from "../motion";

const tiles = [
  { slug: "natural-sweeteners", title: "Natural sweeteners", titleTa: "இயற்கை இனிப்புகள்", line: "Naturally sweet", image: "/img/Urundai-Vellam.webp", tone: "bg-soil text-white", accent: "text-sun" },
  { slug: "oil-vinegers", title: "Ghee & oil", titleTa: "நெய் & எண்ணெய் வகைகள்", line: "Kitchen essentials", image: "/img/Mallamaattu-Nei.webp", tone: "bg-sun text-ink", accent: "text-soil-deep" },
  { slug: "rice-grains", title: "Rice & grains", titleTa: "பாரம்பரிய அரிசி வகைகள்", line: "Pantry staples", image: "/img/Parambariya-Arisi-Vagaigal.webp", tone: "bg-forest text-white", accent: "text-sun" },
];

export default function PromoTiles() {
  return (
    <section aria-label="Featured aisles" className="wrap py-10">
      <Stagger as="ul" gap={0.12} className="grid gap-3 sm:gap-5 md:grid-cols-3">
        {tiles.map((t) => (
          <StaggerItem as="li" key={t.slug}>
            <Tilt className="h-full"><Link href={`/product-category/${t.slug}`} className={`group flex h-full items-stretch overflow-hidden md:max-lg:flex-col-reverse rounded-2xl ${t.tone} transition-shadow hover:shadow-lift`}>
              <span className="flex min-w-0 flex-1 flex-col p-4 sm:p-5 lg:p-6">
                <span className="hidden text-[15px] opacity-85 sm:block md:max-lg:hidden">{t.line}</span>
                <span className="mt-0.5 font-display text-2xl font-bold leading-tight lg:text-[1.75rem]">{t.title}</span>
                <span lang="ta" className="ta text-[15px] opacity-90">{t.titleTa}</span>
                <span className="mt-auto pt-2 sm:pt-4">
                  <span className={`font-display text-xl font-bold ${t.accent}`}>From {inr(lowestPrice(t.slug))}</span>
                  <span className="mt-1 block font-semibold underline decoration-2 underline-offset-4 group-hover:no-underline">Shop now<span className="sr-only">: {t.title}</span></span>
                </span>
              </span>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={t.image} alt="" width={300} height={300} className="h-auto w-[34%] shrink-0 object-cover sm:w-[38%] md:max-lg:aspect-[16/10] md:max-lg:w-full lg:w-[40%] transition-transform duration-500 group-hover:scale-110" />
            </Link></Tilt>
          </StaggerItem>
        ))}
      </Stagger>
    </section>
  );
}
