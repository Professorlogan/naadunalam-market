import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import Breadcrumbs from "@/components/Breadcrumbs";
import Prose from "@/components/Prose";
import { PostCard } from "@/components/community/PostCards";
import { getPost, posts, site } from "@/lib/data";
import { longDate } from "@/lib/format";
import { DrawStrip, Reveal, SplitWords, Stagger, StaggerItem } from "@/components/motion";
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
        <header className="border-b border-mist bg-white">
          <div className="wrap py-8 sm:py-12">
            {/* On phones the trail stops at Blog: the long article title (and its slash) is dropped, the h1 below carries it. */}
            <div className="max-sm:[&_li:last-child]:hidden"><Breadcrumbs items={[{ label: "Blog", href: "/blog" }, { label: post.title }]} /></div>
            <h1 className="mt-5 max-w-4xl text-4xl font-bold sm:text-5xl"><SplitWords text={post.title} delay={0.05} /></h1>
            <DrawStrip className="mt-4 w-28" />
            <Reveal as="p" delay={0.3} y={14} className="mt-4 max-w-2xl text-xl text-muted">{post.excerpt}</Reveal>
            <Reveal as="p" delay={0.4} y={14} className="mt-4 text-sm font-semibold text-leaf">
              Published <time dateTime={post.date}>{longDate(post.date)}</time>
              <span aria-hidden className="mx-2 text-mist">|</span>
              {minutes} minute read
            </Reveal>
          </div>
        </header>
        <div className="wrap py-8 sm:py-12">
          <div className="aspect-[4/3] max-h-[420px] w-full overflow-hidden rounded-[1.25rem] bg-sky sm:aspect-[21/9]">
            <SettleImage src={post.image} width={1536} height={658} className="h-full w-full object-cover mix-blend-multiply" />
          </div>
          <div className="mt-8 grid gap-10 sm:mt-12 lg:grid-cols-[minmax(0,1fr)_19rem] lg:gap-16">
            <div id="article-body" className="min-w-0"><Prose html={post.contentHtml} className="text-lg" /></div>
            <HeadingReveal scope="#article-body" selector="h2, h3" />
            <aside className="lg:sticky lg:top-32 lg:self-start">
              <div className="rounded-[1.25rem] bg-forest p-6 text-white">
                <h2 className="text-2xl font-bold !text-white">Shop the ingredients</h2>
                <p className="mt-2 text-white/85">Everything on the marketplace comes from an independent Tamil Nadu seller. {site.deliveryLine}.</p>
                <Link href="/shop" className="btn btn-sun mt-5">Shop the ingredients</Link>
                <p className="mt-5 border-t border-white/20 pt-4">
                  <Link href="/blog" className="inline-flex min-h-11 items-center font-semibold text-white underline decoration-white/50 underline-offset-4 hover:decoration-white">All blog articles</Link>
                </p>
              </div>
            </aside>
          </div>
        </div>
      </article>
      <section className="-mb-10 border-t border-mist bg-white" aria-labelledby="keep-reading">
        <div className="wrap py-12 sm:py-16">
          <h2 id="keep-reading" className="mb-6 text-3xl font-bold sm:mb-8 sm:text-4xl"><SplitWords text="Keep reading" inView /></h2>
          <Stagger as="ul" gap={0.1} className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {more.map((p, i) => <StaggerItem as="li" key={p.slug} className={i === 2 ? "sm:hidden lg:block" : ""}><PostCard post={p} /></StaggerItem>)}
          </Stagger>
        </div>
      </section>
    </>
  );
}
