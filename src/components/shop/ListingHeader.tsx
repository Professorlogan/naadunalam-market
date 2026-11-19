import Breadcrumbs from "../Breadcrumbs";

/**
 * Opening for shop, category and search pages, Market Colours style: a pastel rounded block with the breadcrumb,
 * the page's only H1, optional Tamil line and intro. On category pages the category photo sits on the right from 768px.
 */
export default function ListingHeader({ title, titleTa, intro, crumbs, image, imageAlt }: {
  title: string; titleTa?: string; intro?: string; crumbs: { label: string; href?: string }[]; image?: string; imageAlt?: string;
}) {
  return (
    <header className="wrap pt-4 sm:pt-6">
      <div className="relative overflow-hidden rounded-[2rem] bg-gradient-to-br from-mint via-mint to-butter px-6 py-8 sm:px-10 sm:py-10">
        <svg aria-hidden viewBox="0 0 200 200" className="pointer-events-none absolute -right-10 -top-12 h-56 w-56 text-leaf/10"><path fill="currentColor" d="M100 10c40 30 70 60 70 100a70 70 0 0 1-140 0C30 70 60 40 100 10z" /></svg>
        <div className={`relative ${image ? "md:grid md:grid-cols-[minmax(0,1fr)_auto] md:items-center md:gap-10" : ""}`}>
          <div className="min-w-0">
            <Breadcrumbs items={crumbs} />
            <h1 className="mt-4 max-w-3xl text-4xl font-bold leading-tight text-forest-deep sm:text-5xl">{title}</h1>
            {titleTa && <p lang="ta" className="ta mt-2 font-display text-xl font-semibold text-leaf">{titleTa}</p>}
            {intro && <p className="mt-3 max-w-2xl text-lg text-ink/75">{intro}</p>}
          </div>
          {image && (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={image} alt={imageAlt ?? ""} width={240} height={240} fetchPriority="high"
              className="hidden h-48 w-48 rounded-full border-[6px] border-white object-cover shadow-[0_18px_40px_-22px_rgb(23_39_30/0.45)] md:block lg:h-56 lg:w-56" />
          )}
        </div>
      </div>
    </header>
  );
}
