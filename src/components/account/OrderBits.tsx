import Link from "next/link";
import { getProductById, getStore } from "../../lib/data";
import { inr } from "../../lib/format";
import type { Order } from "../../lib/store";
import { Totals } from "./shared";

/** Items, totals and delivery address of one saved order. Shared by the confirmation and "My orders". */
export function OrderItems({ order }: { order: Order }) {
  return (
    <ul className="divide-y divide-mist">
      {order.lines.map((l) => {
        const p = getProductById(l.id);
        const seller = p ? getStore(p.vendor) : undefined;
        return (
          <li key={`${l.id}-${l.variantId ?? 0}`} className="flex gap-3 py-3">
            {p?.images[0] && (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={p.images[0].src} alt="" width={56} height={56} loading="lazy" className="h-14 w-14 shrink-0 rounded-lg bg-sky object-cover" />
            )}
            <div className="min-w-0 flex-1 leading-snug">
              <p className="font-semibold">
                {p ? <Link href={`/product/${p.slug}`} className="-my-2.5 inline-block py-2.5 text-forest-deep underline decoration-mist decoration-2 underline-offset-4 hover:text-leaf hover:decoration-leaf">{l.name}</Link> : l.name}
              </p>
              {p?.nameTa && <p lang="ta" className="ta text-sm text-leaf">{p.nameTa}</p>}
              <p className="text-sm text-muted">{l.pack} × {l.qty} at {inr(l.price)}{seller ? ` · Sold by ${seller.name}` : ""}</p>
            </div>
            <p className="whitespace-nowrap font-semibold tabular-nums">{inr(l.price * l.qty)}</p>
          </li>
        );
      })}
    </ul>
  );
}

export function OrderAddress({ order }: { order: Order }) {
  const c = order.customer;
  return (
    <address className="not-italic leading-relaxed">
      <span className="font-semibold">{c.name}</span><br />
      <span className="whitespace-pre-line">{c.address}</span><br />
      {c.city} {c.pincode}, Tamil Nadu<br />
      Mobile {c.phone}
      {c.email && <><br />{c.email}</>}
    </address>
  );
}

export function OrderDetail({ order }: { order: Order }) {
  return (
    <div className="grid gap-6 md:grid-cols-[minmax(0,1fr)_18rem]">
      <div>
        <h3 className="text-xl font-bold">Items</h3>
        <div className="mt-1"><OrderItems order={order} /></div>
        <div className="mt-3 border-t border-mist pt-4"><Totals subtotal={order.subtotal} delivery={order.delivery} total={order.total} /></div>
      </div>
      <div className="space-y-5">
        <div>
          <h3 className="text-xl font-bold">Deliver to</h3>
          <div className="mt-2"><OrderAddress order={order} /></div>
        </div>
        {order.customer.notes && (
          <div>
            <h3 className="text-xl font-bold">Your note</h3>
            <p className="mt-2 whitespace-pre-line text-muted">{order.customer.notes}</p>
          </div>
        )}
        <div>
          <h3 className="text-xl font-bold">Payment</h3>
          <p className="mt-2">Cash on Delivery: {inr(order.total)} due when the order arrives.</p>
        </div>
      </div>
    </div>
  );
}
