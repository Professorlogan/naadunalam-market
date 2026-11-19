import type { Metadata } from "next";
import PolicyPage from "../../components/sellers/PolicyPage";

export const metadata: Metadata = {
  title: "Terms of service",
  description: "The terms that govern use of the Naadu Nalam website and purchases made through it: accounts, pricing, orders, payments, delivery and returns.",
};

export default function Page() {
  return <PolicyPage slug="terms" />;
}
