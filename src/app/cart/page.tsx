import type { Metadata } from "next";
import PageHero from "../../components/PageHero";
import CartView from "../../components/account/CartView";
import { site } from "../../lib/data";

export const metadata: Metadata = {
  title: "Your basket",
  description: "Review the products in your Naadu Nalam basket, grouped by seller, change quantities and go to checkout. Flat ₹50 delivery across Tamil Nadu, cash on delivery.",
  robots: { index: false },
};

export default function CartPage() {
  return (
    <>
      <PageHero title="Your basket" titleTa="உங்கள் கூடை" crumbs={[{ label: "Shop", href: "/shop" }, { label: "Basket" }]}
        intro={`Products from different sellers go through one checkout. ${site.deliveryLine}.`} />
      <CartView />
    </>
  );
}
