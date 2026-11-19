export type Variant = { id: number; pack: string; price: number };
export type Product = {
  id: number; slug: string; name: string; nameTa: string; sku: string;
  price: number; regularPrice: number; onSale: boolean; pack: string;
  variants: Variant[] | null; short: string; descriptionHtml: string;
  images: { src: string; alt: string }[]; categories: string[]; vendor: string;
  inStock: boolean; stock: number; maxQty: number;
};
export type Category = { id: number; slug: string; name: string; nameTa: string; description: string; count: number; image: string };
export type Store = { id: number; slug: string; name: string; phone: string; registered: string; productCount: number };
export type Post = { slug: string; title: string; date: string; excerpt: string; contentHtml: string; image: string };
export type Policy = { title: string; html: string };
