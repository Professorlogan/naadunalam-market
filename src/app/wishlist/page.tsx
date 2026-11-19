import type { Metadata } from "next";
import PageHero from "../../components/PageHero";
import WishlistView from "../../components/account/WishlistView";

export const metadata: Metadata = {
  title: "My wishlist",
  description: "Your favourite traditional products from Naadu Nalam sellers, saved in one place. Add them to your basket one at a time or all together.",
  robots: { index: false },
};

export default function WishlistPage() {
  return (
    <>
      <PageHero compact title="My wishlist" titleTa="என் விருப்பப் பட்டியல்" crumbs={[{ label: "Wishlist" }]}
        intro="Your favourite traditional products, all in one place." />
      <WishlistView />
    </>
  );
}
