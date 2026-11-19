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
        <ul className="mt-3 divide-y divide-mist border-y border-mist">
          {s.cats.map((c) => (
            <li key={c.slug}>
              <Link href={`/product-category/${c.slug}`} className="group flex min-h-12 items-baseline justify-between gap-4 py-3">
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
      <header className="bg-white">
        <div className="wrap pt-6 sm:pt-8">
          <Breadcrumbs items={[{ label: "Sellers", href: "/store-listing" }, { label: store.name }]} />
        </div>
        {/* Nothing around the banner clips, so the round monogram shows in full where it overlaps the cover. */}
        <div className="wrap mt-5 !px-0 sm:!px-6">
          <StoreBanner images={s.collage} monogram={s.monogram} tone={s.tone} className="sm:rounded-xl" />
        </div>
        <div className="wrap pb-7 pt-14 sm:pt-16">
          <h1 className="text-3xl font-bold sm:text-4xl">{store.name}</h1>
          <dl className="mt-5 flex flex-wrap gap-x-8 gap-y-3 border-y border-mist py-3.5">
            {stats.map((st) => (
              <div key={st.label} className="sm:[&:not(:first-child)]:border-l sm:[&:not(:first-child)]:border-mist sm:[&:not(:first-child)]:pl-8">
                <dt className="text-sm text-muted">{st.label}</dt>
                <dd className="font-display text-xl font-bold tabular-nums leading-tight text-forest-deep">{st.value}</dd>
              </div>
            ))}
          </dl>
        </div>
      </header>

      <StoreTabs label={`${store.name} store`} tabs={[
        { key: "products", label: "Products", panel: <StoreProducts products={s.items} newest={s.newest} cats={s.cats} storeName={store.name} /> },
        { key: "story", label: "Our story", panel: story },
      ]} />

      <section className="border-t border-mist bg-white">
        <div className="wrap flex flex-wrap items-center justify-between gap-4 py-7">
          <p>Looking for something else? See every seller on the marketplace.</p>
          <Link href="/store-listing" className="btn btn-ghost">See all sellers</Link>
        </div>
      </section>
    </>
  );
}
