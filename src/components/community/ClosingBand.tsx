import { Reveal, SplitWords } from "../motion";

/**
 * Closing invitation as a soft pastel rounded block inside the page container (Market Colours style).
 * Buttons are passed in so each page says exactly what its links do. `tone` picks the tint: forest = mint, soil = peach.
 */
export default function ClosingBand({ title, children, actions, tone = "forest" }: {
  title: string; children: React.ReactNode; actions: React.ReactNode; tone?: "forest" | "soil";
}) {
  return (
    <section className="wrap py-12 sm:py-16">
      <div className={`grid gap-6 rounded-[2rem] px-6 py-10 sm:px-10 sm:py-12 md:grid-cols-[1.4fr_1fr] md:items-center md:gap-12 ${tone === "soil" ? "bg-peach" : "bg-mint"}`}>
        <div>
          <h2 className="t-h2 font-bold text-forest-deep"><SplitWords text={title} inView /></h2>
          <Reveal as="p" delay={0.15} y={16} className="mt-3 max-w-xl text-lg text-ink/75">{children}</Reveal>
        </div>
        <Reveal delay={0.25} y={16} className="flex flex-wrap gap-3 md:justify-end">{actions}</Reveal>
      </div>
    </section>
  );
}
