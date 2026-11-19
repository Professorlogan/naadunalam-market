"use client";
import { AnimatePresence, motion, useMotionTemplate, useMotionValue, useSpring } from "motion/react";
import { useCallback, useEffect, useRef, useState, type PointerEvent as RPointerEvent } from "react";
import { createPortal } from "react-dom";
import { ChevronLeft, ChevronRight, X, ZoomIn } from "lucide-react";
import { useFocusTrap } from "../motion/useFocusTrap";

type Img = { src: string; alt: string };
const ZOOM = 2.2;
/**
 * Cut-outs and label artwork (the "-pdf" pack shots and the stock images on a white ground) are shown whole;
 * photographs fill the square frame.
 */
const WHOLE = /-pdf\.|\/(11-product-turmeric|16-product-basmati-rice|23-product-leafy-greens)\./;
const fit = (src: string) => (WHOLE.test(src) ? "object-contain" : "object-cover");

/**
 * One large image; a thumbnail row appears only when the product has several.
 * With a mouse the image zooms toward the pointer; a click or tap opens it full screen.
 */
export default function ProductGallery({ images, name }: { images: Img[]; name: string }) {
  const [active, setActive] = useState(0);
  const [open, setOpen] = useState(false);
  const several = images.length > 1;
  const main = images[active] ?? images[0];

  // Hover zoom: scale springs up while the transform origin tracks the pointer.
  const scale = useSpring(1, { stiffness: 260, damping: 28 });
  const ox = useMotionValue(50);
  const oy = useMotionValue(50);
  const origin = useMotionTemplate`${ox}% ${oy}%`;
  const track = (e: RPointerEvent<HTMLButtonElement>) => {
    if (e.pointerType !== "mouse") return;
    const r = e.currentTarget.getBoundingClientRect();
    ox.set(Math.min(100, Math.max(0, ((e.clientX - r.left) / r.width) * 100)));
    oy.set(Math.min(100, Math.max(0, ((e.clientY - r.top) / r.height) * 100)));
    scale.set(ZOOM);
  };
  const rest = () => scale.set(1);

  const step = useCallback((by: number) => setActive((i) => (i + by + images.length) % images.length), [images.length]);
  const close = useCallback(() => setOpen(false), []);

  if (!main) return null;
  return (
    <div>
      {/* Every image gets the same big square frame on a soft mint tint; on short screens the frame shrinks, staying square. */}
      <div className={`relative aspect-square w-full overflow-hidden rounded-[1.75rem] bg-mint ${several ? "md:max-w-[calc(100svh-17rem)]" : "md:max-w-[calc(100svh-11rem)]"}`}>
        <button type="button" onClick={() => { rest(); setOpen(true); }} onPointerMove={track} onPointerLeave={rest}
          aria-haspopup="dialog" aria-label={`Open a larger photo of ${name}`}
          className="relative block h-full w-full cursor-zoom-in overflow-hidden rounded-[1.75rem]">
          <AnimatePresence mode="popLayout" initial={false}>
            <motion.span key={main.src} className="block h-full w-full" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}>
              <motion.img src={main.src} alt={main.alt || name} width={1024} height={1024} fetchPriority="high" draggable={false}
                style={{ scale, transformOrigin: origin }}
                className={`h-full w-full ${fit(main.src)}`} />
            </motion.span>
          </AnimatePresence>
          <span aria-hidden className="pointer-events-none absolute bottom-4 right-4 inline-flex items-center gap-1.5 rounded-full bg-white px-3.5 py-1.5 shadow-[0_10px_24px_-16px_rgb(23_39_30/0.5)] text-sm font-semibold text-forest">
            <ZoomIn size={16} /> <span className="md:hidden">Tap to zoom</span><span className="max-md:hidden">Click to enlarge</span>
          </span>
        </button>
      </div>

      {several && (
        <ul aria-label={`${name} photos`} className="mt-4 flex flex-wrap gap-3">
          {images.map((img, i) => (
            <li key={img.src}>
              <button type="button" onClick={() => setActive(i)} aria-pressed={i === active} aria-label={`Show photo ${i + 1} of ${images.length}`}
                className={`relative block overflow-hidden rounded-xl bg-mint transition-shadow duration-150 ${i === active ? "ring-[3px] ring-leaf ring-offset-2" : "ring-1 ring-mist hover:ring-leaf/50"}`}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={img.src} alt="" width={88} height={88} loading="lazy" className={`h-20 w-20 ${fit(img.src)} transition-opacity duration-200 sm:h-22 sm:w-22 ${i === active ? "" : "opacity-75 hover:opacity-100"}`} />
              </button>
            </li>
          ))}
        </ul>
      )}

      <Lightbox open={open} images={images} active={active} name={name} onClose={close} onStep={step} onPick={setActive} />
    </div>
  );
}

function Lightbox({ open, images, active, name, onClose, onStep, onPick }: {
  open: boolean; images: Img[]; active: number; name: string;
  onClose: () => void; onStep: (by: number) => void; onPick: (i: number) => void;
}) {
  const box = useRef<HTMLDivElement>(null);
  const [mounted, setMounted] = useState(false);
  const several = images.length > 1;
  const img = images[active] ?? images[0];

  // eslint-disable-next-line react-hooks/set-state-in-effect -- the lightbox is portalled, which needs the document
  useEffect(() => setMounted(true), []);
  // Keeps focus inside the lightbox, closes on Escape and returns focus to the image button.
  useFocusTrap(box, open, onClose);

  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const key = (e: KeyboardEvent) => {
      if (!several) return;
      if (e.key === "ArrowRight") onStep(1);
      if (e.key === "ArrowLeft") onStep(-1);
    };
    document.addEventListener("keydown", key);
    return () => { document.body.style.overflow = prev; document.removeEventListener("keydown", key); };
  }, [open, several, onStep]);

  if (!mounted || !img) return null;
  const round = "grid h-12 w-12 place-items-center rounded-full bg-white/15 text-white transition-colors hover:bg-white hover:text-forest-deep";
  return createPortal(
    <AnimatePresence>
      {open && (
        <div key="lightbox" ref={box} role="dialog" aria-modal="true" aria-label={`${name} photo${several ? ` ${active + 1} of ${images.length}` : ""}`}
          className="fixed inset-0 z-[90] flex flex-col">
          <motion.div aria-hidden className="absolute inset-0 bg-forest-deep/95" onClick={onClose}
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }} />
          <motion.div className="relative flex items-center justify-between gap-3 px-4 py-3 text-white"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }}>
            <p className="min-w-0 truncate font-display font-semibold">
              {name}{several && <span className="ml-2 font-normal tabular-nums text-white/75">{active + 1} / {images.length}</span>}
            </p>
            <button type="button" onClick={onClose} aria-label="Close photo" className={round}><X aria-hidden /></button>
          </motion.div>

          <div className="relative flex min-h-0 flex-1 items-center justify-center px-3 pb-4 sm:px-16" onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}>
            <AnimatePresence mode="popLayout" initial={false}>
              <motion.img key={img.src} src={img.src} alt={img.alt || name} width={1024} height={1024} draggable={false}
                className="max-h-full w-auto max-w-full rounded-xl bg-white object-contain"
                initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }}
                transition={{ duration: 0.2, ease: "easeOut" }} />
            </AnimatePresence>
            {several && (
              <>
                <button type="button" onClick={() => onStep(-1)} aria-label="Previous photo" className={`${round} absolute left-3 top-1/2 -translate-y-1/2`}><ChevronLeft aria-hidden /></button>
                <button type="button" onClick={() => onStep(1)} aria-label="Next photo" className={`${round} absolute right-3 top-1/2 -translate-y-1/2`}><ChevronRight aria-hidden /></button>
              </>
            )}
          </div>

          {several && (
            <motion.ul aria-label={`${name} photos`} className="relative flex justify-center gap-3 px-4 pb-5"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }}>
              {images.map((t, i) => (
                <li key={t.src}>
                  <button type="button" onClick={() => onPick(i)} aria-pressed={i === active} aria-label={`Show photo ${i + 1} of ${images.length}`}
                    className="relative block overflow-hidden rounded-lg bg-white">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={t.src} alt="" width={64} height={64} className={`h-14 w-14 object-cover transition-opacity ${i === active ? "" : "opacity-60 hover:opacity-100"}`} />
                    {i === active && <span aria-hidden className="absolute inset-0 rounded-lg border-[3px] border-sun" />}
                  </button>
                </li>
              ))}
            </motion.ul>
          )}
        </div>
      )}
    </AnimatePresence>,
    document.body,
  );
}
