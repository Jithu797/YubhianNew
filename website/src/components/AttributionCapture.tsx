"use client";

import { useEffect } from "react";
import { captureAttribution } from "@/lib/attribution";

/** Records an outreach campaign tag (?ref=…) from the landing URL — see lib/attribution. */
export default function AttributionCapture() {
  useEffect(() => {
    captureAttribution();
  }, []);
  return null;
}
