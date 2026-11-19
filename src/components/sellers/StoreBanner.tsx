import { isLabel } from "./storeInfo";

/** Every tile is a photograph that fills its frame. Label artwork is filtered out before it gets here. */
function Tile({ src, eager }: { src: string; eager: boolean }) {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img src={src} alt="" width={480} height={480} loading={eager ? "eager" : "lazy"} className="h-full w-full object-cover" />
  );
}

/** Round initial-letter avatar. There are no seller photos or logos in the data, so the monogram stands in. */
export function SellerMonogram({ monogram, tone, size = "md", className = "" }: {
  monogram: string; tone: string; size?: "sm" | "md" | "lg"; className?: string;
}) {
  const sizes = { sm: "h-11 w-11 text-xl", md: "h-14 w-14 text-2xl", lg: "h-20 w-20 text-4xl sm:h-24 sm:w-24 sm:text-5xl" };
  return (
    <span aria-hidden className={`grid shrink-0 place-items-center rounded-full font-display font-bold leading-none ${sizes[size]} ${tone} ${className}`}>
      {monogram}
    </span>
  );
}

/**
 * Storefront cover made from the seller's own product photos, with the round monogram avatar overlapping its lower edge.
 * Still images only. The avatar sits outside the clipped photo strip, so it is never cut off; leave about 3rem of
 * space below the banner for it.
 */
export default function StoreBanner({ images, monogram, tone, className = "" }: {
  images: string[]; monogram: string; tone: string; className?: string;
}) {
  const photos = images.filter((src) => !isLabel(src)).slice(0, 4);
  return (
    <div className="relative">
      {/* Equal tiles that always fill the full width, however many photos there are; the fourth joins from 640px. */}
      <div className={`flex h-36 w-full gap-px overflow-hidden bg-mist sm:h-48 lg:h-56 ${className}`}>
        {photos.map((src, i) => (
          <div key={src} className={`min-w-0 flex-1 basis-0 overflow-hidden bg-white ${i === 3 ? "hidden sm:block" : ""}`}><Tile src={src} eager /></div>
        ))}
      </div>
      <SellerMonogram monogram={monogram} tone={tone} size="lg" className="absolute -bottom-10 left-4 z-10 border-4 border-white sm:-bottom-12 sm:left-6" />
    </div>
  );
}

/**
 * Two-by-two photo collage for the sellers index card. When a second set of photos is given, the card's hover
 * (it must carry the `group` class) crossfades to it once, slowly; nothing moves on its own.
 */
export function SellerCollage({ images, hover = [], className = "" }: { images: string[]; hover?: string[]; className?: string }) {
  const photos = images.filter((src) => !isLabel(src));
  const second = hover.filter((src) => !isLabel(src));
  const grid = "absolute inset-0 grid grid-cols-2 gap-px bg-mist";
  return (
    <div className={`relative overflow-hidden bg-mist ${className}`}>
      <div className={`${grid} ${photos.length > 2 ? "grid-rows-2" : "grid-rows-1"}`}>
        {photos.map((src, i) => (
          <div key={src} className={`overflow-hidden bg-white ${photos.length % 2 === 1 && i === photos.length - 1 ? "col-span-2" : ""}`}><Tile src={src} eager={false} /></div>
        ))}
      </div>
      {photos.length === 4 && second.length === 4 && (
        <div aria-hidden className={`${grid} grid-rows-2 opacity-0 transition-opacity duration-700 ease-out group-hover:opacity-100`}>
          {second.map((src) => <div key={src} className="overflow-hidden bg-white"><Tile src={src} eager={false} /></div>)}
        </div>
      )}
    </div>
  );
}
