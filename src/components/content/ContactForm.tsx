"use client";
import Link from "next/link";
import { useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { EASE } from "../motion";
import { SuccessCheck } from "./fx";

const topics = ["Order", "Product", "Selling on Naadu Nalam", "Something else"];
type Values = { name: string; email: string; phone: string; topic: string; message: string; consent: boolean };
type Errors = Partial<Record<keyof Values, string>>;
const empty: Values = { name: "", email: "", phone: "", topic: "", message: "", consent: false };
const order: (keyof Values)[] = ["name", "email", "phone", "topic", "message", "consent"];

function check(v: Values): Errors {
  const e: Errors = {};
  if (v.name.trim().length < 2) e.name = "Enter your name.";
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.email.trim())) e.email = "Enter an email address like name@example.com.";
  if (v.phone.trim() && v.phone.replace(/\D/g, "").length < 10) e.phone = "Enter a phone number with at least 10 digits, or leave this empty.";
  if (!v.topic) e.topic = "Choose what your message is about.";
  if (v.message.trim().length < 10) e.message = "Tell us a little more, at least 10 characters.";
  if (!v.consent) e.consent = "Tick the box so we can use these details to reply.";
  return e;
}

// Floating label: a real <label> that rests inside the empty field and rises when the field is focused or filled.
// It follows the control in the markup so the `peer` state can move it; without CSS support it simply stays raised.
const base = "peer field block min-h-[3.75rem] pb-1.5 placeholder:text-transparent";
const control = `${base} pt-6`;
const floating =
  "pointer-events-none absolute left-[0.95rem] top-1.5 origin-left scale-[0.84] font-semibold text-forest-deep transition-[translate,scale,color] duration-200 ease-out " +
  "peer-[:placeholder-shown:not(:focus):not(:autofill)]:translate-y-[0.7rem] peer-[:placeholder-shown:not(:focus):not(:autofill)]:scale-100 " +
  "peer-[:placeholder-shown:not(:focus):not(:autofill)]:text-muted peer-focus:text-leaf";
const focusBar = "pointer-events-none absolute inset-x-3 bottom-0 h-0.5 origin-left scale-x-0 rounded-full bg-leaf transition-[scale] duration-300 ease-out peer-focus:scale-x-100";
const rise = { hidden: { opacity: 0, y: 14 }, show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: EASE } } };

/** Prototype contact form: validates in the browser and confirms on the page. Nothing is sent. */
export default function ContactForm() {
  const [v, setV] = useState<Values>(empty);
  const [errors, setErrors] = useState<Errors>({});
  const [tried, setTried] = useState(false);
  const [sent, setSent] = useState<Values | null>(null);
  const form = useRef<HTMLFormElement>(null);

  const set = <K extends keyof Values>(key: K, value: Values[K]) => {
    const next = { ...v, [key]: value };
    setV(next);
    if (tried) setErrors(check(next));
  };
  const blur = (key: keyof Values) => {
    const msg = check(v)[key];
    setErrors((e) => ({ ...e, [key]: tried || v[key] ? msg : e[key] }));
  };

  // Error text slides in under its field and out again once the field is fixed.
  const err = (key: keyof Values) => (
    <AnimatePresence initial={false}>
      {errors[key] && (
        <motion.p key="err" id={`cf-${key}-err`} className="mt-1.5 text-[15px] font-semibold text-[#a3261c]"
          initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }} transition={{ duration: 0.25, ease: EASE }}>
          {errors[key]}
        </motion.p>
      )}
    </AnimatePresence>
  );
  const aria = (key: keyof Values) => ({ "aria-invalid": errors[key] ? true : undefined, "aria-describedby": errors[key] ? `cf-${key}-err` : undefined });
  const bad = (key: keyof Values) => (errors[key] ? "!border-[#a3261c]" : "");

  return (
    <AnimatePresence mode="wait" initial={false}>
      {sent ? (
        <motion.div
          key="sent" role="status" tabIndex={-1} className="origin-top rounded-2xl border border-leaf/40 bg-sky p-6"
          initial="hidden" animate="show" exit={{ opacity: 0, y: -10, transition: { duration: 0.25 } }}
          variants={{ hidden: { opacity: 0, scale: 0.94 }, show: { opacity: 1, scale: 1, transition: { duration: 0.45, ease: EASE, staggerChildren: 0.09, delayChildren: 0.35 } } }}
        >
          <SuccessCheck size={48} />
          <motion.h3 variants={rise} className="mt-3 text-2xl font-bold">Your message passed every check, {sent.name.trim().split(/\s+/)[0]}</motion.h3>
          <motion.p variants={rise} className="mt-2">
            This site is a prototype, so the form is not connected yet and <strong>nothing has been sent</strong>. Until it is,
            please reach us by phone, Telegram or email using the details on this page.
          </motion.p>
          <motion.dl variants={rise} className="mt-4 grid gap-x-4 gap-y-1 text-base sm:grid-cols-[6rem_1fr]">
            <dt className="font-semibold text-forest-deep">Topic</dt><dd>{sent.topic}</dd>
            <dt className="font-semibold text-forest-deep">Reply to</dt><dd className="break-all">{sent.email}</dd>
            <dt className="font-semibold text-forest-deep">Message</dt><dd className="whitespace-pre-wrap">{sent.message}</dd>
          </motion.dl>
          <motion.div variants={rise}>
            <button type="button" className="btn btn-ghost mt-5" onClick={() => { setSent(null); setV(empty); setErrors({}); setTried(false); }}>
              Write another message
            </button>
          </motion.div>
        </motion.div>
      ) : (
        <motion.form
          key="form" ref={form} noValidate
          initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }}
          // On success the form folds up towards its heading before the confirmation takes its place.
          exit={{ opacity: 0, scaleY: 0.55, y: -8, transition: { duration: 0.38, ease: EASE } }}
          onSubmit={(e) => {
            e.preventDefault();
            const found = check(v);
            setTried(true);
            setErrors(found);
            const first = order.find((k) => found[k]);
            if (first) { form.current?.querySelector<HTMLElement>(first === "topic" ? "#cf-topic input" : `#cf-${first}`)?.focus(); return; }
            setSent(v);
          }}
          className="grid origin-top gap-5 sm:grid-cols-2"
        >
          <div>
            <div className="relative">
              <input id="cf-name" name="name" required placeholder=" " className={`${control} ${bad("name")}`} autoComplete="name" value={v.name} onChange={(e) => set("name", e.target.value)} onBlur={() => blur("name")} {...aria("name")} />
              <label htmlFor="cf-name" className={floating}>Your name</label>
              <span aria-hidden className={focusBar} />
            </div>
            {err("name")}
          </div>
          <div>
            <div className="relative">
              <input id="cf-email" name="email" type="email" inputMode="email" required placeholder=" " className={`${control} ${bad("email")}`} autoComplete="email" value={v.email} onChange={(e) => set("email", e.target.value)} onBlur={() => blur("email")} {...aria("email")} />
              <label htmlFor="cf-email" className={floating}>Email address</label>
              <span aria-hidden className={focusBar} />
            </div>
            {err("email")}
          </div>
          <div className="sm:col-span-2">
            <div className="relative">
              <input id="cf-phone" name="phone" type="tel" inputMode="tel" placeholder=" " className={`${control} ${bad("phone")}`} autoComplete="tel" value={v.phone} onChange={(e) => set("phone", e.target.value)} onBlur={() => blur("phone")} {...aria("phone")} />
              <label htmlFor="cf-phone" className={floating}>Phone <span className="font-normal text-muted">(optional)</span></label>
              <span aria-hidden className={focusBar} />
            </div>
            {err("phone")}
          </div>
          {/* Topic: real radio buttons shown as chips; the green pill slides to the chosen one. */}
          <fieldset id="cf-topic" role="radiogroup" aria-required className="sm:col-span-2" onBlur={(e) => { if (!e.currentTarget.contains(e.relatedTarget)) blur("topic"); }} {...aria("topic")}>
            <legend className="label">What is it about?</legend>
            <div className="flex flex-wrap gap-2">
              {topics.map((t) => {
                const on = v.topic === t;
                return (
                  <motion.label key={t} whileTap={{ scale: 0.95 }}
                    className={`relative inline-flex min-h-11 cursor-pointer items-center rounded-full border-[1.5px] bg-white px-4 font-semibold has-[:focus-visible]:outline-3 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-water ${errors.topic ? "border-[#a3261c]" : on ? "border-forest" : "border-mist hover:border-leaf"}`}>
                    <input type="radio" name="topic" value={t} required checked={on} onChange={() => set("topic", t)} className="sr-only" />
                    {on && <motion.span layoutId="cf-topic-pill" aria-hidden className="absolute -inset-px rounded-full bg-forest" transition={{ type: "spring", stiffness: 420, damping: 32 }} />}
                    <span className={`relative transition-colors duration-200 ${on ? "text-white" : "text-forest-deep"}`}>{t}</span>
                  </motion.label>
                );
              })}
            </div>
            {err("topic")}
          </fieldset>
          <div className="sm:col-span-2">
            <div className="relative">
              <textarea id="cf-message" name="message" rows={5} required placeholder=" " className={`${base} pt-8 ${bad("message")}`} value={v.message} onChange={(e) => set("message", e.target.value)} onBlur={() => blur("message")} {...aria("message")} />
              <label htmlFor="cf-message" className={`${floating} rounded bg-white pr-2`}>How can we help?</label>
              <span aria-hidden className={focusBar} />
            </div>
            {err("message")}
          </div>
          <div className="sm:col-span-2">
            {/* The whole row is the label, so the tick box has a hit area at least 44px tall. */}
            <label htmlFor="cf-consent" className="flex min-h-11 cursor-pointer items-center gap-3 py-2 text-base">
              <span className="relative grid h-6 w-6 shrink-0 place-items-center">
                <input id="cf-consent" name="consent" type="checkbox" required className={`absolute inset-0 h-6 w-6 cursor-pointer appearance-none rounded-md border-[1.5px] border-forest bg-white ${bad("consent")}`} checked={v.consent} onChange={(e) => set("consent", e.target.checked)} {...aria("consent")} />
                <motion.span aria-hidden className="pointer-events-none absolute inset-0 rounded-md bg-forest" initial={false} animate={{ scale: v.consent ? 1 : 0, opacity: v.consent ? 1 : 0 }} transition={{ type: "spring", stiffness: 500, damping: 26 }} />
                <svg aria-hidden viewBox="0 0 24 24" className="pointer-events-none relative h-[18px] w-[18px]">
                  <motion.path d="M5 12.5l4.5 4.5L19 7.5" fill="none" stroke="#fff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" initial={false}
                    animate={{ pathLength: v.consent ? 1 : 0, opacity: v.consent ? 1 : 0 }} transition={{ duration: 0.28, ease: EASE, delay: v.consent ? 0.08 : 0 }} />
                </svg>
              </span>
              <span>
                I agree that Naadu Nalam may use these details to respond to my enquiry, as set out in the{" "}
                <Link href="/privacy-policy" className="link">Privacy Policy</Link>.
              </span>
            </label>
            {err("consent")}
          </div>
          <div className="sm:col-span-2">
            <button type="submit" className="btn btn-primary">Send message</button>
          </div>
        </motion.form>
      )}
    </AnimatePresence>
  );
}
