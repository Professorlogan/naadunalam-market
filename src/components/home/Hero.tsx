"use client";
import Link from "next/link";
import { motion, useMotionValue, useScroll, useSpring, useTransform } from "motion/react";
import { useRef, type PointerEvent } from "react";
import { EASE, SplitWords } from "../motion";

/**
 * Home hero, a farmer in front of the logo's sun, closed by one soft curve. On load the sun rises, she steps up, and the headline rises word by word;
 * afterwards the scene follows the pointer slightly and drifts apart in layers as the page scrolls.
 */
export default function Hero() {
  const ref = useRef<HTMLElement>(null);
  const mx = useSpring(useMotionValue(0), { stiffness: 60, damping: 16 });
  const my = useSpring(useMotionValue(0), { stiffness: 60, damping: 16 });
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const sunScroll = useTransform(scrollYProgress, [0, 1], [0, 140]);
  const farmerScroll = useTransform(scrollYProgress, [0, 1], [0, 50]);
  const textScroll = useTransform(scrollYProgress, [0, 1], [0, -40]);
  const sunX = useTransform(mx, (v) => v * -22);
  const sunY = useTransform([my, sunScroll], ([p, s]) => (p as number) * -14 + (s as number));
  const farmerX = useTransform(mx, (v) => v * 12);
  const farmerY = useTransform([my, farmerScroll], ([p, s]) => (p as number) * 6 + (s as number));
  const move = (e: PointerEvent<HTMLElement>) => {
    if (e.pointerType !== "mouse") return;
    const r = e.currentTarget.getBoundingClientRect();
    mx.set((e.clientX - r.left) / r.width - 0.5);
    my.set((e.clientY - r.top) / r.height - 0.5);
  };

  return (
    <section ref={ref} aria-labelledby="home-title" onPointerMove={move} onPointerLeave={() => { mx.set(0); my.set(0); }} className="relative isolate overflow-hidden bg-[var(--hero-bg)]">
      <div className="wrap relative grid md:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)] md:gap-6 lg:gap-10">
        <motion.div style={{ y: textScroll }} className="relative z-30 pt-9 sm:pt-12 md:pb-28 md:pt-14 lg:pb-36 lg:pt-20">
          <motion.p lang="ta" initial={{ opacity: 0, x: -24 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.7, ease: EASE }}
            className="ta font-display text-lg font-semibold text-leaf sm:text-xl lg:text-2xl">
            நம்ம மண்ணின் சுவை. நம்ம மக்களின் நலம்.
          </motion.p>
          <h1 id="home-title" className="t-h1 mt-3 max-w-[15ch] font-bold">
            <SplitWords text="Naturally grown food, straight from local sellers" delay={0.15} />
          </h1>
          <motion.p initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, ease: EASE, delay: 0.75 }}
            className="mt-4 max-w-xl text-lg text-ink/85 sm:text-lg lg:mt-5">
            Naadu Nalam brings independent growers and small producers together in one marketplace — native rice,
            millets, pulses, cold-pressed oils, ground masalas and pure honey.
          </motion.p>
          <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, ease: EASE, delay: 0.9 }} className="mt-6 flex flex-wrap gap-3 lg:mt-8">
            <Link href="/shop" className="btn btn-primary">Shop the marketplace</Link>
            <Link href="#categories" className="btn btn-ghost bg-white/70">Explore categories</Link>
          </motion.div>
        </motion.div>

        {/* Scene: sun, birds, then farmer; the horizon below is drawn over her feet so she stands on the soil. */}
        <div className="relative z-10 mx-auto mt-5 h-[20rem] w-full max-w-[26rem] sm:h-[28rem] md:mt-0 md:h-auto md:min-h-[30rem] md:max-w-none md:self-stretch">
          <motion.div aria-hidden style={{ x: sunX, y: sunY }} className="absolute bottom-[21%] left-1/2 aspect-square h-[66%] -translate-x-1/2 md:bottom-[26%] md:h-auto md:w-[94%] lg:bottom-[24%] lg:h-[62%] lg:w-auto">
            <motion.span initial={{ y: "70%", scale: 0.7, opacity: 0 }} animate={{ y: 0, scale: 1, opacity: 1 }} transition={{ type: "spring", stiffness: 42, damping: 12, delay: 0.1 }} className="absolute inset-0 block">
              <span className="nn-pulse-ring absolute inset-0 rounded-full bg-sun/50" />
              <span className="absolute inset-0 rounded-full bg-sun shadow-[0_0_0_1.6rem_rgb(249_181_44/0.22)] lg:shadow-[0_0_0_2.4rem_rgb(249_181_44/0.22)]" />
            </motion.span>
          </motion.div>
          <motion.div style={{ x: farmerX, y: farmerY }} className="absolute inset-0">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <motion.img
              initial={{ y: 70, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 1, ease: EASE, delay: 0.35 }}
              src="/img/nn-hero-cutout-clean-800.webp"
              alt="A farmer in a straw hat holding a woven basket of freshly harvested vegetables"
              width={800} height={1200} fetchPriority="high"
              className="absolute bottom-0 left-1/2 h-[106%] w-auto max-w-none -translate-x-1/2 md:h-auto md:w-[116%] lg:h-[104%] lg:w-auto"
            />
          </motion.div>
        </div>
      </div>

      {/* A single soft curve closes the hero; the farmer is cropped by it. */}
      <svg aria-hidden viewBox="0 0 1440 90" preserveAspectRatio="none" className="pointer-events-none absolute inset-x-0 bottom-[-1px] z-20 h-10 w-full sm:h-14 lg:h-20">
        <path d="M0 90 V58 Q720 -34 1440 58 V90 Z" className="fill-white" />
      </svg>
    </section>
  );
}
