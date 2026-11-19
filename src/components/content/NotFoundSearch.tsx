"use client";
import { motion } from "motion/react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Search } from "lucide-react";

/** Search box for the 404 page: sends the visitor to /search?q=… */
export default function NotFoundSearch() {
  const router = useRouter();
  const [q, setQ] = useState("");
  const [focused, setFocused] = useState(false);
  return (
    <form
      role="search"
      onSubmit={(e) => { e.preventDefault(); const term = q.trim(); if (term) router.push(`/search?q=${encodeURIComponent(term)}`); }}
      className="flex max-w-xl flex-col gap-2 sm:flex-row"
    >
      <label htmlFor="nf-search" className="sr-only">Search products</label>
      {/* The field lifts a little and a five-colour underline draws while it has focus. */}
      <motion.div className="relative sm:flex-1" animate={{ scale: focused ? 1.02 : 1, y: focused ? -2 : 0 }} transition={{ type: "spring", stiffness: 380, damping: 26 }}>
        <motion.span aria-hidden className="pointer-events-none absolute left-4 top-1/2 -mt-[9px] text-leaf" animate={focused ? { rotate: [0, -18, 12, 0], scale: [1, 1.2, 1] } : { rotate: 0, scale: 1 }} transition={{ duration: 0.5 }}>
          <Search size={18} />
        </motion.span>
        <input id="nf-search" name="q" type="search" required value={q} onChange={(e) => setQ(e.target.value)} onFocus={() => setFocused(true)} onBlur={() => setFocused(false)}
          placeholder="Search for rice, millets, oils…" className="field !rounded-full !pl-11" />
        <motion.span aria-hidden className="pointer-events-none absolute inset-x-6 -bottom-1.5 h-1 origin-left rounded-full" initial={false} animate={{ scaleX: focused ? 1 : 0, opacity: focused ? 1 : 0 }}
          transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }} style={{ background: "linear-gradient(90deg,#0f804a 0 30%,#6b3a2c 30% 50%,#0c8fc7 50% 80%,#f9b52c 80% 100%)" }} />
      </motion.div>
      <button type="submit" className="btn btn-primary"><Search aria-hidden size={18} />Search</button>
    </form>
  );
}
