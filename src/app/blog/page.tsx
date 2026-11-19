import type { Metadata } from "next";
import Link from "next/link";
import PageHero from "@/components/PageHero";
import NewsletterForm from "@/components/NewsletterForm";
import { PostRow } from "@/components/community/PostCards";
import BlogLead from "@/components/content/BlogLead";
import { Reveal, Stagger, StaggerItem } from "@/components/motion";
import { posts } from "@/lib/data";

export const metadata: Metadata = {
  title: "Blog",
  description: "Kitchen notes from Naadu Nalam: how to pick honey, why cold-pressed oil tastes different, which rice suits which meal, and how buying direct from Tamil Nadu sellers works.",
};

export default function BlogPage() {
  const sorted = [...posts].sort((a, b) => b.date.localeCompare(a.date));
  const [lead, ...rest] = sorted;
  return (
    <>
      <PageHero title="Blog" crumbs={[{ label: "Blog" }]} intro="Notes on the food we sell and how to cook it." />
      <section className="wrap py-10 sm:py-14">
        <Reveal scale={0.98}><BlogLead post={lead} /></Reveal>
      </section>
      {/* -mb-10 cancels the page's default space before the footer, so no empty band follows the list. */}
      <section aria-labelledby="more-posts">
        <div className="wrap grid gap-10 pb-4 lg:grid-cols-[minmax(0,1fr)_20rem] lg:gap-14">
          <div>
            <Reveal><h2 id="more-posts" className="t-h2 font-bold">Earlier articles</h2></Reveal>
            <Stagger as="ul" className="mt-6 grid gap-4">
              {rest.map((p) => <StaggerItem as="li" key={p.slug}><PostRow post={p} /></StaggerItem>)}
            </Stagger>
          </div>
          <aside className="space-y-5 lg:sticky lg:top-32 lg:self-start">
            <Reveal className="rounded-[1.5rem] bg-white border border-mist p-6">
              <h2 className="t-h3 font-bold text-forest-deep">Shop the ingredients</h2>
              <p className="mt-2 text-ink/75">The rice, millets, oils, honey and podis we write about are all on the marketplace.</p>
              <Link href="/shop" className="btn btn-primary mt-5">Go to the shop</Link>
            </Reveal>
            <Reveal delay={0.1} className="rounded-[1.5rem] bg-white border border-mist p-6">
              <h2 className="t-h4 font-bold">New articles by email</h2>
              {/* The sidebar is narrow from lg up, so the field and button stack there and the placeholder is never clipped. */}
              <div className="mt-4 [&_.btn]:!bg-forest [&_.btn]:!text-white [&_.btn:hover]:!bg-leaf [&_input]:bg-white lg:[&_form]:!flex-col lg:[&_form]:!items-stretch lg:[&_input]:!w-full lg:[&_input]:!flex-none"><NewsletterForm /></div>
            </Reveal>
          </aside>
        </div>
      </section>
    </>
  );
}
