import Link from "next/link";
import { getStore } from "../../lib/data";
import { lineInfo, type CartLine } from "../../lib/store";
import { Reveal } from "../motion";
import { EmptyArt, Ticker } from "./fx";

export type ResolvedLine = { line: CartLine; info: NonNullable<ReturnType<typeof lineInfo>> };

/** Basket lines grouped by the seller who ships them. One basket, one checkout. */
export function groupBySeller(cart: CartLine[]) {
  const groups: { slug: string; name: string; lines: ResolvedLine[] }[] = [];
  for (const line of cart) {
    const info = lineInfo(line);
    if (!info) continue;
    const slug = info.product.vendor;
    let group = groups.find((g) => g.slug === slug);
    if (!group) {
      group = { slug, name: getStore(slug)?.name ?? "Naadu Nalam", lines: [] };
      groups.push(group);
    }
    group.lines.push({ line, info });
  }
  return groups;
}

/** Price per 100 g or 100 ml, worked out from a pack label such as "500 g", "1 kg" or "500 ml". */
export function per100(price: number, pack: string) {
  const m = /^([\d.]+)\s*(kg|g|ml|l)$/i.exec(pack.trim());
  if (!m) return null;
  const n = parseFloat(m[1]);
  if (!n) return null;
  const unit = m[2].toLowerCase();
  const base = unit === "kg" || unit === "l" ? n * 1000 : n;
  const per = unit === "g" || unit === "kg" ? "100 g" : "100 ml";
  return { value: Math.round((price / base) * 100 * 100) / 100, per };
}

export const lineKey = (l: CartLine) => `${l.id}-${l.variantId ?? 0}`;

export const orderDate = (iso: string) =>
  new Date(iso).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" });

/** Light placeholder shown until the saved basket has been read from the browser. */
export function Skeleton({ rows = 3, label = "Loading your saved items" }: { rows?: number; label?: string }) {
  return (
    <div role="status" aria-busy="true" className="wrap py-10 sm:py-14">
      <span className="sr-only">{label}</span>
      <div aria-hidden className="space-y-4">
        {Array.from({ length: rows }, (_, i) => (
          <div key={i} className="card flex animate-pulse items-center gap-4 p-4">
            <div className="h-20 w-20 shrink-0 rounded-xl bg-mist" />
            <div className="flex-1 space-y-3">
              <div className="h-4 w-2/3 rounded bg-mist" />
              <div className="h-4 w-1/3 rounded bg-mist" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/** Every empty state on the account pages: a plain white card, centred, at most 640px wide. */
export const emptyCard = "card mx-auto max-w-[640px] p-6 sm:p-8";
/** Heading of the totals column on the basket and checkout pages. */
export const summaryTitle = "mb-4 text-2xl font-bold";
/** Text buttons in the toolbars above the basket, wishlist and comparison. */
export const toolLink = "link min-h-11 px-1 text-[15px] font-semibold";

export function EmptyState({ title, text, children }: { title: string; text: string; children: React.ReactNode }) {
  return (
    <section className="wrap pb-6 pt-10 sm:pb-8 sm:pt-14">
      <Reveal className={emptyCard}>
        <h2 className="text-2xl font-bold sm:text-3xl">{title}</h2>
        <p className="mt-3 text-muted">{text}</p>
        <div className="mt-6 flex flex-wrap gap-3">{children}</div>
      </Reveal>
    </section>
  );
}

export function Totals({ subtotal, delivery, total }: { subtotal: number; delivery: number; total: number }) {
  return (
    <dl className="space-y-2">
      <div className="flex justify-between gap-4"><dt>Subtotal</dt><dd className="whitespace-nowrap tabular-nums"><Ticker value={subtotal} /></dd></div>
      <div className="flex justify-between gap-4"><dt>Delivery (flat rate)</dt><dd className="whitespace-nowrap tabular-nums"><Ticker value={delivery} /></dd></div>
      <div className="flex justify-between gap-4 border-t border-mist pt-3 font-display text-2xl font-bold text-forest-deep">
        <dt>Total</dt><dd className="whitespace-nowrap tabular-nums"><Ticker value={total} /></dd>
      </div>
    </dl>
  );
}

export function PrototypeNote({ children }: { children: React.ReactNode }) {
  return (
    <p role="note" className="rounded-xl border border-sun bg-sun/15 px-4 py-3 text-base text-ink">
      <strong className="font-semibold">Prototype. </strong>{children}
    </p>
  );
}

export function SellerLink({ slug, name }: { slug: string; name: string }) {
  return <Link href={`/store/${slug}`} className="-my-2.5 inline-block py-2.5 font-semibold text-forest hover:underline">{name}</Link>;
}
