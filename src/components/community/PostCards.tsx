import Link from "next/link";
import type { Post } from "@/lib/types";
import { longDate } from "@/lib/format";
import { Parallax, SplitWords } from "../motion";

/* The title link is stretched over the whole card, so each card is one link (one tab stop) with the title as its name. */
const stretched = "after:absolute after:inset-0 after:content-[''] focus-visible:outline-none";
/* Underline that draws from the left under every line of the title when the card is hovered or focused. */
const draw = "bg-[linear-gradient(currentColor,currentColor)] bg-[length:0%_2px] bg-[position:0_100%] bg-no-repeat pb-0.5 transition-[background-size,color] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:bg-[length:100%_2px] group-focus-within:bg-[length:100%_2px]";
const zoom = "h-full w-full object-cover transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.07] group-focus-within:scale-[1.07]";
const ring = "focus-within:outline focus-within:outline-[3px] focus-within:outline-offset-2 focus-within:outline-water";

function ReadMore() {
  return <span aria-hidden className="mt-4 inline-block font-display font-semibold text-water-deep underline underline-offset-4 group-hover:text-forest">Read the article</span>;
}

/** Large lead story: image and text side by side from tablet up. */
export function PostLead({ post }: { post: Post }) {
  return (
    <article className={`group relative grid overflow-hidden rounded-[1.25rem] border border-mist bg-white md:grid-cols-2 transition-[transform,box-shadow] duration-300 hover:-translate-y-1 hover:shadow-[0_18px_40px_-22px_rgb(23_39_30/0.45)] ${ring}`}>
      <div className="relative aspect-[4/3] overflow-hidden bg-mist md:aspect-auto md:min-h-[24rem]">
        {/* The photo is a little taller than its frame so it can drift as the page scrolls. */}
        <Parallax amount={22} className="absolute inset-x-0 -inset-y-6">
          <img src={post.image} alt="" width={1024} height={768} className={zoom} />
        </Parallax>
      </div>
      <div className="flex flex-col justify-center p-6 sm:p-10">
        <p className="text-sm font-semibold text-leaf">Latest · <time dateTime={post.date}>{longDate(post.date)}</time></p>
        <h2 className="mt-3 text-3xl font-bold sm:text-4xl">
          <Link href={`/${post.slug}`} aria-label={post.title} className={`${stretched} transition-colors group-hover:text-leaf`}><SplitWords text={post.title} delay={0.15} /></Link>
        </h2>
        <p className="mt-4 text-lg text-muted">{post.excerpt}</p>
        <div><ReadMore /></div>
      </div>
    </article>
  );
}

/** Index row: thumbnail left, text right. Used for the rest of the blog list. */
export function PostRow({ post }: { post: Post }) {
  return (
    <article className={`group relative flex gap-4 rounded-[1.25rem] border border-mist bg-white p-3 sm:gap-6 sm:p-4 transition-[transform,box-shadow] duration-300 hover:-translate-y-1 hover:shadow-[0_18px_40px_-22px_rgb(23_39_30/0.45)] ${ring}`}>
      <div className="h-24 w-24 shrink-0 overflow-hidden rounded-[1rem] bg-mist sm:h-40 sm:w-56">
        <img src={post.image} alt="" width={448} height={320} loading="lazy" className={zoom} />
      </div>
      <div className="min-w-0 self-center">
        <time dateTime={post.date} className="text-sm text-muted">{longDate(post.date)}</time>
        <h3 className="mt-1 text-xl font-bold sm:text-2xl">
          <Link href={`/${post.slug}`} className={`${stretched} ${draw} group-hover:text-leaf`}>{post.title}</Link>
        </h3>
        <p className="mt-2 hidden text-muted sm:block">{post.excerpt}</p>
        <div className="[&>span]:mt-2 sm:[&>span]:mt-3"><ReadMore /></div>
      </div>
    </article>
  );
}

/** Upright card for three-across rows ("Keep reading", "From the blog in the meantime"). */
export function PostCard({ post, as: Tag = "h3" }: { post: Post; as?: "h2" | "h3" }) {
  return (
    <article className={`group relative flex h-full flex-col overflow-hidden rounded-[1.25rem] border border-mist bg-white transition-[transform,box-shadow] duration-300 hover:-translate-y-1 hover:shadow-[0_18px_40px_-22px_rgb(23_39_30/0.45)] ${ring}`}>
      <div className="aspect-[3/2] overflow-hidden bg-mist">
        <img src={post.image} alt="" width={600} height={400} loading="lazy" className={zoom} />
      </div>
      <div className="flex flex-1 flex-col p-5 sm:p-6">
        <time dateTime={post.date} className="text-sm text-muted">{longDate(post.date)}</time>
        <Tag className="mt-1 text-xl font-bold">
          <Link href={`/${post.slug}`} className={`${stretched} ${draw} group-hover:text-leaf`}>{post.title}</Link>
        </Tag>
        <p className="mt-2 flex-1 text-muted">{post.excerpt}</p>
        <div><ReadMore /></div>
      </div>
    </article>
  );
}
