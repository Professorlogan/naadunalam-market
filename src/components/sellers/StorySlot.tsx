/**
 * Placeholder for a story the seller has not supplied. The marketplace holds no seller story yet, so the slot says
 * so in one plain sentence instead of filling the space with invented copy. Shown on the store page only.
 */
export default function StorySlot({ name }: { name: string }) {
  return (
    <p className="rounded-xl border border-mist bg-white p-5 text-muted">
      {name} has not added their story yet.
    </p>
  );
}
