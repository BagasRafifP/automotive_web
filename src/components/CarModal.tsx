import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useEffect, useState } from "react";
import type { Car } from "@/data/cars";
import {
  BoltIcon,
  CloseIcon,
  CogIcon,
  GaugeIcon,
  TimerIcon,
  WeightIcon,
  WindIcon,
} from "@/icons";

export function CarModal({ car, onClose }: { car: Car | null; onClose: () => void }) {
  const reduced = useReducedMotion();
  const [activeImg, setActiveImg] = useState(0);

  useEffect(() => {
    setActiveImg(0);
  }, [car?.id]);

  useEffect(() => {
    if (!car) return;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [car, onClose]);

  const images = car ? [car.image, ...car.gallery] : [];

  return (
    <AnimatePresence>
      {car && (
        <motion.div
          className="fixed inset-0 z-[90] flex items-end justify-center sm:items-center sm:p-6"
          role="dialog"
          aria-modal="true"
          aria-label={`${car.brand} ${car.model} details`}
        >
          {/* Backdrop */}
          <motion.button
            type="button"
            aria-label="Close details"
            className="absolute inset-0 cursor-default bg-bg/80 backdrop-blur-2xl"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.45 }}
            onClick={onClose}
          />

          {/* Panel */}
          <motion.div
            className="relative z-10 max-h-[94dvh] w-full max-w-6xl overflow-y-auto rounded-t-[28px] border border-white/[0.09] bg-surface shadow-[0_48px_120px_-32px_rgba(0,0,0,0.95)] sm:rounded-[28px]"
            initial={reduced ? { opacity: 0 } : { opacity: 0, y: 90, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={reduced ? { opacity: 0 } : { opacity: 0, y: 60, scale: 0.97 }}
            transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
          >
            {/* Close */}
            <button
              type="button"
              onClick={onClose}
              aria-label="Close details"
              className="glass absolute right-4 top-4 z-20 flex h-11 w-11 items-center justify-center rounded-full text-fg transition-all duration-300 hover:rotate-90 hover:border-accent/50 hover:text-accent-hi"
            >
              <CloseIcon className="h-5 w-5" />
            </button>

            {/* Hero image — shared element transition from the card */}
            <div className="relative aspect-[16/9] overflow-hidden sm:rounded-t-[27px]">
              <AnimatePresence mode="wait">
                <motion.img
                  key={images[activeImg]}
                  src={images[activeImg]}
                  alt={`${car.brand} ${car.model}`}
                  className="cine absolute inset-0 h-full w-full object-cover"
                  initial={{ opacity: 0, scale: 1.06 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.99 }}
                  transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
                />
              </AnimatePresence>
              <div className="absolute inset-0 bg-gradient-to-t from-surface via-transparent to-bg/30" aria-hidden="true" />

              <motion.div
                className="absolute bottom-6 left-6 right-6 sm:bottom-8 sm:left-9"
                initial={{ opacity: 0, y: 22 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.25, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
              >
                <p className="font-mono text-[11px] uppercase tracking-[0.35em] text-accent-hi">
                  {car.brand} · {car.year} · {car.country}
                </p>
                <h3 className="mt-2 font-display text-4xl font-bold tracking-tight text-fg sm:text-6xl">
                  {car.model}
                </h3>
              </motion.div>
            </div>

            <div className="grid gap-8 px-6 py-8 sm:px-9 md:grid-cols-[1.35fr_1fr] md:py-10">
              {/* Left: description + key figures */}
              <div>
                <p className="text-[15px] leading-relaxed text-silver">{car.description}</p>

                <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-3">
                  <Figure icon={<BoltIcon className="h-4 w-4" />} label="Power" value={`${car.horsepower} hp`} />
                  <Figure icon={<GaugeIcon className="h-4 w-4" />} label="Torque" value={`${car.torqueNm} Nm`} />
                  <Figure icon={<TimerIcon className="h-4 w-4" />} label="0–100 km/h" value={`${car.zeroToHundred}s`} />
                  <Figure icon={<WindIcon className="h-4 w-4" />} label="Top Speed" value={`${car.topSpeed} km/h`} />
                  <Figure icon={<CogIcon className="h-4 w-4" />} label="Drivetrain" value={car.drivetrain} />
                  <Figure icon={<WeightIcon className="h-4 w-4" />} label="Weight" value={`${car.weightKg} kg`} />
                </div>

                <div className="mt-8 rounded-2xl border border-white/[0.07] bg-charcoal/70 px-5 py-4">
                  <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-faint">Engine</p>
                  <p className="mt-1.5 font-display text-lg font-medium text-fg">{car.engine}</p>
                </div>
              </div>

              {/* Right: gallery */}
              <div>
                <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-faint">Gallery</p>
                <div className="mt-4 flex flex-col gap-3">
                  {images.map((img, i) => (
                    <button
                      key={img}
                      type="button"
                      onClick={() => setActiveImg(i)}
                      aria-label={`Show photo ${i + 1}`}
                      className={`group relative aspect-[16/9] overflow-hidden rounded-2xl border transition-all duration-300 ${
                        activeImg === i
                          ? "border-accent/60 shadow-[0_0_32px_-8px_rgba(61,125,255,0.5)]"
                          : "border-white/[0.07] opacity-70 hover:opacity-100 hover:border-white/25"
                      }`}
                    >
                      <img
                        src={img}
                        alt={`${car.model} photo ${i + 1}`}
                        loading="lazy"
                        className="cine h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                      />
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function Figure({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-white/[0.06] bg-white/[0.03] px-4 py-3.5">
      <p className="flex items-center gap-1.5 font-mono text-[9px] uppercase tracking-[0.24em] text-faint">
        {icon}
        {label}
      </p>
      <p className="mt-1.5 font-display text-lg font-semibold text-fg">{value}</p>
    </div>
  );
}
