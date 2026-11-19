/** Server-side parsing of the captured policy HTML. Plain string handling: the markup is our own CMS export. */

export type TocItem = { id: string; label: string };
export type ParsedPolicy = {
  title: string | null;
  intro: string | null;
  updated: { label: string; iso: string | null } | null;
  toc: TocItem[];
  body: string;
};

const ENTITIES: Record<string, string> = { amp: "&", lt: "<", gt: ">", quot: '"', apos: "'", nbsp: " ", rsquo: "’", lsquo: "‘", ndash: "–", mdash: "—" };

export function plainText(html: string) {
  return html
    .replace(/<[^>]+>/g, "")
    .replace(/&#(\d+);/g, (_, n: string) => String.fromCodePoint(Number(n)))
    .replace(/&#x([0-9a-f]+);/gi, (_, n: string) => String.fromCodePoint(parseInt(n, 16)))
    .replace(/&([a-z]+);/gi, (m, name: string) => ENTITIES[name.toLowerCase()] ?? m)
    .replace(/\s+/g, " ")
    .trim();
}

function slugify(text: string) {
  return text.toLowerCase().replace(/^\d+[.)]\s*/, "").replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "") || "section";
}

const MONTHS = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

/** The policies carry dates as dd/mm/yyyy. Anything else is shown exactly as written. */
function parseDate(text: string) {
  const m = text.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/);
  if (!m) return { label: text, iso: null };
  const [d, mo, y] = [Number(m[1]), Number(m[2]), Number(m[3])];
  if (mo < 1 || mo > 12 || d < 1 || d > 31) return { label: text, iso: null };
  return { label: `${d} ${MONTHS[mo - 1]} ${y}`, iso: `${y}-${String(mo).padStart(2, "0")}-${String(d).padStart(2, "0")}` };
}

/** Internal links in the captured HTML end in "/" (the old site's style); this site's routes do not. */
export function tidyInternalHrefs(html: string) {
  return html.replace(/href="(\/(?!\/)[^"#?]*?)\/+((?:[?#][^"]*)?)"/g, (_, path: string, rest: string) => `href="${path || "/"}${rest}"`);
}

export function parsePolicy(source: string): ParsedPolicy {
  let html = tidyInternalHrefs(source);

  // 1. The h1 moves to the page hero, so the page keeps exactly one.
  let title: string | null = null;
  html = html.replace(/<h1[^>]*>([\s\S]*?)<\/h1>/i, (_, inner: string) => { title = plainText(inner); return ""; });
  html = html.replace(/<h1([^>]*)>([\s\S]*?)<\/h1>/gi, "<h2$1>$2</h2>"); // any stray extra h1 is demoted

  // 2. "Last updated" becomes a dated note.
  let updated: ParsedPolicy["updated"] = null;
  html = html.replace(/<p[^>]*>\s*Last updated\s*:?\s*([\s\S]*?)<\/p>/i, (_, inner: string) => { updated = parseDate(plainText(inner)); return ""; });

  // 3. The in-body "On this page" list is replaced by our own table of contents; its anchors name the sections.
  let listIds: string[] = [];
  html = html.replace(/<p[^>]*>\s*On this page\s*<\/p>\s*<(ol|ul)[^>]*>([\s\S]*?)<\/\1>/i, (_, _tag: string, inner: string) => {
    listIds = [...inner.matchAll(/href="#([^"]+)"/g)].map((m) => m[1]);
    return "";
  });

  // 4. Every h2 gets an id: its own, else the matching anchor from the old list, else a slug of its text.
  const headingCount = (html.match(/<h2[\s>]/gi) ?? []).length;
  const useListIds = listIds.length === headingCount && new Set(listIds).size === listIds.length;
  const used = new Set<string>();
  const toc: TocItem[] = [];
  let index = 0;
  html = html.replace(/<h2([^>]*)>([\s\S]*?)<\/h2>/gi, (_, attrs: string, inner: string) => {
    const label = plainText(inner);
    const existing = attrs.match(/\sid="([^"]+)"/)?.[1];
    let id = existing ?? (useListIds ? listIds[index] : slugify(label));
    if (!existing) {
      const base = id;
      for (let n = 2; used.has(id); n++) id = `${base}-${n}`;
    }
    used.add(id);
    index++;
    toc.push({ id, label });
    return existing ? `<h2${attrs}>${inner}</h2>` : `<h2${attrs} id="${id}">${inner}</h2>`;
  });

  // 5. A single plain opening paragraph is lifted into the hero as the intro.
  html = html.trim();
  let intro: string | null = null;
  const firstH2 = html.search(/<h2[\s>]/i);
  const lead = (firstH2 === -1 ? html : html.slice(0, firstH2)).trim();
  const single = lead.match(/^<p>([^<]+)<\/p>$/);
  if (single) {
    intro = plainText(single[1]);
    html = firstH2 === -1 ? "" : html.slice(firstH2);
  }

  return { title, intro, updated, toc, body: html };
}
