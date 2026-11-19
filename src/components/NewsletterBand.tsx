"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import NewsletterForm from "./NewsletterForm";

/** Newsletter row at the top of the footer. Hidden on pages that already carry their own form or a closing call to action. */
const HIDE = ["/newsletter", "/contact", "/checkout", "/cart", "/order-received", "/dashboard", "/vendor-login", "/my-account"];

export default function NewsletterBand() {
  const path = usePathname();
  if (HIDE.some((h) => path === h || path.startsWith(h + "/"))) return null;
  return (
    <div className="border-b border-white/10">
      <div className="wrap grid gap-6 py-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,26rem)] lg:items-center lg:gap-12">
        <div>
          <h2 className="t-h3 text-white">Offers and stories from our farmers</h2>
          <p className="mt-2 text-[0.9375rem] text-white/70">
            New harvests, seasonal offers and recipes, about twice a month.{" "}
            <Link href="/newsletter" className="font-semibold text-sun underline decoration-sun/40 underline-offset-4 hover:decoration-sun">About the newsletter</Link>
          </p>
        </div>
        <div className="lg:justify-self-end lg:w-full"><NewsletterForm dark /></div>
      </div>
    </div>
  );
}
