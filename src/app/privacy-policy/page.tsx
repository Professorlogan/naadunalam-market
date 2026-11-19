import type { Metadata } from "next";
import PolicyPage from "../../components/sellers/PolicyPage";

export const metadata: Metadata = {
  title: "Privacy policy",
  description: "How Naadu Nalam collects, uses, stores and protects your information when you browse the marketplace and place an order.",
};

export default function Page() {
  return <PolicyPage slug="privacy-policy" />;
}
