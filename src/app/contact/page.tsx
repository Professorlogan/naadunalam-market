import type { Metadata } from "next";
import { Clock, Mail, MapPin, MessageCircle, Phone } from "lucide-react";
import PageHero from "../../components/PageHero";
import ContactForm from "../../components/content/ContactForm";
import { PulseOnce } from "../../components/content/fx";
import { Reveal, Stagger, StaggerItem } from "../../components/motion";
import { site } from "../../lib/data";

export const metadata: Metadata = {
  title: "Contact us",
  description: "Questions about orders, products or selling on Naadu Nalam? Call, WhatsApp or email the team in Chennai, Monday to Saturday, 9:00 AM to 6:00 PM.",
};

const mapsUrl = "https://maps.google.com/?q=Chennai,+Tamil+Nadu+600001,+India";
const row = "flex min-h-11 items-center gap-3 py-1.5 underline-offset-4 hover:underline";

export default function ContactPage() {
  return (
    <>
      <PageHero
        title="Contact us"
        intro="Questions about orders, products, or partnerships? Reach the Naadu Nalam team and we will get back to you soon."
      />

      {/* The two cards arrive from opposite sides; the clip keeps the slide from widening the page. */}
      <div className="overflow-x-clip">
      <section className="wrap grid gap-8 py-10 sm:py-14 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:gap-10">
        <Reveal x={-48} y={0} className="flex flex-col rounded-[1.75rem] bg-forest p-6 text-white sm:p-8">
          <h2 className="text-3xl font-bold !text-white">Get in touch</h2>
          <p className="mt-3 text-white/85">
            Visit our store base in Chennai, or write to us anytime. We typically reply within one business day.
          </p>
          <Stagger as="ul" gap={0.1} delay={0.3} className="mt-5 text-lg font-semibold">
            <StaggerItem as="li" y={14}><a href={site.phoneHref} className={row}><Phone aria-hidden size={20} className="shrink-0 text-sun" />{site.phone}</a></StaggerItem>
            <StaggerItem as="li" y={14}><a href={`mailto:${site.email}`} className={`${row} break-all`}><Mail aria-hidden size={20} className="shrink-0 text-sun" />{site.email}</a></StaggerItem>
            <StaggerItem as="li" y={14}>
              <a href={mapsUrl} target="_blank" rel="noopener noreferrer" className={row}>
                <MapPin aria-hidden size={20} className="shrink-0 text-sun" />
                <span>{site.address}<span className="sr-only"> (opens Google Maps in a new tab)</span></span>
              </a>
            </StaggerItem>
          </Stagger>
          {/* One gentle pulse after the card has settled, then it stays still. */}
          <div className="mt-5 flex pb-6">
          <PulseOnce>
            <a href={site.whatsapp} target="_blank" rel="noopener noreferrer" className="btn btn-sun">
              <MessageCircle aria-hidden size={20} />Chat with us on WhatsApp<span className="sr-only"> (opens in a new tab)</span>
            </a>
          </PulseOnce>
          </div>
          {/* On wide screens the card is as tall as the form beside it, and the hours sit on its floor. */}
          <div className="border-t border-white/20 pt-5 lg:mt-auto">
            <h3 className="flex items-center gap-2 text-xl font-bold !text-white"><Clock aria-hidden size={20} className="text-sun" />Business hours</h3>
            <dl className="mt-3 grid gap-x-6 gap-y-0.5 sm:grid-cols-[auto_1fr] sm:gap-y-1">
              <dt className="text-white/85">Monday to Saturday</dt><dd className="mb-2 font-semibold sm:mb-0">9:00 AM – 6:00 PM</dd>
              <dt className="text-white/85">Sunday</dt><dd className="font-semibold">Closed</dd>
            </dl>
          </div>
        </Reveal>

        <Reveal x={48} y={0} delay={0.1} className="card p-6 sm:p-8">
          <h2 className="text-3xl font-bold">Send a message</h2>
          <p className="mb-6 mt-2 text-muted">Tell us how we can help and we will respond by email.</p>
          <ContactForm />
        </Reveal>
      </section>
      </div>

      {/* -mb-10 cancels the page's default space before the footer, so no empty band follows this section. */}
      <section className="-mb-10 border-t border-mist bg-white">
        <div className="wrap flex flex-col gap-5 py-10 sm:py-12 md:flex-row md:items-center md:justify-between">
          <Reveal>
            <h2 className="text-3xl font-bold">Our location</h2>
            <p className="mt-2 text-muted">Naadu Nalam is based in Chennai, Tamil Nadu.</p>
            <address className="mt-3 font-display text-xl font-semibold not-italic text-forest-deep">{site.address}</address>
          </Reveal>
          <Reveal delay={0.15} className="shrink-0 self-start md:self-auto">
            <a href={mapsUrl} target="_blank" rel="noopener noreferrer" className="btn btn-ghost">
              <MapPin aria-hidden size={20} />Open in Google Maps<span className="sr-only"> (new tab)</span>
            </a>
          </Reveal>
        </div>
      </section>
    </>
  );
}
