import type { Metadata } from "next";
import PageHero from "../../components/PageHero";
import CompareView from "../../components/account/CompareView";

export const metadata: Metadata = {
  title: "Compare products",
  description: "Compare up to four Naadu Nalam products side by side: price, pack size, price per 100 g or 100 ml, category, seller and stock.",
  robots: { index: false },
};

export default function ComparePage() {
  return (
    <>
      <PageHero compact title="Compare products" titleTa="பொருட்களை ஒப்பிடுங்கள்" crumbs={[{ label: "Shop", href: "/shop" }, { label: "Compare" }]}
        intro="Put up to four products next to each other and see which pack is the better buy." />
      <CompareView />
    </>
  );
}
