import Link from "next/link";
import { Reveal } from "./motion";

export default function SectionHeading({ title, intro, href, linkLabel, id }: {
  title: string; intro?: string; href?: string; linkLabel?: string; id?: string;
}) {
  return (
    <Reveal className="mb-6 flex flex-wrap items-end justify-between gap-x-6 gap-y-3 sm:mb-8">
      <div className="max-w-2xl">
        <h2 id={id} className="font-display text-3xl font-bold text-forest-deep sm:text-4xl">{title}</h2>
        {intro && <p className="mt-2 text-ink/75">{intro}</p>}
      </div>
      {href && <Link href={href} className="link font-semibold">{linkLabel ?? "View all"}</Link>}
    </Reveal>
  );
}
