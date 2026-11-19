import Link from "next/link";
import { Clock, Mail, MapPin, MessageCircle, Phone } from "lucide-react";
import { categories, site } from "../lib/data";
import ElementStrip from "./ElementStrip";
import NewsletterBand from "./NewsletterBand";
import { footerNav } from "./nav";

/** One text size (15px) and one rhythm (12px between rows) for every list in the footer. */
const ROW = "flex items-start gap-3 leading-6";
const HEAD = "mb-4 font-display text-lg font-bold leading-6 text-white";

export default function Footer() {
  return (
    <footer className="mt-16 bg-forest-deep text-[0.9375rem] text-white/75">
      <ElementStrip />
      <NewsletterBand />
      <div className="wrap grid gap-12 py-14 lg:grid-cols-[minmax(0,20rem)_minmax(0,1fr)] lg:gap-16">
        <div>
          <Link href="/" className="flex items-center gap-3">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/img/logo.webp" alt="" width={384} height={372} className="h-16 w-16 shrink-0 rounded-full bg-white object-contain p-1" />
            <span className="leading-tight">
              <span className="block font-display text-2xl font-bold text-white">Naadu Nalam</span>
              <span className="block text-sm text-sun">Good food. Healthy people. Sustainable tomorrow.</span>
            </span>
          </Link>
          <ul className="mt-8 space-y-3">
            <li className={ROW}><MapPin size={18} className="mt-[3px] shrink-0 text-sun" /> <span>{site.address}</span></li>
            <li className={ROW}><Phone size={18} className="mt-[3px] shrink-0 text-sun" /> <a href={site.phoneHref} className="hover:text-white">{site.phone}</a></li>
            <li className={ROW}><MessageCircle size={18} className="mt-[3px] shrink-0 text-sun" /> <a href={site.whatsapp} className="hover:text-white">Chat on Telegram</a></li>
            <li className={ROW}><Mail size={18} className="mt-[3px] shrink-0 text-sun" /> <a href={`mailto:${site.email}`} className="hover:text-white">{site.email}</a></li>
            <li className={ROW}><Clock size={18} className="mt-[3px] shrink-0 text-sun" /> <span>{site.hours}</span></li>
          </ul>
        </div>
        <div className="grid grid-cols-2 gap-x-8 gap-y-10 sm:grid-cols-4">
          {Object.entries(footerNav).map(([title, links]) => (
            <nav key={title} aria-label={title}>
              <h2 className={HEAD}>{title}</h2>
              <ul className="space-y-3">{links.map((l) => <li key={l.label} className="leading-6"><Link href={l.href} className="transition-colors hover:text-white">{l.label}</Link></li>)}</ul>
            </nav>
          ))}
          <nav aria-label="Shop by category" className="col-span-2 sm:col-span-4">
            <h2 className={HEAD}>Shop by category</h2>
            <ul className="flex flex-wrap gap-2">{categories.map((c) => <li key={c.slug}><Link href={`/product-category/${c.slug}`} className="inline-block rounded-full border border-white/20 px-3.5 py-1.5 text-sm leading-5 transition-colors hover:border-sun hover:text-sun">{c.name}</Link></li>)}</ul>
          </nav>
        </div>
      </div>
      <div className="border-t border-white/10">
        <div className="wrap flex flex-col gap-2 py-5 text-sm text-white/60 sm:flex-row sm:items-center sm:justify-between">
          <p>© 2026 Naadu Nalam. All rights reserved.</p>
          <p>{site.deliveryLine}. {site.payment}.</p>
        </div>
      </div>
    </footer>
  );
}
