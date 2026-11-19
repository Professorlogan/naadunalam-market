"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Heart, Home, LayoutGrid, ShoppingCart, User } from "lucide-react";
import { useStore } from "../lib/store";

/** Thumb-reach navigation for phones and tablets, below 1024px. Hidden on checkout so it never covers the order button. */
export default function MobileTabBar() {
  const path = usePathname();
  const { count, wishlist, setDrawerOpen, ready } = useStore();
  if (path.startsWith("/checkout")) return null;
  const on = (h: string) => (h === "/" ? path === "/" : path === h || path.startsWith(h + "/"));
  const item = "relative flex min-h-14 flex-1 flex-col items-center justify-center gap-0.5 text-[11px] font-semibold";
  const tone = (active: boolean) => (active ? "text-forest" : "text-ink/60");
  const badge = (n: number) =>
    ready && n > 0 ? <span className="absolute left-1/2 top-1.5 ml-1.5 grid h-[17px] min-w-[17px] place-items-center rounded-full bg-leaf px-1 text-[10px] font-bold text-white">{n}</span> : null;
  return (
    <>
      <div aria-hidden className="h-[calc(3.5rem+env(safe-area-inset-bottom))] bg-forest-deep lg:hidden" />
      <nav aria-label="Quick links" className="fixed inset-x-0 bottom-0 z-40 border-t border-mist bg-white/95 pb-[env(safe-area-inset-bottom)] backdrop-blur lg:hidden">
        <div className="mx-auto flex max-w-xl">
          <Link href="/" className={`${item} ${tone(on("/"))}`} aria-current={on("/") ? "page" : undefined}><Home size={20} />Home</Link>
          <Link href="/shop" className={`${item} ${tone(on("/shop") || on("/product-category") || on("/product"))}`}><LayoutGrid size={20} />Shop</Link>
          <Link href="/wishlist" className={`${item} ${tone(on("/wishlist"))}`}><Heart size={20} />Wishlist{badge(wishlist.length)}</Link>
          <Link href="/my-account" className={`${item} ${tone(on("/my-account"))}`}><User size={20} />Account</Link>
          <button type="button" onClick={() => setDrawerOpen(true)} className={`${item} ${tone(on("/cart"))}`}><ShoppingCart size={20} />Basket{badge(count)}</button>
        </div>
      </nav>
    </>
  );
}
