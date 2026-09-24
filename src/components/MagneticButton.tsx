import { useRef, type ReactNode, type MouseEvent } from "react";
import { useReducedMotion } from "framer-motion";

/** Button that leans toward the pointer while hovered. */
export function MagneticButton({
  children,
  className = "",
  strength = 0.35,
  onClick,
  href,
  variant = "primary",
}: {
  children: ReactNode;
  className?: string;
  strength?: number;
  onClick?: () => void;
  href?: string;
  variant?: "primary" | "ghost";
}) {
  const ref = useRef<HTMLAnchorElement | HTMLButtonElement>(null);
  const reduced = useReducedMotion();

  const handleMove = (e: MouseEvent) => {
    if (reduced || !ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const dx = e.clientX - (rect.left + rect.width / 2);
    const dy = e.clientY - (rect.top + rect.height / 2);
    ref.current.style.transform = `translate(${dx * strength}px, ${dy * strength}px)`;
  };

  const reset = () => {
    if (ref.current) ref.current.style.transform = "";
  };

  const styles =
    variant === "primary"
      ? "bg-accent text-white shadow-[0_8px_40px_-8px_rgba(61,125,255,0.65)] hover:bg-accent-hi hover:shadow-[0_10px_48px_-6px_rgba(61,125,255,0.8)]"
      : "border border-white/15 bg-white/[0.04] text-fg backdrop-blur-md hover:border-white/30 hover:bg-white/[0.08]";

  const cls = `group relative inline-flex items-center justify-center gap-2.5 overflow-hidden rounded-2xl px-7 py-3.5 text-sm font-medium tracking-wide transition-all duration-300 will-change-transform ${styles} ${className}`;

  const inner = (
    <>
      <span className="relative z-10 inline-flex items-center gap-2.5">{children}</span>
      <span
        aria-hidden="true"
        className="absolute inset-0 -translate-x-[120%] bg-gradient-to-r from-transparent via-white/15 to-transparent transition-transform duration-700 ease-out group-hover:translate-x-[120%]"
      />
    </>
  );

  if (href) {
    return (
      <a ref={ref as React.Ref<HTMLAnchorElement>} href={href} className={cls} onMouseMove={handleMove} onMouseLeave={reset} onClick={onClick}>
        {inner}
      </a>
    );
  }
  return (
    <button ref={ref as React.Ref<HTMLButtonElement>} type="button" className={cls} onMouseMove={handleMove} onMouseLeave={reset} onClick={onClick}>
      {inner}
    </button>
  );
}
