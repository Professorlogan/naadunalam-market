import Link from "next/link";

/** Full-width photograph with the message set in the quiet left third of the picture. */
export default function Hero() {
  return (
    <section aria-labelledby="hero-title" className="relative isolate overflow-hidden bg-sky">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src="/img/naadu-nalam-store-banner.webp" alt="Cold-pressed oils, millets, pulses and fresh vegetables on a wooden table beside a green field" width={1536} height={1024} fetchPriority="high"
        className="nn-hero-img h-64 w-full object-cover object-[78%_60%] sm:h-80 lg:absolute lg:inset-0 lg:-z-10 lg:h-full" />
      <div aria-hidden className="absolute inset-0 -z-10 hidden bg-[linear-gradient(90deg,var(--color-sky)_0%,var(--color-sky)_44%,color-mix(in_srgb,var(--color-sky)_70%,transparent)_56%,transparent_76%)] lg:block" />
      <div className="wrap py-10 sm:py-14 lg:flex lg:min-h-[38rem] lg:items-center lg:py-24">
        <div className="nn-hero-copy max-w-xl">
          <p lang="ta" className="ta text-lg font-medium text-leaf sm:text-xl">நம்ம மண்ணின் சுவை. நம்ம மக்களின் நலம்.</p>
          <h1 id="hero-title" className="t-h1 mt-4 !font-medium">Naturally grown food, straight from local sellers</h1>
          <p className="mt-6 max-w-md text-lg leading-relaxed text-ink/80">Native rice, millets, pulses, cold-pressed oils and ground masalas from independent Tamil Nadu growers, in one marketplace.</p>
          <div className="mt-8 flex flex-wrap items-center gap-x-7 gap-y-4">
            <Link href="/shop" className="btn btn-primary !min-h-[3.25rem] !px-8 text-[17px]">Shop the marketplace</Link>
            <Link href="/store-listing" className="link text-[17px] font-semibold">Meet the sellers</Link>
          </div>
        </div>
      </div>
    </section>
  );
}
