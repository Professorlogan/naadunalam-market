import type { Metadata } from "next";
import "@fontsource-variable/noto-sans-tamil";
import "@fontsource-variable/catamaran";
import "./globals.css";
import CartDrawer from "../components/CartDrawer";
import Footer from "../components/Footer";
import Header from "../components/Header";
import { MotionProvider, ScrollProgress } from "../components/motion";
import { StoreProvider } from "../lib/store";

export const metadata: Metadata = {
  metadataBase: new URL("https://naadunalam.fastfilings.in"),
  title: { default: "Naadu Nalam – Traditional Food Marketplace | Direct from Tamil Nadu's Sellers", template: "%s | Naadu Nalam" },
  description: "Traditional rice, millets, pulses, cold-pressed oils, natural sweeteners and podis from independent Tamil Nadu sellers. Flat ₹50 delivery, cash on delivery.",
  icons: { icon: "/img/logo.webp" },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <MotionProvider>
        <StoreProvider>
          <ScrollProgress />
          <Header />
          <main id="content">{children}</main>
          <Footer />
          <CartDrawer />
        </StoreProvider>
        </MotionProvider>
      </body>
    </html>
  );
}
