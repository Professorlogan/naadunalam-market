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
  { icon: Wallet, title: "Cash on delivery", text: "Orders on the marketplace are Cash on delivery at present." },
];

const steps = [
  { title: "Apply", text: "Fill in your details and choose your shop name and shop URL." },
  { title: "Set your password", text: "A link to set your password is emailed to you. Open it and choose a password." },
  { title: "List your products", text: "Log in to the vendor dashboard, add your products and keep stock up to date." },
];

export default function VendorLoginPage() {
  return (
    <>
      <PageHero title="Sell on Naadu Nalam" titleTa="நாடு நலத்தில் விற்பனை செய்யுங்கள்" crumbs={[{ label: "Sell on Naadu Nalam" }]}
        intro="Naadu Nalam is a multi-vendor marketplace. If you already have a vendor account, sign in to reach your dashboard. If you don’t, you can apply to open a shop.">
        <a href="#apply" className="btn btn-primary">Apply to sell</a>
        <a href="#login" className="btn btn-ghost">Seller login</a>
      </PageHero>

      <section className="wrap py-12 sm:py-16">
        <h2 className="t-h2 font-bold text-forest-deep"><SplitWords text="What you get as a seller" inView /></h2>
        <Stagger as="ul" gap={0.12} className="mt-6 grid gap-4 md:grid-cols-3 md:gap-5">
          {benefits.map(({ icon: Icon, title, text }, i) => (
            <StaggerItem as="li" key={title} className="group flex gap-4 rounded-[1.25rem] border border-mist bg-white p-5 transition-[box-shadow,translate] duration-300 hover:-translate-y-1 hover:shadow-[0_18px_40px_-22px_rgb(23_39_30/0.45)] sm:p-6 md:flex-col md:gap-3">
              <Pop delay={0.15 + i * 0.12} className={`grid h-12 w-12 shrink-0 place-items-center rounded-full ${["bg-mint", "bg-butter", "bg-peach"][i]} text-forest transition-[background-color,color,rotate] duration-300 group-hover:-rotate-6 group-hover:bg-leaf group-hover:text-white`}><Icon size={22} /></Pop>
              <div className="min-w-0">
                <h3 className="t-h4 font-bold text-forest-deep">{title}</h3>
                <p className="mt-1 text-muted">{text}</p>
              </div>
            </StaggerItem>
          ))}
        </Stagger>
      </section>

      <section className="wrap">
        <div className="grid gap-8 rounded-[2rem] bg-white border border-mist p-6 sm:p-10 lg:grid-cols-[minmax(0,4fr)_minmax(0,8fr)] lg:gap-12">
          <div>
            <h2 className="t-h2 font-bold text-forest-deep"><SplitWords text="How it works" inView /></h2>
            <Reveal as="p" delay={0.15} y={16} className="mt-3 text-muted">Three steps from application to your first listing.</Reveal>
          </div>
          <Stagger as="ol" gap={0.12} className="grid gap-3 sm:grid-cols-3 sm:gap-4">
            {steps.map((s, i) => (
              <StaggerItem as="li" key={s.title} className="rounded-[1.25rem] bg-white p-5">
                <span aria-hidden className="grid h-11 w-11 place-items-center rounded-full bg-leaf font-display text-2xl font-bold leading-none tabular-nums text-white">{i + 1}</span>
                <h3 className="t-h4 mt-3 font-bold text-forest-deep"><span className="sr-only">Step {i + 1}: </span>{s.title}</h3>
                <p className="mt-1 text-muted">{s.text}</p>
              </StaggerItem>
            ))}
          </Stagger>
        </div>
      </section>

      <section className="wrap pb-6 pt-12 sm:pb-8 sm:pt-16">
        <div className="grid items-start gap-8 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:gap-10">
          <Reveal id="login" className="scroll-mt-32 rounded-[1.75rem] bg-white border border-mist p-3 sm:p-4 lg:sticky lg:top-28">
            <div className="rounded-[1.5rem] border border-mist bg-white p-5 sm:p-7">
            <h2 className="t-h3 font-bold text-forest-deep">Seller login</h2>
            <p className="mb-6 mt-2 text-muted">Already selling here? Sign in to reach your dashboard.</p>
            <VendorLoginForm />
            </div>
          </Reveal>
          <Reveal id="apply" delay={0.12} className="scroll-mt-32 rounded-[1.75rem] border border-mist bg-white p-5 sm:p-8">
            <h2 className="t-h3 font-bold text-forest-deep">New here? Apply to sell</h2>
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
