import type { Metadata } from "next";
import Link from "next/link";
import { stores } from "../lib/data";
import BlogStrip from "../components/market/BlogStrip";
import CategoryRow from "../components/market/CategoryRow";
import FeatureBand from "../components/market/FeatureBand";
import HeroSlider from "../components/market/HeroSlider";
import PopularProducts from "../components/market/PopularProducts";
import PromoTiles from "../components/market/PromoTiles";
import TrustRow from "../components/market/TrustRow";

export const metadata: Metadata = {
  description:
    "Naadu Nalam is a Tamil Nadu marketplace where independent growers and small producers sell native rice, millets, pulses, wood-pressed oils, masala powders and natural sweeteners. Flat ₹50 delivery across Tamil Nadu, cash on delivery.",
};

export default function Home() {
  return (
    <>
      <HeroSlider />
      <PromoTiles />
      <CategoryRow />
      <FeatureBand
        img="/img/m/farmer-rice.webp" alt="A Tamil woman farmer in a paddy field holding a winnowing basket of golden paddy"
        eyebrow="Many sellers. One basket." title="Bought straight from the people who grow it"
        text="Naadu Nalam is a marketplace, not a single shop. Each grower and small producer runs their own store, and you check out once."
        cta="Meet our sellers" href="/store-listing" second={{ label: "Sell on Naadu Nalam", href: "/vendor-login" }}>
        <ul className="mt-6 grid max-w-lg gap-3 sm:grid-cols-2">
          {stores.map((s) => (
            <li key={s.slug}>
              <Link href={`/store/${s.slug}`} className="block rounded-2xl bg-white/80 px-4 py-3 transition-colors hover:bg-white">
                <span className="block font-display text-lg font-bold text-forest-deep">{s.name}</span>
                <span className="text-sm text-muted">{s.productCount} products</span>
              </Link>
            </li>
          ))}
        </ul>
      </FeatureBand>
      <PopularProducts />
      <FeatureBand reverse tint="from-butter to-peach"
        img="/img/m/p-gingelly-oil.webp" alt="A bottle of gingelly oil with a brass bowl and sesame seeds"
        eyebrow="From the wooden chekku" title="Oils pressed slowly, nothing taken out"
        text="Gingelly, groundnut and coconut oil pressed cold in wooden mills by small producers, so the taste and aroma stay in the bottle."
        cta="Shop ghee and oils" href="/product-category/oil-vinegers" />
      <TrustRow />
      <BlogStrip />
    </>
  );
}
