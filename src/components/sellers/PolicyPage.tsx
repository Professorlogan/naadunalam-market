import Link from "next/link";
import { CalendarDays } from "lucide-react";
import PageHero from "../PageHero";
import Prose from "../Prose";
import { policies } from "../../lib/data";
import { parsePolicy } from "./policy";
import PolicyToc from "./PolicyToc";
import { Reveal, Stagger, StaggerItem } from "../motion";
import { HeadingReveal } from "../community/Motion";

/** One layout for all four policies: hero with the h1, dated note, contents (sticky on desktop), the text as written. */
export default function PolicyPage({ slug }: { slug: string }) {
  const policy = policies[slug];
  const { title, intro, updated, toc, body } = parsePolicy(policy.html);
  const heading = title ?? policy.title;
  const others = Object.entries(policies).filter(([s]) => s !== slug);

  return (
    <>
      <PageHero title={heading} intro={intro ?? undefined} crumbs={[{ label: heading }]}>
        {updated && (
          <p className="inline-flex items-center gap-2 rounded-full bg-sky px-4 py-2 text-[15px] text-forest-deep">
            <CalendarDays size={17} aria-hidden />
            <span>Last updated {updated.iso ? <time dateTime={updated.iso}>{updated.label}</time> : updated.label}</span>
          </p>
        )}
      </PageHero>

      <div className="wrap pb-4 pt-8 sm:pb-6 sm:pt-12 lg:grid lg:grid-cols-[18rem_minmax(0,1fr)] lg:items-start lg:gap-12">
        {toc.length > 0 && <PolicyToc toc={toc} />}

        <div className="min-w-0">
          <Reveal as="article" id="policy-text" y={20} delay={0.2} className="w-fit max-w-full rounded-xl border border-mist bg-white p-5 sm:p-8 lg:p-10">
            <Prose html={body} className="[&>:first-child]:!mt-0 [&_li>span:first-child]:mr-2 [&_li>span:first-child]:font-semibold [&_li>span:first-child]:text-forest-deep" />
          </Reveal>
          <HeadingReveal scope="#policy-text" />

          <nav aria-labelledby="policy-more" className="mt-10">
            <Reveal><h2 id="policy-more" className="text-2xl font-bold">Other policies</h2></Reveal>
            <Stagger as="ul" gap={0.08} className="mt-4 flex flex-wrap gap-3">
              {others.map(([s, p]) => (
                <StaggerItem as="li" key={s} y={14}><Link href={`/${s}`} className="btn btn-ghost">{p.title}</Link></StaggerItem>
              ))}
            </Stagger>
            <Reveal as="p" delay={0.2} y={14} className="mt-6 text-muted">
              Something here unclear, or need help with an order? <Link href="/contact" className="link font-semibold">Contact us</Link>.
            </Reveal>
          </nav>
        </div>
      </div>
    </>
  );
}
