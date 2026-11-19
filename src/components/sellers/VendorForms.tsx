"use client";
import { useEffect, useId, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Info } from "lucide-react";
import { stores } from "../../lib/data";
import { EASE } from "../motion";
import ShopUrl from "./ShopUrl";

const SHOP_BASE = "naadunalam.fastfilings.in/store/";
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

type Errors<K extends string> = Partial<Record<K, string>>;

/** A message that slides down into place and fades out when it is no longer needed. */
function Slide({ show, children, className, id, role }: { show: boolean; children: React.ReactNode; className?: string; id?: string; role?: "alert" }) {
  return (
    <AnimatePresence initial={false}>
      {show && (
        <motion.p id={id} role={role} className={className}
          initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }} transition={{ duration: 0.28, ease: EASE }}>
          {children}
        </motion.p>
      )}
    </AnimatePresence>
  );
}

/* Focus answers the person: the label takes the leaf colour and nudges, and the field's ring eases in. */
function Field({ label, error, hint, children, id }: { label: string; error?: string; hint?: string; id: string; children: React.ReactNode }) {
  // The last message is kept so it can still be read while it slides away.
  const [shown, setShown] = useState(error);
  if (error && error !== shown) setShown(error);
  return (
    <div className="group/field">
      <label htmlFor={id} className="label origin-left transition-[color,translate] duration-300 group-focus-within/field:translate-x-0.5 group-focus-within/field:!text-leaf">{label}</label>
      {children}
      {hint && <p id={`${id}-hint`} className="mt-1.5 text-sm text-muted">{hint}</p>}
      <Slide show={Boolean(error)} id={`${id}-err`} className="mt-1.5 text-[15px] font-semibold text-[#a12a1c]">{error ?? shown}</Slide>
    </div>
  );
}

/** aria wiring shared by every input */
const a11y = (id: string, error?: string, hint?: boolean) => ({
  id,
  "aria-invalid": error ? true : undefined,
  "aria-describedby": [hint ? `${id}-hint` : "", error ? `${id}-err` : ""].filter(Boolean).join(" ") || undefined,
  className: `field transition-[border-color,box-shadow] duration-300 ${error ? "!border-[#a12a1c]" : ""}`,
});

/**
 * Result notice. It animates in, is scrolled into the middle of the window and takes focus, so the outcome of a
 * submit is never left off-screen (the forms are long on a phone) and screen readers land on it.
 */
function Notice({ title, children }: { title: string; children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const calm = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    el.scrollIntoView({ block: "center", behavior: calm ? "auto" : "smooth" });
    el.focus({ preventScroll: true });
  }, []);
  return (
    <motion.div ref={ref} role="status" tabIndex={-1}
      initial={{ opacity: 0, y: 18, scale: 0.97 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: -8 }}
      transition={{ duration: 0.45, ease: EASE }}
      className="flex scroll-my-32 gap-3 rounded-[1.25rem] bg-white border border-mist p-4 text-ink sm:p-5">
      <motion.span aria-hidden className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-white text-water-deep" initial={{ scale: 0, rotate: -40 }} animate={{ scale: 1, rotate: 0 }}
        transition={{ type: "spring", stiffness: 420, damping: 14, delay: 0.15 }}>
        <Info size={22} />
      </motion.span>
      <div>
        <p className="font-display text-lg font-semibold text-forest-deep">{title}</p>
        <div className="mt-1 space-y-1.5">{children}</div>
      </div>
    </motion.div>
  );
}

/* ---------------------------------------------------------------- login */

type LoginKey = "user" | "password";

export function VendorLoginForm() {
  const uid = useId();
  const [errors, setErrors] = useState<Errors<LoginKey>>({});
  const [done, setDone] = useState(false);
  const [lostOpen, setLostOpen] = useState(false);

  const check = (key: LoginKey, value: string) =>
    key === "user"
      ? value.trim() ? "" : "Enter your username or email address."
      : value ? "" : "Enter your password.";

  const onBlur = (key: LoginKey) => (e: React.FocusEvent<HTMLInputElement>) => {
    const msg = check(key, e.target.value);
    setErrors((prev) => ({ ...prev, [key]: msg || undefined }));
  };

  // The password is read once from the field to check it is not empty, then the field is cleared.
  // It is never put in state, storage or a request.
  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const data = new FormData(form);
    const next: Errors<LoginKey> = {
      user: check("user", String(data.get("user") ?? "")) || undefined,
      password: check("password", String(data.get("password") ?? "")) || undefined,
    };
    setErrors(next);
    if (next.user || next.password) {
      setDone(false);
      form.querySelector<HTMLInputElement>(next.user ? "[name=user]" : "[name=password]")?.focus();
      return;
    }
    const pw = form.querySelector<HTMLInputElement>("[name=password]");
    if (pw) pw.value = "";
    setDone(true);
  }

  return (
    <form onSubmit={onSubmit} noValidate className="space-y-5">
      <Field id={`${uid}-user`} label="Username or email address" error={errors.user}>
        <input {...a11y(`${uid}-user`, errors.user)} name="user" type="text" autoComplete="username" autoCapitalize="none" spellCheck={false} required
          onBlur={onBlur("user")} onChange={() => setDone(false)} />
      </Field>
      <Field id={`${uid}-pw`} label="Password" error={errors.password}>
        <input {...a11y(`${uid}-pw`, errors.password)} name="password" type="password" autoComplete="current-password" required
          onBlur={onBlur("password")} onChange={() => { setDone(false); setErrors((p) => ({ ...p, password: undefined })); }} />
      </Field>
      <label className="flex min-h-11 cursor-pointer items-center gap-3">
        <input type="checkbox" name="remember" className="h-5 w-5 accent-[#0f804a]" />
        <span>Remember me</span>
      </label>

      <AnimatePresence initial={false}>
        {done && (
          <Notice key="done" title="You have not been signed in">
            <p>This is a prototype and it is not connected to vendor accounts, so there is no dashboard to open yet.</p>
            <p>Your password was not saved or sent anywhere, and the field has been cleared.</p>
          </Notice>
        )}
      </AnimatePresence>

      <button type="submit" className="btn btn-primary w-full sm:w-auto">Log in to dashboard</button>

      <div className="border-t border-mist pt-4">
        <button type="button" aria-expanded={lostOpen} aria-controls={`${uid}-lost`} onClick={() => setLostOpen((v) => !v)}
          className="link min-h-11 font-semibold">
          Lost your password?
        </button>
        <Slide show={lostOpen} id={`${uid}-lost`} className="mt-1 text-muted">
          Password reset is not connected in this prototype. On the live marketplace this sends a reset link to your registered email address.
        </Slide>
      </div>
    </form>
  );
}

/* ---------------------------------------------------------------- apply */

type ApplyKey = "first" | "last" | "email" | "phone" | "shop" | "slug";
type ApplyValues = Record<ApplyKey, string>;
const emptyApply: ApplyValues = { first: "", last: "", email: "", phone: "", shop: "", slug: "" };
const order: ApplyKey[] = ["first", "last", "email", "phone", "shop", "slug"];

export const toSlug = (text: string) =>
  text.toLowerCase().normalize("NFKD").replace(/[̀-ͯ]/g, "").replace(/&/g, " and ").replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "").slice(0, 40).replace(/-+$/, "");

function checkApply(key: ApplyKey, v: ApplyValues): string {
  const value = v[key].trim();
  switch (key) {
    case "first": return value ? "" : "Enter your first name.";
    case "last": return value ? "" : "Enter your last name.";
    case "email": return !value ? "Enter your email address." : EMAIL.test(value) ? "" : "Enter an email address in the form name@example.com.";
    case "phone": {
      if (!value) return "Enter your phone number.";
      const digits = value.replace(/\D/g, "").replace(/^(91|0)(?=\d{10}$)/, "");
      return /^[6-9]\d{9}$/.test(digits) ? "" : "Enter a 10-digit Indian mobile number, for example 90921 14630.";
    }
    case "shop": return !value ? "Enter your shop name." : value.length < 3 ? "Use at least 3 characters for the shop name." : "";
    case "slug":
      if (!value) return "Enter a shop URL. Use English letters, numbers and hyphens.";
      if (!/^[a-z0-9]+(-[a-z0-9]+)*$/.test(value)) return "Use lowercase English letters, numbers and single hyphens only, with no spaces.";
      if (value.length < 3) return "Use at least 3 characters for the shop URL.";
      if (stores.some((s) => s.slug === value)) return "That shop URL is already used by a store on Naadu Nalam. Choose another.";
      return "";
  }
}

export function VendorApplyForm() {
  const uid = useId();
  const [values, setValues] = useState<ApplyValues>(emptyApply);
  const [errors, setErrors] = useState<Errors<ApplyKey>>({});
  const [slugEdited, setSlugEdited] = useState(false);
  const [sent, setSent] = useState<ApplyValues | null>(null);

  const id = (k: ApplyKey) => `${uid}-${k}`;

  function set(key: ApplyKey, value: string) {
    const next = { ...values, [key]: value };
    if (key === "shop" && !slugEdited) next.slug = toSlug(value);
    setSent(null);
    setValues(next);
    // Once a field has been flagged, re-check it as the person types so the message clears when fixed.
    setErrors((old) => {
      const out = { ...old };
      if (old[key]) out[key] = checkApply(key, next) || undefined;
      if (key === "shop" && !slugEdited && old.slug) out.slug = checkApply("slug", next) || undefined;
      return out;
    });
  }

  const blur = (key: ApplyKey) => () => setErrors((old) => ({ ...old, [key]: checkApply(key, values) || undefined }));

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const next: Errors<ApplyKey> = {};
    for (const k of order) next[k] = checkApply(k, values) || undefined;
    setErrors(next);
    const firstBad = order.find((k) => next[k]);
    if (firstBad) {
      setSent(null);
      document.getElementById(id(firstBad))?.focus();
      return;
    }
    setSent({ ...values });
  }

  const errorCount = order.filter((k) => errors[k]).length;

  return (
    <form onSubmit={onSubmit} noValidate className="space-y-5">
      <p className="text-[15px] text-muted">Every field is required.</p>
      <div className="grid gap-5 sm:grid-cols-2">
        <Field id={id("first")} label="First name" error={errors.first}>
          <input {...a11y(id("first"), errors.first)} type="text" autoComplete="given-name" required value={values.first}
            onChange={(e) => set("first", e.target.value)} onBlur={blur("first")} />
        </Field>
        <Field id={id("last")} label="Last name" error={errors.last}>
          <input {...a11y(id("last"), errors.last)} type="text" autoComplete="family-name" required value={values.last}
            onChange={(e) => set("last", e.target.value)} onBlur={blur("last")} />
        </Field>
      </div>
      <Field id={id("email")} label="Email address" error={errors.email} hint="A link to set your password is sent to this address.">
        <input {...a11y(id("email"), errors.email, true)} type="email" inputMode="email" autoComplete="email" autoCapitalize="none" spellCheck={false} required
          value={values.email} onChange={(e) => set("email", e.target.value)} onBlur={blur("email")} />
      </Field>
      <Field id={id("phone")} label="Phone number" error={errors.phone}>
        <input {...a11y(id("phone"), errors.phone)} type="tel" inputMode="tel" autoComplete="tel" required value={values.phone}
          onChange={(e) => set("phone", e.target.value)} onBlur={blur("phone")} />
      </Field>
      <Field id={id("shop")} label="Shop name" error={errors.shop}>
        <input {...a11y(id("shop"), errors.shop)} type="text" autoComplete="organization" required value={values.shop}
          onChange={(e) => set("shop", e.target.value)} onBlur={blur("shop")} />
      </Field>
      <Field id={id("slug")} label="Shop URL" error={errors.slug}
        hint="Filled in from your shop name. You can change it. Lowercase English letters, numbers and hyphens.">
        <input {...a11y(id("slug"), errors.slug, true)} type="text" autoCapitalize="none" spellCheck={false} required value={values.slug}
          onChange={(e) => { setSlugEdited(true); set("slug", e.target.value.toLowerCase().replace(/\s+/g, "-")); }} onBlur={blur("slug")} />
        {/* The address may wrap only after a "/". Each change to the URL gives the preview a quick highlight tick. */}
        <p className="relative mt-2 overflow-hidden rounded-full bg-mint px-4 py-2 text-base">
          <motion.span key={values.slug} aria-hidden className="pointer-events-none absolute inset-0 bg-butter"
            initial={{ opacity: values.slug ? 1 : 0 }} animate={{ opacity: 0 }} transition={{ duration: 0.7, ease: "easeOut" }} />
          <span className="relative text-muted">Your shop address: </span>
          <span className="relative font-semibold text-forest-deep">
            <ShopUrl url={`${SHOP_BASE}${values.slug || "your-shop"}`} />
            {/* Typing caret: blinks briefly after each change, then rests hidden. */}
            <motion.span key={`caret-${values.slug}`} aria-hidden className="ml-0.5 inline-block h-[1.05em] w-0.5 translate-y-[0.15em] rounded bg-leaf"
              initial={{ opacity: values.slug ? 1 : 0 }} animate={{ opacity: values.slug ? [1, 1, 0, 0, 1, 1, 0] : 0 }} transition={{ duration: 1.6, times: [0, 0.3, 0.31, 0.6, 0.61, 0.9, 1] }} />
          </span>
        </p>
      </Field>

      <Slide show={errorCount > 0 && !sent} role="alert" className="font-semibold text-[#a12a1c]">
        {errorCount === 1 ? "1 field needs" : `${errorCount} fields need`} attention before you can apply.
      </Slide>

      <AnimatePresence initial={false}>
        {sent && (
          <Notice key="sent" title="No account has been created">
            <p>This is a prototype, so your application was checked on this page only. Nothing was sent, saved or emailed.</p>
            <p className="break-words">
              On the live marketplace, a link to set your password goes to {sent.email.trim()} and your shop opens at{" "}
              <ShopUrl url={`${SHOP_BASE}${sent.slug}.`} className="font-semibold" />
            </p>
          </Notice>
        )}
      </AnimatePresence>

      <button type="submit" className="btn btn-primary w-full sm:w-auto">Apply to sell</button>
    </form>
  );
}
