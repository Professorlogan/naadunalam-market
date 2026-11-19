import type { LucideIcon } from "lucide-react";

/**
 * An honest "nothing here yet" panel: a white rounded card with a hairline border, one icon in a mint disc, a heading and a line of text.
 * `skeleton` is accepted for older callers and ignored; no placeholder bars are drawn.
 */
export default function EmptyState({ icon: Icon, title, children, actions }: {
  icon: LucideIcon; title: string; children: React.ReactNode; actions?: React.ReactNode; skeleton?: boolean;
}) {
  return (
    <div className="flex flex-col gap-4 rounded-[1.5rem] border border-mist bg-white p-5 sm:flex-row sm:items-start sm:gap-5 sm:p-7">
      <span aria-hidden className="grid h-12 w-12 shrink-0 place-items-center rounded-full bg-mint text-forest"><Icon size={24} strokeWidth={1.75} /></span>
      <div className="min-w-0 max-w-2xl flex-1">
        <h3 className="text-xl font-bold sm:text-2xl">{title}</h3>
        <div className="mt-1.5 text-muted">{children}</div>
        {actions && <div className="mt-5 flex flex-wrap gap-3">{actions}</div>}
      </div>
    </div>
  );
}
