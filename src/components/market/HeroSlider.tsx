"use client";
import Link from "next/link";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useCallback, useEffect, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

const slides = [
  {
    bg: "bg-mint", accent: "text-leaf", img: "/img/m/hero-packs.webp",
    alt: "Naadu Nalam pouches of Karuppu Kavuni rice, Mappillai Samba rice, pearl millet and toor dal with bowls of each grain",
    eyebrow: "From the Naadu Nalam store", title: "Heritage grains, packed with care",
    text: "Karuppu Kavuni, Mappillai Samba, pearl millet, toor dal and more, cleaned and packed by Naadu Nalam.",
    cta: "Shop the Naadu Nalam store", href: "/store/naadunalam",
  },
  {
    bg: "bg-mint", accent: "text-leaf", img: "/img/m/hero-rice.webp",
    alt: "Black Karuppu Kavuni, red Mappillai Samba and white Thooyamalli rice in terracotta bowls on a banana leaf",
    eyebrow: "Heritage rice of Tamil Nadu", title: "Rice the way our grandparents ate it",
    text: "Karuppu Kavuni, Mappillai Samba, Thooyamalli and more native varieties, sold by the people who grow them.",
    cta: "Shop traditional rice", href: "/product-category/rice-grains",
  },
  {
    bg: "bg-butter", accent: "text-soil", img: "/img/m/hero-oils.webp",
    alt: "Bottles of gingelly, groundnut and coconut oil beside a wooden oil press with sesame, groundnuts and coconut",
    eyebrow: "Wood-pressed oils and ghee", title: "Pressed slowly, the old way",
    text: "Gingelly, groundnut and coconut oil from the wooden chekku, plus traditional ghee.",
    cta: "Shop ghee and oils", href: "/product-category/oil-vinegers",
  },
  {
    bg: "bg-peach", accent: "text-soil", img: "/img/m/hero-sweet.webp",
    alt: "Palm jaggery blocks, palm sugar crystals in a brass bowl and jaggery balls on a palm-leaf mat",
    eyebrow: "Natural sweeteners", title: "Sweetness straight from the palm",
    text: "Karupatti, palm sugar crystals and country jaggery for your kitchen, with no refined sugar.",
    cta: "Shop sweeteners", href: "/product-category/natural-sweeteners",
  },
];

export default function HeroSlider() {
  const [i, setI] = useState(0);
  const [paused, setPaused] = useState(false);
  const reduce = useReducedMotion();
  const go = useCallback((d: number) => setI((n) => (n + d + slides.length) % slides.length), []);
  useEffect(() => {
    if (paused || reduce) return;
    const t = setInterval(() => go(1), 6500);
    return () => clearInterval(t);
  }, [paused, reduce, go]);
  const s = slides[i];
  return (
    <section aria-roledescription="carousel" aria-label="Featured collections" className="wrap pt-4 sm:pt-6"
      onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)} onFocusCapture={() => setPaused(true)} onBlurCapture={() => setPaused(false)}>
      <h1 className="sr-only">Naadu Nalam: traditional food from Tamil Nadu sellers</h1>
      <div className={`relative overflow-hidden rounded-[2rem] transition-colors duration-700 ${s.bg}`}>
        <AnimatePresence mode="popLayout" initial={false}>
          <motion.div key={i} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.6 }}
            className="relative grid min-h-[30rem] md:min-h-[27rem] lg:min-h-[32rem]" role="group" aria-roledescription="slide" aria-label={`${i + 1} of ${slides.length}`}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <motion.img src={s.img} alt={s.alt} width={1600} height={900} fetchPriority={i === 0 ? "high" : "auto"}
              initial={{ scale: 1.06 }} animate={{ scale: 1 }} transition={{ duration: 1.4, ease: [0.19, 1, 0.22, 1] }}
              className="absolute inset-x-0 bottom-0 h-[58%] w-full object-cover object-[72%_50%] md:inset-0 md:h-full" />
            <div className="relative z-10 flex flex-col justify-start px-6 pb-8 pt-8 sm:px-10 md:max-w-[52%] md:justify-center md:py-12 lg:px-14">
              <motion.p initial={{ y: 16, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.15, duration: 0.6 }} className={`text-sm font-bold uppercase tracking-[0.12em] ${s.accent}`}>{s.eyebrow}</motion.p>
              <motion.h2 initial={{ y: 22, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.25, duration: 0.7 }} className="mt-3 text-[2.1rem] leading-[1.05] sm:text-5xl lg:text-[3.6rem]">{s.title}</motion.h2>
              <motion.p initial={{ y: 22, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.35, duration: 0.7 }} className="mt-4 max-w-md text-base text-ink/75 sm:text-lg">{s.text}</motion.p>
              <motion.div initial={{ y: 22, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.45, duration: 0.7 }} className="mt-6">
                <Link href={s.href} className="btn btn-primary">{s.cta} <ChevronRight size={18} /></Link>
              </motion.div>
            </div>
          </motion.div>
        </AnimatePresence>
        <button type="button" aria-label="Previous slide" onClick={() => go(-1)} className="absolute left-3 top-1/2 z-20 hidden h-11 w-11 -translate-y-1/2 place-items-center rounded-full bg-white text-ink shadow-md transition hover:bg-forest hover:text-white md:grid"><ChevronLeft size={20} /></button>
        <button type="button" aria-label="Next slide" onClick={() => go(1)} className="absolute right-3 top-1/2 z-20 hidden h-11 w-11 -translate-y-1/2 place-items-center rounded-full bg-white text-ink shadow-md transition hover:bg-forest hover:text-white md:grid"><ChevronRight size={20} /></button>
        <div className="absolute bottom-4 left-1/2 z-20 flex -translate-x-1/2 gap-2 rounded-full bg-white/80 px-3 py-2 backdrop-blur">
          {slides.map((sl, n) => (
            <button key={sl.href} type="button" aria-label={`Show slide ${n + 1}: ${sl.eyebrow}`} aria-current={n === i} onClick={() => setI(n)}
              className={`h-2.5 rounded-full transition-all duration-300 ${n === i ? "w-7 bg-forest" : "w-2.5 bg-forest/30 hover:bg-forest/60"}`} />
          ))}
        </div>
      </div>
    </section>
  );
}
