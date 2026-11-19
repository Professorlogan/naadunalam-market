import type { Metadata } from "next";
import { Suspense } from "react";
import ListingHeader from "../../components/shop/ListingHeader";
import SearchResults from "../../components/shop/SearchResults";

export const metadata: Metadata = {
  title: "Search products",
  description: "Search the Naadu Nalam shop by English name, Tamil name or product code across traditional rice, aval, millets, pulses, oils, sweeteners and podis.",
  robots: { index: false, follow: true },
};

export default function SearchPage() {
  return (
    <>
      <ListingHeader title="Search products" crumbs={[{ label: "Shop", href: "/shop" }, { label: "Search" }]} />
      <section className="wrap py-6 sm:py-8">
        <Suspense fallback={<p className="text-muted">Loading search…</p>}>
          <SearchResults />
        </Suspense>
      </section>
    </>
  );
}
