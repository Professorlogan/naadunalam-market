import type { Metadata } from "next";
import PageHero from "../../components/PageHero";
import CheckoutForm from "../../components/account/CheckoutForm";

export const metadata: Metadata = {
  title: "Checkout",
  description: "Enter your contact details and Tamil Nadu delivery address to place your Naadu Nalam order. Payment is Cash on Delivery; nothing is charged online.",
  robots: { index: false },
};

export default function CheckoutPage() {
  return (
    <>
      <PageHero title="Checkout" crumbs={[{ label: "Basket", href: "/cart" }, { label: "Checkout" }]}
        intro="One page: your contact details, where to deliver, and you are done. You pay in cash when the order arrives." />
      <CheckoutForm />
    </>
  );
}
