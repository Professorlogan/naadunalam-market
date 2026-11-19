import Breadcrumbs from "./Breadcrumbs";
import { Reveal, SplitWords } from "./motion";

/** Standard page opening, Market Colours style: a soft pastel rounded banner with the page's only H1. */
export default function PageHero({ title, titleTa, intro, crumbs, children, tone = "sky", compact = false }: {
  title: string; titleTa?: string; intro?: string; crumbs?: { label: string; href?: string }[];
  children?: React.ReactNode; tone?: "sky" | "forest"; compact?: boolean;
}) {
  const dark = tone === "forest";
  return (
    <header className="wrap pt-4 sm:pt-6">
      <div className={`relative overflow-hidden rounded-[2rem] px-6 sm:px-10 ${compact ? "py-6 sm:py-7" : "py-9 sm:py-12"} ${dark ? "bg-forest text-white" : "bg-gradient-to-br from-mint via-mint to-butter"}`}>
        <Reveal y={10} className={`relative ${dark ? "[&_*]:!text-white/80" : ""}`}><Breadcrumbs items={crumbs ?? [{ label: title }]} /></Reveal>
        <h1 className={`relative mt-4 max-w-3xl text-4xl sm:text-5xl ${dark ? "!text-white" : ""}`}><SplitWords text={title} delay={0.05} /></h1>
        {titleTa && <Reveal as="p" delay={0.25} y={14} className={`ta relative mt-3 font-display text-xl font-semibold ${dark ? "text-sun" : "text-leaf"}`}><span lang="ta">{titleTa}</span></Reveal>}
        {intro && <Reveal as="p" delay={0.32} y={14} className={`relative mt-4 max-w-2xl text-lg ${dark ? "text-white/85" : "text-ink/75"}`}>{intro}</Reveal>}
        {children && <Reveal delay={0.4} y={14} className="relative mt-6 flex flex-wrap gap-3">{children}</Reveal>}
      </div>
    </header>
  );
}
