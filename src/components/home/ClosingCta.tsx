import Link from "next/link";
import { Reveal, SplitWords } from "../motion";

export default function ClosingCta() {
  return (
    <section aria-labelledby="closing-title" className="bg-forest text-white">
      <div className="wrap flex flex-col gap-6 py-12 sm:py-14 lg:flex-row lg:items-center lg:justify-between lg:gap-12">
        <Reveal className="max-w-2xl">
          <h2 id="closing-title" className="text-3xl font-bold !text-white sm:text-4xl"><SplitWords inView text="Discover products that feel closer to home." /></h2>
          <p className="mt-3 text-lg text-white/85">Natural, traditional and locally sourced — gathered from independent sellers into one marketplace.</p>
        </Reveal>
        <Reveal delay={0.15} className="flex shrink-0 flex-wrap gap-3">
          <Link href="/shop" className="btn btn-sun">Start shopping</Link>
          <Link href="#categories" className="btn btn-light">Back to categories</Link>
        </Reveal>
      </div>
    </section>
  );
}
