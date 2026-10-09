"use client";

import { usePathname } from "next/navigation";
import { motion, useReducedMotion } from "framer-motion";

// Enter-only fade: the new page appears as soon as it is ready. An exit phase
// (AnimatePresence mode="wait") made every click wait for the old page to fade out
// before the new one could appear, which read as slow navigation. Opacity only — a
// transform here would re-anchor the fixed stage, navbar and tab bar mid-animation.
export default function PageTransition({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const reduceMotion = useReducedMotion();
  return (
    <motion.div
      key={pathname}
      initial={reduceMotion ? false : { opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.35, ease: [0.165, 0.84, 0.44, 1] }}
    >
      {children}
    </motion.div>
  );
}
