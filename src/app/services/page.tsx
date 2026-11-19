import type { Metadata } from "next";
import Link from "next/link";
import { Banknote, Leaf, Sprout, Tractor, Truck, Wheat } from "lucide-react";
import Breadcrumbs from "../../components/Breadcrumbs";
import LeafList from "../../components/content/LeafList";
import StepsSequence from "../../components/content/StepsSequence";
import { Pop, RuleLine, WipeImage } from "../../components/content/fx";
import { Reveal, SplitWords, Stagger, StaggerItem, Tilt } from "../../components/motion";
import { values } from "../../components/content/values";
import { site } from "../../lib/data";

export const metadata: Metadata = {
  title: "How ordering works",
  description: "How Naadu Nalam serves you: traditional Tamil Nadu products, doorstep delivery, cash on delivery, and a simple four-step order from browsing to your kitchen.",
};

const services = [
  { tint: "bg-mint", icon: Wheat, title: "Traditional and natural products", text: "Explore a carefully selected range of traditional rice, siruthaniyam, pulses, natural sweeteners, spices, oils and other everyday essentials.", link: { href: "/shop", label: "Explore products" } },
  { tint: "bg-butter", icon: Sprout, title: "Traditional food choices", text: "Discover traditional grains and ingredients that are closely connected to Tamil Nadu’s food heritage and everyday cooking.", link: { href: "/product-category/siruthaniyam", label: "Discover millets" } },
  { tint: "bg-peach", icon: Truck, title: "Doorstep delivery", text: "We make it convenient to order your favourite products online and have them delivered to your doorstep.", fact: site.deliveryLine },
  { tint: "bg-aqua", icon: Banknote, title: "Cash on delivery", text: "Choose Cash on delivery at checkout.", fact: "Pay when your order arrives" },
  { tint: "bg-clay", icon: Tractor, title: "Direct from growers", text: "We aim to create a stronger connection between the people who grow our food and the families who enjoy it.", fact: "Fewer hands between farm and kitchen" },
  { tint: "bg-mint", icon: Leaf, title: "Natural choices", text: "Discover products selected with a focus on traditional food practices and natural ingredients.", fact: "Chosen for traditional, low-processing methods" },
];

const steps = [
  { title: "Explore", text: "Browse traditional and natural products across our collection." },
  { title: "Choose", text: "Select the products that suit your home and everyday needs." },
  { title: "Order", text: "Add your products to the basket and complete your order." },
  { title: "Receive", text: "Get your order delivered and enjoy the goodness at home." },
];

const kitchen = [
  { slug: "rice-grains", name: "Traditional rice", text: "Seeraga Samba, Kichadi Samba, Karudan Samba and other native varieties.", img: "/img/Karudan-Samba-Arisi.webp", alt: "Karudan Samba arisi rice grains" },
  { slug: "siruthaniyam", name: "Siruthaniyam", text: "Samai, Thinai, Kuthiraivali, Varagu, Kambu, Cholam and Kezhvaragu.", img: "/img/Thinai-Arisi.webp", alt: "Thinai arisi (foxtail millet) grains" },
  { slug: "paruppu-pulses", name: "Paruppu and pulses", text: "Kadalai paruppu, thuvaram paruppu, payaru, ulundhu and kondakadalai.", img: "/img/Thuvaram-Paruppu.webp", alt: "Thuvaram paruppu, split pigeon peas (toor dal)" },
  { slug: "health-mixes", name: "Health mixes", text: "Kanji and dosai maavu, oottachathu mixes and ready-to-cook blends.", img: "/img/Pengalukkaana-Oottachathu-Maavu.webp", alt: "Oottachathu maavu, a traditional health mix flour, in a clay bowl" },
  { slug: "natural-sweeteners", name: "Natural sweeteners", text: "Panangkarkandu, urundai vellam and other traditional sweeteners.", img: "/img/Karuppatti.webp", alt: "Karuppatti, traditional palm jaggery, in a clay bowl" },
  { slug: "masala-podi", name: "Masala and powders", text: "Sambar, kuzhambu, rasam and milagai podi ground the traditional way.", img: "/img/m/p-sambar.webp", alt: "Rasam podi, traditional Tamil rasam powder" },
  { slug: "oil-vinegers", name: "Oils and ghee", text: "Cold-pressed nallennai, kadalai ennai, thengai ennai and mallamaattu nei.", img: "/img/Mallamaattu-Nei.webp", alt: "Mallamaattu nei, traditional cow ghee" },
  { slug: "herbal-wellness", name: "Natural and herbal", text: "Panchakara kudineer, seekkai podi and other herbal everyday essentials.", img: "/img/Seekkai-Podi.webp", alt: "Seekkai podi, traditional herbal hair wash powder" },
];

const why = [
  { title: "Traditional", text: "Products connected to the food traditions of Tamil Nadu." },
  { title: "Convenient", text: "Simple online shopping with doorstep delivery." },
  { title: "Trustworthy", text: "Clear product information and a customer-focused shopping experience." },
  { title: "Rooted in our land", text: "Celebrating the grains, ingredients and food culture of our region." },
];

export default function ServicesPage() {
  return (
    <>
      {/* Opening: text beside a tall field photograph */}
      <header className="wrap pt-4 sm:pt-6">
        <div className="grid gap-8 rounded-[2rem] bg-gradient-to-br from-mint via-mint to-butter px-6 py-8 sm:px-10 sm:py-10 md:grid-cols-[1fr_auto] md:items-center md:gap-14">
          <div>
            <Reveal y={10}><Breadcrumbs items={[{ label: "How ordering works" }]} /></Reveal>
            <h1 className="t-h1 mt-5 max-w-2xl font-bold"><SplitWords text="How ordering works" delay={0.05} /></h1>
            <Reveal as="p" delay={0.25} y={14} className="mt-5 max-w-xl font-display text-2xl font-semibold leading-snug text-leaf">
              Services that bring goodness closer to you
            </Reveal>
            <Reveal as="p" delay={0.32} y={14} className="mt-3 max-w-xl text-lg text-muted">
              At Naadu Nalam, we make it easier to discover, choose and enjoy traditional and natural products from Tamil Nadu.
            </Reveal>
            <Reveal delay={0.4} y={14} className="mt-7 flex flex-wrap gap-3">
              <Link href="/shop" className="btn btn-primary">Shop our products</Link>
              <Link href="/contact" className="btn btn-ghost">Contact us</Link>
            </Reveal>
            <Stagger delay={0.5} className="relative mt-8 pt-5">
              <RuleLine className="absolute inset-x-0 top-0 h-px bg-forest/15" />
              <p className="flex flex-wrap gap-x-6 gap-y-1 font-semibold text-forest">
                <StaggerItem as="span" y={10}>{site.deliveryLine}</StaggerItem>
                <StaggerItem as="span" y={10}>{site.payment}</StaggerItem>
              </p>
            </Stagger>
          </div>
          <WipeImage panel="bg-leaf" className="h-72 w-full rounded-[1.75rem] md:h-[30rem] md:w-64 lg:w-80">
            <img
              src="/img/sona-masoori-rice-fix-scaled.jpg" width={1152} height={2560}
              alt="A hand holding newly picked paddy stalks in a rice field"
              className="h-full w-full object-cover object-[50%_60%]"
            />
          </WipeImage>
        </div>
      </header>

      {/* How we serve you */}
      <section className="wrap py-12 sm:py-16">
        <Reveal className="max-w-2xl">
          <h2 className="t-h2 font-bold">How we serve you</h2>
          <p className="mt-3 text-muted">
            From carefully bringing traditional products together to getting them to your doorstep, we focus on making your shopping experience simple and reliable.
          </p>
        </Reveal>
        <Stagger as="ul" gap={0.1} className="mt-8 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {services.map(({ icon: Icon, tint, ...s }) => (
            <StaggerItem as="li" key={s.title} className="group relative flex gap-4 rounded-[1.5rem] border border-mist bg-white p-5 transition-[transform,box-shadow] duration-300 hover:-translate-y-1 hover:shadow-[0_18px_40px_-22px_rgb(23_39_30/0.45)] sm:p-6">
              <Pop className={`grid h-12 w-12 shrink-0 place-items-center rounded-full text-forest ${tint}`}>
                <Icon aria-hidden size={22} className="transition-transform duration-300 ease-out group-hover:-rotate-12 group-hover:scale-125" />
              </Pop>
              <div>
                <h3 className="t-h4 font-bold">{s.title}</h3>
                <p className="mt-1.5 text-muted">{s.text}</p>
                {/* One trailing line per item, in one style; where it is a link it only gains an underline. */}
                <p className="mt-1 flex min-h-11 items-center text-[15px] font-semibold text-forest/80">
                  {s.link
                    ? <Link href={s.link.href} className="inline-flex min-h-11 items-center underline decoration-forest/30 underline-offset-4 hover:text-forest hover:decoration-forest">{s.link.label}</Link>
                    : s.fact}
                </p>
              </div>
            </StaggerItem>
          ))}
        </Stagger>
      </section>

      {/* The four steps: a real sequence, so it is numbered */}
      <section className="wrap">
        <div className="rounded-[2rem] bg-white border border-mist px-6 py-10 sm:px-10 sm:py-12">
          <h2 className="t-h2 font-bold text-forest-deep"><SplitWords text="Simple from start to finish" inView /></h2>
          {/* Signature moment: the line draws from step to step and each one lights up in turn. */}
          <StepsSequence steps={steps} />
        </div>
      </section>

      {/* Categories as photographs */}
      <section className="wrap py-12 sm:py-16">
        <Reveal><h2 className="t-h2 font-bold">Something for every kitchen</h2></Reveal>
        <Stagger as="ul" className="mt-8 grid grid-cols-2 gap-x-4 gap-y-8 md:grid-cols-4 md:gap-x-6">
          {kitchen.map((k) => (
            <StaggerItem as="li" key={k.slug}>
              <Link href={`/product-category/${k.slug}`} className="group block">
                <Tilt max={6}>
                  {/* Cropped a little past the frame so nothing in the photograph's corners shows. */}
                  <span className="block aspect-[4/5] overflow-hidden rounded-[1.25rem] bg-mist">
                    <img src={k.img} width={1024} height={1024} loading="lazy" alt={k.alt} className="h-full w-full scale-[1.08] object-cover transition-transform duration-700 ease-out group-hover:scale-[1.14]" />
                  </span>
                </Tilt>
                <h3 className="t-h5 mt-3 font-bold group-hover:underline">{k.name}</h3>
                <p className="mt-1 text-[15px] leading-snug text-muted">{k.text}</p>
              </Link>
            </StaggerItem>
          ))}
        </Stagger>
      </section>

      {/* Why choose, with the values alongside */}
      <section className="overflow-x-clip">
        <div className="wrap grid gap-12 py-4 sm:py-6 lg:grid-cols-[minmax(0,7fr)_minmax(0,5fr)] lg:gap-16">
          <div>
            <Reveal><h2 className="t-h2 font-bold">Why choose Naadu Nalam?</h2></Reveal>
            <Stagger as="dl" gap={0.12} className="mt-6 grid gap-x-10 sm:grid-cols-2">
              {why.map((w) => (
                <StaggerItem key={w.title} className="relative py-4">
                  <dt className="font-display text-xl font-bold text-forest-deep"><RuleLine className="absolute inset-x-0 top-0 h-0.5 bg-leaf" />{w.title}</dt>
                  <dd className="mt-1 text-muted">{w.text}</dd>
                </StaggerItem>
              ))}
            </Stagger>
          </div>
          <Reveal x={32} y={0} className="rounded-[2rem] bg-white border border-mist p-6 sm:p-8">
            <h2 className="t-h3 font-bold">Our values</h2>
            <Stagger as="ul" gap={0.16} delay={0.2} className="mt-4 divide-y divide-forest/10">
              {values.map((v) => (
                <StaggerItem as="li" key={v.en} y={16} className="flex flex-col gap-0.5 py-3 sm:flex-row sm:items-baseline sm:justify-between sm:gap-x-4">
                  <span lang="ta" className={`ta font-display text-3xl font-bold ${v.colour}`}>{v.ta}</span>
                  <span className="font-semibold text-forest-deep">{v.roman} <span className="font-normal text-muted">· {v.en}</span></span>
                </StaggerItem>
              ))}
            </Stagger>
            <p className="mt-4 text-muted">Every product we bring to your home should reflect the values we believe in.</p>
          </Reveal>
        </div>
      </section>

      {/* Convenience */}
      <section className="wrap grid items-center gap-8 py-12 sm:py-16 md:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] md:gap-14">
        <WipeImage panel="bg-peach" className="aspect-[4/3] w-full rounded-[1.75rem]">
          <img
            src="/img/m/hero-packs.webp" width={1800} height={972} loading="lazy"
            alt="Naadu Nalam packs of Karuppu Kavuni rice, Mappillai Samba rice, pearl millet and toor dal with clay bowls of grain"
            className="h-full w-full object-cover object-[78%_50%]"
          />
        </WipeImage>
        <div>
        <Reveal>
          <h2 className="t-h2 font-bold">Your convenience matters</h2>
          <p className="mt-4 text-lg">Shopping for traditional and natural products should be simple.</p>
          <p className="mt-3 text-muted">
            That is why we focus on making the experience easy, from discovering products and placing an order to receiving it at your doorstep.
          </p>
        </Reveal>
        <div className="mt-6">
          {/* The checklist ticks itself, one item after another. */}
          <LeafList ticks className="font-display text-xl font-semibold text-forest-deep" items={["Easy product discovery", "Simple ordering", "Convenient delivery"]} />
          <Reveal delay={0.5} y={16} className="mt-7"><Link href="/shop" className="btn btn-primary">Start shopping</Link></Reveal>
        </div>
        </div>
      </section>

      {/* Help */}
      <section className="wrap pb-12 sm:pb-16">
        <div className="flex flex-col gap-6 rounded-[2rem] bg-white border border-mist px-6 py-10 sm:px-10 md:flex-row md:items-center md:justify-between">
          <Reveal>
            <h2 className="t-h2 font-bold text-forest-deep">Need help with your order?</h2>
            <p className="mt-2 text-ink/75">Have a question about a product, order or delivery? We’re here to help.</p>
          </Reveal>
          <Reveal delay={0.15} className="flex shrink-0 flex-wrap gap-3">
            <Link href="/contact" className="btn btn-primary">Contact us</Link>
            <Link href="/shop" className="btn btn-ghost">Shop now</Link>
          </Reveal>
        </div>
      </section>
    </>
  );
}
