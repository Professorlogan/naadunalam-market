import { Stagger, StaggerItem } from "../motion";
import { LeafDot, TickMark } from "./fx";

/**
 * A plain list whose markers are the leaf shape from the logo. Items arrive one after another;
 * with `ticks` the markers are check marks that draw themselves in sequence.
 */
export default function LeafList({ items, dark = false, ticks = false, className = "" }: { items: React.ReactNode[]; dark?: boolean; ticks?: boolean; className?: string }) {
  return (
    <Stagger as="ul" gap={ticks ? 0.28 : 0.1} className={`space-y-3 ${className}`}>
      {items.map((item, i) => (
        <StaggerItem as="li" key={i} y={14} className="flex gap-3">
          {ticks ? <TickMark dark={dark} className="mt-[0.08em] h-[1.25em] w-[1.25em] shrink-0" /> : <LeafDot dark={dark} />}
          <span>{item}</span>
        </StaggerItem>
      ))}
    </Stagger>
  );
}
