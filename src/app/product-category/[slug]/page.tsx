import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Catalogue from "../../../components/shop/Catalogue";
import CategoryLinks from "../../../components/shop/CategoryLinks";
import ListingHeader from "../../../components/shop/ListingHeader";
import { categories, getCategory, getStore, productsInCategory, site } from "../../../lib/data";
import type { Category } from "../../../lib/types";

export const dynamicParams = false;
export const generateStaticParams = () => categories.map((c) => ({ slug: c.slug }));

type Props = { params: Promise<{ slug: string }> };

/** The category's own description, or a plain factual line built from the catalogue when it has none. */
function introFor(c: Category) {
  if (c.description) return c.description;
  const list = productsInCategory(c.slug);
  const sellers = [...new Set(list.map((p) => getStore(p.vendor)?.name).filter(Boolean))].join(" and ");
  const sample = list.slice(0, 3).map((p) => p.name).join(", ");
  return list.length === 1
    ? `${list[0].name}, sold by ${sellers}.`
    : `${list.length} products sold by ${sellers}, including ${sample}.`;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const c = getCategory(slug);
  if (!c) return {};
  const n = productsInCategory(slug).length;
  const description = `${introFor(c)} ${n} ${n === 1 ? "product" : "products"} in ${c.name} (${c.nameTa}). ${site.deliveryLine}, ${site.payment}.`;
  return {
    title: `${c.name} – ${c.nameTa}`,
    description,
    openGraph: { title: `${c.name} – ${c.nameTa}`, description, images: c.image ? [c.image] : undefined },
  };
}

export default async function CategoryPage({ params }: Props) {
  const { slug } = await params;
  const c = getCategory(slug);
  if (!c) notFound();
  return (
    <>
      <ListingHeader title={c.name} titleTa={c.nameTa} intro={introFor(c)} crumbs={[{ label: "Shop", href: "/shop" }, { label: c.name }]}
        image={c.image || undefined} imageAlt={`${c.name} (${c.nameTa})`} />
      <section className="wrap py-6 sm:py-8">
        <Catalogue lockedCategory={c.slug} />
      </section>
      <section aria-labelledby="other-categories" className="wrap pb-10 sm:pb-14">
        <div className="rounded-[2rem] bg-white border border-mist px-6 py-7 sm:px-10">
          <h2 id="other-categories" className="t-h3 mb-4 font-display font-bold text-forest-deep">Browse categories</h2>
          <CategoryLinks current={c.slug} label="Browse categories" />
        </div>
      </section>
    </>
  );
}
