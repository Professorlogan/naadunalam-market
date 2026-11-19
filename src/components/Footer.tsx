import Link from "next/link";
import { Clock, Mail, MapPin, MessageCircle, Phone } from "lucide-react";
import { categories, site } from "../lib/data";
import ElementStrip from "./ElementStrip";
import { Reveal, Stagger, StaggerItem } from "./motion";
import NewsletterForm from "./NewsletterForm";
import { footerNav } from "./nav";

export default function Footer() {
  return (
    <footer className="pt-2">
      {/* Pastel newsletter block inside the page container, overlapping the top of the dark footer. */}
      <div className="wrap relative z-10">
        <Reveal className="grid gap-5 rounded-[2rem] bg-butter px-6 py-8 sm:px-10 sm:py-10 md:grid-cols-[minmax(0,1fr)_minmax(0,28rem)] md:items-center md:gap-10">
          <div>
            <h2 className="text-2xl font-bold text-forest-deep sm:text-3xl">Offers and stories from our farmers</h2>
            <p className="mt-2 text-ink/75">Join the Naadu Nalam list. <Link href="/newsletter" className="font-semibold text-forest underline decoration-forest/40 underline-offset-4 hover:decoration-forest">About the newsletter</Link></p>
          </div>
          {/* The dark variant keeps the footer form's own field id; the colours are set here for the light block. */}
          <div className="[&_.btn]:!bg-forest [&_.btn]:!text-white [&_.btn:hover]:!bg-leaf [&_[role=status]]:!text-forest [&_input]:bg-white"><NewsletterForm dark /></div>
        </Reveal>
      </div>
      <div className="-mt-16 bg-forest-deep text-white/85">
      <ElementStrip />
      <div className="wrap grid gap-10 pb-12 pt-24 lg:grid-cols-[1fr_2.4fr]">
        <Reveal>
          <div className="flex items-center gap-3">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/img/logo.webp" alt="" width={384} height={372} className="h-20 w-auto rounded-full bg-white p-1.5" />
            <p className="leading-tight"><span className="block font-display text-2xl font-bold text-white">Naadu Nalam</span><span className="text-sun">Good food. Healthy people. Sustainable tomorrow.</span></p>
          </div>
          <ul className="mt-6 space-y-2.5">
            <li className="flex gap-3"><MapPin size={19} className="mt-1 shrink-0 text-sun" /> {site.address}</li>
            <li className="flex gap-3"><Phone size={19} className="mt-1 shrink-0 text-sun" /> <a href={site.phoneHref} className="hover:text-white hover:underline">{site.phone}</a></li>
            <li className="flex gap-3"><MessageCircle size={19} className="mt-1 shrink-0 text-sun" /> <a href={site.whatsapp} className="hover:text-white hover:underline">Chat on Telegram</a></li>
            <li className="flex gap-3"><Mail size={19} className="mt-1 shrink-0 text-sun" /> <a href={`mailto:${site.email}`} className="hover:text-white hover:underline">{site.email}</a></li>
            <li className="flex gap-3"><Clock size={19} className="mt-1 shrink-0 text-sun" /> {site.hours}</li>
          </ul>
        </Reveal>
        <Stagger className="grid grid-cols-2 gap-8 sm:grid-cols-4">
          {Object.entries(footerNav).map(([title, links]) => (
            <StaggerItem key={title}><nav aria-label={title}>
              <h2 className="mb-3 text-lg font-semibold !text-white">{title}</h2>
              <ul className="space-y-2">{links.map((l) => <li key={l.label}><Link href={l.href} className="inline-block py-0.5 transition-transform duration-200 hover:translate-x-1 hover:text-white">{l.label}</Link></li>)}</ul>
            </nav></StaggerItem>
          ))}
          <nav aria-label="Categories" className="col-span-2 sm:col-span-4">
            <h2 className="mb-3 text-lg font-semibold !text-white">Shop by category</h2>
            <ul className="flex flex-wrap gap-2">{categories.map((c) => <li key={c.slug}><Link href={`/product-category/${c.slug}`} className="inline-block rounded-full border border-white/25 px-3.5 py-1.5 text-sm hover:border-sun hover:text-sun">{c.name}</Link></li>)}</ul>
          </nav>
        </Stagger>
      </div>
      <div className="border-t border-white/15">
        <div className="wrap flex flex-wrap items-center justify-between gap-3 py-5 text-sm">
          <p>© 2026 Naadu Nalam. All rights reserved.</p>
          <p>{site.deliveryLine}. {site.payment}.</p>
        </div>
      </div>
      </div>
    </footer>
  );
}
