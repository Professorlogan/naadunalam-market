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
      <div className="relative overflow-hidden rounded-[2rem] bg-gradient-to-br from-mint via-[#eef7f0] to-butter px-5 py-7 sm:px-10 sm:py-9">
        <div className={`relative ${image ? "md:grid md:grid-cols-[minmax(0,1fr)_auto] md:items-center md:gap-10" : ""}`}>
          <div className="min-w-0">
            <Breadcrumbs items={crumbs} />
            <h1 className="t-h1 mt-4 max-w-3xl font-bold text-forest-deep">{title}</h1>
            {titleTa && <p lang="ta" className="ta mt-2 font-display text-xl font-semibold text-leaf">{titleTa}</p>}
            {intro && <p className="mt-3 max-w-2xl text-base text-ink/75 sm:text-lg">{intro}</p>}
          </div>
          {image && (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={image} alt={imageAlt ?? ""} width={240} height={240} fetchPriority="high"
              className="hidden h-36 w-36 rounded-full border-[5px] border-white object-cover shadow-[0_18px_40px_-22px_rgb(23_39_30/0.45)] md:block lg:h-44 lg:w-44" />
          )}
        </div>
      </div>
    </header>
  );
}
