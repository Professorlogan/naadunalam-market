"use client";
import Link from "next/link";
import { GitCompareArrows, Heart, Package, ShoppingBasket } from "lucide-react";
import { useStore } from "../../lib/store";
import { CountUp, Lift, Stagger, StaggerItem } from "../motion";

/** Quick links with live counts from the browser store (counts appear once the store is ready). */
export default function AccountLinks() {
  const { ready, orders, wishlist, compare, count } = useStore();
  const links = [
    { href: "/my-orders", label: "My orders", text: "Orders placed from this browser", n: orders.length, Icon: Package, tint: "bg-aqua" },
    { href: "/wishlist", label: "Wishlist", text: "Products you saved for later", n: wishlist.length, Icon: Heart, tint: "bg-peach" },
    { href: "/compare", label: "Compare", text: "Up to four products side by side", n: compare.length, Icon: GitCompareArrows, tint: "bg-butter" },
    { href: "/cart", label: "Basket", text: "Review items and check out", n: count, Icon: ShoppingBasket, tint: "bg-mint" },
  ];
  return (
    <Stagger as="ul" className="grid grid-cols-2 gap-3 lg:grid-cols-4">
      {links.map(({ href, label, text, n, Icon, tint }) => (
        <StaggerItem as="li" key={href}>
          <Lift className="h-full">
            <Link href={href} className="group flex h-full flex-col rounded-[1.25rem] border border-mist bg-white p-4 transition-[border-color,box-shadow] duration-300 hover:border-leaf/50 hover:shadow-[0_18px_40px_-22px_rgb(23_39_30/0.45)] sm:p-5">
              <span className="flex items-center justify-between gap-2 text-forest">
                <span aria-hidden className={`grid h-12 w-12 place-items-center rounded-full ${tint}`}><Icon size={22} className="transition-transform duration-300 group-hover:-rotate-6 group-hover:scale-110" /></span>
                <span className="min-w-8 rounded-full border border-mist px-2.5 py-0.5 text-center text-sm font-semibold tabular-nums text-forest-deep">
                  {ready ? <CountUp to={n} /> : <span aria-hidden>·</span>}
                </span>
              </span>
              <span className="mt-3 font-display text-xl font-bold text-forest-deep">{label}</span>
              <span className="mt-1 text-[15px] text-muted">{text}</span>
            </Link>
          </Lift>
        </StaggerItem>
      ))}
    </Stagger>
  );
}
