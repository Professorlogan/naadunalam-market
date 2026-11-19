"use client";
import { motion } from "motion/react";
import { useState } from "react";

type Bar = { x1: number; y1: number; x2: number; y2: number; c: string; from: { x: number; y: number; r: number } };
const four = (dx: number, c: [string, string, string], flip = 1): Bar[] => [
  { x1: dx + 64, y1: 12, x2: dx + 14, y2: 88, c: c[0], from: { x: -30 * flip, y: -150, r: -50 * flip } },
  { x1: dx + 14, y1: 88, x2: dx + 96, y2: 88, c: c[1], from: { x: 40 * flip, y: -190, r: 35 * flip } },
  { x1: dx + 70, y1: 48, x2: dx + 70, y2: 128, c: c[2], from: { x: 10 * flip, y: -230, r: 80 * flip } },
];
const bars = [...four(0, ["#0f804a", "#0c8fc7", "#6b3a2c"]), ...four(232, ["#1b5338", "#0f804a", "#0c8fc7"], -1)];

/**
 * "404" built from the logo's elements: leaf, water and soil strokes drop in and settle as the two 4s,
 * and the sun rolls in between them as the 0. Decorative; the page says "Error 404" in text.
 */
export default function NotFoundArt({ className = "" }: { className?: string }) {
  // Entrance delays apply once; after that the pieces answer the pointer straight away.
  const [settled, setSettled] = useState(false);
  const d = settled ? 0 : 1;
  return (
    <motion.svg onAnimationComplete={(name) => { if (name === "show") setSettled(true); }} aria-hidden viewBox="-6 -4 348 148" className={`overflow-visible ${className}`} initial="hidden" animate="show" whileHover="nudge">
      {bars.map((b, i) => (
        <motion.line key={i} x1={b.x1} y1={b.y1} x2={b.x2} y2={b.y2} stroke={b.c} strokeWidth="17" strokeLinecap="round"
          variants={{
            hidden: { x: b.from.x, y: b.from.y, rotate: b.from.r, opacity: 0 },
            show: { x: 0, y: 0, rotate: 0, opacity: 1, transition: { type: "spring", stiffness: 170, damping: 11, delay: d * (0.15 + i * 0.09) } },
            nudge: { y: i % 2 ? -5 : 4, rotate: i % 2 ? 3 : -3, transition: { type: "spring", stiffness: 300, damping: 9 } },
          }} />
      ))}
      <motion.g
        variants={{
          hidden: { x: 230, rotate: 400, opacity: 0 },
          show: { x: 0, rotate: 0, opacity: 1, transition: { type: "spring", stiffness: 60, damping: 11, delay: d * 0.75 } },
          nudge: { rotate: 120, transition: { type: "spring", stiffness: 90, damping: 10 } },
        }}>
        <circle cx="168" cy="70" r="47" fill="none" stroke="#f9b52c" strokeWidth="17" />
        <path d="M150 88c0-25 12-37 37-37 0 25-12 37-37 37z" fill="#0f804a" />
        <path d="M152 86l22-22" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" opacity="0.7" />
      </motion.g>
    </motion.svg>
  );
}
