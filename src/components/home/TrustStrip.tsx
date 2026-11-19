import { ReceiptIndianRupee, Sprout, Store, Truck } from "lucide-react";
import { site } from "../../lib/data";
import { Stagger, StaggerItem } from "../motion";

const items = [
  { icon: Truck, title: `Flat ₹${site.deliveryFee} delivery`, note: "Across Tamil Nadu, cash on delivery" },
  { icon: Sprout, title: "Sourced close to home", note: "From trusted local farmers" },
  { icon: Store, title: "Every seller has a storefront", note: "Verified and transparent" },
  { icon: ReceiptIndianRupee, title: "Clear, upfront pricing", note: "No hidden costs" },
];

export default function TrustStrip() {
  return (
    <section aria-label="Why shop here" className="border-b border-mist bg-white">
      <Stagger as="ul" gap={0.1} className="wrap grid grid-cols-2 gap-x-4 gap-y-4 py-5 sm:py-6 lg:grid-cols-4 lg:gap-x-8 lg:py-7">
        {items.map(({ icon: Icon, title, note }) => (
          <StaggerItem as="li" key={title} className="group flex items-center gap-3 sm:items-start">
            <span aria-hidden className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-sky text-forest transition-[background-color,color,scale] duration-300 group-hover:scale-110 group-hover:bg-forest group-hover:text-sun sm:h-11 sm:w-11">
              <Icon size={20} />
            </span>
            <p className="min-w-0 leading-snug">
              <span className="block font-semibold text-forest-deep">{title}</span>
              <span className="hidden text-sm text-muted sm:block">{note}</span>
            </p>
          </StaggerItem>
        ))}
      </Stagger>
    </section>
  );
}
