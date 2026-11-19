import Link from "next/link";
import { categories } from "../../lib/data";

/** Pill links to every category. `current` marks the category being viewed; `exclude` leaves one out. */
export default function CategoryLinks({ exclude, current, label }: { exclude?: string; current?: string; label: string }) {
  const list = categories.filter((c) => c.slug !== exclude);
  return (
    <nav aria-label={label}>
      <ul className="flex flex-wrap gap-2">
        {list.map((c) => {
          const on = c.slug === current;
          return (
            <li key={c.slug}>
              <Link href={`/product-category/${c.slug}`} aria-current={on ? "page" : undefined}
                className={`inline-flex min-h-11 items-center gap-2 rounded-full border px-4 text-[15px] font-semibold transition-colors duration-150 ${on ? "border-leaf bg-leaf text-white" : "border-mist bg-white text-forest hover:border-leaf hover:text-leaf"}`}>
                {c.name}
                <span className={`text-sm font-normal ${on ? "text-white/80" : "text-muted"}`}>{c.count}</span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
