import type { Metadata } from "next";
import Link from "next/link";
import Breadcrumbs from "../../components/Breadcrumbs";
import ElementStrip from "../../components/ElementStrip";
import LeafList from "../../components/content/LeafList";
import PromiseValues from "../../components/content/PromiseValues";
import { RuleLine, WipeImage } from "../../components/content/fx";
import { DrawStrip, Lift, Parallax, Reveal, SplitWords, Stagger, StaggerItem } from "../../components/motion";

export const metadata: Metadata = {
  title: "About us",
  description: "Naadu Nalam brings traditional Tamil Nadu rice, millets, pulses, oils, sweeteners and podis together in one place, and keeps growers and families connected.",
};

const reasons = [
  { title: "Naturally sourced", text: "We focus on products that stay close to their natural form and traditional roots." },
  { title: "Traditional varieties", text: "Discover traditional rice varieties, siruthaniyam, pulses and other ingredients deeply connected to Tamil food culture." },
  { title: "Supporting farmers", text: "We believe in creating a stronger connection between the people who grow our food and the people who consume it." },
  { title: "From farm to family", text: "Our goal is to make traditional products accessible for everyday households." },
];

const ranges = [
  { slug: "rice-grains", name: "Traditional rice", img: "/img/Kudavaazhai-Arisi.webp", alt: "Kudavaazhai arisi rice grains", items: ["Seeraga Samba", "Kichili Samba", "Karudan Samba", "Kudavaazhai", "Moongil Arisi"] },
  { slug: "siruthaniyam", name: "Siruthaniyam", img: "/img/Samai-Arisi.webp", alt: "Samai arisi (little millet) grains", items: ["Samai", "Thinai", "Kuthiraivali", "Varagu", "Kambu", "Cholam", "Kezhvaragu"] },
  { slug: "paruppu-pulses", name: "Paruppu and pulses", img: "/img/Kadalai-Paruppu.webp", alt: "Kadalai paruppu, split Bengal gram", items: ["Kadalai Paruppu", "Thuvaram Paruppu", "Pachai Payaru", "Ulundhu", "Kondakadalai"] },
  { slug: "natural-sweeteners", name: "Natural sweeteners", img: "/img/Karuppatti.webp", alt: "Karuppatti, traditional palm jaggery", items: ["Naattu Sarkkarai", "Karuppatti", "Vellam", "Panangkarkandu", "Then"] },
  { slug: "masala-podi", name: "Masala and powders", img: "/img/Sambar-Podi.webp", alt: "Sambar podi, traditional Tamil sambar powder", items: ["Sambar Podi", "Kuzhambu Podi", "Rasam Podi", "Milagai Podi"] },
  { slug: "oil-vinegers", name: "Traditional oils and ghee", img: "/img/Nallennai.webp", alt: "Nallennai, cold-pressed sesame oil", items: ["Nallennai", "Kadalai Ennai", "Thengai Ennai", "Mallamaattu Nei"] },
];

export default function AboutPage() {
  return (
    <>
      {/* Opening: forest band, photograph running off the right edge */}
      <header className="overflow-hidden bg-forest text-white">
        <div className="wrap grid items-stretch gap-8 py-8 md:grid-cols-[1.05fr_1fr] md:gap-12 md:py-0">
          <div className="md:py-16 lg:py-20">
            <Reveal y={10} className="[&_*]:!text-white/80"><Breadcrumbs items={[{ label: "About us" }]} /></Reveal>
            <h1 className="mt-5 text-4xl font-bold !text-white sm:text-5xl lg:text-6xl"><SplitWords text="About Naadu Nalam" delay={0.05} /></h1>
            <Reveal as="p" delay={0.25} y={16} className="ta mt-4 font-display text-2xl font-semibold text-sun sm:text-3xl">
              <span lang="ta">நம்ம மண்ணின் சுவை.<br />நம்ம மக்களின் நலம்.</span>
            </Reveal>
            <Reveal as="p" delay={0.35} y={16} className="mt-5 max-w-xl text-lg text-white/85">
              Naadu Nalam brings the goodness of traditional Tamil Nadu foods and natural products closer to your home.
            </Reveal>
            <Reveal delay={0.45} y={16} className="mt-7"><Link href="/shop" className="btn btn-sun">Explore our products</Link></Reveal>
          </div>
          {/* The photograph settles from a soft zoom, then drifts a little slower than the page. */}
          <Reveal y={0} scale={1.08} className="h-64 overflow-hidden rounded-2xl sm:h-80 md:-mr-[max(1.5rem,calc((100vw_-_78rem)_/_2_+_1.5rem))] md:h-auto md:rounded-none">
            <Parallax amount={26} className="h-full">
              <img
                src="/img/naadu-nalam-store-banner.webp" width={1536} height={1024}
                alt="Traditional Tamil Nadu produce: millets, pulses, cold-pressed oils and native vegetables laid on a wooden table before a paddy field"
                className="h-full w-full scale-[1.14] object-cover"
              />
            </Parallax>
          </Reveal>
        </div>
      </header>
      <ElementStrip />

      {/* Story */}
      <section className="bg-white">
        <div className="wrap grid items-center gap-8 py-12 sm:py-16 md:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] md:gap-14">
          <WipeImage className="aspect-square w-full max-w-md rounded-[1.75rem]">
            <img
              src="/img/Parambariya-Arisi-Vagaigal.webp" width={1024} height={1024} loading="lazy"
              alt="Parambariya arisi vagaigal: traditional rice varieties"
              className="aspect-square w-full object-cover"
            />
          </WipeImage>
          <Stagger gap={0.1}>
            <StaggerItem><h2 className="text-3xl font-bold sm:text-4xl">From our soil to your home</h2></StaggerItem>
            <StaggerItem as="p" className="mt-4 font-display text-2xl font-semibold text-leaf">Good food begins with good soil.</StaggerItem>
            <StaggerItem className="mt-4 max-w-xl space-y-4 text-lg">
              <p>Tamil Nadu has a rich agricultural heritage filled with traditional grains, rice varieties, native ingredients and time-tested food practices.</p>
              <p>At Naadu Nalam, we bring these products together in one place so you can discover and enjoy the foods that have been part of our culture for generations.</p>
            </StaggerItem>
            <StaggerItem className="relative mt-6 pt-5">
              <RuleLine className="absolute inset-x-0 top-0 h-px bg-mist" />
              <Stagger as="p" gap={0.16} delay={0.35} className="flex flex-wrap gap-x-5 gap-y-1 font-display text-xl font-bold text-forest-deep">
                <StaggerItem as="span" y={12}>Traditional.</StaggerItem><StaggerItem as="span" y={12}>Natural.</StaggerItem><StaggerItem as="span" y={12}>Authentic.</StaggerItem>
              </Stagger>
            </StaggerItem>
          </Stagger>
        </div>
      </section>

      {/* Why: heading held on the left, ruled list on the right */}
      <section className="wrap grid gap-8 py-12 sm:py-16 md:grid-cols-[minmax(0,4fr)_minmax(0,8fr)] md:gap-14">
        <Reveal className="md:sticky md:top-32 md:self-start">
          <h2 className="text-3xl font-bold sm:text-4xl">Why Naadu Nalam?</h2>
          <p className="mt-3 max-w-sm text-lg text-muted">Goodness from our land. Goodness for your home.</p>
        </Reveal>
        {/* Each row rises as its rule line draws beneath it. */}
        <Stagger as="dl" gap={0.14}>
          {reasons.map((r, i) => (
            <StaggerItem key={r.title} className="relative grid gap-1 py-5 sm:grid-cols-[13rem_1fr] sm:gap-6">
              <dt className="font-display text-xl font-bold text-forest-deep">{i === 0 && <RuleLine className="absolute inset-x-0 top-0 h-0.5 bg-forest" />}{r.title}</dt>
              <dd className="text-muted">{r.text}<RuleLine className="absolute inset-x-0 bottom-0 h-px bg-mist" /></dd>
            </StaggerItem>
          ))}
        </Stagger>
      </section>

      {/* Product philosophy */}
      <section className="border-y border-mist bg-white">
        <div className="wrap py-12 sm:py-16">
          <Reveal><h2 className="text-3xl font-bold sm:text-4xl">Our product philosophy</h2></Reveal>
          <Stagger as="ul" className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {ranges.map((r) => (
              <StaggerItem as="li" key={r.slug}>
                <Lift className="h-full">
                  <Link href={`/product-category/${r.slug}`} className="group flex h-full items-start gap-4 rounded-2xl border border-mist bg-sky p-4 transition-[border-color,box-shadow] duration-300 hover:border-leaf hover:shadow-lift">
                    <span className="block h-24 w-24 shrink-0 overflow-hidden rounded-full">
                      <img src={r.img} width={1024} height={1024} loading="lazy" alt={r.alt} className="h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-110" />
                    </span>
                    <div>
                      <h3 className="text-xl font-bold group-hover:underline">{r.name}</h3>
                      <p className="mt-1.5 text-base leading-relaxed text-muted">{r.items.join(" · ")}</p>
                    </div>
                  </Link>
                </Lift>
              </StaggerItem>
            ))}
          </Stagger>
        </div>
      </section>

      {/* More than a store */}
      <section className="overflow-hidden bg-soil-deep text-white">
        <div className="wrap grid gap-8 pt-12 sm:pt-16 md:grid-cols-[minmax(0,7fr)_minmax(0,5fr)] md:items-center md:gap-12 md:pt-0">
          <div className="md:py-16">
            <Reveal>
              <h2 className="text-3xl font-bold !text-white sm:text-4xl">More than a store</h2>
              <p className="mt-2 font-display text-2xl font-semibold text-sun">We are preserving a way of life.</p>
            </Reveal>
            <Reveal as="p" delay={0.1} className="mt-5 max-w-xl text-lg text-white/85">
              In a world where food is becoming increasingly processed and disconnected from its origins, Naadu Nalam wants to bring people closer to the foods and traditions that shaped Tamil households.
            </Reveal>
            <LeafList dark className="mt-6 text-lg font-semibold" items={[
              "Every traditional grain has a story.",
              "Every native rice variety carries generations of knowledge.",
              "Every farmer plays a part in keeping that heritage alive.",
            ]} />
            <Reveal as="p" className="mt-6 max-w-xl text-white/85">Naadu Nalam is our small step towards keeping that connection alive.</Reveal>
          </div>
          {/* The cutout stands on the bottom edge of the band; no drift, so the gap above it stays at the grid's 32px. */}
          <div className="mx-auto w-64 self-end sm:w-72 md:w-full md:max-w-sm md:pt-10">
            <img
              src="/img/nn-hero-cutout-clean-800.webp" width={800} height={1200} loading="lazy"
              alt="A farmer holding a woven basket of freshly harvested vegetables"
              className="block h-auto w-full"
            />
          </div>
        </div>
      </section>

      {/* Our promise: the three values, large and bilingual */}
      <section className="wrap py-12 sm:py-16">
        <h2 className="text-3xl font-bold sm:text-4xl"><SplitWords text="Our promise" inView /></h2>
        <DrawStrip className="mt-4 w-28" />
        <PromiseValues />
        <Reveal as="p" x={-24} y={0} className="mt-10 max-w-2xl border-l-4 border-sun pl-5 text-xl">
          Because when we choose better food, we don’t just nourish ourselves. We support our farmers, our soil and our heritage.
        </Reveal>
      </section>

      {/* Closing */}
      <section className="bg-forest text-white">
        <div className="wrap flex flex-col gap-6 py-12 sm:py-16 lg:flex-row lg:items-end lg:justify-between">
          <Reveal className="max-w-2xl">
            <h2 lang="ta" className="ta text-3xl font-bold !text-white sm:text-4xl">நம் மண்ணிலிருந்து, உங்கள் வீட்டிற்கு</h2>
            <p className="mt-2 font-display text-xl font-semibold text-sun">Goodness from our land. Goodness for your home.</p>
            <p className="mt-4 text-white/85">
              Explore traditional rice varieties, siruthaniyam, pulses, cold-pressed oils, natural sweeteners and everyday podis, brought together in one place for your kitchen.
            </p>
          </Reveal>
          <Reveal delay={0.15} className="shrink-0 self-start lg:self-auto"><Link href="/shop" className="btn btn-sun">Explore our products</Link></Reveal>
        </div>
      </section>
    </>
  );
}
