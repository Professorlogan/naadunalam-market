import Breadcrumbs from "../Breadcrumbs";

/** Flat opening for shop, category and search pages: breadcrumb, one small H1, optional Tamil line and intro. */
export default function ListingHeader({ title, titleTa, intro, crumbs }: {
  title: string; titleTa?: string; intro?: string; crumbs: { label: string; href?: string }[];
}) {
  return (
    <header className="border-b border-mist bg-white">
      <div className="wrap py-5 sm:py-7">
        <Breadcrumbs items={crumbs} />
        <h1 className="mt-3 text-[28px] font-bold leading-tight sm:text-[32px]">{title}</h1>
        {titleTa && <p lang="ta" className="ta mt-1 font-display text-lg font-medium text-leaf">{titleTa}</p>}
        {intro && <p className="mt-2 max-w-2xl text-[15px] text-muted">{intro}</p>}
      </div>
    </header>
  );
}
