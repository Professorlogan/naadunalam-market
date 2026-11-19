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
      <section className="-mb-10 border-t border-mist bg-white" aria-labelledby="more-posts">
        <div className="wrap grid gap-10 py-12 sm:py-16 lg:grid-cols-[minmax(0,1fr)_20rem] lg:gap-14">
          <div>
            <Reveal><h2 id="more-posts" className="text-3xl font-bold sm:text-4xl">Earlier articles</h2></Reveal>
            <Stagger as="ul" className="mt-4 divide-y divide-mist">
              {rest.map((p) => <StaggerItem as="li" key={p.slug}><PostRow post={p} /></StaggerItem>)}
            </Stagger>
          </div>
          <aside className="space-y-5 lg:sticky lg:top-32 lg:self-start">
            <Reveal className="rounded-[1.25rem] bg-forest p-6 text-white">
              <h2 className="text-2xl font-bold !text-white">Shop the ingredients</h2>
              <p className="mt-2 text-white/85">The rice, millets, oils, honey and podis we write about are all on the marketplace.</p>
              <Link href="/shop" className="btn btn-sun mt-5">Go to the shop</Link>
            </Reveal>
            <Reveal delay={0.1} className="card p-6">
              <h2 className="text-xl font-bold">New articles by email</h2>
              {/* The sidebar is narrow from lg up, so the field and button stack there and the placeholder is never clipped. */}
              <div className="mt-4 lg:[&_form]:!flex-col lg:[&_form]:!items-stretch lg:[&_input]:!w-full lg:[&_input]:!flex-none"><NewsletterForm /></div>
            </Reveal>
          </aside>
        </div>
      </section>
    </>
  );
}
