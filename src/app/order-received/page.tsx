import type { Metadata } from "next";
import { Suspense } from "react";
import PageHero from "../../components/PageHero";
import OrderReceived from "../../components/account/OrderReceived";
import { Skeleton } from "../../components/account/shared";

export const metadata: Metadata = {
  title: "Order received",
  description: "Your Naadu Nalam order confirmation: order number, items, total to pay on delivery, delivery address and what happens next.",
  robots: { index: false },
};

export default function OrderReceivedPage() {
  return (
    <>
      <PageHero compact title="Order received" titleTa="ஆர்டர் பெறப்பட்டது" intro="Thank you. Your seller will call you to confirm before delivery." crumbs={[{ label: "Checkout", href: "/checkout" }, { label: "Order received" }]} />
      <Suspense fallback={<Skeleton rows={2} label="Loading your order" />}>
        <OrderReceived />
      </Suspense>
    </>
  );
}
