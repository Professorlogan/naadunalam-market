import Link from "next/link";
import { Reveal } from "../motion";

/** The one seller call-to-action for account pages: a forest card with the same two buttons everywhere. */
export default function SellerCta({ title, text }: { title: string; text: string }) {
  return (
    <section aria-labelledby="seller-cta-title" className="wrap pb-5 pt-8 sm:pb-6 sm:pt-12">
      <Reveal className="flex flex-col gap-6 rounded-xl bg-forest p-6 text-white sm:p-8 md:flex-row md:items-center md:justify-between">
        <div className="max-w-2xl">
          <h2 id="seller-cta-title" className="text-2xl font-bold !text-white sm:text-3xl">{title}</h2>
          <p className="mt-2 text-white/85">{text}</p>
        </div>
        <SellerCtaButtons onDark />
      </Reveal>
    </section>
  );
}

/** Primary "Apply to sell" (sun) and secondary "Seller login" (outlined). Use these labels wherever sellers are invited. */
export function SellerCtaButtons({ onDark = false }: { onDark?: boolean }) {
  return (
    <div className="flex shrink-0 flex-wrap gap-3">
      <Link href="/vendor-login#apply" className="btn btn-sun">Apply to sell</Link>
      <Link href="/vendor-login#login" className={onDark ? "btn border-[1.5px] border-white/70 text-white hover:bg-white hover:text-forest" : "btn btn-ghost"}>Seller login</Link>
    </div>
  );
}
