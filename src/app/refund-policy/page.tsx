import type { Metadata } from "next";
import PolicyPage from "../../components/sellers/PolicyPage";

export const metadata: Metadata = {
  title: "Return and refund policy",
  description: "When returns, replacements and refunds are available on Naadu Nalam orders, what is non-returnable, and how to report a damaged or incorrect item.",
};

export default function Page() {
  return <PolicyPage slug="refund-policy" />;
}
