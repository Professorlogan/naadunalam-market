/** The logo's five elements — leaf, soil, water, sun, sky — as one band. Used as the site's divider. */
export default function ElementStrip({ className = "" }: { className?: string }) {
  return (
    <div aria-hidden className={`flex h-1.5 w-full ${className}`}>
      <span className="flex-[3] bg-leaf" />
      <span className="flex-[2] bg-soil" />
      <span className="flex-[3] bg-water" />
      <span className="flex-[2] bg-sun" />
    </div>
  );
}
