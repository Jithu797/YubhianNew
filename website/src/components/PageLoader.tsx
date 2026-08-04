"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";

export default function PageLoader() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // Client-only: this must run post-mount so the loader doesn't flash during SSR.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setVisible(true);
    const timer = setTimeout(() => setVisible(false), 1500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.4 }}
          className="fixed inset-0 z-[200] flex items-center justify-center"
          style={{ background: "var(--navy)" }}
        >
          <div className="flex items-center gap-3">
            <motion.div
              className="w-11 h-11 rounded-xl overflow-hidden shrink-0"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4, ease: "easeOut" }}
            >
              <Image src="/logo.jpg" alt="Yubhian Technologies" width={44} height={44} className="w-full h-full object-cover" priority />
            </motion.div>
            <motion.span
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4, delay: 0.3 }}
              className="text-2xl font-extrabold"
              style={{ fontFamily: "var(--font-syne)", color: "var(--white)" }}
            >
              Yubhian
            </motion.span>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
