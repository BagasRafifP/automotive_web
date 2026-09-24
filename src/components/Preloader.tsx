import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useEffect, useState } from "react";

const LETTERS = "AUTOMOTIVE".split("");

export function Preloader() {
  const [done, setDone] = useState(false);
  const reduced = useReducedMotion();

  useEffect(() => {
    const t = window.setTimeout(() => setDone(true), reduced ? 150 : 1700);
    return () => window.clearTimeout(t);
  }, [reduced]);

  return (
    <AnimatePresence>
      {!done && (
        <motion.div
          className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-bg"
          exit={{ opacity: 0, filter: "blur(8px)" }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          aria-hidden="true"
        >
          <div className="flex overflow-hidden">
            {LETTERS.map((l, i) => (
              <motion.span
                key={i}
                className="font-display text-2xl font-semibold tracking-[0.45em] text-fg md:text-4xl"
                initial={{ opacity: 0, y: 28 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15 + i * 0.055, duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
              >
                {l}
              </motion.span>
            ))}
          </div>
          <motion.div
            className="mt-8 h-px w-40 origin-left bg-gradient-to-r from-transparent via-accent to-transparent"
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ delay: 0.2, duration: 1.25, ease: "easeInOut" }}
          />
          <motion.p
            className="mt-5 font-mono text-[10px] uppercase tracking-[0.4em] text-faint"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7, duration: 0.6 }}
          >
            The Art of Automotion
          </motion.p>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
