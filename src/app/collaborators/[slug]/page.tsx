import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Handshake, Hourglass } from "lucide-react";
import PageHero from "@/components/PageHero";
import SectionHeading from "@/components/SectionHeading";
import EmptyState from "@/components/community/EmptyState";
import ClosingBand from "@/components/community/ClosingBand";
import { Reveal, Stagger, StaggerItem } from "@/components/motion";
import { collaborators } from "@/lib/data";

export const dynamicParams = false;
export const generateStaticParams = () => collaborators.map((c) => ({ slug: c.slug }));

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const c = collaborators.find((x) => x.slug === slug);
  if (!c) return {};
  return {
    title: c.name,
    description: `${c.name} is one of the community organisations working alongside Naadu Nalam. A full introduction is being prepared and will appear on this page.`,
  };
}

export default async function CollaboratorPage({ params }: Props) {
  const { slug } = await params;
  const c = collaborators.find((x) => x.slug === slug);
  if (!c) notFound();
  const others = collaborators.filter((x) => x.slug !== c.slug);

  return (
    <>
      <PageHero
        title={c.name}
        crumbs={[{ label: "Collaborators", href: "/collaborators" }, { label: c.name }]}
        intro={`${c.name} is one of the community organisations working alongside Naadu Nalam. A full introduction is being prepared and will appear on this page.`}
      />
      <section className="wrap grid gap-10 py-12 sm:py-16 lg:grid-cols-[minmax(0,1fr)_20rem] lg:gap-14">
        <div>
          <SectionHeading title={`About ${c.name}`} />
          <EmptyState
            icon={Hourglass}
            title="Details coming soon"
            actions={<Link href="/collaborators" className="btn btn-ghost">All collaborators</Link>}
          >
            <p>We are gathering a description, contact details and photographs for {c.name}. They will be added here as soon as they are confirmed.</p>
          </EmptyState>
        </div>
        <aside aria-labelledby="other-collaborators">
          <Reveal><h2 id="other-collaborators" className="text-2xl font-bold">Other collaborators</h2></Reveal>
          <Stagger as="ul" gap={0.08} className="mt-4 divide-y divide-mist border-y border-mist">
            {others.map((o) => (
              <StaggerItem as="li" key={o.slug} y={16}>
                  <Link href={`/collaborators/${o.slug}`} className="group flex min-h-14 items-center gap-3 py-3 font-display text-lg font-semibold text-forest-deep hover:text-leaf">
                    <Handshake aria-hidden size={20} className="shrink-0 text-leaf transition-transform duration-300 group-hover:-rotate-12 group-hover:scale-110" />
                    <span className="group-hover:underline group-hover:underline-offset-4">{o.name}</span>
                  </Link>
              </StaggerItem>
            ))}
          </Stagger>
        </aside>
      </section>
      <ClosingBand
        title="Want to know more?"
        actions={<>
          <Link href="/contact" className="btn btn-primary">Contact us</Link>
          <Link href="/collaborators" className="btn btn-ghost">All collaborators</Link>
        </>}
      >
        Questions about {c.name}, or about collaborating with Naadu Nalam? We would like to hear from you.
      </ClosingBand>
    </>
  );
}
