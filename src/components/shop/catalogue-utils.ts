import type { Product } from "../../lib/types";

export type SortKey = "featured" | "price-asc" | "price-desc" | "name";
export type Filters = { cats: string[]; sellers: string[]; packs: string[]; price: string; inStock: boolean };
export const NO_FILTERS: Filters = { cats: [], sellers: [], packs: [], price: "", inStock: false };

export const PRICE_BANDS = [
  { id: "under-125", label: "Under ₹125", min: 0, max: 125 },
  { id: "125-175", label: "₹125 to ₹174", min: 125, max: 175 },
  { id: "175-250", label: "₹175 to ₹249", min: 175, max: 250 },
  { id: "250-up", label: "₹250 and above", min: 250, max: Infinity },
];

export const SORTS: { id: SortKey; label: string }[] = [
  { id: "featured", label: "Featured" },
  { id: "price-asc", label: "Price: low to high" },
  { id: "price-desc", label: "Price: high to low" },
  { id: "name", label: "Name: A to Z" },
];

export type View = { filters: Filters; sort: SortKey };
export const NO_VIEW: View = { filters: NO_FILTERS, sort: "featured" };
/** The query-string keys the catalogue owns. Anything else in the URL (such as `q`) is left alone. */
export const VIEW_KEYS = ["cat", "seller", "pack", "price", "stock", "sort"] as const;

const list = (v: string | null) => (v ? [...new Set(v.split(",").map((s) => s.trim()).filter(Boolean))] : []);
const join = (key: string, values: string[]) => (values.length ? `${key}=${values.map(encodeURIComponent).join(",")}` : "");

/** Reads ?cat=&seller=&pack=&price=&stock=&sort= into a view. Unknown values are dropped. */
export function parseView(params: { get: (key: string) => string | null }): View {
  const price = params.get("price") ?? "";
  const sort = params.get("sort") ?? "";
  return {
    filters: {
      cats: list(params.get("cat")),
      sellers: list(params.get("seller")),
      packs: list(params.get("pack")),
      price: PRICE_BANDS.some((b) => b.id === price) ? price : "",
      inStock: params.get("stock") === "1",
    },
    sort: SORTS.some((s) => s.id === sort) ? (sort as SortKey) : "featured",
  };
}

/** The view as a canonical query string (no leading "?"), empty when nothing is filtered or sorted. */
export function viewQuery({ filters: f, sort }: View) {
  return [
    join("cat", f.cats), join("seller", f.sellers), join("pack", f.packs),
    f.price ? `price=${encodeURIComponent(f.price)}` : "",
    f.inStock ? "stock=1" : "",
    sort !== "featured" ? `sort=${sort}` : "",
  ].filter(Boolean).join("&");
}

/** Every pack a product can be bought in (the variable product has several). */
export const packsOf = (p: Product) => (p.variants ? p.variants.map((v) => v.pack) : [p.pack]);

/** "250 g" → grams/millilitres, so packs list smallest first with weights before volumes. */
export function packWeight(pack: string) {
  const m = pack.match(/([\d.]+)\s*(kg|g|ml|l)\b/i);
  if (!m) return Number.MAX_SAFE_INTEGER;
  const unit = m[2].toLowerCase();
  const n = parseFloat(m[1]) * (unit === "kg" || unit === "l" ? 1000 : 1);
  return unit === "ml" || unit === "l" ? 1e7 + n : n;
}

/** Does the product pass every filter group, optionally ignoring one (used for facet counts)? */
export function matches(p: Product, f: Filters, skip?: keyof Filters) {
  if (skip !== "cats" && f.cats.length && !f.cats.some((c) => p.categories.includes(c))) return false;
  if (skip !== "sellers" && f.sellers.length && !f.sellers.includes(p.vendor)) return false;
  if (skip !== "packs" && f.packs.length && !packsOf(p).some((k) => f.packs.includes(k))) return false;
  if (skip !== "price" && f.price) {
    const band = PRICE_BANDS.find((b) => b.id === f.price);
    if (band && !(p.price >= band.min && p.price < band.max)) return false;
  }
  if (skip !== "inStock" && f.inStock && !p.inStock) return false;
  return true;
}

/** Has the product got one of the new market photos as its lead image? */
export const hasNewPhoto = (p: Product) => p.images[0]?.src.startsWith("/img/m/") ?? false;

/**
 * "Featured" keeps the catalogue order but lifts products with a new photo to the front (a stable split),
 * so listings open with the best pictures. Pass `photoFirst: false` to keep a given order as-is (search relevance).
 */
export function sortProducts(list: Product[], sort: SortKey, photoFirst = true) {
  if (sort === "featured") return photoFirst ? [...list.filter(hasNewPhoto), ...list.filter((p) => !hasNewPhoto(p))] : list;
  const out = [...list];
  if (sort === "price-asc") out.sort((a, b) => a.price - b.price);
  else if (sort === "price-desc") out.sort((a, b) => b.price - a.price);
  else out.sort((a, b) => a.name.localeCompare(b.name, "en"));
  return out;
}

const norm = (s: string) => s.normalize("NFC").toLowerCase();

/** Search English + Tamil names, short description and SKU. Every word must match; name matches rank first. */
export function searchProducts(list: Product[], query: string) {
  const words = norm(query).split(/\s+/).filter(Boolean);
  if (!words.length) return [];
  return list
    .map((p, i) => {
      const names = norm(`${p.name} ${p.nameTa}`);
      const all = `${names} ${norm(p.short)} ${norm(p.sku)}`;
      if (!words.every((w) => all.includes(w))) return null;
      return { p, i, score: words.every((w) => names.includes(w)) ? 0 : 1 };
    })
    .filter((r): r is { p: Product; i: number; score: number } => r !== null)
    .sort((a, b) => a.score - b.score || a.i - b.i)
    .map((r) => r.p);
}

export const hasTamil = (s: string) => /[஀-௿]/.test(s);
