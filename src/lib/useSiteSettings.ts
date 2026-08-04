"use client";

import { useEffect, useState } from "react";

export type SiteSettings = {
  hero_title: string;
  typewriter_words: string[];
  hero_subtitle: string;
  cta_primary: string;
  cta_secondary: string;
  stat_projects: number;
  stat_clients: number;
  stat_team: number;
  stat_years: number;
  cta_banner_title: string;
  cta_banner_subtitle: string;
  contact_email: string;
  address: string;
  linkedin_url: string;
  twitter_url: string;
  instagram_url: string;
};

export const SITE_SETTINGS_DEFAULTS: SiteSettings = {
  hero_title: "We Build Intelligent",
  typewriter_words: ["AI Solutions", "Web Applications", "Mobile Apps", "Digital Products", "SaaS Platforms"],
  hero_subtitle: "Yubhian Technologies delivers enterprise-grade IT solutions from Andhra Pradesh, India. We turn innovative ideas into powerful digital products.",
  cta_primary: "Explore Our Services",
  cta_secondary: "See Our Work",
  stat_projects: 15,
  stat_clients: 10,
  stat_team: 15,
  stat_years: 1,
  cta_banner_title: "Ready to build something great?",
  cta_banner_subtitle: "Let's turn your idea into a powerful digital product. Talk to us today.",
  contact_email: "info@yubhiantechnologies.in",
  address: "Kaikaluru, Andhra Pradesh, India",
  linkedin_url: "https://linkedin.com/company/yubhian-technologies",
  twitter_url: "",
  instagram_url: "",
};

/** Fetches the single site_settings document from Firestore, falling back to sensible
 *  defaults when Firestore isn't reachable or the collection is empty.
 *  Shared by Hero, Stats, and CTABanner so they don't each fetch the same document. */
export function useSiteSettings() {
  const [settings, setSettings] = useState<SiteSettings>(SITE_SETTINGS_DEFAULTS);

  useEffect(() => {
    (async () => {
      try {
        const { db } = await import("./firebase");
        const { collection, getDocs, limit, query } = await import("firebase/firestore");
        const snap = await getDocs(query(collection(db, "site_settings"), limit(1)));
        if (!snap.empty) {
          setSettings({ ...SITE_SETTINGS_DEFAULTS, ...(snap.docs[0].data() as Partial<SiteSettings>) });
        }
      } catch {
        // Firestore not reachable yet — keep defaults
      }
    })();
  }, []);

  return settings;
}
