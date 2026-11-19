import type { Metadata } from "next";
import PolicyPage from "../../components/sellers/PolicyPage";

export const metadata: Metadata = {
  title: "Shipping policy",
  description: "How Naadu Nalam orders are processed, packed and delivered: timelines, delivery charges, delays and what to do about a damaged order.",
};

export default function Page() {
  return <PolicyPage slug="shipping-policy" />;
}
