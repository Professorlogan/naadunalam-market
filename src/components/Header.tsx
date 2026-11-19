"use client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useId, useMemo, useRef, useState } from "react";
import { ChevronDown, ChevronLeft, ChevronRight, Heart, Menu, Phone, Search, ShoppingCart, UserRound, X } from "lucide-react";
import { categories, products, site } from "../lib/data";
import { inr } from "../lib/format";
import { useStore } from "../lib/store";
import { useFocusTrap } from "./motion/useFocusTrap";
import { communityNav, mainNav } from "./nav";

function SearchBox({ onDone }: { onDone?: () => void }) {
  const router = useRouter();
  const id = useId();
  const [q, setQ] = useState("");
  const [open, setOpen] = useState(false);
  const box = useRef<HTMLFormElement>(null);
  const hits = useMemo(() => {
    const t = q.trim().toLowerCase();
    if (t.length < 2) return [];
    return products.filter((p) => p.name.toLowerCase().includes(t) || p.nameTa.includes(q.trim())).slice(0, 6);
  }, [q]);
  useEffect(() => {
    const close = (e: MouseEvent) => { if (!box.current?.contains(e.target as Node)) setOpen(false); };
    document.addEventListener("mousedown", close);
    return () => document.removeEventListener("mousedown", close);
  }, []);
  const go = (href: string) => { setOpen(false); setQ(""); onDone?.(); router.push(href); };
  return (
    <form ref={box} role="search" className="relative w-full" onSubmit={(e) => { e.preventDefault(); if (q.trim()) go(`/search?q=${encodeURIComponent(q.trim())}`); }}>
      <label htmlFor={id} className="sr-only">Search products</label>
      <input id={id} type="search" value={q} autoComplete="off" placeholder="Search rice, millets, oils…"
        onChange={(e) => { setQ(e.target.value); setOpen(true); }} onFocus={() => setOpen(true)}
        className="h-12 w-full rounded-full border-[1.5px] border-mist bg-sky pl-5 pr-14 text-ink placeholder:text-muted focus:border-leaf focus:bg-white focus:outline-none" />
      <button type="submit" aria-label="Search" className="absolute right-1 top-1 grid h-10 w-10 place-items-center rounded-full bg-forest text-white hover:bg-leaf"><Search size={18} /></button>
      <AnimatePresence>
      {open && hits.length > 0 && (
        <motion.ul initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }} transition={{ duration: 0.18 }} className="absolute left-0 right-0 top-14 z-50 overflow-hidden rounded-2xl border border-mist bg-white shadow-lift">
          {hits.map((p) => (
            <li key={p.id}>
              <button type="button" onClick={() => go(`/product/${p.slug}`)} className="flex w-full items-center gap-3 px-3 py-2 text-left hover:bg-sky">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={p.images[0]?.src} alt="" width={44} height={44} className="h-11 w-11 rounded-lg object-cover" />
                <span className="min-w-0 flex-1"><span className="block truncate font-semibold">{p.name}</span><span lang="ta" className="ta block truncate text-sm text-leaf">{p.nameTa}</span></span>
                <span className="font-semibold text-forest">{inr(p.price)}</span>
              </button>
            </li>
          ))}
          <li><button type="submit" className="w-full bg-sky px-4 py-2.5 text-left font-semibold text-forest hover:bg-mist">See all results for “{q.trim()}”</button></li>
        </motion.ul>
      )}
      </AnimatePresence>
    </form>
  );
}

function Dropdown({ label, children, wide }: { label: string; children: React.ReactNode; wide?: boolean }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const btn = useRef<HTMLButtonElement>(null);
  const pathname = usePathname();
  // eslint-disable-next-line react-hooks/set-state-in-effect -- close on navigation
  useEffect(() => setOpen(false), [pathname]);
  useEffect(() => {
    const close = (e: MouseEvent | KeyboardEvent) => {
      if (e instanceof KeyboardEvent) {
        if (e.key !== "Escape") return;
        if (ref.current?.contains(document.activeElement)) btn.current?.focus();
        setOpen(false);
      } else if (!ref.current?.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", close); document.addEventListener("keydown", close);
    return () => { document.removeEventListener("mousedown", close); document.removeEventListener("keydown", close); };
  }, []);
  return (
    <div ref={ref} className="relative">
      <button ref={btn} type="button" aria-expanded={open} onClick={() => setOpen(!open)} className="nn-navlink flex h-12 items-center gap-1 whitespace-nowrap px-2 text-[15px] font-display font-semibold text-ink lg:px-3 lg:text-base hover:text-leaf">
        {label} <ChevronDown size={16} className={open ? "rotate-180 transition-transform" : "transition-transform"} />
      </button>
      <AnimatePresence>
        {open && (
          <motion.div initial={{ opacity: 0, y: -10, scale: 0.98 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: -8, scale: 0.98 }} transition={{ duration: 0.2 }}
            className={`absolute left-1/2 top-12 z-40 -translate-x-1/2 origin-top-left rounded-2xl border border-mist bg-white p-3 text-ink shadow-lift ${wide ? "w-[min(44rem,90vw)]" : "w-64"}`}>{children}</motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

const notes = [
  "Flat ₹50 delivery across Tamil Nadu",
  "Cash on Delivery on every order",
  "Heritage rice, millets and cold-pressed oils from Tamil Nadu sellers",
  "Grow or make food? Open your own store on Naadu Nalam",
];

function NoteBar() {
  const [i, setI] = useState(0);
  const [paused, setPaused] = useState(false);
  useEffect(() => {
    if (paused) return;
    const t = setInterval(() => setI((n) => (n + 1) % notes.length), 5000);
    return () => clearInterval(t);
  }, [paused]);
  const step = (d: number) => setI((n) => (n + d + notes.length) % notes.length);
  return (
    <div className="bg-forest text-white" onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)}>
      <div className="wrap flex h-10 items-center justify-center gap-3 text-sm font-medium">
        <button type="button" aria-label="Previous message" onClick={() => step(-1)} className="grid h-8 w-8 place-items-center rounded-full hover:bg-white/15"><ChevronLeft size={16} /></button>
        <div className="relative h-6 min-w-0 flex-1 overflow-hidden text-center sm:max-w-xl" aria-live="polite">
          <AnimatePresence mode="wait" initial={false}>
            <motion.p key={i} initial={{ y: 14, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: -14, opacity: 0 }} transition={{ duration: 0.3 }} className="truncate leading-6">
              {i === 3 ? <Link href="/vendor-login" className="underline-offset-2 hover:underline">{notes[i]}</Link> : notes[i]}
            </motion.p>
          </AnimatePresence>
        </div>
        <button type="button" aria-label="Next message" onClick={() => step(1)} className="grid h-8 w-8 place-items-center rounded-full hover:bg-white/15"><ChevronRight size={16} /></button>
      </div>
    </div>
  );
}

function Badge({ n }: { n: number }) {
  return <motion.span key={n} initial={{ scale: 0.4 }} animate={{ scale: 1 }} transition={{ type: "spring", stiffness: 520, damping: 14 }} className="absolute -right-0.5 -top-0.5 grid h-[18px] min-w-[18px] place-items-center rounded-full bg-leaf px-1 text-[11px] font-bold text-white">{n}</motion.span>;
}

export default function Header() {
  const { count, wishlist, setDrawerOpen, ready } = useStore();
  const [menu, setMenu] = useState(false);
  const [search, setSearch] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const drawer = useRef<HTMLDivElement>(null);
  useFocusTrap(drawer, menu, () => setMenu(false));
  useEffect(() => {
    const on = () => setScrolled(window.scrollY > 40);
    on();
    window.addEventListener("scroll", on, { passive: true });
    return () => window.removeEventListener("scroll", on);
  }, []);
  const pathname = usePathname();
  // eslint-disable-next-line react-hooks/set-state-in-effect -- close on navigation
  useEffect(() => { setMenu(false); setSearch(false); }, [pathname]);
  useEffect(() => { document.body.style.overflow = menu ? "hidden" : ""; }, [menu]);
  const active = (href: string) => href === "/" ? pathname === "/" : pathname === href || pathname.startsWith(href + "/");
  const navCls = (on: boolean) => `nn-navlink flex h-12 items-center whitespace-nowrap px-2 text-[15px] font-display font-semibold lg:px-3 lg:text-base hover:text-leaf ${on ? "text-leaf nn-navlink-on" : "text-ink"}`;
  const icon = "relative grid h-11 w-11 place-items-center rounded-full text-ink transition-colors hover:bg-mint hover:text-forest";

  return (
    <>
    <NoteBar />
    <header className={`sticky top-0 z-30 bg-white/95 backdrop-blur transition-shadow ${scrolled ? "shadow-[0_6px_24px_-16px_rgb(23_39_30/0.35)]" : "shadow-[0_1px_0_var(--color-mist)]"}`}>
      <a href="#content" className="sr-only focus:not-sr-only focus:absolute focus:left-3 focus:top-3 focus:z-50 focus:rounded-full focus:bg-sun focus:px-4 focus:py-2">Skip to content</a>
      <div className="wrap flex h-[68px] items-center gap-2 md:h-[76px] md:gap-6">
        <button type="button" aria-label="Open menu" aria-expanded={menu} onClick={() => setMenu(true)} className={`${icon} md:hidden`}><Menu /></button>
        <Link href="/" className="flex shrink-0 items-center gap-2.5" aria-label="Naadu Nalam home">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/img/logo.webp" alt="" width={384} height={372} className="h-11 w-auto md:h-14" />
          <span className="hidden leading-none sm:block">
            <span className="block font-display text-[22px] font-bold text-forest">Naadu Nalam</span>
            <span lang="ta" className="ta block font-display text-[13px] font-semibold text-leaf">நாடு நலம்</span>
          </span>
        </Link>
        <nav aria-label="Main" className="mx-auto hidden items-center md:flex">
          <Link href="/" aria-current={active("/") ? "page" : undefined} className={navCls(active("/"))}>Home</Link>
          <Dropdown label="Shop" wide>
            <ul className="grid grid-cols-2 gap-1 lg:grid-cols-3">
              {categories.map((c) => (
                <li key={c.slug}>
                  <Link href={`/product-category/${c.slug}`} className="flex items-center gap-3 rounded-xl p-2 hover:bg-mint">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={c.image} alt="" width={44} height={44} className="h-11 w-11 rounded-full object-cover" />
                    <span><span className="block font-semibold leading-tight">{c.name}</span><span lang="ta" className="ta block text-sm text-leaf">{c.nameTa}</span></span>
                  </Link>
                </li>
              ))}
            </ul>
            <Link href="/shop" className="mt-2 block rounded-xl bg-mint px-3 py-2.5 font-semibold text-forest hover:bg-leaf hover:text-white">See all {products.length} products</Link>
          </Dropdown>
          {[{ label: "Sellers", href: "/store-listing" }, { label: "About us", href: "/about-us" }, { label: "Blog", href: "/blog" }].map((n) => (
            <Link key={n.href} href={n.href} aria-current={active(n.href) ? "page" : undefined} className={navCls(active(n.href))}>{n.label}</Link>
          ))}
          <Dropdown label="More">
            <ul>{[{ label: "How ordering works", href: "/services" }, ...communityNav].map((n) => <li key={n.href}><Link href={n.href} className="block rounded-lg px-3 py-2 hover:bg-mint">{n.label}</Link></li>)}</ul>
          </Dropdown>
          <Link href="/contact" aria-current={active("/contact") ? "page" : undefined} className={navCls(active("/contact"))}>Contact us</Link>
        </nav>
        <div className="ml-auto flex items-center gap-0.5 md:ml-0">
          <button type="button" aria-label={search ? "Close search" : "Search products"} aria-expanded={search} onClick={() => setSearch(!search)} className={icon}>{search ? <X size={21} /> : <Search size={21} />}</button>
          <Link href="/my-account" aria-label="My account" className={`${icon} hidden sm:grid`}><UserRound size={21} /></Link>
          <Link href="/wishlist" aria-label={`Wishlist, ${ready ? wishlist.length : 0} items`} className={icon}>
            <Heart size={21} />{ready && <Badge n={wishlist.length} />}
          </Link>
          <button type="button" onClick={() => setDrawerOpen(true)} aria-label={`Open basket, ${ready ? count : 0} items`} className={icon}>
            <ShoppingCart size={21} />{ready && <Badge n={count} />}
          </button>
        </div>
      </div>
      <AnimatePresence initial={false}>
        {search && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.22 }} className="border-t border-mist bg-white">
            <div className="wrap max-w-3xl py-4"><SearchBox onDone={() => setSearch(false)} /></div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
      {menu && (
        <div ref={drawer} className="fixed inset-0 z-50 md:hidden" role="dialog" aria-modal="true" aria-label="Menu">
          <motion.button initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }} type="button" tabIndex={-1} aria-label="Close menu" className="absolute inset-0 bg-ink/50" onClick={() => setMenu(false)} />
          <motion.div initial={{ x: "-100%" }} animate={{ x: 0 }} exit={{ x: "-100%" }} transition={{ type: "spring", stiffness: 360, damping: 36 }} className="absolute inset-y-0 left-0 flex w-[min(22rem,88vw)] flex-col overflow-y-auto bg-white">
            <div className="flex items-center justify-between border-b border-mist px-4 py-3">
              <span className="font-display text-xl font-bold text-forest">Menu</span>
              <button type="button" aria-label="Close menu" onClick={() => setMenu(false)} className="grid h-11 w-11 place-items-center rounded-full hover:bg-sky"><X /></button>
            </div>
            <div className="px-4 py-3">
              <p className="mb-1 text-sm font-semibold text-muted">Shop by category</p>
              <ul>
                <li><Link href="/shop" className="block py-2.5 font-semibold text-forest">All products</Link></li>
                {categories.map((c) => (
                  <li key={c.slug}><Link href={`/product-category/${c.slug}`} className="flex items-center gap-3 border-t border-mist py-2.5">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={c.image} alt="" width={36} height={36} className="h-9 w-9 rounded-full object-cover" />
                    <span className="flex-1">{c.name} <span lang="ta" className="ta block text-sm text-leaf">{c.nameTa}</span></span><span className="text-sm text-muted">{c.count}</span></Link></li>
                ))}
              </ul>
              <p className="mb-1 mt-5 text-sm font-semibold text-muted">Naadu Nalam</p>
              <ul>{[...mainNav.slice(1), ...communityNav, { label: "Contact us", href: "/contact" }, { label: "Sell on Naadu Nalam", href: "/vendor-login" }, { label: "My account", href: "/my-account" }].map((n) => <li key={n.href}><Link href={n.href} className="block border-t border-mist py-2.5">{n.label}</Link></li>)}</ul>
              <a href={site.phoneHref} className="btn btn-ghost mt-5 w-full"><Phone size={18} /> Call {site.phone}</a>
            </div>
          </motion.div>
        </div>
      )}
      </AnimatePresence>
    </header>
    </>
  );
}
