import type { Metadata } from "next";
import Link from "next/link";
import { CalendarDays } from "lucide-react";
import PageHero from "@/components/PageHero";
import SectionHeading from "@/components/SectionHeading";
import EmptyState from "@/components/community/EmptyState";
import ClosingBand from "@/components/community/ClosingBand";
import YearGrid, { type Month } from "@/components/community/YearGrid";

export const metadata: Metadata = {
  title: "Calendar",
  description: "A month-by-month view of Naadu Nalam activity: markets, farm visits, tastings and dispatch notices, set against Tamil Nadu's seasons. No dates are confirmed yet.",
};

const months: Month[] = [
  { name: "January", season: "pongal" },
  { name: "February", season: "cool" },
  { name: "March", season: "cool" },
  { name: "April", season: "summer" },
  { name: "May", season: "summer" },
  { name: "June", season: "summer" },
  { name: "July", season: "southwest" },
  { name: "August", season: "southwest" },
  { name: "September", season: "southwest" },
  { name: "October", season: "northeast" },
  { name: "November", season: "northeast" },
  { name: "December", season: "northeast" },
];

export default function CalendarPage() {
  return (
    <>
      <PageHero
        title="Calendar"
        crumbs={[{ label: "Calendar" }]}
        intro="A month-by-month view of Naadu Nalam activity — markets, farm visits, tastings and notices about dispatch. Months with nothing against them are simply not scheduled yet."
      />
      <section className="wrap py-12 sm:py-16">
        <SectionHeading title="What is coming up" />
        <EmptyState icon={CalendarDays} title="Our calendar will be updated with upcoming activities and events">
          <p>Nothing is on the calendar yet. The year below is where dates will land as they are confirmed — one line per activity, under the month it falls in.</p>
        </EmptyState>
      </section>
      <section className="border-y border-mist bg-white">
        <div className="wrap py-12 sm:py-16">
          <SectionHeading
            title="The year ahead"
            intro="Markets and stalls, farm and producer visits, tastings, and notices about when dispatch pauses will each be listed against their month."
          />
          <YearGrid months={months} />
        </div>
      </section>
      <ClosingBand
        title="Something we should put in the diary?"
        actions={<>
          <Link href="/contact" className="btn btn-sun">Contact us</Link>
          <Link href="/events" className="btn btn-light">See events</Link>
        </>}
      >
        If you are organising a market, a farm visit or a food event that fits Naadu Nalam, tell us and we will add it here.
      </ClosingBand>
    </>
  );
}
