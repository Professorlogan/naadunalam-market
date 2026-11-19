"use client";
import Link from "next/link";
import { useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import type { Product } from "../lib/types";
import ProductCard from "./ProductCard";

/**
 * A row of products: title, blurb and "Show all" in a left column, a scroll-snap carousel on the right
 * that pages with the arrow buttons. No autoplay.
 */
export default function ProductRail({ title, titleTa, blurb, href, linkLabel = "Show all", products, id }: {
  title: string; titleTa?: string; blurb?: string; href?: string; linkLabel?: string; products: Product[]; id: string;
}) {
  const track = useRef<HTMLUListElement>(null);
  const page = (dir: 1 | -1) => track.current?.scrollBy({ left: dir * track.current.clientWidth * 0.9, behavior: "smooth" });
  if (products.length === 0) return null;
  return (
    <section aria-labelledby={id} className="wrap grid gap-x-8 gap-y-4 py-10 lg:grid-cols-[15rem_minmax(0,1fr)]">
      <div className="flex flex-wrap items-end justify-between gap-3 lg:flex-col lg:items-start lg:justify-start">
        <div>
          <h2 id={id} className="t-h3 font-display font-bold text-forest-deep [text-wrap:balance]">{title}</h2>
          {titleTa && <p lang="ta" className="ta mt-0.5 text-[15px] font-medium text-leaf">{titleTa}</p>}
          {blurb && <p className="mt-2 text-[15px] text-muted max-lg:hidden">{blurb}</p>}
        </div>
        <div className="flex items-center gap-2 lg:mt-4">
          {href && <Link href={href} className="link mr-2 text-[15px] font-semibold">{linkLabel}</Link>}
          {products.length > 4 && <><button type="button" aria-label={`Previous products in ${title}`} onClick={() => page(-1)} className="grid h-11 w-11 place-items-center rounded-full bg-mint text-forest transition-colors hover:bg-leaf hover:text-white"><ChevronLeft size={20} /></button>
          <button type="button" aria-label={`Next products in ${title}`} onClick={() => page(1)} className="grid h-11 w-11 place-items-center rounded-full bg-mint text-forest transition-colors hover:bg-leaf hover:text-white"><ChevronRight size={20} /></button></>}
        </div>
      </div>
      <ul ref={track} tabIndex={0} aria-label={title} className="flex snap-x snap-mandatory gap-3 overflow-x-auto pb-4 pt-1 [scrollbar-width:none] sm:gap-4 [&::-webkit-scrollbar]:hidden">
        {products.map((p) => (
          <li key={p.id} className="w-[44%] shrink-0 snap-start sm:w-[30%] xl:w-[calc((100%-3rem)/4.3)]"><ProductCard product={p} /></li>
        ))}
      </ul>
    </section>
  );
}
