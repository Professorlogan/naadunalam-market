const items = [
  ["Flat ₹50 delivery", "Anywhere in Tamil Nadu"],
  ["Cash on Delivery", "Pay when your order arrives"],
  ["Named sellers", "Every product shows who sells it"],
  ["Price and pack size", "Shown on every listing"],
];

/** The only trust statement on the page: four facts, set as text. */
export default function Promise() {
  return (
    <section aria-label="How Naadu Nalam works" className="border-t border-mist">
      <dl className="wrap grid grid-cols-2 gap-x-6 gap-y-8 pb-6 pt-12 sm:pt-16 lg:grid-cols-4">
        {items.map(([t, d]) => (
          <div key={t} className="lg:border-l lg:border-mist lg:pl-6 lg:first:border-l-0 lg:first:pl-0">
            <dt className="font-display text-xl font-semibold text-forest-deep">{t}</dt>
            <dd className="mt-1 text-base text-muted">{d}</dd>
          </div>
        ))}
      </dl>
    </section>
  );
}
