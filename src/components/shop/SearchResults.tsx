"use client";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useMemo, useState } from "react";
import { Search, SearchX } from "lucide-react";
import { products, site } from "../../lib/data";
import Catalogue from "./Catalogue";
import CategoryLinks from "./CategoryLinks";
import { searchProducts } from "./catalogue-utils";

export default function SearchResults() {
  const q = (useSearchParams().get("q") ?? "").trim();
  const results = useMemo(() => searchProducts(products, q), [q]);

  return (
    <div>
      {q === "" ? (
        <div className="rounded-[1.5rem] bg-sky p-6 sm:p-8">
          <SearchBox initial="" label="Search the shop" />
          <h2 className="mt-6 font-display text-2xl font-bold text-forest-deep">What are you looking for?</h2>
          <p className="mt-2 max-w-2xl text-[15px] text-muted">
            Search by English name, Tamil name or product code, for example “samba”, “அவல்” or “NN-TUR-001”. Or pick a category.
          </p>
          <div className="mt-4"><CategoryLinks label="Browse by category" /></div>
        </div>
      ) : results.length === 0 ? (
        <div className="rounded-[1.5rem] bg-butter p-6 sm:p-8">
          <span aria-hidden className="mb-4 grid h-12 w-12 place-items-center rounded-full bg-white text-forest"><SearchX size={24} /></span>
          <h2 role="status" className="font-display text-2xl font-bold text-forest-deep">No products match “{q}”</h2>
          <div className="mt-4"><SearchBox key={q} initial={q} label="Search again" /></div>
          <ul className="prose-nn mt-3 text-[15px] text-muted">
            <li>Check the spelling, or try a shorter word such as “samba” instead of the full variety name.</li>
            <li>Try the other language: every product has an English and a Tamil name.</li>
            <li>Many names have several spellings in English (kavuni / kauni, aval / poha). The Tamil name is the surest match.</li>
          </ul>
          <h3 className="mt-6 font-display text-lg font-bold text-forest-deep">Browse by category instead</h3>
          <div className="mt-3"><CategoryLinks label="Browse by category" /></div>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link href="/shop" className="btn btn-primary">Shop all {products.length} products</Link>
            <a href={site.whatsapp} target="_blank" rel="noopener noreferrer" className="btn btn-ghost">Ask us on Telegram</a>
          </div>
        </div>
      ) : (
        <div>
          <p role="status" className="mb-5 flex flex-wrap items-baseline gap-x-3 gap-y-1">
            <span className="font-display text-2xl font-bold text-forest-deep">Results for “{q}”</span>
            <span className="text-[15px] text-muted">{results.length} {results.length === 1 ? "product" : "products"}</span>
          </p>
          <Catalogue key={q} items={results} featuredLabel="Best match" />
        </div>
      )}
    </div>
  );
}

/** A compact search field, shown only when there is nothing to list: the header's search covers every other case. */
function SearchBox({ initial, label }: { initial: string; label: string }) {
  const router = useRouter();
  const [value, setValue] = useState(initial);
  const [error, setError] = useState("");
  return (
    <form role="search" aria-label={label} noValidate className="max-w-md"
      onSubmit={(e) => {
        e.preventDefault();
        const next = value.trim();
        if (!next) return setError("Type a product name, Tamil name or product code to search.");
        setError("");
        router.push(`/search?q=${encodeURIComponent(next)}`);
      }}>
      <label htmlFor="page-search" className="mb-1.5 block text-sm font-semibold text-ink">{label}</label>
      <div className="flex gap-2">
        <input id="page-search" type="search" className="field !min-h-11 !rounded-full !px-4 !py-2 text-[15px]" value={value} autoComplete="off" enterKeyHint="search"
          placeholder="Rice, millets, oils, அவல்…" aria-invalid={error ? true : undefined} aria-describedby={error ? "page-search-error" : undefined}
          onChange={(e) => { setValue(e.target.value); if (error) setError(""); }} />
        <button type="submit" className="btn btn-primary !min-h-11 shrink-0 !rounded-full !px-5 !text-[15px]"><Search size={17} aria-hidden /> Search</button>
      </div>
      {error && <p id="page-search-error" role="alert" className="mt-2 text-[15px] font-semibold text-soil">{error}</p>}
    </form>
  );
}
