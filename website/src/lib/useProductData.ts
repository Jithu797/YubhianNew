"use client";

import { useEffect, useState } from "react";

export type ProductData = {
  tagline: string;
  description: string;
  features: string[];
  waitlistCount: number;
};

export const PRODUCT_DEFAULTS: ProductData = {
  tagline: "Something powerful is coming",
  description: "We are not just a services company. Yubhian is building its own product — designed to solve a real problem for businesses across India.",
  features: [
    "AI-powered insights built in from day one",
    "Designed for Indian SMEs and enterprises alike",
    "Seamless integration with your existing stack",
    "Enterprise-grade security and reliability",
    "Continuous updates based on real user feedback",
  ],
  waitlistCount: 0,
};

/** Fetches the single product document from Firestore, falling back to defaults when
 *  Firestore isn't reachable yet. Shared by the homepage spotlight and the /product page. */
export function useProductData() {
  const [product, setProduct] = useState<ProductData>(PRODUCT_DEFAULTS);

  useEffect(() => {
    (async () => {
      try {
        const { db } = await import("./firebase");
        const { collection, getDocs, limit, query } = await import("firebase/firestore");
        const snap = await getDocs(query(collection(db, "product"), limit(1)));
        if (!snap.empty) {
          const d = snap.docs[0].data();
          setProduct({
            tagline: d.tagline || PRODUCT_DEFAULTS.tagline,
            description: d.description || PRODUCT_DEFAULTS.description,
            features: d.features?.length ? d.features : PRODUCT_DEFAULTS.features,
            waitlistCount: d.waitlist_count ?? 0,
          });
        }
      } catch {
        // Firestore not reachable yet — keep defaults
      }
    })();
  }, []);

  return product;
}
