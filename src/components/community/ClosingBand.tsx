import { Reveal, SplitWords } from "../motion";

/**
 * Full-width closing invitation, always on forest green so it never merges with the brown footer.
 * Buttons are passed in so each page says exactly what its links do. `tone` is accepted for older callers and ignored.
 */
export default function ClosingBand({ title, children, actions }: {
  title: string; children: React.ReactNode; actions: React.ReactNode; tone?: "forest" | "soil";
}) {
  return (
    <section className="bg-forest text-white">
      <div className="wrap grid gap-6 py-12 sm:py-16 md:grid-cols-[1.4fr_1fr] md:items-center md:gap-12">
        <div>
          <h2 className="text-3xl font-bold !text-white sm:text-4xl"><SplitWords text={title} inView /></h2>
          <Reveal as="p" delay={0.15} y={16} className="mt-3 max-w-xl text-lg text-white/85">{children}</Reveal>
        </div>
        <Reveal delay={0.25} y={16} className="flex flex-wrap gap-3 md:justify-end">{actions}</Reveal>
      </div>
    </section>
  );
}
