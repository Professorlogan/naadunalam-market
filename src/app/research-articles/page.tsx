import type { Metadata } from "next";
import Link from "next/link";
import { FlaskConical } from "lucide-react";
import PageHero from "@/components/PageHero";
import SectionHeading from "@/components/SectionHeading";
import EmptyState from "@/components/community/EmptyState";
import ClosingBand from "@/components/community/ClosingBand";
import { PostCard } from "@/components/community/PostCards";
import { Stagger, StaggerItem } from "@/components/motion";
import { posts } from "@/lib/data";

export const metadata: Metadata = {
  title: "Research articles",
  description: "Longer, sourced writing about traditional Tamil Nadu grains, oils, spices and the farming they come from. No research has been published yet; practical guides are on the blog.",
};

export default function ResearchArticlesPage() {
  const newest = [...posts].sort((a, b) => b.date.localeCompare(a.date)).slice(0, 3);
  return (
    <>
      <PageHero
        title="Research articles"
        crumbs={[{ label: "Research articles" }]}
        intro="Longer, sourced writing about traditional Tamil Nadu grains, oils, spices and the farming they come from — and what is actually known about them."
      />
      <section className="wrap py-12 sm:py-16">
        <SectionHeading title="Published research" />
        <EmptyState icon={FlaskConical} title="Research articles will be published here">
          <p>We have not published any research yet. When the first pieces are ready, each one will appear here with its title, date, a short summary and a link to read it in full.</p>
        </EmptyState>
      </section>
      <section className="border-y border-mist bg-white">
        <div className="wrap py-12 sm:py-16">
          <SectionHeading
            title="From the blog in the meantime"
            intro="These are practical guides rather than research, but they cover the same foods — how to tell one honey from another, why cold-pressed oil tastes different, which rice suits which meal."
            href="/blog" linkLabel="Read all blog posts"
          />
          <Stagger as="ul" gap={0.1} className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {newest.map((p, i) => <StaggerItem as="li" key={p.slug} className={i === 2 ? "sm:col-span-2 lg:col-span-1" : ""}><PostCard post={p} /></StaggerItem>)}
          </Stagger>
        </div>
      </section>
      <ClosingBand
        title="Working on something we should read?"
        actions={<>
          <Link href="/contact" className="btn btn-sun">Contact us</Link>
          <Link href="/about-us" className="btn btn-light">About Naadu Nalam</Link>
        </>}
      >
        If you research Tamil Nadu food systems, traditional crops or nutrition and would like your work published here, we would like to hear from you.
      </ClosingBand>
    </>
  );
}
