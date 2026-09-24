import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { FEATURED_CAR } from "@/data/cars";
import { Reveal } from "@/components/Reveal";
import { MagneticButton } from "@/components/MagneticButton";
import { ArrowRightIcon } from "@/icons";

export function Featured({ onSelect }: { onSelect: (car: typeof FEATURED_CAR) => void }) {
  const ref = useRef<HTMLElement>(null);
  const reduced = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const imgY = useTransform(scrollYProgress, [0, 1], ["-12%", "12%"]);

  const car = FEATURED_CAR;

  return (
    <section ref={ref} id="featured" className="relative scroll-mt-24 py-24 md:py-32">
      {/* Backdrop aura */}
      <div
        className="pointer-events-none absolute left-1/2 top-1/2 h-[80vmin] w-[80vmin] -translate-x-1/2 -translate-y-1/2 opacity-30"
        aria-hidden="true"
      >
        <div className="aura h-full w-full rounded-full bg-[conic-gradient(from_40deg,transparent_0deg,rgba(61,125,255,0.14)_70deg,transparent_150deg)] blur-3xl" />
      </div>

      <div className="relative mx-auto max-w-7xl px-5 md:px-8">
        <Reveal className="flex flex-wrap items-end justify-between gap-6">
          <div>
            <p className="font-mono text-xs uppercase tracking-[0.35em] text-accent-hi">Car of the Week</p>
            <h2 className="mt-4 font-display text-4xl font-semibold leading-[1.05] tracking-tight text-fg md:text-6xl">
              Lamborghini Revuelto<span className="text-accent">.</span>
            </h2>
          </div>
          <p className="max-w-md text-sm leading-relaxed text-muted">
            Every week we put one machine under the spotlight — its engineering,
            its numbers, its theatre. This week: Sant'Agata's hybrid V12 flagship.
          </p>
        </Reveal>

        <Reveal delay={0.1} className="mt-12">
          <div className="group relative overflow-hidden rounded-[28px] border border-white/[0.08]">
            {/* Image */}
            <div className="relative aspect-[16/10] md:aspect-[21/9]">
              <motion.img
                src={car.image}
                alt={`${car.brand} ${car.model}`}
                width={1920}
                height={1080}
                loading="lazy"
                className="cine h-full w-full object-cover"
                style={reduced ? undefined : { y: imgY, scale: 1.18 }}
              />
              <div
                className="absolute inset-0 bg-gradient-to-t from-bg via-bg/30 to-transparent md:bg-gradient-to-r md:from-bg/95 md:via-bg/25 md:to-transparent"
                aria-hidden="true"
              />
            </div>

            {/* Overlay content */}
            <div className="absolute inset-x-0 bottom-0 p-6 md:inset-y-0 md:right-0 md:flex md:w-[46%] md:flex-col md:justify-center md:p-10 xl:p-14">
              <p className="font-mono text-[10px] uppercase tracking-[0.35em] text-accent-hi">
                {car.brand} · {car.year}
              </p>
              <h3 className="mt-2 font-display text-3xl font-bold tracking-tight text-fg md:text-5xl">
                {car.model}
              </h3>
              <p className="mt-4 hidden text-sm leading-relaxed text-silver md:block">{car.description}</p>

              <div className="mt-6 grid grid-cols-4 gap-2 md:gap-3">
                <MiniStat label="HP" value={`${car.horsepower}`} />
                <MiniStat label="0–100" value={`${car.zeroToHundred}s`} />
                <MiniStat label="V-MAX" value={`${car.topSpeed}`} />
                <MiniStat label="NM" value={`${car.torqueNm}`} />
              </div>

              <div className="mt-8">
                <MagneticButton onClick={() => onSelect(car)}>
                  View Exhibit
                  <ArrowRightIcon className="h-4 w-4" />
                </MagneticButton>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

function MiniStat({ label, value }: { label: string; value: string }) {
  return (
    <div className="glass rounded-2xl px-2 py-3 text-center md:px-3">
      <p className="font-mono text-[9px] uppercase tracking-[0.24em] text-faint">{label}</p>
      <p className="mt-1 font-display text-lg font-semibold text-fg md:text-xl">{value}</p>
    </div>
  );
}
