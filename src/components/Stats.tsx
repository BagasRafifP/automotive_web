import { animate, useInView, useReducedMotion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { Reveal } from "@/components/Reveal";

function Counter({
  to,
  decimals = 0,
  suffix = "",
  duration = 2,
}: {
  to: number;
  decimals?: number;
  suffix?: string;
  duration?: number;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  const reduced = useReducedMotion();
  const [value, setValue] = useState(0);

  useEffect(() => {
    if (!inView) return;
    if (reduced) {
      setValue(to);
      return;
    }
    const controls = animate(0, to, {
      duration,
      ease: [0.16, 1, 0.3, 1],
      onUpdate: (v) => setValue(v),
    });
    return () => controls.stop();
  }, [inView, to, reduced, duration]);

  const formatted = value.toLocaleString("en-US", {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });

  return (
    <span ref={ref}>
      {formatted}
      {suffix}
    </span>
  );
}

const STATS = [
  { value: 12, label: "Curated Icons", decimals: 0, suffix: "" },
  { value: 7918, label: "Combined Horsepower", decimals: 0, suffix: " HP" },
  { value: 1.81, label: "Fastest 0–100 km/h", decimals: 2, suffix: " S" },
  { value: 412, label: "Top Speed Record", decimals: 0, suffix: " KM/H" },
];

export function Stats() {
  return (
    <section className="relative border-y border-white/[0.06] bg-surface/60">
      <div className="mx-auto grid max-w-7xl grid-cols-2 gap-x-6 gap-y-10 px-5 py-14 md:grid-cols-4 md:px-8 md:py-16">
        {STATS.map((s, i) => (
          <Reveal key={s.label} delay={i * 0.08}>
            <div className="text-center md:text-left">
              <p className="font-display text-4xl font-semibold tracking-tight text-fg md:text-5xl">
                <Counter to={s.value} decimals={s.decimals} suffix={s.suffix} />
              </p>
              <p className="mt-2.5 font-mono text-[10px] uppercase tracking-[0.28em] text-faint md:text-[11px]">
                {s.label}
              </p>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
