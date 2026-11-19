import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { Reveal } from "../motion";

/** A full-width pastel band with a big photo on one side, like a magazine spread. */
export default function FeatureBand({ img, alt, eyebrow, title, text, cta, href, second, reverse = false, tint = "from-mint to-butter", children }: {
  img: string; alt: string; eyebrow: string; title: string; text: string; cta: string; href: string;
  second?: { label: string; href: string }; reverse?: boolean; tint?: string; children?: React.ReactNode;
}) {
  return (
    <section className={`mt-14 bg-gradient-to-b ${tint} py-10 sm:mt-20 sm:py-14`}>
      <div className={`wrap grid items-center gap-8 md:grid-cols-2 lg:gap-16`}>
        <Reveal y={24} className={reverse ? "md:order-2" : ""}>
          <div className="aspect-[4/5] overflow-hidden rounded-[1.75rem] sm:aspect-[5/5] md:aspect-[4/5]">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={img} alt={alt} width={1000} height={1250} loading="lazy" className="h-full w-full object-cover" />
          </div>
        </Reveal>
        <Reveal y={24} delay={0.1}>
          <p className="text-sm font-bold uppercase tracking-[0.14em] text-leaf">{eyebrow}</p>
          <h2 className="mt-3 text-3xl leading-tight sm:text-[2.75rem]">{title}</h2>
          <p className="mt-4 max-w-lg text-lg text-ink/75">{text}</p>
          {children}
          <div className="mt-7 flex flex-wrap gap-3">
            <Link href={href} className="btn btn-primary">{cta} <ChevronRight size={18} /></Link>
            {second && <Link href={second.href} className="btn btn-ghost">{second.label}</Link>}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
