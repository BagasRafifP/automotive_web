import { motion } from "framer-motion";
import {
  BODY_TYPES,
  BRANDS,
  COUNTRIES,
  CARS,
  ENGINE_TYPES,
  PERF_CATEGORIES,
} from "@/data/cars";
import { CloseIcon, SearchIcon } from "@/icons";

export type Filters = {
  query: string;
  brand: string;
  country: string;
  bodyType: string;
  engineType: string;
  perf: string;
};

export const EMPTY_FILTERS: Filters = {
  query: "",
  brand: "",
  country: "",
  bodyType: "",
  engineType: "",
  perf: "",
};

const SELECTS: { key: keyof Omit<Filters, "query">; label: string; options: readonly string[] }[] = [
  { key: "brand", label: "Brand", options: BRANDS },
  { key: "country", label: "Country", options: COUNTRIES },
  { key: "bodyType", label: "Body Type", options: BODY_TYPES },
  { key: "engineType", label: "Engine", options: ENGINE_TYPES },
  { key: "perf", label: "Performance", options: PERF_CATEGORIES },
];

export function applyFilters(filters: Filters) {
  const q = filters.query.trim().toLowerCase();
  return CARS.filter((c) => {
    if (q && !`${c.brand} ${c.model}`.toLowerCase().includes(q)) return false;
    if (filters.brand && c.brand !== filters.brand) return false;
    if (filters.country && c.country !== filters.country) return false;
    if (filters.bodyType && c.bodyType !== filters.bodyType) return false;
    if (filters.engineType && c.engineType !== filters.engineType) return false;
    if (filters.perf && c.perfCategory !== filters.perf) return false;
    return true;
  });
}

export function FilterBar({
  filters,
  onChange,
  resultCount,
}: {
  filters: Filters;
  onChange: (f: Filters) => void;
  resultCount: number;
}) {
  const set = (key: keyof Filters, value: string) => onChange({ ...filters, [key]: value });
  const active =
    filters.query !== "" ||
    filters.brand !== "" ||
    filters.country !== "" ||
    filters.bodyType !== "" ||
    filters.engineType !== "" ||
    filters.perf !== "";

  return (
    <div className="glass sticky top-[84px] z-[60] rounded-3xl p-4 shadow-[0_24px_64px_-32px_rgba(0,0,0,0.9)] md:p-5">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
        {/* Search */}
        <label className="relative flex flex-1 items-center">
          <SearchIcon className="pointer-events-none absolute left-4 h-4.5 w-4.5 text-faint" />
          <input
            type="search"
            value={filters.query}
            onChange={(e) => set("query", e.target.value)}
            placeholder="Search by name — try 'Supra'…"
            aria-label="Search cars by name"
            className="h-12 w-full rounded-2xl border border-white/[0.08] bg-bg/60 pl-11 pr-10 text-sm text-fg placeholder:text-faint focus:border-accent/60 focus:outline-none focus:ring-2 focus:ring-accent/25"
          />
          {filters.query && (
            <button
              type="button"
              onClick={() => set("query", "")}
              className="absolute right-3 flex h-7 w-7 items-center justify-center rounded-full text-faint hover:text-fg"
              aria-label="Clear search"
            >
              <CloseIcon className="h-4 w-4" />
            </button>
          )}
        </label>

        {/* Selects */}
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:flex lg:shrink-0">
          {SELECTS.map((s) => (
            <div key={s.key} className="relative">
              <select
                value={filters[s.key]}
                onChange={(e) => set(s.key, e.target.value)}
                aria-label={`Filter by ${s.label.toLowerCase()}`}
                className={`h-12 w-full appearance-none rounded-2xl border px-4 pr-9 text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-accent/25 lg:w-auto ${
                  filters[s.key]
                    ? "border-accent/50 bg-accent/[0.12] text-accent-hi"
                    : "border-white/[0.08] bg-bg/60 text-silver hover:border-white/20"
                }`}
              >
                <option value="">{s.label}</option>
                {s.options.map((o) => (
                  <option key={o} value={o}>
                    {o}
                  </option>
                ))}
              </select>
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth={1.8}
                strokeLinecap="round"
                strokeLinejoin="round"
                className="pointer-events-none absolute right-3.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-faint"
                aria-hidden="true"
              >
                <path d="m6 9 6 6 6-6" />
              </svg>
            </div>
          ))}

          {active && (
            <motion.button
              type="button"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              onClick={() => onChange(EMPTY_FILTERS)}
              className="col-span-2 flex h-12 items-center justify-center gap-2 rounded-2xl border border-white/[0.08] px-4 text-sm text-muted transition-colors hover:border-white/25 hover:text-fg sm:col-span-1"
            >
              <CloseIcon className="h-3.5 w-3.5" />
              Reset
            </motion.button>
          )}
        </div>
      </div>

      <p className="mt-3 px-1 font-mono text-[10px] uppercase tracking-[0.28em] text-faint">
        {resultCount} of {CARS.length} machines
      </p>
    </div>
  );
}
