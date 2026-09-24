import { motion, useReducedMotion } from "framer-motion";
import type { Car } from "@/data/cars";
import { ArrowRightIcon, BoltIcon, TimerIcon, WindIcon } from "@/icons";

export function CarCard({ car, onSelect }: { car: Car; onSelect: (car: Car) => void }) {
  const reduced = useReducedMotion();

  return (
    <motion.article
      layout
      initial={{ opacity: 0, scale: 0.94, y: 24 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.94, y: 12 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      className="group relative"
    >
      <button
        type="button"
        onClick={() => onSelect(car)}
        className="block w-full rounded-3xl text-left focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent"
        aria-label={`View details: ${car.brand} ${car.model}`}
        data-cursor
      >
        {/* Glow behind card */}
        <div
          aria-hidden="true"
          className="absolute -inset-px rounded-3xl bg-gradient-to-b from-accent/0 via-accent/0 to-accent/0 opacity-0 blur-xl transition-all duration-700 group-hover:from-accent/25 group-hover:via-accent/10 group-hover:to-transparent group-hover:opacity-100"
        />

        <div className="relative overflow-hidden rounded-3xl border border-white/[0.07] bg-charcoal transition-all duration-500 ease-out group-hover:-translate-y-2 group-hover:border-white/[0.14] group-hover:shadow-[0_32px_80px_-24px_rgba(0,0,0,0.85)]">
          {/* Image */}
          <div className="relative aspect-[16/10] overflow-hidden">
            <img
              src={car.image}
              alt={`${car.brand} ${car.model} ${car.year}`}
              width={1920}
              height={1080}
              loading="lazy"
              className={`cine h-full w-full object-cover transition-transform duration-[1200ms] ease-out ${
                reduced ? "" : "group-hover:scale-[1.07]"
              }`}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-charcoal via-charcoal/20 to-transparent" aria-hidden="true" />
            <div className="absolute left-4 top-4 flex gap-2" aria-hidden="true">
              <span className="glass rounded-full px-3 py-1 font-mono text-[10px] uppercase tracking-[0.2em] text-silver">
                {car.year}
              </span>
              <span className="glass rounded-full px-3 py-1 font-mono text-[10px] uppercase tracking-[0.2em] text-accent-hi">
                {car.perfCategory}
              </span>
            </div>
          </div>

          {/* Body */}
          <div className="relative px-6 pb-6 pt-5">
            <div className="flex items-baseline justify-between gap-3">
              <div>
                <p className="font-mono text-[11px] uppercase tracking-[0.3em] text-faint">{car.brand}</p>
                <h3 className="mt-1.5 font-display text-2xl font-semibold tracking-tight text-fg">
                  {car.model}
                </h3>
              </div>
              <p className="hidden shrink-0 text-right text-[11px] leading-snug text-muted sm:block">{car.country}</p>
            </div>

            <p className="mt-3 line-clamp-2 text-sm leading-relaxed text-muted">{car.description}</p>

            {/* Specs — always visible on touch, fade in on desktop hover */}
            <div className="mt-5 grid grid-cols-3 gap-3 border-t border-white/[0.06] pt-4 opacity-100 transition-all duration-500 md:translate-y-1.5 md:opacity-0 md:group-hover:translate-y-0 md:group-hover:opacity-100">
              <Spec icon={<BoltIcon className="h-4 w-4" />} label="HP" value={`${car.horsepower}`} />
              <Spec icon={<TimerIcon className="h-4 w-4" />} label="0–100" value={`${car.zeroToHundred}s`} />
              <Spec icon={<WindIcon className="h-4 w-4" />} label="V-MAX" value={`${car.topSpeed}`} />
            </div>

            <div className="mt-5 flex items-center gap-2 text-sm font-medium text-accent-hi opacity-100 transition-opacity duration-500 md:opacity-60 md:group-hover:opacity-100">
              View Details
              <ArrowRightIcon className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
            </div>
          </div>
        </div>
      </button>
    </motion.article>
  );
}

function Spec({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="rounded-xl bg-white/[0.03] px-3 py-2.5">
      <p className="flex items-center gap-1.5 font-mono text-[9px] uppercase tracking-[0.22em] text-faint">
        {icon}
        {label}
      </p>
      <p className="mt-1 font-display text-lg font-semibold text-fg">{value}</p>
    </div>
  );
}
