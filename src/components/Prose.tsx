/** Renders trusted HTML captured from the site's own CMS (policies, posts, product descriptions). */
export default function Prose({ html, className = "" }: { html: string; className?: string }) {
  return <div className={`prose-nn ${className}`} dangerouslySetInnerHTML={{ __html: html }} />;
}
