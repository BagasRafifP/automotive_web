import { CARS } from "@/data/cars";

export function Footer() {
  return (
    <footer className="border-t border-white/[0.06] bg-surface/40">
      <div className="mx-auto flex max-w-7xl flex-col gap-8 px-5 py-12 md:flex-row md:items-center md:justify-between md:px-8">
        <div>
          <p className="font-display text-lg font-bold tracking-[0.32em] text-fg">AUTOMOTIVE</p>
          <p className="mt-2 text-sm text-faint">The Art of Automotion — a cinematic car gallery.</p>
        </div>

        <p className="max-w-xl text-xs leading-relaxed text-faint">
          Photography via{" "}
          <a
            href="https://commons.wikimedia.org/"
            target="_blank"
            rel="noreferrer"
            className="text-silver underline decoration-white/20 underline-offset-4 transition-colors hover:text-accent-hi"
          >
            Wikimedia Commons
          </a>{" "}
          under CC BY / CC BY-SA / CC0 / public-domain licenses — per-image credits in the{" "}
          <a
            href="/credits.html"
            className="text-silver underline decoration-white/20 underline-offset-4 transition-colors hover:text-accent-hi"
          >
            full attribution list
          </a>
          . Vehicle names are trademarks of their respective manufacturers; this independent
          editorial gallery ({CARS.length} cars) is unaffiliated.
        </p>
      </div>
    </footer>
  );
}
