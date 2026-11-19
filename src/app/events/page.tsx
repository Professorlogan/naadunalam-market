import type { Metadata } from "next";
import Link from "next/link";
import { CalendarDays, CookingPot, Store, Tractor } from "lucide-react";
import PageHero from "@/components/PageHero";
import SectionHeading from "@/components/SectionHeading";
import EmptyState from "@/components/community/EmptyState";
import ClosingBand from "@/components/community/ClosingBand";
import { Pop } from "@/components/community/Motion";
import { Lift, Reveal, Stagger, StaggerItem } from "@/components/motion";

export const metadata: Metadata = {
  title: "Events",
  description: "Markets, farm visits and tastings from Naadu Nalam. Nothing is scheduled at the moment; confirmed dates, places and times will be listed on this page.",
};

const kinds = [
  { icon: Store, title: "Markets and stalls", text: "Days where you can meet the sellers behind the listings and buy from them face to face." },
  { icon: Tractor, title: "Farm and producer visits", text: "Trips to the fields, mills and oil presses our products actually come from." },
  { icon: CookingPot, title: "Tastings and kitchen sessions", text: "Short, practical sessions around traditional rice, millets, cold-pressed oils and whole spices." },
];

export default function EventsPage() {
  return (
    <>
      <PageHero
        title="Events"
        crumbs={[{ label: "Events" }]}
        intro="Markets, farm visits and gatherings that bring the people who grow our food and the people who cook it into the same room. When Naadu Nalam has something on, it will be listed here."
      />
      <section className="wrap py-12 sm:py-16">
        <SectionHeading title="Upcoming events" />
        <EmptyState
          icon={CalendarDays}
          title="Upcoming events will be announced here"
          actions={<Link href="/calendar" className="btn btn-ghost">See the year calendar</Link>}
        >
          <p>Nothing is scheduled at the moment. Once a date is confirmed, this page will carry the event, where it is, what time it starts and how to join.</p>
        </EmptyState>
      </section>
      <section className="border-y border-mist bg-white">
        <div className="wrap grid gap-8 py-12 sm:py-16 lg:grid-cols-[20rem_minmax(0,1fr)] lg:gap-14">
          <Reveal>
            <h2 className="text-3xl font-bold sm:text-4xl">The kinds of events we plan to run</h2>
            <p className="mt-3 text-muted">None of these are scheduled yet. This is what an entry on this page will look like when one is.</p>
          </Reveal>
          <Stagger as="ul" gap={0.12} className="grid gap-4">
            {kinds.map(({ icon: Icon, title, text }, i) => (
              <StaggerItem as="li" key={title}>
                <Lift className="flex h-full gap-4 rounded-[1.25rem] border border-mist bg-sky p-5 transition-shadow duration-300 hover:shadow-lift sm:gap-6 sm:p-6">
                  <Pop delay={0.15 + i * 0.12} className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-forest text-white sm:h-14 sm:w-14"><Icon size={24} /></Pop>
                  <div>
                    <h3 className="text-xl font-bold sm:text-2xl">{title}</h3>
                    <p className="mt-1 max-w-xl text-muted">{text}</p>
                    <p className="mt-2 text-sm text-muted">Not scheduled yet</p>
                  </div>
                </Lift>
              </StaggerItem>
            ))}
          </Stagger>
        </div>
      </section>
      <ClosingBand
        title="Hear about the next one"
        actions={<>
          <Link href="/contact" className="btn btn-sun">Contact us</Link>
          <Link href="/blog" className="btn btn-light">Read the blog</Link>
        </>}
      >
        Write to us and we will let you know when a date is set. In the meantime, the blog is where we write about the food itself.
      </ClosingBand>
    </>
  );
}
