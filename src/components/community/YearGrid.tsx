"use client";
import { useSyncExternalStore } from "react";

export type Season = "pongal" | "cool" | "summer" | "southwest" | "northeast";
export type Month = { name: string; season: Season };

export const seasons: Record<Season, { label: string }> = {
  pongal: { label: "Pongal season" },
  cool: { label: "Cool season" },
  summer: { label: "Summer" },
  southwest: { label: "South-west monsoon" },
  northeast: { label: "North-east monsoon" },
};

const noop = () => () => {};
/** Month index from the visitor's own clock; -1 on the server so the static HTML carries no stale "this month". */
const useCurrentMonth = () => useSyncExternalStore(noop, () => new Date().getMonth(), () => -1);

/**
 * The year as twelve plain cards: month, season, and what is scheduled. The current month has a forest border and a
 * small tag that sits on the card's top edge, so its title stays level with its neighbours.
 */
export default function YearGrid({ months }: { months: Month[] }) {
  const current = useCurrentMonth();
  return (
    <ol className="grid grid-cols-2 gap-2.5 sm:gap-4 md:grid-cols-3 lg:grid-cols-4">
      {months.map((m, i) => {
        const now = i === current;
        return (
          <li key={m.name} aria-current={now ? "date" : undefined}
            className={`relative flex flex-col rounded-[1.25rem] bg-white sm:min-h-36 ${now ? "border-2 border-leaf p-[11px] sm:p-[19px]" : "border border-mist p-3 sm:p-5"}`}>
            {now && (
              <span className="absolute -top-3 right-3 rounded-full bg-leaf px-2.5 py-0.5 text-xs font-semibold leading-5 text-white">This month</span>
            )}
            <h3 className="text-lg font-bold leading-tight sm:text-2xl">{m.name}</h3>
            <p className="mt-0.5 text-sm text-muted sm:mt-1">{seasons[m.season].label}</p>
            <p className="mt-2 text-sm text-muted sm:mt-auto sm:pt-4">No entries yet</p>
          </li>
        );
      })}
    </ol>
  );
}
