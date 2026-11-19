"use client";
import { useEffect, useState } from "react";
import ProductRail from "../ProductRail";
import { getProductById } from "../../lib/data";
import type { Product } from "../../lib/types";

const KEY = "naadunalam-recent-v1";
const KEEP = 8;

/** Remembers the last eight products opened on this device and shows the others as a rail. Hidden until there are at least two, so the rail never holds a lone card. */
export default function RecentlyViewed({ currentId }: { currentId: number }) {
  const [list, setList] = useState<Product[]>([]);

  useEffect(() => {
    let ids: number[] = [];
    try {
      const saved: unknown = JSON.parse(localStorage.getItem(KEY) ?? "[]");
      if (Array.isArray(saved)) ids = saved.filter((n): n is number => typeof n === "number");
    } catch {}
    const others = ids.filter((id) => id !== currentId);
    try { localStorage.setItem(KEY, JSON.stringify([currentId, ...others].slice(0, KEEP))); } catch {}
    // eslint-disable-next-line react-hooks/set-state-in-effect -- one-time read of this device's history after hydration
    setList(others.map(getProductById).filter((p): p is Product => Boolean(p)));
  }, [currentId]);

  if (list.length < 2) return null;
  return (
    <div className="border-t border-mist">
      <ProductRail id="recently-viewed" title="Recently viewed" blurb="Products you opened on this device." products={list} />
    </div>
  );
}
