import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import Breadcrumbs from "@/components/Breadcrumbs";
import Prose from "@/components/Prose";
import { PostCard } from "@/components/community/PostCards";
import { getPost, posts, site } from "@/lib/data";
import { longDate } from "@/lib/format";
import { Reveal, SplitWords, Stagger, StaggerItem } from "@/components/motion";
import { HeadingReveal, SettleImage } from "@/components/community/Motion";

/* Blog posts live at the site root (e.g. /many-sellers-one-basket), exactly as on the live site. */
export const dynamicParams = false;
export const generateStaticParams = () => posts.map((p) => ({ slug: p.slug }));

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) return {};
  return {
    title: post.title,
    description: post.excerpt,
    openGraph: { type: "article", title: post.title, description: post.excerpt, publishedTime: post.date, images: [post.image] },
  };
}

export default async function PostPage({ params }: Props) {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) notFound();

  const sorted = [...posts].sort((a, b) => b.date.localeCompare(a.date));
  const at = sorted.findIndex((p) => p.slug === post.slug);
  const more = [1, 2, 3].map((n) => sorted[(at + n) % sorted.length]);

  // Reading time from the article's own word count, at an easy 200 words a minute.
  const words = post.contentHtml.replace(/<[^>]+>/g, " ").split(/\s+/).filter(Boolean).length;
  const minutes = Math.max(1, Math.round(words / 200));

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description: post.excerpt,
    datePublished: post.date,
    dateModified: post.date,
    image: [post.image],
    author: { "@type": "Organization", name: site.name },
    publisher: { "@type": "Organization", name: site.name, logo: { "@type": "ImageObject", url: "/img/logo.webp" } },
    mainEntityOfPage: `/${post.slug}`,
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }} />
      <article>
        <header className="wrap pt-4 sm:pt-6">
          <div className="rounded-[2rem] bg-gradient-to-br from-mint via-mint to-butter px-6 py-8 sm:px-10 sm:py-12">
            {/* On phones the trail stops at Blog: the long article title (and its slash) is dropped, the h1 below carries it. */}
            <div className="max-sm:[&_li:last-child]:hidden"><Breadcrumbs items={[{ label: "Blog", href: "/blog" }, { label: post.title }]} /></div>
            <h1 className="t-h1 mt-5 max-w-4xl font-bold"><SplitWords text={post.title} delay={0.05} /></h1>
            <Reveal as="p" delay={0.3} y={14} className="mt-4 max-w-2xl text-xl text-ink/75">{post.excerpt}</Reveal>
            <Reveal as="p" delay={0.4} y={14} className="mt-4 text-sm font-semibold text-leaf">
              Published <time dateTime={post.date}>{longDate(post.date)}</time>
              <span aria-hidden className="mx-2 text-forest/30">|</span>
              {minutes} minute read
            </Reveal>
          </div>
        </header>
        <div className="wrap py-8 sm:py-12">
          <div className="aspect-[4/3] max-h-[460px] w-full overflow-hidden rounded-[1.75rem] bg-sky sm:aspect-[21/9]">
            <SettleImage src={post.image} width={1536} height={658} className="h-full w-full object-cover" />
          </div>
          <div className="mt-8 grid gap-10 sm:mt-12 lg:grid-cols-[minmax(0,1fr)_18rem] lg:gap-12">
            <div id="article-body" className="min-w-0 max-w-[72ch] [&_.prose-nn]:max-w-none"><Prose html={post.contentHtml} className="text-lg leading-[1.8]" /></div>
            <HeadingReveal scope="#article-body" selector="h2, h3" />
            <aside className="lg:sticky lg:top-32 lg:self-start">
              <div className="rounded-[1.5rem] bg-white border border-mist p-6">
                <h2 className="t-h3 font-bold text-forest-deep">Shop the ingredients</h2>
                <p className="mt-2 text-ink/75">Everything on the marketplace comes from an independent Tamil Nadu seller. {site.deliveryLine}.</p>
                <Link href="/shop" className="btn btn-primary mt-5">Shop the ingredients</Link>
                <p className="mt-5 border-t border-forest/15 pt-4">
                  <Link href="/blog" className="inline-flex min-h-11 items-center font-semibold text-forest underline decoration-forest/40 underline-offset-4 hover:decoration-forest">All blog articles</Link>
                </p>
              </div>
            </aside>
          </div>
        </div>
      </article>
      <section className="wrap pb-4" aria-labelledby="keep-reading">
        <div className="rounded-[2rem] bg-sky px-6 py-10 sm:px-10 sm:py-12">
          <h2 id="keep-reading" className="t-h2 mb-6 font-bold sm:mb-8"><SplitWords text="Keep reading" inView /></h2>
          <Stagger as="ul" gap={0.1} className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {more.map((p, i) => <StaggerItem as="li" key={p.slug} className={i === 2 ? "sm:hidden lg:block" : ""}><PostCard post={p} /></StaggerItem>)}
          </Stagger>
        </div>
      </section>
    </>
  );
}
