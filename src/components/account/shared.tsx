import Link from "next/link";
import { ShoppingBasket, type LucideIcon } from "lucide-react";
import { getStore } from "../../lib/data";
import { lineInfo, type CartLine } from "../../lib/store";
import { Reveal } from "../motion";
import { Ticker } from "./fx";

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

/** Every empty state on the account pages: a white rounded card, centred, at most 640px wide. */
export const emptyCard = "mx-auto flex max-w-[640px] flex-col items-center rounded-[1.75rem] border border-mist bg-white p-7 text-center sm:p-10";
/** Heading of the totals column on the basket and checkout pages. */
export const summaryTitle = "mb-4 text-2xl font-bold text-forest-deep";
/** White rounded card used for line items, form sections and lists. */
export const marketCard = "rounded-[1.25rem] border border-mist bg-white";
/** Pastel side panel (summaries, info panels). Add a tint: bg-mint, bg-butter, bg-aqua… */
export const pastelPanel = "rounded-[1.5rem] p-5 sm:p-7";
/** Small round icon button (remove, close). */
export const roundIconBtn = "grid h-11 min-h-11 w-11 min-w-11 shrink-0 place-items-center rounded-full border border-mist bg-white text-muted transition-colors duration-150 hover:border-soil/40 hover:bg-peach hover:text-soil";
/** Wrapper that tints the shared quantity stepper leaf/forest. */
export const stepperTint = "inline-flex [&>div]:border-leaf/35 [&>div]:bg-mint/60 [&_button]:text-forest [&_button:hover]:bg-leaf [&_button:hover]:text-white";

/** Large pastel disc holding an icon, the head of every empty and success state. */
export function IconDisc({ icon: Icon = ShoppingBasket, tint = "bg-mint", className = "" }: { icon?: LucideIcon; tint?: string; className?: string }) {
  return (
    <span aria-hidden className={`grid h-24 w-24 place-items-center rounded-full ${tint} text-forest ${className}`}>
      <Icon size={40} strokeWidth={1.75} />
    </span>
  );
}
/** Text buttons in the toolbars above the basket, wishlist and comparison. */
export const toolLink = "link min-h-11 px-1 text-[15px] font-semibold";

export function EmptyState({ title, text, children, icon, tint }: { title: string; text: string; children: React.ReactNode; icon?: LucideIcon; tint?: string }) {
  return (
    <section className="wrap pb-6 pt-10 sm:pb-8 sm:pt-14">
      <Reveal className={emptyCard}>
        <IconDisc icon={icon} tint={tint} className="mb-6" />
        <h2 className="text-2xl font-bold text-forest-deep sm:text-3xl">{title}</h2>
        <p className="mt-3 max-w-[46ch] text-muted">{text}</p>
        <div className="mt-7 flex flex-wrap justify-center gap-3">{children}</div>
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
    <p role="note" className="rounded-[1.25rem] bg-butter px-5 py-3.5 text-base text-ink">
      <strong className="font-semibold">Prototype. </strong>{children}
    </p>
  );
}

export function SellerLink({ slug, name }: { slug: string; name: string }) {
  return <Link href={`/store/${slug}`} className="-my-2.5 inline-block py-2.5 font-semibold text-forest hover:underline">{name}</Link>;
}
