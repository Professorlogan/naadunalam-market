import type { LucideIcon } from "lucide-react";

/**
 * An honest "nothing here yet" panel: a plain white card with a hairline border, one icon, a heading and a line of text.
 * `skeleton` is accepted for older callers and ignored; no placeholder bars are drawn.
 */
export default function EmptyState({ icon: Icon, title, children, actions }: {
  icon: LucideIcon; title: string; children: React.ReactNode; actions?: React.ReactNode; skeleton?: boolean;
}) {
  return (
    <div className="flex flex-col gap-4 rounded-xl border border-mist bg-white p-5 sm:flex-row sm:items-start sm:gap-5 sm:p-7">
      <Icon aria-hidden size={28} strokeWidth={1.75} className="shrink-0 text-forest sm:mt-0.5" />
      <div className="min-w-0 max-w-2xl flex-1">
        <h3 className="text-xl font-bold sm:text-2xl">{title}</h3>
        <div className="mt-1.5 text-muted">{children}</div>
        {actions && <div className="mt-5 flex flex-wrap gap-3">{actions}</div>}
      </div>
    </div>
  );
}
