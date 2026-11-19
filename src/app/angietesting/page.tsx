import type { Metadata } from "next";
import Link from "next/link";
import PageHero from "../../components/PageHero";
import { Reveal } from "../../components/motion";

export const metadata: Metadata = {
  title: "Angie testing",
  description: "A test page on Naadu Nalam with no content.",
  robots: { index: false },
};

export default function AngieTestingPage() {
  return (
    <>
      <PageHero title="Angie testing" />
      <section className="wrap py-10 sm:py-14">
        <Reveal>
          <p className="text-lg">This is a test page with no content.</p>
          <Link href="/" className="btn btn-ghost mt-6">Go to the home page</Link>
        </Reveal>
      </section>
    </>
  );
}
