import type { Metadata } from "next";
import Link from "next/link";
import NewsletterForm from "../../components/NewsletterForm";
import PageHero from "../../components/PageHero";
import LeafList from "../../components/content/LeafList";
import { SubscribeMoment } from "../../components/content/fx";
import { Reveal } from "../../components/motion";

export const metadata: Metadata = {
  title: "Newsletter",
  description: "Subscribe to the Naadu Nalam newsletter for marketplace updates, offers and stories from our farmers.",
};

export default function NewsletterPage() {
  return (
    <>
      <PageHero title="Newsletter" intro="Get marketplace updates, offers and stories from our farmers." />
      <section className="wrap grid gap-8 pb-4 pt-10 sm:pb-8 sm:pt-14 md:grid-cols-2 md:gap-14">
        <div>
          <Reveal><h2 className="text-2xl font-bold sm:text-3xl">What subscribers get</h2></Reveal>
          <LeafList className="mt-5 text-lg" items={[
            <><strong className="text-forest-deep">News and updates</strong> from the marketplace</>,
            <><strong className="text-forest-deep">Offers</strong> on products in the shop</>,
            <><strong className="text-forest-deep">Stories from our farmers</strong></>,
          ]} />
        </div>
        <Reveal delay={0.15} scale={0.97} className="rounded-[2rem] bg-butter p-6 sm:p-8">
          <h2 className="text-2xl font-bold">Subscribe by email</h2>
          <p className="mb-5 mt-2 text-ink/75">Enter your email address to join the list.</p>
          {/* On a valid submit a drawn check plays beside the form's confirmation. */}
          <div className="[&_.btn]:!bg-forest [&_.btn]:!text-white [&_.btn:hover]:!bg-leaf [&_input]:bg-white"><SubscribeMoment><NewsletterForm /></SubscribeMoment></div>
          <p className="mt-4 text-[15px] text-ink/75">
            How we look after your details is set out in our <Link href="/privacy-policy" className="link">Privacy Policy</Link>.
          </p>
        </Reveal>
      </section>
    </>
  );
}
