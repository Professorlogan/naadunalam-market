import type { Metadata } from "next";
import Catalogue from "../../components/shop/Catalogue";
import ListingHeader from "../../components/shop/ListingHeader";
import { categories, products, site, stores } from "../../lib/data";

export const metadata: Metadata = {
  title: "Shop all products",
  description: `Browse all ${products.length} products across ${categories.length} categories: traditional rice, aval, millets, pulses, oils, natural sweeteners and podis from Tamil Nadu sellers. ${site.deliveryLine}, ${site.payment}.`,
};

export default function ShopPage() {
  return (
    <>
      <ListingHeader
        title="Shop all products"
        crumbs={[{ label: "Shop" }]}
        intro={`${products.length} products in ${categories.length} categories from ${stores.map((s) => s.name).join(" and ")}. ${site.deliveryLine}, pay by ${site.payment.toLowerCase()}.`}
      />
      <section className="wrap py-6 sm:py-8">
        <Catalogue />
      </section>
    </>
  );
}
