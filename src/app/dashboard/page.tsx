import type { Metadata } from "next";
import Link from "next/link";
import { Banknote, Boxes, ClipboardList, Tags } from "lucide-react";
import PageHero from "../../components/PageHero";
import SellerCta, { SellerCtaButtons } from "../../components/account/SellerCta";
import { Reveal, SplitWords, Stagger, StaggerItem } from "../../components/motion";
import { site, stores } from "../../lib/data";

export const metadata: Metadata = {
  title: "Seller dashboard",
  description: "The Naadu Nalam seller dashboard is where vendors manage their own products, prices, stock, orders and earnings. Log in as a seller or apply to open a shop.",
  robots: { index: false },
};

const features = [
  { Icon: Tags, title: "Products and pricing", text: "Add your own listings and set your own prices. Each seller manages their own products." },
  { Icon: Boxes, title: "Stock", text: "Keep stock up to date so customers only order what you can pack." },
  { Icon: ClipboardList, title: "Orders", text: "Track the orders that include your products and follow them through to delivery." },
  { Icon: Banknote, title: "Earnings", text: `See what your shop has earned. Orders on the marketplace are ${site.payment} at present.` },
];

export default function DashboardPage() {
  return (
    <>
      <PageHero title="Seller dashboard" titleTa="விற்பனையாளர் பகுதி" crumbs={[{ label: "Sell on Naadu Nalam", href: "/vendor-login" }, { label: "Seller dashboard" }]}
        intro="The dashboard is for sellers and needs a seller login. It is where you run your shop on the marketplace: products, stock, orders and earnings.">
        <SellerCtaButtons />
      </PageHero>

      <section className="wrap py-10 sm:py-14">
        <div className="grid gap-8 lg:grid-cols-[18rem_minmax(0,1fr)] lg:gap-12">
          <div>
            <h2 className="t-h2 font-bold text-forest-deep"><SplitWords text="What sellers do here" inView /></h2>
            <Reveal as="p" y={14} delay={0.15} className="mt-3 text-muted">Naadu Nalam is a multi-vendor marketplace. Every seller has their own storefront and looks after their own shop.</Reveal>
          </div>
          <Stagger as="ul" gap={0.1} className="grid gap-5 sm:grid-cols-2">
            {features.map(({ Icon, title, text }) => (
              <StaggerItem as="li" key={title} className="h-full">
                <div className="flex h-full gap-4 rounded-[1.25rem] border border-mist bg-white p-5 transition-[box-shadow,translate] duration-300 hover:-translate-y-1 hover:shadow-[0_18px_40px_-22px_rgb(23_39_30/0.45)] sm:p-6">
                  <span aria-hidden className={`grid h-12 w-12 shrink-0 place-items-center rounded-full ${["bg-mint", "bg-butter", "bg-aqua", "bg-peach"][features.findIndex((f) => f.title === title)]} text-forest`}><Icon size={22} /></span>
                  <div>
                    <h3 className="t-h4 font-bold text-forest-deep">{title}</h3>
                    <p className="mt-1.5 text-muted">{text}</p>
                  </div>
                </div>
              </StaggerItem>
            ))}
          </Stagger>
        </div>
      </section>

      <section className="wrap">
        <div className="grid gap-8 rounded-[2rem] bg-white border border-mist p-6 sm:p-10 md:grid-cols-2 md:gap-12">
          <div>
            <h2 className="t-h2 font-bold text-forest-deep"><SplitWords text="Shops on the marketplace today" inView /></h2>
            <Reveal as="p" y={14} delay={0.15} className="mt-3 text-muted">Each shop below is run from its own seller dashboard.</Reveal>
            <Stagger as="ul" gap={0.1} delay={0.15} className="mt-5 space-y-2.5">
              {stores.map((s) => (
                <StaggerItem as="li" key={s.slug} y={14}>
                  <Link href={`/store/${s.slug}`} className="group flex min-h-14 items-center justify-between gap-4 rounded-full bg-white px-5 py-3 transition-shadow hover:text-leaf hover:shadow-[0_18px_40px_-22px_rgb(23_39_30/0.45)]">
                    <span className="font-display text-xl font-semibold text-forest-deep transition-transform duration-300 group-hover:translate-x-1.5 group-hover:text-leaf">{s.name}</span>
                    <span className="whitespace-nowrap text-muted">{s.productCount} products</span>
                  </Link>
                </StaggerItem>
              ))}
            </Stagger>
          </div>
          <Reveal x={24} y={0} delay={0.1} className="self-start rounded-[1.5rem] border border-mist bg-white p-5 sm:p-7">
            <h2 className="t-h3 font-bold text-forest-deep">Are you a customer?</h2>
            <p className="mt-3 text-muted">You do not need the seller dashboard. Your orders, wishlist and basket are under My account.</p>
            <div className="mt-5 flex flex-wrap gap-3">
              <Link href="/my-account" className="btn btn-primary">Go to My account</Link>
              <Link href="/my-orders" className="btn btn-ghost">See my orders</Link>
            </div>
          </Reveal>
        </div>
      </section>

      <SellerCta title="Ready to open your shop?" text="Apply for a seller account and claim your own storefront, or log in if you already have one." />
    </>
  );
}
