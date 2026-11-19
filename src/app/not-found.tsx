import type { Metadata } from "next";
import Link from "next/link";
import NotFoundArt from "../components/content/NotFoundArt";
import NotFoundSearch from "../components/content/NotFoundSearch";
import { Lift, Reveal, SplitWords, Stagger, StaggerItem } from "../components/motion";
import { categories } from "../lib/data";

export const metadata: Metadata = {
  title: "Page not found",
  description: "This page could not be found on Naadu Nalam. Search the shop or browse the main categories.",
};

export default function NotFound() {
  const top = [...categories].sort((a, b) => b.count - a.count).slice(0, 6);
  return (
    <>
      <section className="wrap pt-4 sm:pt-6">
        <div className="grid items-center gap-8 overflow-hidden rounded-[2rem] bg-gradient-to-br from-mint via-mint to-butter px-6 py-10 sm:px-10 sm:py-14 lg:grid-cols-[minmax(0,1fr)_minmax(0,26rem)] lg:gap-14">
          {/* Signature moment: "404" assembled from leaf, water, soil and sun shapes that drop and roll into place. */}
          <NotFoundArt className="mx-auto w-full max-w-[17rem] sm:max-w-sm lg:order-2 lg:max-w-none" />
          <div>
            <Reveal as="p" y={10} className="font-display text-xl font-bold text-leaf">Error 404</Reveal>
            <h1 className="mt-2 max-w-2xl text-4xl font-bold sm:text-5xl"><SplitWords text="We could not find that page" delay={0.1} /></h1>
            <Reveal as="p" delay={0.3} y={14} className="mt-4 max-w-xl text-lg text-ink/75">
              The link may be old, or the address may have a typing mistake. Search for a product, or pick up from the shop.
            </Reveal>
            <Reveal delay={0.4} y={14} className="mt-7"><NotFoundSearch /></Reveal>
            <Reveal delay={0.5} y={14} className="mt-6 flex flex-wrap gap-3">
              <Link href="/shop" className="btn btn-primary">Go to the shop</Link>
              <Link href="/" className="btn btn-ghost">Go to the home page</Link>
            </Reveal>
          </div>
        </div>
      </section>
      <section className="wrap py-10 sm:py-14">
        <Reveal><h2 className="text-2xl font-bold sm:text-3xl">Browse a category</h2></Reveal>
        <Stagger as="ul" gap={0.08} className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
          {top.map((c) => (
            <StaggerItem as="li" key={c.slug}>
              <Lift>
                <Link href={`/product-category/${c.slug}`} className="group block">
                  <span className="block overflow-hidden rounded-[1.25rem] border border-mist">
                    <img src={c.image} width={1024} height={1024} loading="lazy" alt="" className="aspect-square w-full object-cover transition-transform duration-500 ease-out group-hover:scale-110" />
                  </span>
                  <span className="mt-2 block font-display text-lg font-bold leading-tight text-forest-deep group-hover:underline">{c.name}</span>
                  <span lang="ta" className="ta block text-sm text-muted">{c.nameTa}</span>
                </Link>
              </Lift>
            </StaggerItem>
          ))}
        </Stagger>
      </section>
    </>
  );
}
