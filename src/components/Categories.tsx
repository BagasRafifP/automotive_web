import { CARS, CATEGORIES, type Car } from "@/data/cars";
import { Reveal, SectionHeading } from "@/components/Reveal";
import { ChevronLeftIcon, ChevronRightIcon } from "@/icons";
import { useRef } from "react";

export function Categories({ onSelect }: { onSelect: (car: Car) => void }) {
  return (
    <section id="categories" className="scroll-mt-24 overflow-hidden py-24 md:py-32">
      <div className="mx-auto max-w-7xl px-5 md:px-8">
        <SectionHeading
          kicker="Curated by Character"
          title={
            <>
              Categories<span className="text-accent">.</span>
            </>
          }
        />
        <p className="mt-5 max-w-2xl text-base leading-relaxed text-muted">
          Walk the halls by temperament — from supercar royalty to
          rally-bred warriors and silent electric violence.
        </p>
      </div>

      <div className="mt-14 space-y-14">
        {CATEGORIES.map((cat) => {
          const cars = CARS.filter((c) => c.categories.includes(cat));
          if (cars.length === 0) return null;
          return <CategoryRow key={cat} name={cat} cars={cars} onSelect={onSelect} />;
        })}
      </div>
    </section>
  );
}

function CategoryRow({
  name,
  cars,
  onSelect,
}: {
  name: string;
  cars: Car[];
  onSelect: (car: Car) => void;
}) {
  const scroller = useRef<HTMLDivElement>(null);

  const nudge = (dir: 1 | -1) => {
    scroller.current?.scrollBy({ left: dir * 420, behavior: "smooth" });
  };

  return (
    <Reveal>
      <div className="mx-auto max-w-7xl px-5 md:px-8">
        <div className="flex items-center justify-between gap-4">
          <h3 className="font-display text-2xl font-semibold tracking-tight text-fg md:text-3xl">
            {name}
            <span className="ml-3 align-middle font-mono text-xs font-normal tracking-[0.3em] text-faint">
              {cars.length.toString().padStart(2, "0")}
            </span>
          </h3>
          <div className="hidden gap-2 md:flex">
            <ArrowButton dir={-1} onClick={() => nudge(-1)} />
            <ArrowButton dir={1} onClick={() => nudge(1)} />
          </div>
        </div>
      </div>

      <div
        ref={scroller}
        className="no-scrollbar mt-6 flex snap-x snap-mandatory gap-5 overflow-x-auto scroll-px-6 px-5 pb-2 md:px-8"
        role="list"
        aria-label={`${name} cars`}
      >
        {cars.map((car) => (
          <button
            key={car.id}
            type="button"
            role="listitem"
            onClick={() => onSelect(car)}
            className="group relative w-[320px] shrink-0 snap-start overflow-hidden rounded-3xl border border-white/[0.07] text-left transition-all duration-500 hover:-translate-y-1.5 hover:border-white/[0.16] hover:shadow-[0_28px_64px_-24px_rgba(0,0,0,0.85)] md:w-[400px]"
            aria-label={`View details: ${car.brand} ${car.model}`}
          >
            <div className="relative aspect-[16/10] overflow-hidden">
              <img
                src={car.image}
                alt={`${car.brand} ${car.model}`}
                loading="lazy"
                width={1920}
                height={1080}
                className="cine h-full w-full object-cover transition-transform duration-[1100ms] ease-out group-hover:scale-105"
              />
              <div
                className="absolute inset-0 bg-gradient-to-t from-bg/95 via-bg/25 to-transparent transition-opacity duration-500 group-hover:from-bg/85"
                aria-hidden="true"
              />
              <div className="absolute bottom-0 left-0 right-0 p-5">
                <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-accent-hi">
                  {car.brand} · {car.year}
                </p>
                <p className="mt-1 font-display text-xl font-semibold text-fg">{car.model}</p>
                <p className="mt-2 font-mono text-[10px] uppercase tracking-[0.22em] text-muted opacity-0 transition-opacity duration-500 group-hover:opacity-100">
                  {car.horsepower} hp · {car.zeroToHundred}s · {car.topSpeed} km/h
                </p>
              </div>
            </div>
          </button>
        ))}
      </div>
    </Reveal>
  );
}

function ArrowButton({ dir, onClick }: { dir: 1 | -1; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={dir === 1 ? "Scroll right" : "Scroll left"}
      className="flex h-11 w-11 items-center justify-center rounded-full border border-white/10 bg-white/[0.04] text-silver transition-all duration-300 hover:border-accent/50 hover:text-accent-hi"
    >
      {dir === 1 ? <ChevronRightIcon className="h-4.5 w-4.5" /> : <ChevronLeftIcon className="h-4.5 w-4.5" />}
    </button>
  );
}
