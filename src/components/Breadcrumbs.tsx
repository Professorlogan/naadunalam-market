import Link from "next/link";

export default function Breadcrumbs({ items }: { items: { label: string; href?: string }[] }) {
  return (
    <nav aria-label="Breadcrumb" className="text-sm text-muted">
      <ol className="flex flex-wrap items-center gap-x-2 gap-y-1">
        <li><Link href="/" className="hover:text-leaf hover:underline">Home</Link></li>
        {items.map((it) => (
          <li key={it.label} className="flex items-center gap-2">
            <span aria-hidden>/</span>
            {it.href ? <Link href={it.href} className="hover:text-leaf hover:underline">{it.label}</Link> : <span aria-current="page" className="font-semibold text-forest-deep">{it.label}</span>}
          </li>
        ))}
      </ol>
    </nav>
  );
}
