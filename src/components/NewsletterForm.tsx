"use client";
import { useState } from "react";

/** Prototype: confirms on screen only. Connect to the mailing provider before launch. */
export default function NewsletterForm({ dark = false }: { dark?: boolean }) {
  const [done, setDone] = useState(false);
  if (done) return <p role="status" className={`font-semibold ${dark ? "text-sun" : "text-leaf"}`}>Thanks. You are on the list.</p>;
  return (
    <form onSubmit={(e) => { e.preventDefault(); setDone(true); }} className="flex max-w-md flex-col gap-2 sm:flex-row">
      <label htmlFor={dark ? "nl-footer" : "nl-page"} className="sr-only">Email address</label>
      <input id={dark ? "nl-footer" : "nl-page"} type="email" required placeholder="Your email address" autoComplete="email" className="field !rounded-full sm:flex-1" />
      <button type="submit" className="btn btn-sun">Subscribe</button>
    </form>
  );
}
