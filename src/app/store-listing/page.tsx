import type { Metadata } from "next";
import Link from "next/link";
import ListingHeader from "../../components/shop/ListingHeader";
import { SellerCollage, SellerMonogram } from "../../components/sellers/StoreBanner";
import { plural, storeSummary } from "../../components/sellers/storeInfo";
import { site, stores } from "../../lib/data";

export const metadata: Metadata = {
  title: "Our sellers",
  description: "Naadu Nalam is a marketplace of independent sellers. See what each store sells, how many products it lists and when it joined, then visit the store to shop its range.",
};

const howItWorks = [
  "Every product page names the store that sells it, so you always know who you are buying from.",
  "Each seller has its own storefront and keeps its own product list and stock up to date from a vendor dashboard.",
  "You can put products from different sellers in the same basket.",
  `Orders on the marketplace are ${site.payment} at present.`,
];

export default function StoreListingPage() {
  return (
    <>
      <ListingHeader
        title="Our sellers"
        titleTa="எங்கள் விற்பனையாளர்கள்"
        crumbs={[{ label: "Sellers" }]}
        intro={`Naadu Nalam is a marketplace of independent sellers. ${plural(stores.length, "store sells", "stores sell")} here today; each lists and stocks its own products, and you can shop them all in one basket.`}
      />

      <section className="wrap py-10 sm:py-12" aria-label="Sellers">
        <ul className="space-y-6 sm:space-y-8">
          {stores.map((store, n) => {
            const s = storeSummary(store);
            return (
              <li key={store.id}>
                <article className="group grid overflow-hidden rounded-[1.75rem] border border-mist bg-white transition-[transform,box-shadow] duration-300 hover:-translate-y-1 hover:shadow-[0_18px_40px_-22px_rgb(23_39_30/0.45)] md:grid-cols-2">
                  <SellerCollage images={s.collage} hover={s.more} className={`aspect-[4/3] md:aspect-auto md:min-h-[22rem] ${n % 2 ? "md:order-last" : ""}`} />
                  <div className="flex flex-col p-5 sm:p-7 lg:p-9">
                    <div className="flex items-center gap-3.5">
                      <SellerMonogram monogram={s.monogram} tone={s.tone} />
                      <h2 className="text-2xl font-bold sm:text-[1.75rem]">
                        <Link href={`/store/${store.slug}`} className="hover:underline">{store.name}</Link>
                      </h2>
                    </div>
                    <p className="mt-4 text-[15px] text-muted">
                      {plural(s.items.length, "product", "products")} · {plural(s.cats.length, "category", "categories")} · Selling since {s.since}
                    </p>

                    <ul aria-label={`What ${store.name} sells`} className="mt-4 flex flex-wrap gap-1.5">
                      {s.cats.map((c) => (
                        <li key={c.slug} className="rounded-full bg-mint px-3 py-1 text-sm text-forest-deep">
                          {c.name}
                          {c.nameTa && <span lang="ta" className="ta ml-1.5 text-leaf max-sm:hidden">{c.nameTa}</span>}
                        </li>
                      ))}
                    </ul>

                    <div className="mt-auto pt-6">
                      <Link href={`/store/${store.slug}`} className="btn btn-primary" aria-label={`Visit the ${store.name} store`}>Visit store</Link>
                    </div>
                  </div>
                </article>
              </li>
            );
          })}
        </ul>
      </section>

      <section className="wrap">
        <div className="grid gap-6 rounded-[2rem] bg-aqua px-6 py-10 sm:px-10 sm:py-12 md:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] md:gap-12">
          <div>
            <h2 className="text-2xl font-bold sm:text-[1.75rem]">How sellers work on Naadu Nalam</h2>
            <p className="mt-2 text-ink/75">One marketplace, several stores. You shop in one place, and every product is listed by a named store.</p>
          </div>
          <ul className="grid gap-2">
            {howItWorks.map((line) => <li key={line} className="rounded-[1.25rem] bg-white px-4 py-3.5">{line}</li>)}
          </ul>
        </div>
      </section>

      <section className="wrap py-10 sm:py-12">
        <div className="flex flex-col gap-5 rounded-[2rem] bg-butter px-6 py-10 sm:px-10 sm:py-12 md:flex-row md:items-center md:justify-between">
          <div className="max-w-2xl">
            <h2 className="text-2xl font-bold text-forest-deep sm:text-[1.75rem]">Grow or make something worth sharing?</h2>
            <p className="mt-2 text-ink/75">
              Apply to open your own storefront on Naadu Nalam, then add products, manage stock and track orders from the vendor dashboard.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link href="/vendor-login" className="btn btn-primary">Become a seller</Link>
            <Link href="/vendor-login#login" className="btn btn-ghost">Vendor login</Link>
          </div>
        </div>
      </section>
    </>
  );
}
