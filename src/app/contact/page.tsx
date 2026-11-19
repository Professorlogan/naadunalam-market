import type { Metadata } from "next";
import { Clock, Mail, MapPin, MessageCircle, Phone } from "lucide-react";
import PageHero from "../../components/PageHero";
import ContactForm from "../../components/content/ContactForm";
import { PulseOnce } from "../../components/content/fx";
import { Reveal, Stagger, StaggerItem } from "../../components/motion";
import { site } from "../../lib/data";

export const metadata: Metadata = {
  title: "Contact us",
  description: "Questions about orders, products or selling on Naadu Nalam? Call, message on Telegram or email the team in Chennai, Monday to Saturday, 9:00 AM to 6:00 PM.",
};

const mapsUrl = "https://maps.google.com/?q=Chennai,+Tamil+Nadu+600001,+India";
const row = "flex min-h-11 items-center gap-3 py-1 underline-offset-4 hover:underline";
const disc = "grid h-12 w-12 shrink-0 place-items-center rounded-full text-forest";

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
        <Reveal x={-48} y={0} className="flex flex-col gap-4">
          <div className="rounded-[1.5rem] bg-mint p-6 sm:p-8">
            <h2 className="text-3xl font-bold text-forest-deep">Get in touch</h2>
            <p className="mt-3 text-ink/75">
              Visit our store base in Chennai, or write to us anytime. We typically reply within one business day.
            </p>
            <Stagger as="ul" gap={0.1} delay={0.3} className="mt-5 space-y-2 text-lg font-semibold text-forest-deep">
              <StaggerItem as="li" y={14}><a href={site.phoneHref} className={row}><span className={`${disc} bg-butter`}><Phone aria-hidden size={20} /></span>{site.phone}</a></StaggerItem>
              <StaggerItem as="li" y={14}><a href={`mailto:${site.email}`} className={`${row} break-all`}><span className={`${disc} bg-peach`}><Mail aria-hidden size={20} /></span>{site.email}</a></StaggerItem>
              <StaggerItem as="li" y={14}>
                <a href={mapsUrl} target="_blank" rel="noopener noreferrer" className={row}>
                  <span className={`${disc} bg-aqua`}><MapPin aria-hidden size={20} /></span>
                  <span>{site.address}<span className="sr-only"> (opens Google Maps in a new tab)</span></span>
                </a>
              </StaggerItem>
            </Stagger>
            {/* One gentle pulse after the card has settled, then it stays still. */}
            <div className="mt-6 flex">
            <PulseOnce>
              <a href={site.whatsapp} target="_blank" rel="noopener noreferrer" className="btn btn-primary">
                <MessageCircle aria-hidden size={20} />Chat with us on Telegram<span className="sr-only"> (opens in a new tab)</span>
              </a>
            </PulseOnce>
            </div>
          </div>
          {/* On wide screens the cards are as tall as the form beside them. */}
          <div className="flex items-start gap-4 rounded-[1.5rem] border border-mist bg-white p-6 sm:p-8 lg:flex-1">
            <span className={`${disc} bg-mint`}><Clock aria-hidden size={20} /></span>
            <div className="min-w-0 flex-1">
              <h3 className="text-xl font-bold">Business hours</h3>
              <dl className="mt-3 grid gap-x-6 gap-y-0.5 sm:grid-cols-[auto_1fr] sm:gap-y-1">
                <dt className="text-muted">Monday to Saturday</dt><dd className="mb-2 font-semibold text-forest-deep sm:mb-0">9:00 AM – 6:00 PM</dd>
                <dt className="text-muted">Sunday</dt><dd className="font-semibold text-forest-deep">Closed</dd>
              </dl>
            </div>
          </div>
        </Reveal>

        <Reveal x={48} y={0} delay={0.1} className="rounded-[1.5rem] border border-mist bg-white p-6 shadow-[0_18px_40px_-28px_rgb(23_39_30/0.35)] sm:p-8">
          <h2 className="text-3xl font-bold">Send a message</h2>
          <p className="mb-6 mt-2 text-muted">Tell us how we can help and we will respond by email.</p>
          <ContactForm />
        </Reveal>
      </section>
      </div>

      {/* -mb-10 cancels the page's default space before the footer, so no empty band follows this section. */}
      <section className="wrap pb-4">
        <div className="flex flex-col gap-5 rounded-[2rem] bg-butter px-6 py-10 sm:px-10 sm:py-12 md:flex-row md:items-center md:justify-between">
          <Reveal>
            <h2 className="text-3xl font-bold">Our location</h2>
            <p className="mt-2 text-ink/75">Naadu Nalam is based in Chennai, Tamil Nadu.</p>
            <address className="mt-3 font-display text-xl font-semibold not-italic text-forest-deep">{site.address}</address>
          </Reveal>
          <Reveal delay={0.15} className="shrink-0 self-start md:self-auto">
            <a href={mapsUrl} target="_blank" rel="noopener noreferrer" className="btn btn-primary">
              <MapPin aria-hidden size={20} />Open in Google Maps<span className="sr-only"> (new tab)</span>
            </a>
          </Reveal>
        </div>
      </section>
    </>
  );
}
