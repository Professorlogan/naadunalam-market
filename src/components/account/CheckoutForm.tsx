"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Banknote, Check, LoaderCircle, ShoppingBasket } from "lucide-react";
import { site } from "../../lib/data";
import { inr } from "../../lib/format";
import { useStore, type Order } from "../../lib/store";
import { EASE, Reveal } from "../motion";
import { FieldError, Shake, Ticker } from "./fx";
import { EmptyState, groupBySeller, lineKey, marketCard, pastelPanel, PrototypeNote, Skeleton, summaryTitle, Totals } from "./shared";

type Values = Order["customer"];
type Key = keyof Values;
const blank: Values = { name: "", phone: "", email: "", address: "", city: "", pincode: "", notes: "" };
const order: Key[] = ["name", "phone", "email", "address", "city", "pincode", "notes"];
const digits = (s: string) => s.replace(/[\s-]/g, "");
/** Unfinished checkout details, kept for this tab only so a trip to the basket and back does not lose them. */
const DRAFT = "naadunalam-checkout-draft";

function validate(v: Values): Partial<Record<Key, string>> {
  const e: Partial<Record<Key, string>> = {};
  if (v.name.trim().length < 2) e.name = "Enter the name of the person receiving the order.";
  if (!digits(v.phone)) e.phone = "Enter a mobile number so the seller can reach you about delivery.";
  else if (!/^\d{10}$/.test(digits(v.phone))) e.phone = "Enter a 10-digit mobile number, without +91 or a leading 0.";
  if (v.email.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.email.trim())) e.email = "This email address does not look right. Check it, or leave it empty.";
  if (v.address.trim().length < 5) e.address = "Enter your door number, street and area.";
  if (v.city.trim().length < 2) e.city = "Enter your town or city.";
  if (!digits(v.pincode)) e.pincode = "Enter your 6-digit PIN code.";
  else if (!/^\d{6}$/.test(digits(v.pincode))) e.pincode = "A PIN code has exactly 6 digits.";
  else if (!digits(v.pincode).startsWith("6")) e.pincode = "We deliver within Tamil Nadu only. Tamil Nadu PIN codes start with 6.";
  return e;
}

export default function CheckoutForm() {
  const { ready, cart, subtotal, delivery, total, placeOrder } = useStore();
  const router = useRouter();
  const [values, setValues] = useState<Values>(blank);
  const [touched, setTouched] = useState<Partial<Record<Key, boolean>>>({});
  const [submitted, setSubmitted] = useState(false);
  const [shake, setShake] = useState(0);
  const [placing, setPlacing] = useState(false);
  const [placed, setPlaced] = useState(false);
  const [restored, setRestored] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Bring back anything typed earlier in this tab, then keep the draft up to date. Checkout is the only page that stores it.
  useEffect(() => {
    try {
      const raw = sessionStorage.getItem(DRAFT);
      if (raw) {
        const saved = JSON.parse(raw) as Partial<Values>;
        const next = { ...blank };
        for (const k of order) if (typeof saved[k] === "string") next[k] = saved[k];
        // eslint-disable-next-line react-hooks/set-state-in-effect -- one-time read of the saved draft after hydration
        setValues(next);
      }
    } catch {}
    setRestored(true);
  }, []);
  useEffect(() => {
    if (!restored || placed) return;
    try {
      if (order.some((k) => values[k])) sessionStorage.setItem(DRAFT, JSON.stringify(values));
      else sessionStorage.removeItem(DRAFT);
    } catch {}
  }, [values, restored, placed]);
  useEffect(() => () => { if (timer.current) clearTimeout(timer.current); }, []);

  if (!ready) return <Skeleton label="Loading your basket" />;
  if (placed) {
    return <div className="wrap py-16"><p role="status" className="font-display text-2xl font-semibold text-forest-deep">Placing your order…</p></div>;
  }
  const groups = groupBySeller(cart);
  if (groups.length === 0) {
    return (
      <EmptyState icon={ShoppingBasket} title="There is nothing to check out yet" text="Your basket is empty. Add products from the shop and come back here to place your order.">
        <Link href="/shop" className="btn btn-primary">Start shopping</Link>
        <Link href="/my-orders" className="btn btn-ghost">See my orders</Link>
      </EmptyState>
    );
  }

  const errors = validate(values);
  const shown = (k: Key) => (submitted || touched[k] ? errors[k] : undefined);
  const errorCount = Object.keys(errors).length;
  const bind = (k: Key, hint?: boolean) => {
    const err = shown(k);
    const describedBy = [hint ? `co-${k}-hint` : "", err ? `co-${k}-error` : ""].filter(Boolean).join(" ") || undefined;
    return {
      id: `co-${k}`, name: k, value: values[k], className: `field ${err ? "!border-soil" : ""}`,
      "aria-invalid": err ? true : undefined, "aria-describedby": describedBy,
      onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => setValues((v) => ({ ...v, [k]: e.target.value })),
      onBlur: () => setTouched((t) => ({ ...t, [k]: true })),
    };
  };
  const err = (k: Key) => <FieldError id={`co-${k}-error`} message={shown(k)} />;
  /** Wraps a field so it shakes once when a submit fails on it. */
  const field = (k: Key, control: React.ReactNode) => <Shake on={Boolean(errors[k])} tick={shake}>{control}</Shake>;

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (placing) return;
    setSubmitted(true);
    const first = order.find((k) => errors[k]);
    if (first) {
      setShake((n) => n + 1);
      document.getElementById(`co-${first}`)?.focus();
      return;
    }
    setPlacing(true);
    timer.current = setTimeout(() => {
      const made = placeOrder({
        name: values.name.trim(), phone: digits(values.phone), email: values.email.trim(), address: values.address.trim(),
        city: values.city.trim(), pincode: digits(values.pincode), notes: values.notes.trim(),
      });
      try { sessionStorage.removeItem(DRAFT); } catch {}
      setPlaced(true);
      router.push("/order-received?order=" + made.number);
    }, 650);
  };

  /** Rendered twice (end of the form and in the summary); both submit the same form. */
  const placeButton = (
    <button type="submit" aria-disabled={placing || undefined} className={`btn btn-primary !min-h-14 w-full text-lg ${placing ? "cursor-progress" : ""}`}>
      <AnimatePresence mode="wait" initial={false}>
        {placing ? (
          <motion.span key="placing" className="inline-flex items-center gap-2" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.18 }}>
            <LoaderCircle size={18} aria-hidden className="animate-spin" /> Placing…
          </motion.span>
        ) : (
          <motion.span key="idle" className="inline-flex items-center gap-1.5 whitespace-nowrap" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.18 }}>
            Place order · <Ticker value={total} />
          </motion.span>
        )}
      </AnimatePresence>
    </button>
  );

  const legend = "float-left mb-5 w-full font-display text-2xl font-bold text-forest-deep";
  const showSummary = submitted && errorCount > 0;

  return (
    <section className="wrap pb-5 pt-8 sm:pb-6 sm:pt-12">
      <form noValidate onSubmit={submit} aria-busy={placing || undefined} className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_24rem] lg:items-start">
        <div className="space-y-6">
          <Reveal y={16}>
            <PrototypeNote>This is a prototype checkout. No real order is sent to a seller and nothing will be delivered. Your details stay in this browser only.</PrototypeNote>
          </Reveal>

          <Reveal delay={0.12}>
            <fieldset className={`${marketCard} p-5 sm:p-7`}>
              <legend className={legend}>Contact</legend>
              <div className="clear-both grid gap-5 sm:grid-cols-2">
                <div className="sm:col-span-2">
                  <label htmlFor="co-name" className="label">Full name</label>
                  {field("name", <input {...bind("name")} type="text" autoComplete="name" required />)}
                  {err("name")}
                </div>
                <div>
                  <label htmlFor="co-phone" className="label">Mobile number</label>
                  {field("phone", <input {...bind("phone", true)} type="tel" inputMode="numeric" autoComplete="tel-national" required />)}
                  <p id="co-phone-hint" className="mt-1.5 text-sm text-muted">10 digits. The seller calls this number about delivery.</p>
                  {err("phone")}
                </div>
                <div>
                  <label htmlFor="co-email" className="label">Email <span className="font-normal text-muted">(optional)</span></label>
                  {field("email", <input {...bind("email")} type="email" autoComplete="email" />)}
                  {err("email")}
                </div>
              </div>
            </fieldset>
          </Reveal>

          <Reveal delay={0.2}>
            <fieldset className={`${marketCard} p-5 sm:p-7`}>
              <legend className={legend}>Delivery address</legend>
              <div className="clear-both grid gap-5 sm:grid-cols-2">
                <div className="sm:col-span-2">
                  <label htmlFor="co-address" className="label">Address</label>
                  {field("address", <textarea {...bind("address", true)} rows={3} autoComplete="street-address" required />)}
                  <p id="co-address-hint" className="mt-1.5 text-sm text-muted">Door number, street, area and a landmark if it helps.</p>
                  {err("address")}
                </div>
                <div>
                  <label htmlFor="co-city" className="label">Town or city</label>
                  {field("city", <input {...bind("city")} type="text" autoComplete="address-level2" required />)}
                  {err("city")}
                </div>
                <div>
                  <label htmlFor="co-pincode" className="label">PIN code</label>
                  {field("pincode", <input {...bind("pincode")} type="text" inputMode="numeric" maxLength={7} autoComplete="postal-code" required />)}
                  {err("pincode")}
                </div>
                <div className="sm:col-span-2">
                  <label htmlFor="co-state" className="label">State</label>
                  <input id="co-state" type="text" value="Tamil Nadu" readOnly aria-describedby="co-state-hint" className="field !bg-sky text-muted" />
                  <p id="co-state-hint" className="mt-1.5 text-sm text-muted">{site.deliveryLine}. We do not deliver outside the state yet.</p>
                </div>
              </div>
            </fieldset>
          </Reveal>

          <Reveal delay={0.1}>
            <fieldset className={`${marketCard} p-5 sm:p-7`}>
              <legend className={legend}>Order notes</legend>
              <div className="clear-both">
                <label htmlFor="co-notes" className="label">Anything the seller should know? <span className="font-normal text-muted">(optional)</span></label>
                <textarea {...bind("notes")} rows={3} />
              </div>
            </fieldset>
          </Reveal>

          <Reveal delay={0.1}>
            <fieldset className={`${marketCard} p-5 sm:p-7`}>
              <legend className={legend}>Payment</legend>
              <label className="relative clear-both flex min-h-11 cursor-pointer items-start gap-3 rounded-[1.25rem] border-2 border-leaf bg-white border border-mist/60 p-4 pr-14 ring-4 ring-leaf/15 sm:p-5 sm:pr-16">
                {/* The wrapper is exactly one line of the label tall, so the 20px control centres on the first line. */}
                <span className="flex h-[1lh] shrink-0 items-center">
                  <input type="radio" name="payment" value="cod" checked readOnly aria-describedby="co-pay-hint" className="m-0 h-5 w-5 accent-[#0f804a]" />
                </span>
                <span>
                  <span className="flex items-center gap-2.5 font-display text-lg font-bold text-forest-deep"><span aria-hidden className="grid h-10 w-10 place-items-center rounded-full bg-white text-forest"><Banknote size={20} /></span> {site.payment}</span>
                  <span id="co-pay-hint" className="mt-1 block text-base text-muted">
                    You pay in cash when the order reaches your door. Nothing is charged now, and no card or UPI details are needed. It is the only payment method on the marketplace at present.
                  </span>
                </span>
                <span aria-hidden className="absolute right-4 top-4 grid h-7 w-7 place-items-center rounded-full bg-leaf text-white sm:right-5 sm:top-5"><Check size={16} strokeWidth={3} /></span>
              </label>
            </fieldset>
          </Reveal>

          {placeButton}
        </div>

        {/* Sticky on a plain wrapper: the summary stays in view beside the form on desktop. */}
        <div className="lg:sticky lg:top-28 lg:self-start">
        <Reveal delay={0.18}>
          <aside aria-labelledby="co-summary" className={`${pastelPanel} bg-butter`}>
            <h2 id="co-summary" className={summaryTitle}>Your order</h2>
            <div className="space-y-4">
              {groups.map((g) => (
                <div key={g.slug}>
                  <p className="text-sm text-ink/70">Sold by <span className="font-semibold text-forest">{g.name}</span></p>
                  <ul className="mt-1.5 space-y-2.5">
                    {g.lines.map(({ line: l, info: i }) => (
                      <li key={lineKey(l)} className="flex gap-3">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={i.product.images[0]?.src} alt="" width={52} height={52} className="h-13 w-13 shrink-0 rounded-xl bg-white object-cover" />
                        <div className="min-w-0 flex-1 leading-snug">
                          <p className="font-semibold">{i.product.name}</p>
                          {i.product.nameTa && <p lang="ta" className="ta text-sm text-leaf">{i.product.nameTa}</p>}
                          <p className="text-sm text-muted">{i.pack} × {l.qty}</p>
                        </div>
                        <p className="whitespace-nowrap font-semibold tabular-nums">{inr(i.total)}</p>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
            <div className="mt-5 border-t border-ink/10 pt-4"><Totals subtotal={subtotal} delivery={delivery} total={total} /></div>
            {/*
              The slot above the button always has the height of the error summary (an invisible copy holds it open),
              so the button stays exactly where it is when the summary comes and goes.
            */}
            <div className="mt-4 grid">
              <p aria-hidden className="invisible col-start-1 row-start-1 rounded-xl px-4 py-3 text-[15px] font-semibold">
                7 details need your attention before the order can be placed.
              </p>
              <div aria-live="polite" className="col-start-1 row-start-1 grid">
                <AnimatePresence initial={false} mode="wait">
                  {showSummary ? (
                    <motion.p key="errors" className="self-stretch rounded-xl bg-white px-4 py-3 text-[15px] font-semibold text-soil"
                      initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.25, ease: EASE }}>
                      {errorCount === 1 ? "One detail needs" : `${errorCount} details need`} your attention before the order can be placed.
                    </motion.p>
                  ) : (
                    <motion.p key="cod" className="self-center text-left text-[15px] text-muted"
                      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }}>
                      Pay by cash on delivery.
                    </motion.p>
                  )}
                </AnimatePresence>
              </div>
            </div>
            <div className="mt-4">{placeButton}</div>
            <p role="status" className="sr-only">{placing ? "Placing your order…" : ""}</p>
            <p className="mt-2 text-center"><Link href="/cart" className="link inline-flex min-h-11 items-center px-2 text-[15px]">Change your basket</Link></p>
          </aside>
        </Reveal>
        </div>
      </form>
    </section>
  );
}
