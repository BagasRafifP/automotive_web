import { AnimatePresence, motion } from "framer-motion";
import { useMemo, useState } from "react";
import { type Car } from "@/data/cars";
import { CarCard } from "@/components/CarCard";
import { SectionHeading } from "@/components/Reveal";
import { EMPTY_FILTERS, FilterBar, applyFilters, type Filters } from "@/components/FilterBar";

export function Collection({ onSelect }: { onSelect: (car: Car) => void }) {
  const [filters, setFilters] = useState<Filters>(EMPTY_FILTERS);
  const results = useMemo(() => applyFilters(filters), [filters]);

  return (
    <section id="collection" className="relative scroll-mt-24 py-24 md:py-32">
      {/* Ambient gradient */}
      <div className="pointer-events-none absolute inset-x-0 top-0 h-[480px] bg-[radial-gradient(60%_50%_at_50%_0%,rgba(61,125,255,0.07),transparent)]" aria-hidden="true" />

      <div className="mx-auto max-w-7xl px-5 md:px-8">
        <SectionHeading
          kicker="The Exhibition"
          title={
            <>
              The Gallery
              <span className="text-accent">.</span>
            </>
          }
        />
        <p className="mt-5 max-w-2xl text-base leading-relaxed text-muted">
          Twelve machines on display. Browse the collection by brand, origin,
          body style, engine philosophy or performance tier — a showcase for
          the love of machines, not a showroom for sale.
        </p>

        <div className="mt-10">
          <FilterBar filters={filters} onChange={setFilters} resultCount={results.length} />
        </div>

        <motion.div layout className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">
          <AnimatePresence mode="popLayout">
            {results.map((car) => (
              <CarCard key={car.id} car={car} onSelect={onSelect} />
            ))}
          </AnimatePresence>
        </motion.div>

        {results.length === 0 && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-10 rounded-3xl border border-dashed border-white/10 py-20 text-center"
          >
            <p className="font-display text-2xl font-semibold text-fg">No machines match</p>
            <p className="mt-3 text-sm text-muted">Loosen a filter or clear the search to see the full gallery.</p>
          </motion.div>
        )}
      </div>
    </section>
  );
}
