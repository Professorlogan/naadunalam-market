import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import Breadcrumbs from "../../../components/Breadcrumbs";
import SellerTrustCard from "../../../components/sellers/SellerTrustCard";
import StoreBanner from "../../../components/sellers/StoreBanner";
import StoreProducts from "../../../components/sellers/StoreProducts";
import StoreTabs from "../../../components/sellers/StoreTabs";
import StorySlot from "../../../components/sellers/StorySlot";
import { storeSummary } from "../../../components/sellers/storeInfo";
import { getStore, stores } from "../../../lib/data";

export const dynamicParams = false;
export function generateStaticParams() {
  return stores.map((s) => ({ slug: s.slug }));
}

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const store = getStore(slug);
  if (!store) return {};
  const s = storeSummary(store);
  const range = s.cats.slice(0, 4).map((c) => c.name).join(", ");
  return {
    title: `${store.name} store`,
    description: `Shop ${s.items.length} products from ${store.name} on Naadu Nalam, including ${range}. Search the store, filter by category and sort by price or name.`,
  };
}

export default async function StorePage({ params }: Props) {
  const { slug } = await params;
  const store = getStore(slug);
  if (!store) notFound();
  const s = storeSummary(store);

  const stats = [
    { label: s.items.length === 1 ? "Product" : "Products", value: String(s.items.length) },
    { label: s.cats.length === 1 ? "Category" : "Categories", value: String(s.cats.length) },
    { label: "Selling on Naadu Nalam since", value: s.since },
  ];

  const story = (
    <section className="wrap grid gap-10 py-10 sm:py-12 lg:grid-cols-[minmax(0,1fr)_22rem] lg:gap-14" aria-labelledby="store-story">
      <div className="min-w-0">
        <h2 id="store-story" className="text-2xl font-bold sm:text-[1.75rem]">Our story</h2>
        <div className="mt-4"><StorySlot name={store.name} /></div>

        <h3 className="mt-10 text-lg font-bold">What {store.name} sells</h3>
        <ul className="mt-3 grid gap-2 sm:grid-cols-2">
          {s.cats.map((c) => (
            <li key={c.slug}>
              <Link href={`/product-category/${c.slug}`} className="group flex min-h-12 items-baseline justify-between gap-4 rounded-[1.25rem] border border-mist bg-white px-4 py-3 transition-[transform,box-shadow,border-color] duration-300 hover:-translate-y-0.5 hover:border-leaf hover:shadow-[0_18px_40px_-22px_rgb(23_39_30/0.45)]">
                <span>
                  <span className="font-semibold text-forest-deep group-hover:underline">{c.name}</span>
                  {c.nameTa && <span lang="ta" className="ta ml-2 text-[15px] text-leaf">{c.nameTa}</span>}
                </span>
                <span className="shrink-0 text-[15px] tabular-nums text-muted">{c.count} {c.count === 1 ? "product" : "products"}</span>
              </Link>
            </li>
          ))}
        </ul>
        <p className="mt-2 text-sm text-muted">Each category page shows products from every seller on the marketplace.</p>
      </div>

      <div className="space-y-5">
        <SellerTrustCard slug={store.slug} />
        <p className="text-[15px] text-muted">
          Seller phone{" "}
          <a href={s.phone.href} className="inline-flex min-h-11 items-center tabular-nums text-ink hover:underline" aria-label={`Call ${store.name} on ${s.phone.label}`}>
            {s.phone.label}
          </a>
        </p>
        <p className="border-t border-mist pt-5 text-[15px] text-muted">
          A question about an order or a product from this store?{" "}
          <Link href="/contact" className="link">Contact Naadu Nalam about this seller</Link>
        </p>
      </div>
    </section>
  );

  return (
    <>
      {/* Pastel rounded store block: photo tiles, monogram, the store name big, and its facts as white chips. */}
      <header className="wrap pt-4 sm:pt-6">
        <div className="rounded-[2rem] bg-mint p-4 sm:p-6 lg:p-8">
          <div className="px-2 sm:px-0"><Breadcrumbs items={[{ label: "Sellers", href: "/store-listing" }, { label: store.name }]} /></div>
          {/* Nothing around the banner clips, so the round monogram shows in full where it overlaps the cover. */}
          <div className="mt-5">
            <StoreBanner images={s.collage} monogram={s.monogram} tone={s.tone} />
          </div>
          <div className="px-2 pb-2 pt-14 sm:px-0 sm:pt-16">
            <h1 className="text-4xl font-bold sm:text-5xl lg:text-6xl">{store.name}</h1>
            <dl className="mt-5 flex flex-wrap gap-3">
              {stats.map((st) => (
                <div key={st.label} className="rounded-[1.25rem] bg-white px-4 py-2.5">
                  <dt className="text-sm text-muted">{st.label}</dt>
                  <dd className="font-display text-xl font-bold tabular-nums leading-tight text-forest-deep">{st.value}</dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </header>

      <StoreTabs label={`${store.name} store`} tabs={[
        { key: "products", label: "Products", panel: <StoreProducts products={s.items} newest={s.newest} cats={s.cats} storeName={store.name} /> },
        { key: "story", label: "Our story", panel: story },
      ]} />

      <section className="wrap pb-4">
        <div className="flex flex-wrap items-center justify-between gap-4 rounded-[2rem] bg-butter px-6 py-7 sm:px-10">
          <p className="text-lg text-forest-deep">Looking for something else? See every seller on the marketplace.</p>
          <Link href="/store-listing" className="btn btn-primary">See all sellers</Link>
        </div>
      </section>
    </>
  );
}
