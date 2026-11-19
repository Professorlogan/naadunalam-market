import { Fragment } from "react";

/**
 * A web address that may wrap only after a "/". Each part between slashes is kept whole and moves to the
 * next line as a unit; a part is split only if it is longer than the whole line (a very long shop URL on a phone).
 */
export default function ShopUrl({ url, className = "" }: { url: string; className?: string }) {
  const parts = url.split("/");
  return (
    <span className={className}>
      {parts.map((part, i) => (
        <Fragment key={i}>
          <span className="inline-block max-w-full align-bottom [overflow-wrap:anywhere]">{part}{i < parts.length - 1 ? "/" : ""}</span>
          {i < parts.length - 1 && <wbr />}
        </Fragment>
      ))}
    </span>
  );
}
