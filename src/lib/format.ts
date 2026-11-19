export const inr = (n: number) =>
  "₹" + n.toLocaleString("en-IN", { minimumFractionDigits: n % 1 ? 2 : 0, maximumFractionDigits: 2 });
export const longDate = (iso: string) =>
  new Date(iso + "T00:00:00").toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" });

/** "₹33 / 100 g" from a price and a pack label such as "500 g", "1 kg" or "500 ml". Empty when the pack is not a weight or volume. */
export function unitPrice(price: number, pack: string): string {
  const m = /^([\d.]+)\s*(g|kg|ml|l)$/i.exec(pack.trim());
  if (!m) return "";
  const qty = parseFloat(m[1]); const u = m[2].toLowerCase();
  const base = u === "kg" || u === "l" ? qty * 1000 : qty;
  if (!base) return "";
  return `${inr(Math.round((price / base) * 100))} / 100 ${u === "kg" || u === "g" ? "g" : "ml"}`;
}
