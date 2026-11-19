import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { FileText, MessageSquare, Store, Truck } from "lucide-react";
import Breadcrumbs from "../../../components/Breadcrumbs";
import ProductRail from "../../../components/ProductRail";
import Prose from "../../../components/Prose";
import Accordion from "../../../components/shop/Accordion";
import BuyBox from "../../../components/shop/BuyBox";
import PinCheck from "../../../components/shop/PinCheck";
import ProductGallery from "../../../components/shop/ProductGallery";
import RecentlyViewed from "../../../components/shop/RecentlyViewed";
import { hasTamil } from "../../../components/shop/catalogue-utils";
import { getCategory, getProduct, getStore, products, productsByStore, productsInCategory, site, stores } from "../../../lib/data";
import { unitPrice } from "../../../lib/format";
import type { Category, Product } from "../../../lib/types";

export const dynamicParams = false;
export const generateStaticParams = () => products.map((p) => ({ slug: p.slug }));

type Props = { params: Promise<{ slug: string }> };

/** Set NEXT_PUBLIC_SITE_URL at build time so structured data and social images carry absolute URLs. */
const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL ?? "").replace(/\/$/, "");

const packLabel = (p: Product) => (p.variants ? p.variants.map((v) => v.pack).join(" or ") : p.pack);

function clip(text: string, max = 158) {
  if (text.length <= max) return text;
  const cut = text.slice(0, max);
  return cut.slice(0, cut.lastIndexOf(" ")).replace(/[,;:.–—-]+$/, "") + "…";
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const p = getProduct(slug);
  if (!p) return {};
  const title = `${p.name} (${p.nameTa}) – ${packLabel(p)}`;
  const description = clip(p.short);
  return {
    title,
    description,
    openGraph: { title, description, images: p.images.map((i) => ({ url: SITE_URL + i.src, alt: i.alt })) },
  };
}

function jsonLd(p: Product, category: Category | undefined, sellerName: string | undefined) {
  const availability = p.inStock ? "https://schema.org/InStock" : "https://schema.org/OutOfStock";
  const seller = sellerName ? { "@type": "Organization", name: sellerName } : undefined;
  const url = `${SITE_URL}/product/${p.slug}`;
  const offers = p.variants
    ? {
        "@type": "AggregateOffer", priceCurrency: "INR", offerCount: p.variants.length,
        lowPrice: Math.min(...p.variants.map((v) => v.price)), highPrice: Math.max(...p.variants.map((v) => v.price)),
        availability, seller, url,
      }
    : { "@type": "Offer", priceCurrency: "INR", price: p.price, availability, seller, url };
  const data = {
    "@context": "https://schema.org", "@type": "Product",
    name: p.name, alternateName: p.nameTa, sku: p.sku, description: p.short,
    image: p.images.map((i) => SITE_URL + i.src), category: category?.name, url, offers,
  };
  return JSON.stringify(data).replace(/</g, "\\u003c");
}

const RAIL = 12;
/** Monogram backgrounds, one per seller in catalogue order. */
const AVATAR = ["bg-forest", "bg-soil", "bg-water-deep", "bg-leaf"];
const TH = "w-28 py-2.5 pr-3 align-top font-normal text-muted";
const TD = "py-2.5 text-ink";
/** Sub-headings inside the CMS description stay below the accordion title: 16px semibold, body face. */
const DESCRIPTION = "[&_h2]:!font-body [&_h2]:!text-base [&_h2]:!font-semibold [&_h2]:!leading-snug [&_h3]:!font-body [&_h3]:!text-base [&_h3]:!font-semibold [&_h3]:!leading-snug [&_h4]:!font-body [&_h4]:!text-base [&_h4]:!font-semibold";

export default async function ProductPage({ params }: Props) {
  const { slug } = await params;
  const p = getProduct(slug);
  if (!p) notFound();
  const cats = p.categories.map(getCategory).filter((c): c is Category => Boolean(c));
  const category = cats[0];
  const seller = getStore(p.vendor);
  const sellerProducts = seller ? productsByStore(seller.slug) : [];
  const sellerCats = [...new Set(sellerProducts.flatMap((o) => o.categories))].map(getCategory).filter((c): c is Category => Boolean(c));
  const avatar = AVATAR[Math.max(0, stores.findIndex((s) => s.slug === p.vendor)) % AVATAR.length];
  const countLabel = `${sellerProducts.length} ${sellerProducts.length === 1 ? "product" : "products"}`;
  // The seller rail leads with the seller's other categories, so it does not repeat the category rail under it.
  const others = sellerProducts.filter((o) => o.id !== p.id);
  const fromSeller = [...others.filter((o) => !category || !o.categories.includes(category.slug)), ...others.filter((o) => category && o.categories.includes(category.slug))].slice(0, RAIL);
  const inCategory = category ? productsInCategory(category.slug).filter((o) => o.id !== p.id).slice(0, RAIL) : [];
  const tamilDescription = hasTamil(p.descriptionHtml);
  const perUnit = (p.variants ?? [{ id: 0, pack: p.pack, price: p.price }])
    .map((v) => ({ pack: v.pack, per: unitPrice(v.price, v.pack) }))
    .filter((v) => v.per);
  const stockLabel = !p.inStock ? "Sold out for now" : p.stock > 0 && p.stock <= 10 ? `In stock, only ${p.stock} left` : "In stock";

  return (
    <div className="bg-white">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd(p, category, seller?.name) }} />

      <div className="wrap pb-6 pt-5 sm:py-8">
        <Breadcrumbs items={[
          { label: "Shop", href: "/shop" },
          ...(category ? [{ label: category.name, href: `/product-category/${category.slug}` }] : []),
          { label: category?.name === p.name ? `${p.name} (${p.pack})` : p.name },
        ]} />

        {/* From tablet up both columns stick below the header: whichever is shorter stays in view while the other scrolls. */}
        <div className="mt-5 grid items-start gap-6 md:grid-cols-2 md:gap-8 lg:grid-cols-[1.05fr_1fr] lg:gap-12">
          <div className="min-w-0 md:sticky md:top-28 lg:top-36">
            <ProductGallery images={p.images} name={p.name} />
          </div>

          <div className="min-w-0 md:sticky md:top-28 lg:top-36">
            {seller && (
              <div className="flex items-center gap-3 border-b border-mist pb-3">
                <span aria-hidden className={`grid h-10 w-10 shrink-0 place-items-center rounded-full font-display text-lg font-bold text-white ${avatar}`}>{seller.name.charAt(0).toUpperCase()}</span>
                <p className="min-w-0 flex-1 leading-snug">
                  <span className="block text-[15px] text-muted">Sold by <Link href={`/store/${seller.slug}`} className="font-semibold text-ink hover:text-forest hover:underline">{seller.name}</Link></span>
                  <span className="block text-sm text-muted">{countLabel}</span>
                </p>
                <Link href={`/store/${seller.slug}`} className="link inline-flex min-h-11 shrink-0 items-center text-sm font-semibold">Visit store</Link>
              </div>
            )}

            <h1 className="mt-4 text-[28px] font-bold leading-tight sm:text-[32px]">{p.name}</h1>
            {p.nameTa && <p lang="ta" className="ta mt-1 font-display text-lg font-medium text-leaf">{p.nameTa}</p>}

            <div className="mt-4">
              <BuyBox product={{ id: p.id, name: p.name, price: p.price, pack: p.pack, variants: p.variants, inStock: p.inStock, stock: p.stock, maxQty: p.maxQty }} />
            </div>
            <div className="mt-3 border-t border-mist pt-4"><PinCheck /></div>
          </div>
        </div>
      </div>

      <section aria-label="Product information" className="border-t border-mist">
        <div className="wrap grid gap-8 py-8 sm:py-10 lg:grid-cols-[22rem_minmax(0,1fr)] lg:gap-12">
          {/* Beside the accordion this block opens on the same rule and its heading sits on the first title's line. */}
          <div className="lg:border-t lg:border-mist">
            <h2 className="flex items-center font-body text-base font-semibold text-ink lg:min-h-14">Product details</h2>
            <table className="mt-2 w-full border-t border-mist text-left text-[15px] lg:mt-0">
              <tbody className="divide-y divide-mist border-b border-mist">
                {seller && <tr><th scope="row" className={TH}>Sold by</th><td className={TD}><Link href={`/store/${seller.slug}`} className="link">{seller.name}</Link></td></tr>}
                <tr><th scope="row" className={TH}>Pack</th><td className={TD}>{packLabel(p)}</td></tr>
                {perUnit.length > 0 && (
                  <tr>
                    <th scope="row" className={TH}>Unit price</th>
                    <td className={TD}>{perUnit.map((v) => (perUnit.length > 1 ? `${v.per} (${v.pack} pack)` : v.per)).join(", ")}</td>
                  </tr>
                )}
                <tr>
                  <th scope="row" className={TH}>Category</th>
                  <td className={TD}>
                    {cats.map((c, i) => (
                      <span key={c.slug}>{i > 0 && ", "}<Link href={`/product-category/${c.slug}`} className="link">{c.name}</Link></span>
                    ))}
                  </td>
                </tr>
                <tr><th scope="row" className={TH}>SKU</th><td className={TD}>{p.sku}</td></tr>
                <tr><th scope="row" className={TH}>Stock</th><td className={TD}>{stockLabel}</td></tr>
              </tbody>
            </table>
          </div>

          <div className="border-t border-mist">
            <Accordion title="About this product" icon={<FileText size={18} />} defaultOpen>
              <p className="max-w-[68ch]">{p.short}</p>
              {p.descriptionHtml && (
                <div lang={tamilDescription ? "ta" : undefined} className={`mt-4 max-w-[68ch] ${DESCRIPTION} ${tamilDescription ? "ta" : ""}`}><Prose html={p.descriptionHtml} /></div>
              )}
            </Accordion>

            <Accordion title="Delivery and returns" icon={<Truck size={18} />}>
              <ul className="space-y-1.5">
                <li>{site.deliveryLine}.</li>
                <li>Packed within 24–48 hours on business days.</li>
                <li>{site.payment}: pay when your order arrives.</li>
              </ul>
              <p className="mt-3 flex flex-wrap gap-x-5 gap-y-1">
                <Link href="/shipping-policy" className="link">Shipping policy</Link>
                <Link href="/refund-policy" className="link">Refund policy</Link>
              </p>
            </Accordion>

            {seller && (
              <Accordion title="About the seller" icon={<Store size={18} />}>
                <p><span className="font-semibold">{seller.name}</span> sells {countLabel} on Naadu Nalam.</p>
                {sellerCats.length > 0 && (
                  <p className="mt-2">
                    <span className="text-muted">Categories: </span>
                    {sellerCats.map((c, i) => (
                      <span key={c.slug}>{i > 0 && ", "}<Link href={`/product-category/${c.slug}`} className="link">{c.name}</Link></span>
                    ))}
                  </p>
                )}
                <p className="mt-3"><Link href={`/store/${seller.slug}`} className="link font-semibold">Visit the {seller.name} store</Link></p>
              </Accordion>
            )}

            <Accordion title="Reviews" icon={<MessageSquare size={18} />}>
              <p className="font-semibold">No reviews yet</p>
              <p className="mt-1 text-muted">Nobody has reviewed {p.name} so far, so there is no rating to show.</p>
            </Accordion>
          </div>
        </div>
      </section>

      {seller && fromSeller.length > 0 && (
        <div className="border-t border-mist">
          <ProductRail id="more-from-seller" title={`More from ${seller.name}`} href={`/store/${seller.slug}`} linkLabel="Visit store" products={fromSeller} />
        </div>
      )}
      {category && inCategory.length > 0 && (
        <div className="border-t border-mist">
          <ProductRail id="more-in-category" title={`More in ${category.name}`} titleTa={category.nameTa} href={`/product-category/${category.slug}`} products={inCategory} />
        </div>
      )}
      <RecentlyViewed currentId={p.id} />
    </div>
  );
}
