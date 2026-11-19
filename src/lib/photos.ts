/**
 * Market Colours photography. New scene photos are listed here by product slug and are shown first
 * on the card and the product page; the seller's original photos stay in the gallery after them.
 * To swap in the client's real photos later, replace the files in public/img/m/ (same names).
 */
const P = (file: string, alt: string) => ({ src: `/img/m/${file}.webp`, alt });

export const productPhotos: Record<string, { src: string; alt: string }> = {
  "black-kavuni-rice": P("p-karuppu-kavuni", "Black Karuppu Kavuni rice heaped in a wooden bowl with paddy stalks"),
  "mappillai-samba": P("p-mappillai-samba", "Red Mappillai Samba rice in a terracotta pot with a wooden scoop"),
  "palm-jaggery-karupatti": P("p-karupatti", "Palm jaggery cakes stacked on a banana leaf beside a palmyra leaf"),
  "nallamaattu-nei": P("p-ghee", "A jar of traditional ghee with a brass spoon, cows grazing behind"),
  "cold-pressed-sesame-oil": P("p-gingelly-oil", "A bottle of gingelly oil with a brass bowl and sesame seeds"),
};

export const categoryPhotos: Record<string, string> = {
  "rice-grains": "/img/m/p-mappillai-samba.webp",
  "oil-vinegers": "/img/m/p-gingelly-oil.webp",
  "natural-sweeteners": "/img/m/p-karupatti.webp",
  "siruthaniyam": "/img/m/promo-millets.webp",
  "health-mixes": "/img/m/promo-health.webp",
};
