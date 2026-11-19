import type { Metadata } from "next";
import Link from "next/link";
import { Languages, ShoppingBasket, Store } from "lucide-react";
import PageHero from "@/components/PageHero";
import SectionHeading from "@/components/SectionHeading";
import ClosingBand from "@/components/community/ClosingBand";
import { DrawLine, Pop } from "@/components/community/Motion";
import { Stagger, StaggerItem, Tilt } from "@/components/motion";
import { collaborators } from "@/lib/data";

export const metadata: Metadata = {
  title: "Collaborators",
  description: "The community organisations working alongside Naadu Nalam, how collaboration works on the marketplace, and where to find the sellers behind the products.",
};

/** Up to two initials from the organisation's name, for its badge until a logo is supplied. */
const initials = (name: string) => name.split(/\s+/).filter((w) => /^[A-Za-z]/.test(w)).slice(0, 2).map((w) => w[0].toUpperCase()).join("");

const points = [
  { icon: Store, title: "Every seller has their own store", text: "Sellers list and manage their own products, stock and orders, and each one has a store page of their own on this site." },
  { icon: Languages, title: "Listed in English and Tamil", text: "Product names and descriptions carry both, so the produce is named the way the people who grow it name it." },
  { icon: ShoppingBasket, title: "One basket, many sellers", text: "You can order from several sellers in a single basket. Orders on the marketplace are Cash on delivery at present." },
];

export default function CollaboratorsPage() {
  return (
    <>
      <PageHero
        title="Collaborators"
        crumbs={[{ label: "Collaborators" }]}
        intro="This page introduces the community organisations working alongside Naadu Nalam."
      >
        <p className="max-w-2xl text-lg text-muted">
          The sellers whose products are on the marketplace have their own page: <Link href="/store-listing" className="link font-semibold">meet our sellers</Link>.
        </p>
      </PageHero>
      <section className="wrap py-12 sm:py-16">
        <SectionHeading
          title="Our collaborators"
          intro="We are gathering profiles, logos and links for the organisations we work with. As each one is confirmed, its description and details will appear here."
        />
        <Stagger as="ul" gap={0.09} className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {collaborators.map((c, i) => (
            <StaggerItem as="li" key={c.slug}>
              <Tilt max={6} className="h-full">
                <Link href={`/collaborators/${c.slug}`} className="group flex h-full min-h-44 flex-col justify-start gap-5 rounded-[1.5rem] border border-mist bg-white p-6 transition-[transform,box-shadow,border-color] duration-300 hover:-translate-y-1 hover:border-leaf hover:shadow-[0_18px_40px_-22px_rgb(23_39_30/0.45)]">
                  <Pop delay={0.2 + i * 0.09} className={`grid h-14 w-14 shrink-0 place-items-center rounded-full font-display text-xl font-bold text-forest ${["bg-mint", "bg-butter", "bg-peach", "bg-aqua", "bg-clay"][i % 5]}`}>{initials(c.name)}</Pop>
                  <span>
                    <span className="block font-display text-2xl font-bold leading-tight text-forest-deep transition-colors group-hover:text-leaf">{c.name}</span>
                    <span className="mt-1 block text-sm text-muted">Community organisation · details coming soon</span>
                  </span>
                </Link>
              </Tilt>
            </StaggerItem>
          ))}
          <StaggerItem as="li">
            <Tilt max={6} className="h-full">
              <Link href="/store-listing" className="group flex h-full min-h-44 flex-col justify-start gap-5 rounded-[1.5rem] bg-white border border-mist p-6 text-forest-deep transition-[transform,box-shadow] duration-300 hover:-translate-y-1 hover:shadow-[0_18px_40px_-22px_rgb(23_39_30/0.45)]">
                <Pop delay={0.2 + collaborators.length * 0.09} className="grid h-14 w-14 shrink-0 place-items-center rounded-full bg-white text-forest"><Store size={24} /></Pop>
                <span>
                  <span className="block font-display text-2xl font-bold leading-tight">Browse our sellers</span>
                  <span className="mt-1 block text-sm text-ink/75">The stores already selling on the marketplace</span>
                </span>
              </Link>
            </Tilt>
          </StaggerItem>
        </Stagger>
      </section>
      <section className="wrap py-4 sm:py-6">
        <div className="rounded-[2rem] bg-sky px-6 py-10 sm:px-10 sm:py-12">
          <SectionHeading title="How collaboration works here" intro="Three things are true of every seller on the marketplace today." />
          <Stagger as="ul" gap={0.12} className="grid gap-x-10 gap-y-8 md:grid-cols-3">
            {points.map(({ icon: Icon, title, text }, i) => (
              <StaggerItem as="li" key={title}>
                <DrawLine delay={0.1 + i * 0.12} className="h-1 rounded-full bg-leaf" />
                <Pop delay={0.25 + i * 0.12} className="mt-5 inline-block text-leaf"><Icon size={28} /></Pop>
                <h3 className="t-h4 mt-3 font-bold">{title}</h3>
                <p className="mt-2 text-muted">{text}</p>
              </StaggerItem>
            ))}
          </Stagger>
        </div>
      </section>
      <ClosingBand
        title="Want to work with us?"
        actions={<>
          <Link href="/vendor-login" className="btn btn-primary">Apply to sell</Link>
          <Link href="/contact" className="btn btn-ghost">Contact us</Link>
        </>}
      >
        If you grow, make or gather something that belongs on Naadu Nalam — or you represent a group that does — we would like to hear from you.
      </ClosingBand>
    </>
  );
}
