import type { Metadata } from "next";
import Link from "next/link";
import { HandHeart, Home, Leaf, Wheat } from "lucide-react";
import Breadcrumbs from "../../components/Breadcrumbs";
import LeafList from "../../components/content/LeafList";
import PromiseValues from "../../components/content/PromiseValues";
import { RuleLine, WipeImage } from "../../components/content/fx";
import { DrawStrip, Lift, Parallax, Reveal, SplitWords, Stagger, StaggerItem } from "../../components/motion";

export const metadata: Metadata = {
  title: "About us",
  description: "Naadu Nalam brings traditional Tamil Nadu rice, millets, pulses, oils, sweeteners and podis together in one place, and keeps growers and families connected.",
};

const reasons = [
  { icon: Leaf, tint: "bg-mint", title: "Naturally sourced", text: "We focus on products that stay close to their natural form and traditional roots." },
  { icon: Wheat, tint: "bg-butter", title: "Traditional varieties", text: "Discover traditional rice varieties, siruthaniyam, pulses and other ingredients deeply connected to Tamil food culture." },
  { icon: HandHeart, tint: "bg-peach", title: "Supporting farmers", text: "We believe in creating a stronger connection between the people who grow our food and the people who consume it." },
  { icon: Home, tint: "bg-aqua", title: "From farm to family", text: "Our goal is to make traditional products accessible for everyday households." },
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
      {/* Opening: pastel rounded block, text beside a big rounded photograph */}
      <header className="wrap pt-4 sm:pt-6">
        <div className="grid items-center gap-8 overflow-hidden rounded-[2rem] bg-gradient-to-br from-mint via-mint to-butter px-6 py-8 sm:px-10 sm:py-10 md:grid-cols-[1.05fr_1fr] md:gap-12 lg:py-12">
          <div>
            <Reveal y={10}><Breadcrumbs items={[{ label: "About us" }]} /></Reveal>
            <h1 className="mt-5 text-4xl font-bold sm:text-5xl lg:text-6xl"><SplitWords text="About Naadu Nalam" delay={0.05} /></h1>
            <Reveal as="p" delay={0.25} y={16} className="ta mt-4 font-display text-2xl font-semibold text-leaf sm:text-3xl">
              <span lang="ta">நம்ம மண்ணின் சுவை.<br />நம்ம மக்களின் நலம்.</span>
            </Reveal>
            <Reveal as="p" delay={0.35} y={16} className="mt-5 max-w-xl text-lg text-ink/75">
              Naadu Nalam brings the goodness of traditional Tamil Nadu foods and natural products closer to your home.
            </Reveal>
            <Reveal delay={0.45} y={16} className="mt-7"><Link href="/shop" className="btn btn-primary">Explore our products</Link></Reveal>
          </div>
          {/* The photograph settles from a soft zoom, then drifts a little slower than the page. */}
          <Reveal y={0} scale={1.08} className="h-64 overflow-hidden rounded-[1.75rem] sm:h-80 md:h-[26rem]">
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

      {/* Story */}
      <section>
        <div className="wrap grid items-center gap-8 py-12 sm:py-16 md:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] md:gap-14">
          <WipeImage panel="bg-butter" className="aspect-square w-full max-w-md rounded-[1.75rem]">
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
          {reasons.map(({ icon: Icon, tint, ...r }) => (
            <StaggerItem key={r.title} className="relative grid grid-cols-[3rem_minmax(0,1fr)] gap-x-4 gap-y-1 py-5 sm:grid-cols-[3rem_13rem_1fr] sm:items-center sm:gap-x-6">
              <span aria-hidden className={`row-span-2 grid h-12 w-12 place-items-center rounded-full text-forest sm:row-span-1 ${tint}`}><Icon size={22} /></span>
              <dt className="font-display text-xl font-bold text-forest-deep">{r.title}</dt>
              <dd className="text-muted">{r.text}<RuleLine className="absolute inset-x-0 bottom-0 h-px bg-mist" /></dd>
            </StaggerItem>
          ))}
        </Stagger>
      </section>

      {/* Product philosophy */}
      <section className="wrap py-4 sm:py-6">
        <div className="rounded-[2rem] bg-sky px-6 py-10 sm:px-10 sm:py-12">
          <Reveal><h2 className="text-3xl font-bold sm:text-4xl">Our product philosophy</h2></Reveal>
          <Stagger as="ul" className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {ranges.map((r) => (
              <StaggerItem as="li" key={r.slug}>
                <Lift className="h-full">
                  <Link href={`/product-category/${r.slug}`} className="group flex h-full items-start gap-4 rounded-[1.25rem] border border-mist bg-white p-4 transition-[border-color,box-shadow] duration-300 hover:border-leaf hover:shadow-[0_18px_40px_-22px_rgb(23_39_30/0.45)]">
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

      {/* More than a store: peach block beside a big rounded photograph */}
      <section className="wrap py-12 sm:py-16">
        <div className="grid gap-8 overflow-hidden rounded-[2rem] bg-peach p-6 sm:p-10 md:grid-cols-[minmax(0,7fr)_minmax(0,5fr)] md:items-center md:gap-12">
          <div>
            <Reveal>
              <h2 className="text-3xl font-bold text-forest-deep sm:text-4xl">More than a store</h2>
              <p className="mt-2 font-display text-2xl font-semibold text-leaf">We are preserving a way of life.</p>
            </Reveal>
            <Reveal as="p" delay={0.1} className="mt-5 max-w-xl text-lg text-ink/75">
              In a world where food is becoming increasingly processed and disconnected from its origins, Naadu Nalam wants to bring people closer to the foods and traditions that shaped Tamil households.
            </Reveal>
            <LeafList className="mt-6 text-lg font-semibold text-forest-deep" items={[
              "Every traditional grain has a story.",
              "Every native rice variety carries generations of knowledge.",
              "Every farmer plays a part in keeping that heritage alive.",
            ]} />
            <Reveal as="p" className="mt-6 max-w-xl text-ink/75">Naadu Nalam is our small step towards keeping that connection alive.</Reveal>
          </div>
          <WipeImage panel="bg-leaf" className="h-72 w-full rounded-[1.75rem] sm:h-96 md:h-full md:min-h-[26rem]">
            <img
              src="/img/m/farmer.webp" width={1000} height={1250} loading="lazy"
              alt="A smiling farmer in a straw hat holding a woven basket of greens and vegetables"
              className="h-full w-full object-cover object-top"
            />
          </WipeImage>
        </div>
      </section>

      {/* Our promise: the three values, large and bilingual */}
      <section className="wrap pb-4 sm:pb-6">
        <h2 className="text-3xl font-bold sm:text-4xl"><SplitWords text="Our promise" inView /></h2>
        <DrawStrip className="mt-4 w-28" />
        <PromiseValues />
        <Reveal as="p" x={-24} y={0} className="mt-10 max-w-2xl border-l-4 border-leaf pl-5 text-xl">
          Because when we choose better food, we don’t just nourish ourselves. We support our farmers, our soil and our heritage.
        </Reveal>
      </section>

      {/* Closing: butter block */}
      <section className="wrap py-12 sm:py-16">
        <div className="flex flex-col gap-6 rounded-[2rem] bg-butter px-6 py-10 sm:px-10 sm:py-12 lg:flex-row lg:items-end lg:justify-between">
          <Reveal className="max-w-2xl">
            <h2 lang="ta" className="ta text-3xl font-bold text-forest-deep sm:text-4xl">நம் மண்ணிலிருந்து, உங்கள் வீட்டிற்கு</h2>
            <p className="mt-2 font-display text-xl font-semibold text-leaf">Goodness from our land. Goodness for your home.</p>
            <p className="mt-4 text-ink/75">
              Explore traditional rice varieties, siruthaniyam, pulses, cold-pressed oils, natural sweeteners and everyday podis, brought together in one place for your kitchen.
            </p>
          </Reveal>
          <Reveal delay={0.15} className="shrink-0 self-start lg:self-auto"><Link href="/shop" className="btn btn-primary">Explore our products</Link></Reveal>
        </div>
      </section>
    </>
  );
}
