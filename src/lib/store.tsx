"use client";
import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import { getProductById, site } from "./data";
import type { Product } from "./types";

export type CartLine = { id: number; variantId?: number; qty: number };
export type Order = {
  number: string; date: string; lines: (CartLine & { name: string; pack: string; price: number })[];
  subtotal: number; delivery: number; total: number;
  customer: { name: string; phone: string; email: string; address: string; city: string; pincode: string; notes: string };
};
type State = { cart: CartLine[]; wishlist: number[]; compare: number[]; orders: Order[] };
const empty: State = { cart: [], wishlist: [], compare: [], orders: [] };
const KEY = "naadunalam-v1";
export const COMPARE_MAX = 4;

export function lineInfo(line: CartLine) {
  const product = getProductById(line.id) as Product | undefined;
  if (!product) return null;
  const variant = product.variants?.find((v) => v.id === line.variantId);
  const price = variant?.price ?? product.price;
  return { product, pack: variant?.pack ?? product.pack, price, total: price * line.qty };
}

type Ctx = State & {
  ready: boolean;
  count: number; subtotal: number; delivery: number; total: number;
  add: (id: number, qty?: number, variantId?: number) => void;
  setQty: (id: number, variantId: number | undefined, qty: number) => void;
  remove: (id: number, variantId?: number) => void;
  clearCart: () => void;
  toggleWishlist: (id: number) => void; clearWishlist: () => void;
  toggleCompare: (id: number) => void; clearCompare: () => void;
  placeOrder: (customer: Order["customer"]) => Order;
  drawerOpen: boolean; setDrawerOpen: (v: boolean) => void;
  toast: string; notify: (msg: string) => void;
};
const StoreContext = createContext<Ctx | null>(null);

export function StoreProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<State>(empty);
  const [ready, setReady] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [toast, setToast] = useState("");
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(KEY);
      // eslint-disable-next-line react-hooks/set-state-in-effect -- one-time read of saved basket after hydration
      if (raw) setState({ ...empty, ...JSON.parse(raw) });
    } catch {}
    setReady(true);
  }, []);
  useEffect(() => {
    if (!ready) return;
    try { localStorage.setItem(KEY, JSON.stringify(state)); } catch {}
  }, [state, ready]);

  const notify = useCallback((msg: string) => {
    setToast(msg);
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => setToast(""), 2600);
  }, []);

  const same = (l: CartLine, id: number, v?: number) => l.id === id && l.variantId === v;

  const value = useMemo<Ctx>(() => {
    const infos = state.cart.map(lineInfo).filter(Boolean) as NonNullable<ReturnType<typeof lineInfo>>[];
    const subtotal = infos.reduce((s, i) => s + i.total, 0);
    const delivery = state.cart.length ? site.deliveryFee : 0;
    return {
      ...state, ready, drawerOpen, setDrawerOpen, toast, notify,
      count: state.cart.reduce((s, l) => s + l.qty, 0), subtotal, delivery, total: subtotal + delivery,
      add: (id, qty = 1, variantId) => {
        const p = getProductById(id); if (!p) return;
        setState((s) => {
          const found = s.cart.find((l) => same(l, id, variantId));
          const cart = found
            ? s.cart.map((l) => (same(l, id, variantId) ? { ...l, qty: Math.min(l.qty + qty, p.maxQty) } : l))
            : [...s.cart, { id, variantId, qty: Math.min(qty, p.maxQty) }];
          return { ...s, cart };
        });
        notify(`Added ${p.name} to your basket`);
      },
      setQty: (id, variantId, qty) =>
        setState((s) => ({
          ...s,
          cart: qty <= 0 ? s.cart.filter((l) => !same(l, id, variantId)) : s.cart.map((l) => (same(l, id, variantId) ? { ...l, qty } : l)),
        })),
      remove: (id, variantId) => setState((s) => ({ ...s, cart: s.cart.filter((l) => !same(l, id, variantId)) })),
      clearCart: () => setState((s) => ({ ...s, cart: [] })),
      toggleWishlist: (id) => {
        const has = state.wishlist.includes(id);
        setState((s) => ({ ...s, wishlist: has ? s.wishlist.filter((x) => x !== id) : [...s.wishlist, id] }));
        notify(has ? "Removed from your wishlist" : "Saved to your wishlist");
      },
      clearWishlist: () => setState((s) => ({ ...s, wishlist: [] })),
      toggleCompare: (id) => {
        const has = state.compare.includes(id);
        if (!has && state.compare.length >= COMPARE_MAX) return notify(`You can compare up to ${COMPARE_MAX} products`);
        setState((s) => ({ ...s, compare: has ? s.compare.filter((x) => x !== id) : [...s.compare, id] }));
        notify(has ? "Removed from compare" : "Added to compare");
      },
      clearCompare: () => setState((s) => ({ ...s, compare: [] })),
      placeOrder: (customer) => {
        const lines = state.cart.flatMap((l) => {
          const i = lineInfo(l);
          return i ? [{ ...l, name: i.product.name, pack: i.pack, price: i.price }] : [];
        });
        const order: Order = {
          number: "NN-" + Date.now().toString().slice(-7), date: new Date().toISOString(),
          lines, subtotal, delivery, total: subtotal + delivery, customer,
        };
        setState((s) => ({ ...s, cart: [], orders: [order, ...s.orders] }));
        return order;
      },
    };
  }, [state, ready, drawerOpen, toast, notify]);

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
}

export function useStore() {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error("useStore must be used inside StoreProvider");
  return ctx;
}
