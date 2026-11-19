"use client";
import { useMemo, useState } from "react";
import { Search, X } from "lucide-react";
import ProductGrid from "../ProductGrid";
import ProductRail from "../ProductRail";
import type { Product } from "../../lib/types";
import type { StoreCategory } from "./storeInfo";

type Sort = "default" | "price-asc" | "price-desc" | "name";

/**
 * A seller's products: a "newest" rail, then the full range with in-store search (English or Tamil name),
 * category pills with counts and a sort. State is in memory only; nothing is saved.
 */
export default function StoreProducts({ products, newest, cats, storeName }: {
  products: Product[]; newest: Product[]; cats: StoreCategory[]; storeName: string;
}) {
  const [cat, setCat] = useState<string>("all");
  const [sort, setSort] = useState<Sort>("default");
  const [query, setQuery] = useState("");

  const q = query.trim().toLowerCase();
  const matched = useMemo(
    () => (q ? products.filter((p) => p.name.toLowerCase().includes(q) || p.nameTa.toLowerCase().includes(q)) : products),
    [products, q],
  );
  const shown = useMemo(() => {
    const list = cat === "all" ? [...matched] : matched.filter((p) => p.categories.includes(cat));
    if (sort === "price-asc") list.sort((a, b) => a.price - b.price);
    if (sort === "price-desc") list.sort((a, b) => b.price - a.price);
    if (sort === "name") list.sort((a, b) => a.name.localeCompare(b.name));
    return list;
  }, [matched, cat, sort]);
  // Pill counts follow the search, so a count always says how many products that pill will show.
  const countIn = (slug: string) => matched.filter((p) => p.categories.includes(slug)).length;

  const reset = () => { setQuery(""); setCat("all"); };
  const filtered = q !== "" || cat !== "all";

  const pill = (value: string, label: string, count: number) => {
    const active = cat === value;
    return (
      <button key={value} type="button" aria-pressed={active} onClick={() => setCat(value)}
        className={`inline-flex min-h-11 shrink-0 items-center gap-2 rounded-full border px-4 text-[15px] font-semibold transition-colors duration-150 ${
          active ? "border-leaf bg-leaf text-white" : "border-mist bg-white text-forest-deep hover:text-leaf"}`}>
        {label} <span className={`text-sm font-normal tabular-nums ${active ? "text-white/80" : "text-muted"}`}>{count}</span>
      </button>
    );
  };

  return (
    <>
      {newest.length > 0 && products.length > newest.length && (
        <div>
          <ProductRail id="store-newest" title="Our picks" blurb={`Favourites from ${storeName}.`}
            products={newest} />
        </div>
      )}

      <section className="wrap py-10 sm:py-12" aria-labelledby="store-all">
        <h2 id="store-all" className="text-2xl font-bold sm:text-[1.75rem]">All products from {storeName}</h2>

        <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="relative w-full sm:max-w-sm">
            <label htmlFor="store-search" className="sr-only">Search {storeName} products by English or Tamil name</label>
            <Search size={18} aria-hidden className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-muted" />
            <input id="store-search" type="search" value={query} onChange={(e) => setQuery(e.target.value)} autoComplete="off"
              placeholder={`Search in ${storeName}`} className="field !pl-10 !pr-11 [&::-webkit-search-cancel-button]:hidden" />
            {query && (
              <button type="button" onClick={() => setQuery("")} aria-label="Clear search"
                className="absolute right-0 top-1/2 grid h-11 w-11 -translate-y-1/2 place-items-center rounded-lg text-muted hover:text-forest">
                <X size={18} />
              </button>
            )}
          </div>
          <div className="flex shrink-0 items-center gap-2">
            <label htmlFor="store-sort" className="whitespace-nowrap text-[15px] font-semibold text-forest-deep">Sort by</label>
            <select id="store-sort" value={sort} onChange={(e) => setSort(e.target.value as Sort)} className="field !w-auto">
              <option value="default">Store order</option>
              <option value="price-asc">Price: low to high</option>
              <option value="price-desc">Price: high to low</option>
              <option value="name">Name: A to Z</option>
            </select>
          </div>
        </div>

        {cats.length > 1 && (
          <div role="group" aria-label={`Filter ${storeName} products by category`}
            className="-mx-4 mt-3 flex gap-2 overflow-x-auto px-4 pb-1 [scrollbar-width:none] sm:mx-0 sm:flex-wrap sm:overflow-visible sm:px-0 [&::-webkit-scrollbar]:hidden">
            {pill("all", "All", matched.length)}
            {cats.map((c) => pill(c.slug, c.name, countIn(c.slug)))}
          </div>
        )}

        <p role="status" className="mt-4 text-[15px] text-muted">
          Showing <span className="font-semibold tabular-nums text-forest-deep">{shown.length}</span> of {products.length}{" "}
          {products.length === 1 ? "product" : "products"}{q && <> for “{query.trim()}”</>}
        </p>

        {shown.length > 0 ? (
          <ProductGrid products={shown} className="mt-4" />
        ) : (
          <div className="card mt-4 p-6">
            <p>{q ? `No ${storeName} products match “${query.trim()}”${cat !== "all" ? " in this category" : ""}.` : "No products in this category right now."}</p>
            {filtered && <button type="button" onClick={reset} className="link mt-2 min-h-11 text-[15px]">Clear search and filters</button>}
          </div>
        )}
      </section>
    </>
  );
}
