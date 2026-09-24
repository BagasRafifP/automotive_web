import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";
import { CloseIcon, MenuIcon } from "@/icons";

const LINKS = [
  { label: "Home", href: "#home" },
  { label: "Gallery", href: "#collection" },
  { label: "Categories", href: "#categories" },
  { label: "Featured", href: "#featured" },
  { label: "About", href: "#about" },
];

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <>
      <motion.header
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 1.9, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        className={`fixed inset-x-0 top-0 z-[80] transition-all duration-500 ${
          scrolled ? "border-b border-white/[0.06] bg-bg/70 backdrop-blur-xl" : "bg-transparent"
        }`}
      >
        <nav className="mx-auto flex h-[72px] max-w-7xl items-center justify-between px-5 md:px-8" aria-label="Main navigation">
          <a href="#home" className="font-display text-lg font-bold tracking-[0.32em] text-fg transition-colors hover:text-accent-hi">
            AUTOMOTIVE
          </a>

          <ul className="hidden items-center gap-9 md:flex">
            {LINKS.map((l) => (
              <li key={l.href}>
                <a
                  href={l.href}
                  className="group relative text-[13px] font-medium tracking-[0.18em] text-silver uppercase transition-colors hover:text-fg"
                >
                  {l.label}
                  <span className="absolute -bottom-1.5 left-0 h-px w-0 bg-accent transition-all duration-300 group-hover:w-full" />
                </a>
              </li>
            ))}
          </ul>

          <button
            type="button"
            className="flex h-11 w-11 items-center justify-center rounded-xl border border-white/10 bg-white/[0.04] text-fg md:hidden"
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
          >
            {open ? <CloseIcon className="h-5 w-5" /> : <MenuIcon className="h-5 w-5" />}
          </button>
        </nav>
      </motion.header>

      <AnimatePresence>
        {open && (
          <motion.div
            className="fixed inset-0 z-[75] flex flex-col justify-center bg-bg/95 px-8 backdrop-blur-2xl md:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <ul className="space-y-2">
              {LINKS.map((l, i) => (
                <motion.li
                  key={l.href}
                  initial={{ opacity: 0, x: -28 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.08 + i * 0.06, duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                >
                  <a
                    href={l.href}
                    onClick={() => setOpen(false)}
                    className="block py-3 font-display text-4xl font-semibold tracking-tight text-fg transition-colors active:text-accent-hi"
                  >
                    {l.label}
                  </a>
                </motion.li>
              ))}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
