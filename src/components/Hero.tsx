import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { HERO_IMAGE } from "@/data/cars";
import { MagneticButton } from "@/components/MagneticButton";
import { ArrowRightIcon, ChevronDownIcon } from "@/icons";

const TITLE = "THE ART OF AUTOMOTION";

const FLOATING_SPECS = [
  { label: "POWER", value: "2,107 HP", delay: 2.4, className: "float-slow md:left-[6%] md:top-[30%]", mobile: "left-[4%] top-[26%]" },
  { label: "TOP SPEED", value: "412 KM/H", delay: 2.7, className: "float-slower md:right-[7%] md:top-[38%]", mobile: "right-[4%] top-[38%]" },
  { label: "0–100 KM/H", value: "1.81 S", delay: 3.0, className: "float-slow md:right-[14%] md:bottom-[24%]", mobile: "right-[6%] bottom-[26%]" },
];

export function Hero() {
  const ref = useRef<HTMLElement>(null);
  const reduced = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const imageY = useTransform(scrollYProgress, [0, 1], ["0%", "22%"]);
  const imageScale = useTransform(scrollYProgress, [0, 1], [1.05, 1.18]);
  const contentY = useTransform(scrollYProgress, [0, 1], ["0%", "38%"]);
  const contentOpacity = useTransform(scrollYProgress, [0, 0.75], [1, 0]);

  return (
    <section ref={ref} id="home" className="relative flex min-h-[680px] flex-col overflow-hidden lg:min-h-[88vh]">
      {/* Backdrop photography with parallax */}
      <motion.div className="absolute inset-0" style={reduced ? undefined : { y: imageY, scale: imageScale }}>
        <img
          src={HERO_IMAGE}
          alt="Rimac Nevera R hypercar under dramatic blue lighting"
          className="cine h-full w-full object-cover object-center"
          width={1920}
          height={1080}
          fetchPriority="high"
        />
      </motion.div>
      <div className="vignette absolute inset-0" aria-hidden="true" />
      <div
        className="absolute inset-0 bg-gradient-to-r from-bg/80 via-transparent to-bg/40"
        aria-hidden="true"
      />

      {/* Animated aura glow */}
      <div className="pointer-events-none absolute -left-1/4 top-1/3 h-[60vmin] w-[60vmin] opacity-40" aria-hidden="true">
        <div className="aura h-full w-full rounded-full bg-[conic-gradient(from_120deg,transparent_0deg,rgba(61,125,255,0.16)_80deg,transparent_160deg)] blur-3xl" />
      </div>

      {/* Content */}
      <motion.div
        className="relative z-10 mx-auto flex w-full max-w-7xl flex-1 flex-col justify-center px-5 pb-28 pt-40 md:px-8 lg:pb-32"
        style={reduced ? undefined : { y: contentY, opacity: contentOpacity }}
      >
        <motion.p
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 2.0, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="font-mono text-[11px] uppercase tracking-[0.45em] text-accent-hi md:text-xs"
        >
          A Curated Car Showcase
        </motion.p>

        <h1 className="mt-6 max-w-4xl font-display text-[13vw] font-bold leading-[0.98] tracking-tight text-fg sm:text-6xl md:text-7xl xl:text-[86px]">
          {TITLE.split(" ").map((word, wi) => (
            <span key={wi} className="mr-[0.28em] inline-block whitespace-nowrap">
              {word.split("").map((ch, ci) => (
                <span
                  key={ci}
                  className="rise"
                  style={{ animationDelay: `${2.05 + wi * 0.28 + ci * 0.045}s` }}
                >
                  {ch}
                </span>
              ))}
            </span>
          ))}
        </h1>

        <motion.p
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 2.9, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="mt-6 max-w-xl text-base leading-relaxed text-silver md:text-lg"
        >
          An exhibition of automotive icons — from rotary legends to
          electric hypercars, displayed like centrepieces of a modern museum.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 3.1, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="mt-10 flex flex-wrap items-center gap-4"
        >
          <MagneticButton href="#collection">
            Enter the Gallery
            <ArrowRightIcon className="h-4 w-4" />
          </MagneticButton>
          <MagneticButton href="#featured" variant="ghost">
            Car of the Week
            <ChevronDownIcon className="h-4 w-4" />
          </MagneticButton>
        </motion.div>
      </motion.div>

      {/* Floating specifications */}
      {FLOATING_SPECS.map((s) => (
        <motion.div
          key={s.label}
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: s.delay, duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
          className={`absolute z-10 hidden sm:block ${s.mobile} ${s.className}`}
          aria-hidden="true"
        >
          <div className="glass rounded-2xl px-5 py-3.5 shadow-[0_16px_40px_-16px_rgba(0,0,0,0.8)]">
            <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-faint">{s.label}</p>
            <p className="mt-1 font-display text-xl font-semibold text-fg">{s.value}</p>
          </div>
        </motion.div>
      ))}

      {/* Scroll indicator */}
      <motion.a
        href="#collection"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 3.5, duration: 1 }}
        className="absolute bottom-7 left-1/2 z-10 flex -translate-x-1/2 flex-col items-center gap-3 text-faint transition-colors hover:text-silver"
        aria-label="Scroll to collection"
      >
        <span className="font-mono text-[10px] uppercase tracking-[0.4em]">Scroll</span>
        <span className="relative block h-12 w-px overflow-hidden bg-white/10">
          <span className="scroll-line absolute inset-0 bg-accent-hi" />
        </span>
      </motion.a>
    </section>
  );
}
