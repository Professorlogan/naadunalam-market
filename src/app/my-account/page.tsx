import type { Metadata } from "next";
import PageHero from "../../components/PageHero";
import AccountForms from "../../components/account/AccountForms";
import AccountLinks from "../../components/account/AccountLinks";
import SellerCta from "../../components/account/SellerCta";
import { SplitWords } from "../../components/motion";

export const metadata: Metadata = {
  title: "My account",
  description: "Sign in or register as a Naadu Nalam customer, and reach your orders, wishlist, comparison and basket. Sellers log in separately.",
  robots: { index: false },
};

export default function MyAccountPage() {
  return (
    <>
      <PageHero title="My account" titleTa="என் கணக்கு" crumbs={[{ label: "My account" }]}
        intro="Sign in or register as a customer. You do not need an account to shop: your basket, wishlist and orders are kept in this browser." />

      <section className="wrap py-8 sm:py-12">
        <h2 className="mb-4 text-2xl font-bold text-forest-deep sm:text-3xl"><SplitWords text="Your shopping" inView /></h2>
        <AccountLinks />
      </section>

      <section className="wrap pb-2">
        <div className="rounded-[2rem] bg-aqua p-4 sm:p-8 lg:p-10">
          <AccountForms />
        </div>
      </section>

      <SellerCta title="Want to sell on Naadu Nalam?"
        text="Seller accounts are separate from customer accounts. Naadu Nalam is a multi-vendor marketplace: sellers get their own storefront and manage products, stock and orders from the seller dashboard." />
    </>
  );
}
