import type { Metadata } from "next";
import PageHero from "../../components/PageHero";
import MyOrders from "../../components/account/MyOrders";

export const metadata: Metadata = {
  title: "My orders",
  description: "See the orders you have placed on Naadu Nalam, newest first, with items, totals, delivery address and Cash on Delivery amount.",
  robots: { index: false },
};

export default function MyOrdersPage() {
  return (
    <>
      <PageHero title="My orders" titleTa="என் ஆர்டர்கள்" crumbs={[{ label: "My account", href: "/my-account" }, { label: "My orders" }]}
        intro="Every order you have placed, with what was in it and where it is going." />
      <MyOrders />
    </>
  );
}
