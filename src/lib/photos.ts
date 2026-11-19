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
  "poongar-rice": P("p-poongar", "A Naadu Nalam pouch of Poongar rice beside a brass bowl of the light red rice"),
  "kalanamak-rice": P("p-kalanamak", "A Naadu Nalam pouch of Kalanamak rice beside a wooden bowl of the rice"),
  "kullakar-rice": P("p-kullakar", "A Naadu Nalam pouch of Kullakar rice beside a clay pot of the red rice"),
  "ratha-sali-rice": P("p-ratha-sali", "A Naadu Nalam pouch of Ratha Sali rice beside a terracotta pot of the rice"),
  "country-sugar-nattu-sakkarai": P("p-country-jaggery", "A Thaayanbu pouch of country jaggery beside a brass bowl and sugarcane pieces"),
  "kaatuyanam-rice": P("p-kattu-yanam", "A Naadu Nalam pouch of Kattu Yanam rice beside a wooden bowl of the red-brown rice"),
  "karunguruvai-rice": P("p-karunguruvai", "A Naadu Nalam pouch of Karunguruvai rice beside a brass bowl of the dark rice"),
  "thuya-malli-aval": P("p-thooyamalli-aval", "A Naadu Nalam pouch of Thooyamalli aval beside a bamboo basket of the white flakes"),
  "ratha-sali-aval": P("p-ratha-sali-aval", "A Naadu Nalam pouch of Ratha Sali aval beside a brass bowl of the red flakes"),
  "mappillai-samba-aval": P("p-mappillai-aval", "A Naadu Nalam pouch of Mappillai Samba aval beside a terracotta bowl of the red flakes"),
  "kichadi-samba-rice": P("p-kichili-samba", "A Naadu Nalam pouch of Kichili Samba rice beside a clay pot of the small white grains"),
  "ellu": P("p-sesame-seeds", "A Thaayanbu pouch of sesame seeds beside a brass bowl of black and white sesame, sesame plants behind"),
  "kuliyal-podi": P("p-bath-powder", "A Thaayanbu pouch of herbal bath powder beside a brass bowl of the powder with dried roses"),
  "aathur-kichadi-samba-aval": P("p-aathur-kichadi-aval", "A Naadu Nalam pouch of Aathur Kichadi Samba aval behind a carved wooden bowl of white flakes"),
  "vellai-kondakadalai": P("p-white-chickpeas", "A Naadu Nalam pouch of white chickpeas beside a terracotta pot of chickpeas"),
  "iluppai-poo-samba-aval": P("p-iluppai-poo-aval", "A Naadu Nalam pouch of Iluppai Poo Samba aval beside a terracotta bowl of flakes, paddy field behind"),
  "arubathaam-kuruvai-aval": P("p-arubathaam-aval", "A Naadu Nalam pouch of Arubathaam Kuruvai aval beside a brass uruli of reddish flakes on a kitchen counter"),
  "kuzhambu-podi": P("p-curry-powder", "A Thaayanbu pouch of curry powder on a banana leaf with a brass bowl of the powder and whole spices"),
  "pachai-payaru": P("p-green-gram", "A Naadu Nalam pouch of green gram beside a bamboo basket of whole moong on a kitchen counter"),
  "karuppu-kondakadalai": P("p-black-chickpeas", "A Naadu Nalam pouch of black chickpeas lying on a banana leaf beside a brass bowl of chickpeas"),
  "udal-suththi-kudal-suththi-maavu": P("p-cleansing-tea", "A Thaayanbu pouch of gut and body cleansing tea beside a bowl of tea powder and a glass of tea"),
  "kollu-yennai-horse-gram-oil": P("p-horse-gram-oil", "A Thaayanbu bottle of horse gram oil beside a brass bowl of horse gram, a wooden oil press behind"),
  "seekkai-podi": P("p-shikakai", "A Thaayanbu pouch of shikakai powder beside a brass bowl of the powder and dried shikakai pods"),
  "kallundai-samba-aval": P("p-kallundai-aval", "A Naadu Nalam pouch of Kallundai Samba aval beside a brass bowl of red-brown flakes, paddy field behind"),
  "milagai-podi": P("p-chilli-powder", "A Thaayanbu pouch of chilli powder beside a brass bowl of red chilli powder and dried chillies"),
  "siru-paruppu": P("p-split-green-gram", "A Naadu Nalam pouch of split green gram beside a brass bowl of split moong"),
  "panchakara-kudineer": P("p-panchakara", "A Thaayanbu pouch of Panchakara herbal drink on a banana leaf with a bowl of the powder and a cup of the drink"),
  "kudavaazhai-aval": P("p-kudavaazhai-aval", "A Naadu Nalam pouch of Kudavaazhai aval on a banana leaf beside a bowl of red flakes"),
  "kalanamak-aval": P("p-kalanamak-aval", "A Naadu Nalam pouch of Kalanamak aval on a banana leaf beside a clay bowl of dark brown flakes"),
  "urundai-vellam": P("p-round-jaggery", "A Thaayanbu pouch of round jaggery behind a bamboo basket of jaggery balls"),
  "nilakadalai": P("p-groundnuts", "A Naadu Nalam pouch of groundnuts behind a carved wooden bowl of red-skinned peanuts"),
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
  "oil-vinegers": "/img/m/p-gingelly-oil.webp",
  "natural-sweeteners": "/img/m/p-karupatti.webp",
  "siruthaniyam": "/img/m/p-kambu.webp",
  "health-mixes": "/img/m/p-kali-kanji.webp",
  "masala-podi": "/img/m/p-sambar.webp",
  "honey": "/img/m/p-honey.webp",
};
