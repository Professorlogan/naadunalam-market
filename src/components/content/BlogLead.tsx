import Link from "next/link";
import type { Post } from "@/lib/types";
import { longDate } from "@/lib/format";

/**
 * Lead story on the blog index. The photograph is held to 420px at most, cropped with object-cover inside a
 * rounded sky-coloured frame, so a pack shot on a white background never becomes a page-wide hero.
 * The title link is stretched over the whole card: one link, one tab stop.
 */
export default function BlogLead({ post }: { post: Post }) {
  return (
    <article className="group relative grid gap-6 rounded-[1.5rem] border border-mist bg-white p-4 transition-[transform,box-shadow] duration-300 hover:-translate-y-1 hover:shadow-[0_18px_40px_-22px_rgb(23_39_30/0.45)] focus-within:outline focus-within:outline-[3px] focus-within:outline-offset-2 focus-within:outline-water sm:p-6 md:grid-cols-2 md:items-center md:gap-10">
      <div className="h-56 max-h-[420px] overflow-hidden rounded-[1.25rem] bg-mint sm:h-72 md:h-[22rem] lg:h-[420px]">
        <img src={post.image} alt="" width={1024} height={768} className="h-full w-full object-cover mix-blend-multiply transition-transform duration-700 ease-out group-hover:scale-[1.04]" />
      </div>
      <div className="px-2 pb-2 sm:px-0 sm:pb-0 md:pr-4">
        <p className="text-sm font-semibold text-leaf">Latest · <time dateTime={post.date}>{longDate(post.date)}</time></p>
        <h2 className="mt-3 text-3xl font-bold sm:text-4xl">
          <Link href={`/${post.slug}`} className="transition-colors after:absolute after:inset-0 after:content-[''] focus-visible:outline-none group-hover:text-leaf">{post.title}</Link>
        </h2>
        <p className="mt-4 text-lg text-muted">{post.excerpt}</p>
        <span aria-hidden className="mt-4 inline-block font-display font-semibold text-water-deep underline underline-offset-4 group-hover:text-forest">Read the article</span>
      </div>
    </article>
  );
}
