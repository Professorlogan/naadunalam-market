import type { Metadata } from "next";
import Link from "next/link";
import { LayoutDashboard, Store, Wallet } from "lucide-react";
import PageHero from "../../components/PageHero";
import { Reveal, SplitWords, Stagger, StaggerItem } from "../../components/motion";
import { Pop } from "../../components/community/Motion";
import ShopUrl from "../../components/sellers/ShopUrl";
import { VendorApplyForm, VendorLoginForm } from "../../components/sellers/VendorForms";

export const metadata: Metadata = {
  title: "Sell on Naadu Nalam",
  description: "Open a shop on the Naadu Nalam multi-vendor marketplace. Apply for a vendor account and claim your shop URL, or log in to your vendor dashboard.",
};

const benefits = [
  { icon: Store, title: "Your own storefront", text: <>Your shop gets its own address at <ShopUrl url="naadunalam.fastfilings.in/store/your-shop." /></> },
  { icon: LayoutDashboard, title: "One dashboard", text: "Add products, manage stock and track orders from the vendor dashboard." },
  { icon: Wallet, title: "Cash on Delivery", text: "Orders on the marketplace are Cash on Delivery at present." },
];

const steps = [
  { title: "Apply", text: "Fill in your details and choose your shop name and shop URL." },
  { title: "Set your password", text: "A link to set your password is emailed to you. Open it and choose a password." },
  { title: "List your products", text: "Log in to the vendor dashboard, add your products and keep stock up to date." },
];

export default function VendorLoginPage() {
  return (
    <>
      <PageHero tone="forest" title="Sell on Naadu Nalam" titleTa="நாடு நலத்தில் விற்பனை செய்யுங்கள்" crumbs={[{ label: "Sell on Naadu Nalam" }]}
        intro="Naadu Nalam is a multi-vendor marketplace. If you already have a vendor account, sign in to reach your dashboard. If you don’t, you can apply to open a shop.">
        <a href="#apply" className="btn btn-sun">Apply to sell</a>
        <a href="#login" className="btn btn-light">Vendor login</a>
      </PageHero>

      <section className="wrap py-12 sm:py-16">
        <h2 className="text-3xl font-bold sm:text-4xl"><SplitWords text="What you get as a seller" inView /></h2>
        <Stagger as="ul" gap={0.12} className="mt-6 divide-y divide-mist rounded-3xl border border-mist bg-white md:grid md:grid-cols-3 md:divide-x md:divide-y-0">
          {benefits.map(({ icon: Icon, title, text }, i) => (
            <StaggerItem as="li" key={title} className="group flex gap-4 p-5 sm:p-6 md:flex-col md:gap-3">
              <Pop delay={0.15 + i * 0.12} className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-sky text-forest transition-[background-color,color,rotate] duration-300 group-hover:-rotate-6 group-hover:bg-forest group-hover:text-sun"><Icon size={24} /></Pop>
              <div className="min-w-0">
                <h3 className="text-xl font-semibold">{title}</h3>
                <p className="mt-1 text-muted">{text}</p>
              </div>
            </StaggerItem>
          ))}
        </Stagger>
      </section>

      <section className="border-y border-mist bg-sky">
        <div className="wrap grid gap-8 py-12 sm:py-16 lg:grid-cols-[minmax(0,4fr)_minmax(0,8fr)] lg:gap-12">
          <div>
            <h2 className="text-3xl font-bold sm:text-4xl"><SplitWords text="How it works" inView /></h2>
            <Reveal as="p" delay={0.15} y={16} className="mt-3 text-muted">Three steps from application to your first listing.</Reveal>
          </div>
          <Stagger as="ol" gap={0.12} className="divide-y divide-mist border-y border-mist sm:grid sm:grid-cols-3 sm:divide-x sm:divide-y-0">
            {steps.map((s, i) => (
              <StaggerItem as="li" key={s.title} className="py-5 sm:px-6 sm:first:pl-0 sm:last:pr-0">
                <span aria-hidden className="font-display text-3xl font-bold leading-none tabular-nums text-forest">{i + 1}</span>
                <h3 className="mt-2 text-xl font-semibold"><span className="sr-only">Step {i + 1}: </span>{s.title}</h3>
                <p className="mt-1 text-muted">{s.text}</p>
              </StaggerItem>
            ))}
          </Stagger>
        </div>
      </section>

      <section className="wrap pb-6 pt-12 sm:pb-8 sm:pt-16">
        <div className="grid items-start gap-8 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:gap-10">
          <Reveal id="login" className="card scroll-mt-32 p-5 sm:p-8 lg:sticky lg:top-28">
            <h2 className="text-2xl font-bold sm:text-3xl">Vendor login</h2>
            <p className="mb-6 mt-2 text-muted">Already selling here? Sign in to reach your dashboard.</p>
            <VendorLoginForm />
          </Reveal>
          <Reveal id="apply" delay={0.12} className="card scroll-mt-32 p-5 sm:p-8">
            <h2 className="text-2xl font-bold sm:text-3xl">New here? Apply to sell</h2>
            <p className="mb-6 mt-2 text-muted">
              Fill in your details below to create a vendor account and claim your shop URL. A link to set your password is emailed to you.
            </p>
            <VendorApplyForm />
          </Reveal>
        </div>
        <p className="mt-8 text-muted">
          Want to see how stores look to shoppers first? <Link href="/store-listing" className="link font-semibold">Browse our sellers</Link>.
        </p>
      </section>
    </>
  );
}
