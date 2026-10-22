import { ChevronLeftIcon, ChevronRightIcon } from "@/icons";

export type PageItem = number | "gap";

/**
 * Numbered page list with gap markers.
 * Keeps at most 7 entries on screen: first, current ± siblings, last.
 */
export function buildPageItems(page: number, pageCount: number, siblings = 1): PageItem[] {
  if (pageCount <= 7) {
    return Array.from({ length: pageCount }, (_, i) => i + 1);
  }

  const items: PageItem[] = [1];
  const left = Math.max(2, page - siblings);
  const right = Math.min(pageCount - 1, page + siblings);

  if (left > 2) items.push("gap");
  for (let i = left; i <= right; i += 1) items.push(i);
  if (right < pageCount - 1) items.push("gap");
  items.push(pageCount);

  return items;
}

export function Pagination({
  page,
  pageCount,
  onChange,
  className = "",
}: {
  page: number;
  pageCount: number;
  onChange: (page: number) => void;
  className?: string;
}) {
  if (pageCount <= 1) return null;

  const items = buildPageItems(page, pageCount);
  const canPrev = page > 1;
  const canNext = page < pageCount;

  return (
    <nav aria-label="Gallery pagination" className={`flex items-center justify-center gap-2 ${className}`}>
      <ArrowButton dir="prev" disabled={!canPrev} onClick={() => onChange(page - 1)} />

      <div className="hidden items-center gap-1.5 sm:flex">
        {items.map((item, index) =>
          item === "gap" ? (
            <span key={`gap-${index}`} className="px-1 text-faint" aria-hidden="true">
              …
            </span>
          ) : (
            <button
              key={item}
              type="button"
              onClick={() => onChange(item)}
              aria-label={`Page ${item}`}
              aria-current={item === page ? "page" : undefined}
              className={`flex h-10 min-w-10 items-center justify-center rounded-xl border px-3 font-mono text-xs transition-all duration-300 ${
                item === page
                  ? "border-accent bg-accent text-white shadow-[0_12px_32px_-12px_rgba(61,125,255,0.8)]"
                  : "border-white/[0.08] text-silver hover:border-white/25 hover:text-fg"
              }`}
            >
              {item}
            </button>
          )
        )}
      </div>

      <span className="px-1 font-mono text-[11px] uppercase tracking-[0.22em] text-muted sm:hidden">
        {page} / {pageCount}
      </span>

      <ArrowButton dir="next" disabled={!canNext} onClick={() => onChange(page + 1)} />
    </nav>
  );
}

function ArrowButton({
  dir,
  disabled,
  onClick,
}: {
  dir: "prev" | "next";
  disabled: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={dir === "prev" ? "Previous page" : "Next page"}
      className="flex h-10 items-center gap-1.5 rounded-xl border border-white/[0.08] px-3 text-sm text-silver transition-all duration-300 enabled:hover:border-accent/50 enabled:hover:text-accent-hi disabled:cursor-not-allowed disabled:opacity-30"
    >
      {dir === "prev" ? <ChevronLeftIcon className="h-4 w-4" /> : null}
      <span className="hidden font-mono text-[10px] uppercase tracking-[0.22em] sm:inline">
        {dir === "prev" ? "Prev" : "Next"}
      </span>
      {dir === "next" ? <ChevronRightIcon className="h-4 w-4" /> : null}
    </button>
  );
}
