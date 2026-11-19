import { categories, productsByStore } from "../../lib/data";
import type { Product, Store } from "../../lib/types";

export type StoreCategory = { slug: string; name: string; nameTa: string; count: number };

/** One monogram colour for every seller: forest with white initials. */
const tone = "bg-forest text-white";

/** "8123456456" becomes "+91 81234 56456" with a matching tel: link. Unknown shapes are shown as captured. */
export function phoneParts(raw: string) {
  const digits = raw.replace(/\D/g, "");
  const local = digits.length === 12 && digits.startsWith("91") ? digits.slice(2) : digits;
  if (local.length !== 10) return { label: raw, href: `tel:${digits}` };
  return { label: `+91 ${local.slice(0, 5)} ${local.slice(5)}`, href: `tel:+91${local}` };
}

const MONTHS = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
/** "2026-09-22" becomes "September 2026". Written out by hand so server and browser always agree. */
export function monthYear(iso: string) {
  const [y, m] = iso.split("-").map(Number);
  return MONTHS[m - 1] ? `${MONTHS[m - 1]} ${y}` : iso;
}

/** Label artwork exported from print files; kept out of every cover and collage. */
export const isLabel = (src: string) => /-pdf/i.test(src);

export const plural = (n: number, one: string, many: string) => `${n} ${n === 1 ? one : many}`;

/** Everything the seller pages derive from a store's own products. */
export function storeSummary(store: Store) {
  const all: Product[] = productsByStore(store.slug);
  const hasNew = (p: Product) => p.images[0]?.src.startsWith("/img/m/");
  // Products with the new scene photos lead the store, the rest keep their order.
  const items: Product[] = [...all.filter(hasNew), ...all.filter((p) => !hasNew(p))];

  const counts = new Map<string, number>();
  for (const p of items) for (const c of p.categories) counts.set(c, (counts.get(c) ?? 0) + 1);
  const cats: StoreCategory[] = [...counts.entries()]
    .map(([slug, count]) => {
      const c = categories.find((x) => x.slug === slug);
      return { slug, name: c?.name ?? slug, nameTa: c?.nameTa ?? "", count };
    })
    .sort((a, b) => b.count - a.count || a.name.localeCompare(b.name));

  // Covers and collages use lifestyle photographs only: label artwork (file names containing "-pdf") is never shown.
  const photoOf = (p: Product) => p.images.find((im) => !isLabel(im.src))?.src;
  const used = new Set<string>();
  const usedCats = new Set<string>();
  // At most one new studio photo per strip, so the tiles stay varied; the seller's own photos fill the rest.
  const photoFor = (into: string[], p: Product) => {
    const ok = p.images.filter((im) => !isLabel(im.src)).map((im) => im.src);
    const oneNew = into.some((x) => x.startsWith("/img/m/"));
    return ok.find((x) => !(oneNew && x.startsWith("/img/m/")) && !used.has(x));
  };
  const pick = (into: string[], p?: Product) => {
    const src = p && photoFor(into, p);
    if (!p || !src || used.has(src) || into.length >= 4) return;
    used.add(src);
    p.categories.forEach((c) => usedCats.add(c));
    into.push(src);
  };
  const free = (p: Product) => { const src = photoOf(p); return !!src && !used.has(src); };

  // Collage: one photo from each of the store's biggest categories, skipping products that share a category with
  // a tile already chosen so the four tiles look different; then fill up. Never repeat a photo.
  const collage: string[] = [];
  for (const c of cats) {
    if (usedCats.has(c.slug)) continue;
    const inCat = items.filter((p) => p.categories.includes(c.slug) && free(p));
    pick(collage, inCat.find((p) => p.categories.every((x) => !usedCats.has(x))) ?? inCat[0]);
  }
  for (const p of items) pick(collage, p);

  // A second set of four photos for the sellers index card to crossfade to on hover, again without repeats.
  const more: string[] = [];
  usedCats.clear();
  for (const c of cats) {
    if (usedCats.has(c.slug)) continue;
    pick(more, items.find((p) => p.categories.includes(c.slug) && free(p)));
  }
  for (const p of items) pick(more, p);

  // Newest first: the catalogue has no "added on" date, so the product id (assigned in order of creation) stands in.
  const newest = items.slice(0, 8);

  return {
    items,
    cats,
    collage,
    more,
    newest,
    since: monthYear(store.registered),
    phone: phoneParts(store.phone),
    monogram: store.name.trim().charAt(0).toUpperCase(),
    tone,
  };
}
