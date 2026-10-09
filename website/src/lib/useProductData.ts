"use client";

import { useEffect, useState } from "react";

export type ProductData = {
  tagline: string;
  description: string;
  features: string[];
  waitlistCount: number;
};

// Defaults describe YuCampus, Yubhian's first product. The admin's Product editor
// (Firestore "product" document) overrides tagline, description and features.
export const PRODUCT_DEFAULTS: ProductData = {
  tagline: "YuCampus keeps every campus accreditation-ready, all year round",
  description:
    "A web-based platform that helps Indian colleges and universities prepare for NAAC, NBA and NIRF — faculty upload evidence all year, YuCampus organises it by criteria and generates ready-to-submit reports.",
  features: [
    "Faculty upload documents, photos and data from laptop or phone",
    "Everything organised under the right NAAC and NBA criteria",
    "IQAC sees what's complete and what's missing at a glance",
    "Ready-to-submit SSR, AQAR and SAR reports",
    "Rules update instantly when NAAC or NBA change formats",
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
