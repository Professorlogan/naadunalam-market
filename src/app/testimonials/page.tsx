import type { Metadata } from "next";
import Link from "next/link";
import Breadcrumbs from "../../components/Breadcrumbs";
import LeafList from "../../components/content/LeafList";
import { RuleLine, StepNumeral, WipeImage } from "../../components/content/fx";
import { Lift, Reveal, SplitWords, Stagger, StaggerItem } from "../../components/motion";

export const metadata: Metadata = {
  title: "Customer reviews",
  description: "Naadu Nalam is a new marketplace and no customer reviews have been published yet. Read our review policy and how to review a product you have bought.",
};

const rules = [
  { title: "No paid reviews", text: "We do not write, buy or incentivise reviews." },
  { title: "Nothing hidden", text: "We do not delete a review because it is negative." },
  { title: "Removed only for abuse", text: "We remove reviews only if they contain abuse, personal information, or spam." },
  { title: "Your chosen name", text: "Reviews are attributed to the name the reviewer chooses to display." },
];
const reasons = [
  { title: "Traditional choices", text: "Products inspired by the food traditions and ingredients of our land." },
  { title: "Natural everyday options", text: "Thoughtfully presented choices for everyday kitchens." },
  { title: "Simple shopping", text: "A straightforward experience from browsing to ordering." },
  { title: "Community", text: "A growing connection between people who value traditional and natural living." },
];
const steps = [
  { title: "Discover", text: "Explore our collection of traditional and natural products." },
  { title: "Choose", text: "Find the products that fit your everyday needs." },
  { title: "Enjoy", text: "Receive your order and make them part of your home." },
];

export default function TestimonialsPage() {
  return (
    <>
      <header className="border-b border-mist bg-white">
        <div className="wrap py-8 sm:py-12">
          <Reveal y={10}><Breadcrumbs items={[{ label: "Customer reviews" }]} /></Reveal>
          <h1 className="t-h1 mt-4 font-bold"><SplitWords text="What our customers say" delay={0.05} /></h1>
          <Reveal as="p" delay={0.3} y={14} className="mt-4 max-w-2xl text-lg text-muted">
            Every order is part of our journey. This is where customers’ own words about their experience with Naadu Nalam will appear.
          </Reveal>
        </div>
      </header>

      {/* The honest state of things, said first and said large */}
      <section className="wrap py-10 sm:py-14">
        <Reveal scale={0.97} className="rounded-[1.75rem] border border-mist bg-white p-6 sm:p-10">
          <h2 className="t-h4 font-bold text-muted">Stories from our customers</h2>
          <p className="mt-3 max-w-3xl font-display text-[1.75rem] font-bold leading-tight text-forest-deep sm:text-[2rem]">
            <SplitWords text="The first review is still to be written." inView delay={0.2} />
          </p>
          <Reveal delay={0.3} className="mt-5 grid gap-4 text-lg text-ink md:grid-cols-2 md:gap-10">
            <p>
              Naadu Nalam is a new marketplace, and no customer reviews have been published yet. When they arrive they will appear here, exactly as they were written.
            </p>
            <p>
              Reviews sit on the product pages themselves, next to the item they describe, so you can see what people thought of that specific rice, oil or honey rather than a general impression of the shop. Once you have received an order, you can review any item in it from its product page.
            </p>
          </Reveal>
          <Reveal delay={0.4} y={14} className="mt-7"><Link href="/shop" className="btn btn-primary">Browse products</Link></Reveal>
        </Reveal>
      </section>

      {/* Review policy */}
      <section className="wrap py-4 sm:py-6">
        <div className="grid gap-10 rounded-[2rem] bg-white border border-mist px-6 py-10 sm:px-10 sm:py-12 lg:grid-cols-2 lg:gap-16">
          {/* Both columns are stretched to one height: the quotation sits on the same baseline as the last rule. */}
          <Reveal className="flex flex-col">
            <h2 className="t-h2 font-bold text-forest-deep">Our promise on reviews</h2>
            <p className="mt-4 font-display text-2xl font-semibold leading-snug text-leaf sm:text-3xl">
              We would rather show you nothing than show you reviews we wrote ourselves.
            </p>
            <figure className="mt-6 border-l-4 border-leaf pl-5 lg:mt-auto">
              <blockquote className="text-lg text-ink/85">
                Every review on this site comes from a real customer, published unedited, including the critical ones.
              </blockquote>
              <figcaption className="mt-2 text-muted">Naadu Nalam, our review policy</figcaption>
            </figure>
          </Reveal>
          <div className="flex flex-col">
            <Reveal><h2 className="t-h3 font-bold text-forest-deep">How we handle reviews</h2></Reveal>
            <Stagger as="dl" gap={0.14} className="mt-4 flex flex-1 flex-col justify-between">
              {rules.map((r, i) => (
                <StaggerItem key={r.title} className="relative py-4">
                  <dt className="font-display text-xl font-bold text-forest-deep">{i === 0 && <RuleLine className="absolute inset-x-0 top-0 h-px bg-forest/20" />}{r.title}</dt>
                  <dd className="mt-1 text-ink/75">{r.text}<RuleLine className="absolute inset-x-0 bottom-0 h-px bg-forest/20" /></dd>
                </StaggerItem>
              ))}
            </Stagger>
          </div>
        </div>
      </section>

      {/* More than products, beside the photograph */}
      <section className="bg-white">
        <div className="wrap grid items-center gap-8 py-12 sm:py-16 md:grid-cols-2 md:gap-14">
          <WipeImage className="aspect-[3/2] w-full rounded-[1.75rem]">
            <img
              src="/img/m/hero-sweet.webp" width={1800} height={972} loading="lazy"
              alt="Traditional Tamil Nadu produce: millets, pulses, cold-pressed oils and native vegetables laid on a wooden table before a paddy field"
              className="aspect-[3/2] w-full object-cover"
            />
          </WipeImage>
          <div>
            <Reveal>
              <h2 className="t-h2 font-bold">More than just products</h2>
              <p className="mt-4 text-lg">
                At Naadu Nalam, we believe that choosing traditional and natural products is also about choosing better connections: with our food, our traditions and the people around us.
              </p>
            </Reveal>
            <LeafList className="mt-5 font-semibold text-forest-deep" items={["Traditional choices", "Natural everyday essentials", "Customer-focused experience"]} />
          </div>
        </div>
      </section>

      {/* What brings people back */}
      <section className="wrap py-12 sm:py-16">
        <Reveal><h2 className="t-h2 font-bold">What brings people back</h2></Reveal>
        <Stagger as="dl" gap={0.12} className="mt-7 grid gap-x-10 sm:grid-cols-2 lg:grid-cols-4">
          {reasons.map((r) => (
            <StaggerItem key={r.title} className="relative py-4">
              <dt className="font-display text-xl font-bold text-forest-deep"><RuleLine className="absolute inset-x-0 top-0 h-0.5 bg-leaf" />{r.title}</dt>
              <dd className="mt-1 text-muted">{r.text}</dd>
            </StaggerItem>
          ))}
        </Stagger>

        <Reveal className="mt-12"><h2 className="t-h2 font-bold">From our store to your home</h2></Reveal>
        <Stagger as="ol" gap={0.28} className="mt-7 grid gap-4 md:grid-cols-3">
          {steps.map((s, i) => (
            <StaggerItem as="li" key={s.title}>
              <Lift className="card flex h-full items-start gap-4 p-5">
                <StepNumeral n={i + 1} className="w-9 shrink-0" />
                <div>
                  <h3 className="t-h4 font-bold"><span className="sr-only">Step {i + 1}: </span>{s.title}</h3>
                  <p className="mt-1 text-muted">{s.text}</p>
                </div>
              </Lift>
            </StaggerItem>
          ))}
        </Stagger>
      </section>

      {/* Leaving a review, and what to do when something is wrong */}
      <section className="border-y border-mist bg-white">
        <div className="wrap grid gap-8 py-12 sm:py-16 md:grid-cols-[minmax(0,7fr)_minmax(0,5fr)] md:gap-12">
          <Reveal>
            <h2 className="t-h2 font-bold">Have you tried Naadu Nalam?</h2>
            <p className="mt-4 text-lg">We’d love to hear about your experience.</p>
            <p className="mt-3 max-w-xl text-muted">
              Reviews are left on the product page for the item you bought: open the product and scroll to the Reviews section. Ratings and written reviews are both published as submitted.
            </p>
            <Link href="/shop" className="btn btn-primary mt-6">Find the product you bought</Link>
          </Reveal>
          <Reveal delay={0.15} className="md:self-start">
          <aside className="rounded-[1.5rem] bg-white border border-mist p-6">
            <h3 className="t-h4 font-bold">Something wrong with an order?</h3>
            <p className="mt-2">
              A review is a slow way to get a problem solved. If an item arrived damaged, spoiled or incorrect,{" "}
              <Link href="/contact" className="link font-semibold">contact us</Link> within 24 hours of delivery and we will sort it out under our{" "}
              <Link href="/refund-policy" className="link font-semibold">Returns and refunds</Link>.
            </p>
          </aside>
          </Reveal>
        </div>
      </section>

      <section className="wrap pb-4 pt-12 sm:pt-16">
        <div className="flex flex-col gap-6 rounded-[2rem] bg-white border border-mist px-6 py-10 sm:px-10 md:flex-row md:items-center md:justify-between">
          <Reveal className="max-w-2xl">
            <h2 className="t-h2 font-bold text-forest-deep">Ready to discover Naadu Nalam?</h2>
            <p className="mt-2 text-ink/75">Explore our collection of traditional and natural products and become part of our growing community.</p>
          </Reveal>
          <Reveal delay={0.15} className="flex shrink-0 flex-wrap gap-3">
            <Link href="/shop" className="btn btn-primary">Shop now</Link>
            <Link href="/contact" className="btn btn-ghost">Contact us</Link>
          </Reveal>
        </div>
      </section>
    </>
  );
}
