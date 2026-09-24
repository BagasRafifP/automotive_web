import { motion, useReducedMotion } from "framer-motion";
import type { ReactNode } from "react";

export function Reveal({
  children,
  delay = 0,
  y = 36,
  className,
}: {
  children: ReactNode;
  delay?: number;
  y?: number;
  className?: string;
}) {
  const reduced = useReducedMotion();
  if (reduced) return <div className={className}>{children}</div>;
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.9, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}

export function SectionHeading({
  kicker,
  title,
  align = "left",
}: {
  kicker: string;
  title: ReactNode;
  align?: "left" | "center";
}) {
  return (
    <Reveal className={align === "center" ? "text-center" : undefined}>
      <p className="font-mono text-xs uppercase tracking-[0.35em] text-accent-hi">{kicker}</p>
      <h2 className="mt-4 font-display text-4xl font-semibold leading-[1.05] tracking-tight text-fg md:text-6xl">
        {title}
      </h2>
    </Reveal>
  );
}
