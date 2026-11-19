import productsJson from "../data/products.json";
import categoriesJson from "../data/categories.json";
import storesJson from "../data/stores.json";
import postsJson from "../data/posts.json";
import policiesJson from "../data/policies.json";
import type { Category, Policy, Post, Product, Store } from "./types";
import { categoryPhotos, productPhotos } from "./photos";

export const products = (productsJson as Product[]).map((p) =>
  productPhotos[p.slug] ? { ...p, images: [productPhotos[p.slug], ...p.images] } : p);
export const categories = (categoriesJson as Category[]).map((c) =>
  categoryPhotos[c.slug] ? { ...c, image: categoryPhotos[c.slug] } : c);
export const stores = storesJson as Store[];
export const posts = postsJson as Post[];
export const policies = policiesJson as Record<string, Policy>;

export const getProduct = (slug: string) => products.find((p) => p.slug === slug);
export const getProductById = (id: number) => products.find((p) => p.id === id);
export const getCategory = (slug: string) => categories.find((c) => c.slug === slug);
export const getStore = (slug: string) => stores.find((s) => s.slug === slug);
export const getPost = (slug: string) => posts.find((p) => p.slug === slug);
export const productsInCategory = (slug: string) => products.filter((p) => p.categories.includes(slug));
export const productsByStore = (slug: string) => products.filter((p) => p.vendor === slug);
export const lowestPrice = (slug: string) => Math.min(...productsInCategory(slug).map((p) => p.price));

/** Site-wide facts. Change them here and every page follows. */
export const site = {
  name: "Naadu Nalam",
  nameTa: "நாடு நலம்",
  tagline: "Our Inclusive Well-Being",
  phone: "+91 90921 14630",
  phoneHref: "tel:+919092114630",
  whatsapp: "https://wa.me/919092114630",
  email: "hello@naadunalam.in",
  address: "Chennai, Tamil Nadu 600001, India",
  hours: "Monday to Saturday, 9:00 AM – 6:00 PM",
  deliveryFee: 50,
  deliveryLine: "Flat ₹50 delivery across Tamil Nadu",
  payment: "Cash on Delivery",
};

export const collaborators = [
  { slug: "tst-music-dance-academy", name: "TST Music & Dance Academy" },
  { slug: "tst-event-mgt", name: "TST Event Mgt" },
  { slug: "ignite-our-tharas-kids-kondaatam", name: "Ignite Our Tharas Kids Kondaatam" },
  { slug: "queen-bees-math-tutoring", name: "Queen Bee’s Math Tutoring" },
  { slug: "bharathanaatiyam", name: "Bharathanaatiyam" },
];
