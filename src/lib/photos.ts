/**
 * Market Colours photography. Scene photos listed here by product slug are shown first on the card
 * and product page; the seller's original photos stay in the gallery after them. Packs carry the
 * real seller's brand: Naadu Nalam for its own store, Thaayanbu for Thaayanbu's products.
 * To swap in the client's real photos later, replace the files in public/img/m/ (same names).
 */
const P = (file: string, alt: string) => ({ src: `/img/m/${file}.webp`, alt });

export const productPhotos: Record<string, { src: string; alt: string }> = {
  // Naadu Nalam store
  "black-kavuni-rice": P("p-karuppu-kavuni", "A Naadu Nalam pouch of Karuppu Kavuni rice beside a wooden bowl of the black rice"),
  "mappillai-samba": P("p-mappillai-samba", "A Naadu Nalam pouch of Mappillai Samba rice beside a clay pot of the red rice"),
  "thooyamalli-rice": P("p-thooyamalli", "A Naadu Nalam pouch of Thooyamalli rice beside a brass bowl of the white rice"),
  "karuppu-kavuni-aval": P("p-kavuni-aval", "A Naadu Nalam pouch of Karuppu Kavuni aval beside a bamboo basket of the flakes"),
  "foxtail-millet-thinai": P("p-thinai", "A Naadu Nalam pouch of foxtail millet beside a wooden bowl of the millet"),
  "toor-dal": P("p-toor-dal", "A Naadu Nalam pouch of toor dal beside a brass bowl of split pigeon peas"),
  "karuppu-ulundhu": P("p-urad", "A Naadu Nalam pouch of black urad dal beside a clay bowl of the dal"),
  "kambu": P("p-kambu", "A Naadu Nalam pouch of pearl millet beside a clay bowl of the millet and millet ears"),
  // Thaayanbu
  "palm-jaggery-karupatti": P("p-karupatti", "Thaayanbu palm jaggery cakes on a banana leaf with a kraft tag"),
  "nallamaattu-nei": P("p-ghee", "A Thaayanbu jar of cow ghee with a brass spoon, cows grazing behind"),
  "cold-pressed-sesame-oil": P("p-gingelly-oil", "A Thaayanbu bottle of gingelly oil with a brass bowl and sesame seeds"),
  "groundnut-oil": P("p-groundnut-oil", "A Thaayanbu bottle of groundnut oil with a clay bowl and groundnuts"),
  "cold-pressed-coconut-oil": P("p-coconut-oil", "A Thaayanbu bottle of coconut oil with halved coconuts"),
  "sambar-podi": P("p-sambar", "A Thaayanbu pouch of sambar powder beside a brass bowl with red chillies"),
  "rasam-podi": P("p-rasam", "A Thaayanbu pouch of rasam powder beside a brass bowl with pepper and cumin"),
  "kali-kanji-maavu": P("p-kali-kanji", "A Thaayanbu pouch of kali kanji maavu beside a clay cup of ragi porridge"),
  "tulsi-infused-honey": P("p-honey", "A Thaayanbu jar of raw honey with honeycomb and a wooden dipper"),
  "panangkarkandu": P("p-palm-sugar", "A Thaayanbu jar of palm sugar crystals beside a palm leaf"),
};

export const categoryPhotos: Record<string, string> = {
  "rice-grains": "/img/m/p-mappillai-samba.webp",
  "aval-flakes": "/img/m/p-kavuni-aval.webp",
  "oil-vinegers": "/img/m/p-gingelly-oil.webp",
  "natural-sweeteners": "/img/m/p-karupatti.webp",
  "siruthaniyam": "/img/m/p-kambu.webp",
  "health-mixes": "/img/m/p-kali-kanji.webp",
  "paruppu-pulses": "/img/m/p-toor-dal.webp",
  "masala-podi": "/img/m/p-sambar.webp",
  "honey": "/img/m/p-honey.webp",
};
