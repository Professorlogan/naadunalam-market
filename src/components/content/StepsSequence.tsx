"use client";
import { motion, useInView } from "motion/react";
import { useRef } from "react";
import { EASE } from "../motion";
import { StepNumeral } from "./fx";

const BEAT = 0.45; // seconds between one step lighting up and the next

/**
 * The ordering sequence as white rounded cards with a number disc. A leaf-coloured line draws from step to
 * step (across on wide screens, down on narrow ones); as it reaches each step its disc brightens and the text follows.
 */
export default function StepsSequence({ steps }: { steps: { title: string; text: string }[] }) {
  const ref = useRef<HTMLOListElement>(null);
  const run = useInView(ref, { once: true, margin: "0px 0px -18% 0px" });
  const state = run ? "show" : "hidden";
  return (
    <ol ref={ref} className="mt-8 grid gap-4 lg:grid-cols-4 lg:gap-5">
      {steps.map((s, i) => {
        const at = i * BEAT;
        const last = i === steps.length - 1;
        return (
          <li key={s.title} className="relative grid grid-cols-[3.5rem_minmax(0,1fr)] gap-x-4 rounded-[1.5rem] border border-mist bg-white p-5 transition-[transform,box-shadow] duration-300 hover:-translate-y-1 hover:shadow-[0_18px_40px_-22px_rgb(23_39_30/0.45)] lg:block lg:p-6">
            {/* Narrow screens: the line runs down to the next numeral. */}
            {!last && (
              <span aria-hidden className="absolute bottom-[-2.25rem] left-12 top-[4.75rem] z-10 w-0.5 -translate-x-1/2 rounded-full bg-mist lg:hidden">
                <motion.span className="block h-full w-full origin-top rounded-full bg-leaf" initial={false} animate={{ scaleY: run ? 1 : 0 }} transition={{ duration: BEAT, ease: "linear", delay: at + 0.2 }} />
              </span>
            )}
            <div className="flex items-center lg:gap-3">
              <motion.span aria-hidden className="grid h-14 w-14 shrink-0 place-items-center rounded-full bg-mint" initial={false} animate={state}
                variants={{ hidden: { opacity: 0.4 }, show: { opacity: 1, transition: { duration: 0.3, delay: at } } }}>
                <StepNumeral n={i + 1} className="!text-2xl !text-forest" />
              </motion.span>
              {/* Wide screens: the line runs across to the next numeral. */}
              {!last && (
                <span className="hidden h-0.5 flex-1 rounded-full bg-mist lg:block">
                  <motion.span className="block h-full w-full origin-left rounded-full bg-leaf" initial={false} animate={{ scaleX: run ? 1 : 0 }} transition={{ duration: BEAT, ease: "linear", delay: at + 0.2 }} />
                </span>
              )}
            </div>
            <motion.div className="lg:mt-4" initial={false} animate={state}
              variants={{ hidden: { opacity: 0, y: 18 }, show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: EASE, delay: at + 0.08 } } }}>
              <h3 className="text-2xl font-bold text-forest-deep"><span className="sr-only">Step {i + 1}: </span>{s.title}</h3>
              <p className="mt-1.5 text-ink/75">{s.text}</p>
            </motion.div>
          </li>
        );
      })}
    </ol>
  );
}
