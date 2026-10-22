import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useMemo, useRef, useState } from "react";
import { CARS, type Car } from "@/data/cars";
import { CarCard } from "@/components/CarCard";
import { SectionHeading } from "@/components/Reveal";
import { EMPTY_FILTERS, FilterBar, applyFilters, type Filters } from "@/components/FilterBar";
import { Pagination } from "@/components/Pagination";

// 15 is the hard cap — one page never shows more than 15 machines.
const PAGE_SIZES = [6, 12, 15] as const;
const DEFAULT_PAGE_SIZE = 15;

export function Collection({ onSelect }: { onSelect: (car: Car) => void }) {
  const [filters, setFilters] = useState<Filters>(EMPTY_FILTERS);
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState<number>(DEFAULT_PAGE_SIZE);
  const gridRef = useRef<HTMLDivElement>(null);

  const results = useMemo(() => applyFilters(filters), [filters]);
  const pageCount = Math.max(1, Math.ceil(results.length / perPage));
  const currentPage = Math.min(page, pageCount);
  const firstIndex = (currentPage - 1) * perPage;
  const visible = results.slice(firstIndex, firstIndex + perPage);

  // Any filter or page-size change sends the visitor back to the first page.
  useEffect(() => {
    setPage(1);
  }, [filters, perPage]);

  const goToPage = (next: number) => {
    setPage(next);
    gridRef.current?.scrollIntoView?.({ behavior: "smooth", block: "start" });
  };

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
          {CARS.length} machines on display. Browse the collection by brand,
          origin, body style, engine philosophy or performance tier — a
          showcase for the love of machines, not a showroom for sale.
        </p>

        <div className="mt-10">
          <FilterBar filters={filters} onChange={setFilters} resultCount={results.length} />
        </div>

        <motion.div
          ref={gridRef}
          layout
          className="mt-10 grid scroll-mt-80 grid-cols-1 gap-6 sm:grid-cols-2 lg:scroll-mt-48 xl:grid-cols-3"
        >
          <AnimatePresence mode="popLayout" initial={false}>
            {visible.map((car) => (
              <CarCard key={car.id} car={car} onSelect={onSelect} />
            ))}
          </AnimatePresence>
        </motion.div>

        {results.length > 0 && (
          <div className="mt-12 flex flex-col items-center gap-6">
            <div className="flex w-full flex-wrap items-center justify-between gap-4">
              <p className="font-mono text-[10px] uppercase tracking-[0.28em] text-faint">
                Showing {firstIndex + 1}–{firstIndex + visible.length} of {results.length} machines
              </p>
              <label className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.28em] text-faint">
                Per page
                <select
                  value={perPage}
                  onChange={(e) => setPerPage(Number(e.target.value))}
                  aria-label="Cars per page"
                  className="h-9 appearance-none rounded-xl border border-white/[0.08] bg-bg/60 px-3 pr-7 font-mono text-[11px] tracking-normal text-silver transition-colors hover:border-white/20 focus:border-accent/60 focus:outline-none focus:ring-2 focus:ring-accent/25"
                >
                  {PAGE_SIZES.map((size) => (
                    <option key={size} value={size}>
                      {size}
                    </option>
                  ))}
                </select>
              </label>
            </div>

            <Pagination page={currentPage} pageCount={pageCount} onChange={goToPage} />
          </div>
        )}

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
