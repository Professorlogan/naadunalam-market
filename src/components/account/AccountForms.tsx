"use client";
import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useAnimate, useReducedMotion } from "motion/react";
import { EASE, Reveal } from "../motion";
import { FieldError, Shake } from "./fx";

type Errors = Record<string, string>;
const emailOk = (s: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(s);
const NOTICE = "Sign-in is not connected in this prototype";

function Field({ form, name, label, type = "text", autoComplete, hint, error, shake = 0 }: {
  form: string; name: string; label: string; type?: string; autoComplete: string; hint?: string; error?: string; shake?: number;
}) {
  const id = `${form}-${name}`;
  const describedBy = [hint ? `${id}-hint` : "", error ? `${id}-error` : ""].filter(Boolean).join(" ") || undefined;
  return (
    <div>
      <label htmlFor={id} className="label">{label}</label>
      <Shake on={Boolean(error)} tick={shake}>
        <input id={id} name={name} type={type} autoComplete={autoComplete} required aria-invalid={error ? true : undefined} aria-describedby={describedBy}
          className={`field ${error ? "!border-soil" : ""}`} />
      </Shake>
      {hint && <p id={`${id}-hint`} className="mt-1.5 text-sm text-muted">{hint}</p>}
      <FieldError id={`${id}-error`} message={error} />
    </div>
  );
}

/**
 * Prototype form: reads the fields once to validate them, then resets the form.
 * Nothing typed here (including the password) is kept in state, stored or sent.
 */
function ProtoForm({ form, title, intro, submitLabel, validate, done, children }: {
  form: string; title: string; intro: string; submitLabel: string; done: string;
  validate: (get: (k: string) => string) => Errors;
  children: (errors: Errors, shake: number) => React.ReactNode;
}) {
  const [errors, setErrors] = useState<Errors>({});
  const [shake, setShake] = useState(0);
  const [notice, setNotice] = useState(false);
  const submit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const el = e.currentTarget;
    const data = new FormData(el);
    const found = validate((k) => String(data.get(k) ?? ""));
    setErrors(found);
    const first = Object.keys(found)[0];
    if (first) {
      setNotice(false);
      setShake((n) => n + 1);
      el.querySelector<HTMLInputElement>(`[name="${first}"]`)?.focus();
      return;
    }
    el.reset();
    setNotice(true);
  };
  return (
    <section aria-labelledby={`${form}-title`} className="flex h-full flex-col rounded-[1.5rem] border border-mist bg-white p-5 sm:p-8">
      <h2 id={`${form}-title`} className="t-h3 font-bold text-forest-deep">{title}</h2>
      <p className="mt-2 text-muted">{intro}</p>
      <form noValidate onSubmit={submit} className="mt-5 flex flex-1 flex-col gap-5">
        {children(errors, shake)}
        {/* Pinned to the bottom of the card so both buttons line up when the cards stretch to the same height. */}
        <div className="mt-auto">
        <button type="submit" className="btn btn-primary w-full">{submitLabel}</button>
        <div aria-live="polite">
          <AnimatePresence initial={false}>
            {notice && (
              <motion.p key="notice" className="mt-4 rounded-[1.25rem] bg-white border border-mist px-4 py-3"
                initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.3, ease: EASE }}>
                <strong className="font-semibold">{NOTICE}.</strong> {done}
              </motion.p>
            )}
          </AnimatePresence>
        </div>
        </div>
      </form>
    </section>
  );
}

const tabs = [{ id: "signin", label: "Sign in" }, { id: "register", label: "Create account" }] as const;
type TabId = (typeof tabs)[number]["id"];

/**
 * Phones show one form at a time behind a two-button switch; from tablet up both forms sit side by side and the
 * switch is hidden. Both forms stay mounted, so nothing typed is lost when switching.
 */
export default function AccountForms() {
  const [tab, setTab] = useState<TabId>("signin");
  const [scope, animate] = useAnimate<HTMLDivElement>();
  const first = useRef(true);
  const reduce = useReducedMotion();
  useEffect(() => {
    if (first.current) { first.current = false; return; }
    if (reduce) return;
    const el = scope.current?.querySelector<HTMLElement>(`[data-panel="${tab}"]`);
    if (el) animate(el, { opacity: [0, 1], x: [tab === "signin" ? -18 : 18, 0] }, { duration: 0.35, ease: EASE });
  }, [tab, animate, scope, reduce]);
  return (
    <div ref={scope}>
      <div role="group" aria-label="Choose a form" className="mb-5 grid grid-cols-2 rounded-full border border-mist bg-mint p-1 md:hidden">
        {tabs.map((t) => (
          <button key={t.id} type="button" aria-pressed={tab === t.id} onClick={() => setTab(t.id)}
            className={`relative min-h-11 rounded-full px-3 font-display font-semibold transition-colors duration-200 ${tab === t.id ? "text-white" : "text-forest"}`}>
            {tab === t.id && <motion.span layoutId="account-tab" aria-hidden className="absolute inset-0 rounded-full bg-leaf" transition={{ type: "spring", stiffness: 420, damping: 34 }} />}
            <span className="relative">{t.label}</span>
          </button>
        ))}
      </div>
      <div className="grid gap-6 md:grid-cols-2 md:items-stretch">
      <Reveal className={tab === "signin" ? "h-full" : "hidden h-full md:block"}>
      <div data-panel="signin" className="h-full">
      <ProtoForm
        form="signin" title="Sign in" intro="For customers who already have an account." submitLabel="Sign in"
        done="Your details were checked and then discarded. You can still shop and place a prototype order without an account."
        validate={(get) => {
          const e: Errors = {};
          if (!get("username").trim()) e.username = "Enter your username or email address.";
          if (!get("password")) e.password = "Enter your password.";
          return e;
        }}
      >
        {(errors, shake) => (
          <>
            <Field form="signin" name="username" label="Username or email address" autoComplete="username" error={errors.username} shake={shake} />
            <Field form="signin" name="password" label="Password" type="password" autoComplete="current-password" error={errors.password} shake={shake} />
          </>
        )}
      </ProtoForm>
      </div>
      </Reveal>

      <Reveal delay={0.1} className={tab === "register" ? "h-full" : "hidden h-full md:block"}>
      <div data-panel="register" className="h-full">
      <ProtoForm
        form="register" title="Create an account" intro="New here? Register to keep your orders and wishlist in one place." submitLabel="Register"
        done="No account was created and nothing you typed was saved."
        validate={(get) => {
          const e: Errors = {};
          if (get("name").trim().length < 2) e.name = "Enter your name.";
          if (!get("email").trim()) e.email = "Enter your email address.";
          else if (!emailOk(get("email").trim())) e.email = "This email address does not look right. Check for a missing @ or dot.";
          if (!get("password")) e.password = "Choose a password.";
          else if (get("password").length < 8) e.password = "Use at least 8 characters.";
          return e;
        }}
      >
        {(errors, shake) => (
          <>
            <Field form="register" name="name" label="Full name" autoComplete="name" error={errors.name} shake={shake} />
            <Field form="register" name="email" label="Email address" type="email" autoComplete="email" error={errors.email} shake={shake} />
            <Field form="register" name="password" label="Password" type="password" autoComplete="new-password" hint="At least 8 characters." error={errors.password} shake={shake} />
          </>
        )}
      </ProtoForm>
      </div>
      </Reveal>
      </div>
    </div>
  );
}
